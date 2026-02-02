import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const app = express();

const adapterFactory = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({
  adapter: adapterFactory,
  log: ['query', 'info', 'warn', 'error'],
});
const PORT = 3002;

console.log('SERVER: Starting...');
console.log('SERVER: CWD:', process.cwd());
console.log('SERVER: DATABASE_URL:', process.env.DATABASE_URL);

app.use(cors());
app.use(express.json());

// Root endpoint to verify server is running
app.get('/', (req, res) => {
  res.send('Orchestra OS API - Status: ONLINE');
});

// Get all agents with their memories
app.get('/api/agents', async (req, res) => {
  try {
    const agents = await prisma.agent.findMany({
        include: { memories: true }
    });
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

// Update an agent's memory
app.post('/api/agents/:id/memory', async (req, res) => {
  try {
    const { key, value, type } = req.body;
    const memory = await prisma.memoryEntry.create({
      data: {
        agentId: req.params.id,
        key,
        value,
        type: type || 'FACT'
      }
    });
    res.json(memory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create memory' });
  }
});

// Create new agent
app.post('/api/agents', async (req, res) => {
  try {
    const agent = await prisma.agent.create({
      data: req.body
    });
    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create agent' });
    console.error(error);
  }
});

// Update agent status
app.put('/api/agents/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const agent = await prisma.agent.update({
      where: { id: req.params.id },
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
    res.status(500).json({ error: 'Failed to update agent status' });
  }
});

app.get('/api/logs', async (req, res) => {
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
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

app.post('/api/logs', async (req, res) => {
    try {
        const log = await prisma.logEntry.create({
            data: req.body
        });
        res.json(log);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create log' });
    }
});

app.listen(PORT, () => {
  console.log(`SERVER: API running on http://localhost:${PORT}`);
});
