import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
import {
  CreateAgentSchema,
  CreateLogSchema,
  CreateMemorySchema,
  CreateConsoleEventSchema,
  UpdateAgentStatusSchema,
  validate,
} from './validators.js';

const app = express();

// Database setup
const adapterFactory = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({
  adapter: adapterFactory,
  log: ['query', 'info', 'warn', 'error'],
});
const PORT = process.env.PORT || 3002;

// Startup logging (without sensitive data)
console.log('SERVER: Starting...');
console.log('SERVER: CWD:', process.cwd());
console.log('SERVER: Database configured:', process.env.DATABASE_URL ? 'Yes' : 'No');

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Rate limiting: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

app.use(limiter);
app.use(express.json({ limit: '10kb' })); // Limit body size

// Root endpoint to verify server is running
app.get('/', (req: Request, res: Response) => {
  res.send('Orchestra OS API - Status: ONLINE');
});

// Get all agents with their memories
app.get('/api/agents', async (req: Request, res: Response) => {
  try {
    const agents = await prisma.agent.findMany({
      include: { memories: true }
    });
    res.json(agents);
  } catch (error) {
    console.error('Failed to fetch agents:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

// Create new agent with validated input
app.post('/api/agents', async (req: Request, res: Response) => {
  try {
    const validation = validate(CreateAgentSchema, req.body);

    if (!validation.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: validation.errors
      });
      return;
    }

    const { name, role, status, version, message, imageUrl, color, progress } = validation.data;

    const agent = await prisma.agent.create({
      data: {
        name,
        role,
        status,
        version,
        message,
        imageUrl,
        color,
        progress,
      }
    });
    res.status(201).json(agent);
  } catch (error) {
    console.error('Failed to create agent:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({ error: 'Failed to create agent' });
  }
});

// Update an agent's memory with validated input
app.post('/api/agents/:id/memory', async (req: Request, res: Response) => {
  try {
    const agentId = req.params.id;

    // Verify agent exists
    const agent = await prisma.agent.findUnique({ where: { id: agentId } });
    if (!agent) {
      res.status(404).json({ error: 'Agent not found' });
      return;
    }

    const validation = validate(CreateMemorySchema, req.body);

    if (!validation.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: validation.errors
      });
      return;
    }

    const { key, value, type } = validation.data;

    const memory = await prisma.memoryEntry.create({
      data: {
        agentId,
        key,
        value,
        type,
      }
    });
    res.status(201).json(memory);
  } catch (error) {
    console.error('Failed to create memory:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({ error: 'Failed to create memory' });
  }
});

// Update agent status with validated input
app.put('/api/agents/:id/status', async (req: Request, res: Response) => {
  try {
    const agentId = req.params.id;

    // Verify agent exists
    const existingAgent = await prisma.agent.findUnique({ where: { id: agentId } });
    if (!existingAgent) {
      res.status(404).json({ error: 'Agent not found' });
      return;
    }

    const validation = validate(UpdateAgentStatusSchema, req.body);

    if (!validation.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: validation.errors
      });
      return;
    }

    const { status } = validation.data;

    const agent = await prisma.agent.update({
      where: { id: agentId },
      data: { status }
    });

    // Create a log for this action
    await prisma.logEntry.create({
      data: {
        level: 'SYS',
        source: 'ORCHESTRATOR',
        message: `Agent ${agent.name} status update: ${status}`
      }
    });
    res.json(agent);
  } catch (error) {
    console.error('Failed to update agent status:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({ error: 'Failed to update agent status' });
  }
});

// Get logs
app.get('/api/logs', async (req: Request, res: Response) => {
  try {
    const logs = await prisma.logEntry.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' }
    });
    // Frontend expects fields that map. DB has 'createdAt'.
    // Frontend expects 'timestamp' string.
    const formattedLogs = logs.map(l => ({
      ...l,
      timestamp: new Date(l.createdAt).toLocaleTimeString('en-US', { hour12: false })
    }));
    res.json(formattedLogs);
  } catch (error) {
    console.error('Failed to fetch logs:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// Create log entry with validated input
app.post('/api/logs', async (req: Request, res: Response) => {
  try {
    const validation = validate(CreateLogSchema, req.body);

    if (!validation.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: validation.errors
      });
      return;
    }

    const { level, source, message } = validation.data;

    const log = await prisma.logEntry.create({
      data: {
        level,
        source,
        message,
      }
    });
    res.status(201).json(log);
  } catch (error) {
    console.error('Failed to create log:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({ error: 'Failed to create log' });
  }
});

// Consle Event Routes

// Get console events
app.get('/api/console', async (req: Request, res: Response) => {
  try {
    const events = await prisma.consoleEvent.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' }
    });
    // Format timestamp
    const formattedEvents = events.map(e => ({
        ...e,
        time: new Date(e.createdAt).toLocaleTimeString('en-US', { hour12: false })
    }));
    // Reverse so newest is at bottom (stream) or keep desc? Usually a stream is newest bottom.
    // But findMany desc brings newest first.
    // Let's reverse for the frontend to map nicely or let frontend handle it.
    // Frontend expects array to push to bottom. So [oldest -> newest].
    res.json(formattedEvents.reverse());
  } catch (error) {
    console.error('Failed to fetch console events:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({ error: 'Failed to fetch console events' });
  }
});

// Create console event
app.post('/api/console', async (req: Request, res: Response) => {
    try {
        const validation = validate(CreateConsoleEventSchema, req.body);
        
        if (!validation.success) {
            res.status(400).json({
                error: 'Validation failed',
                details: validation.errors
            });
            return;
        }

        const { type, agent, content } = validation.data;

        const event = await prisma.consoleEvent.create({
            data: { type, agent, content }
        });
        
        res.status(201).json({
            ...event,
            time: new Date(event.createdAt).toLocaleTimeString('en-US', { hour12: false })
        });
    } catch (error) {
        console.error('Failed to create console event:', error instanceof Error ? error.message : 'Unknown error');
        res.status(500).json({ error: 'Failed to create console event' });
    }
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`SERVER: API running on http://localhost:${PORT}`);
});
