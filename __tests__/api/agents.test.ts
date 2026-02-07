import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import cors from 'cors';

// Create a test server instance
const createTestServer = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Mock data
  const agents = [
    {
      id: 'agent-1',
      name: 'TEST_AGENT_1',
      role: 'TEST_ROLE',
      status: 'RUNNING',
      version: 'v1.0.0',
      message: 'Test message',
      imageUrl: 'https://example.com/image.png',
      color: 'blue',
      progress: 50,
    },
  ];

  // Routes
  app.get('/api/agents', (req, res) => {
    res.json(agents);
  });

  app.post('/api/agents', (req, res) => {
    const newAgent = {
      id: `agent-${Date.now()}`,
      ...req.body,
    };
    agents.push(newAgent);
    res.json(newAgent);
  });

  app.put('/api/agents/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const agent = agents.find(a => a.id === id);

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    agent.status = status;
    res.json(agent);
  });

  return app;
};

describe('Agents API Integration Tests', () => {
  let app: express.Express;

  beforeAll(() => {
    app = createTestServer();
  });

  describe('GET /api/agents', () => {
    it('should return list of agents', async () => {
      const response = await request(app)
        .get('/api/agents')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return agents with correct structure', async () => {
      const response = await request(app)
        .get('/api/agents')
        .expect(200);

      const agent = response.body[0];
      expect(agent).toHaveProperty('id');
      expect(agent).toHaveProperty('name');
      expect(agent).toHaveProperty('role');
      expect(agent).toHaveProperty('status');
      expect(agent).toHaveProperty('version');
      expect(agent).toHaveProperty('message');
      expect(agent).toHaveProperty('imageUrl');
      expect(agent).toHaveProperty('color');
    });

    it('should return valid agent status values', async () => {
      const response = await request(app)
        .get('/api/agents')
        .expect(200);

      const validStatuses = ['RUNNING', 'IDLE', 'ERROR', 'OFFLINE'];
      response.body.forEach((agent: any) => {
        expect(validStatuses).toContain(agent.status);
      });
    });
  });

  describe('POST /api/agents', () => {
    it('should create a new agent', async () => {
      const newAgent = {
        name: 'NEW_TEST_AGENT',
        role: 'TEST_ROLE',
        status: 'IDLE',
        version: 'v1.0.0',
        message: 'New agent message',
        imageUrl: 'https://example.com/new-agent.png',
        color: 'green',
        progress: 0,
      };

      const response = await request(app)
        .post('/api/agents')
        .send(newAgent)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('NEW_TEST_AGENT');
      expect(response.body.role).toBe('TEST_ROLE');
      expect(response.body.status).toBe('IDLE');
    });

    it('should assign unique ID to created agent', async () => {
      const newAgent = {
        name: 'UNIQUE_AGENT',
        role: 'TEST_ROLE',
        status: 'IDLE',
        version: 'v1.0.0',
        message: 'Test',
        imageUrl: 'https://example.com/image.png',
        color: 'blue',
      };

      const response = await request(app)
        .post('/api/agents')
        .send(newAgent)
        .expect(200);

      expect(response.body.id).toBeDefined();
      expect(typeof response.body.id).toBe('string');
      expect(response.body.id).toMatch(/^agent-/);
    });

    it('should preserve all agent properties', async () => {
      const newAgent = {
        name: 'COMPLETE_AGENT',
        role: 'COMPLETE_ROLE',
        status: 'RUNNING',
        version: 'v2.0.0',
        message: 'Complete message',
        imageUrl: 'https://example.com/complete.png',
        color: 'red',
        progress: 75,
      };

      const response = await request(app)
        .post('/api/agents')
        .send(newAgent)
        .expect(200);

      expect(response.body.name).toBe(newAgent.name);
      expect(response.body.role).toBe(newAgent.role);
      expect(response.body.status).toBe(newAgent.status);
      expect(response.body.version).toBe(newAgent.version);
      expect(response.body.message).toBe(newAgent.message);
      expect(response.body.imageUrl).toBe(newAgent.imageUrl);
      expect(response.body.color).toBe(newAgent.color);
      expect(response.body.progress).toBe(newAgent.progress);
    });

    it('should accept request with application/json content type', async () => {
      const response = await request(app)
        .post('/api/agents')
        .set('Content-Type', 'application/json')
        .send({
          name: 'JSON_AGENT',
          role: 'TEST',
          status: 'IDLE',
          version: 'v1.0.0',
          message: 'test',
          imageUrl: 'https://example.com/image.png',
          color: 'blue',
        })
        .expect(200);

      expect(response.body.name).toBe('JSON_AGENT');
    });
  });

  describe('PUT /api/agents/:id/status', () => {
    it('should update agent status', async () => {
      const response = await request(app)
        .put('/api/agents/agent-1/status')
        .send({ status: 'IDLE' })
        .expect(200);

      expect(response.body.status).toBe('IDLE');
      expect(response.body.id).toBe('agent-1');
    });

    it('should return 404 for non-existent agent', async () => {
      await request(app)
        .put('/api/agents/non-existent/status')
        .send({ status: 'RUNNING' })
        .expect(404);
    });

    it('should update to RUNNING status', async () => {
      const response = await request(app)
        .put('/api/agents/agent-1/status')
        .send({ status: 'RUNNING' })
        .expect(200);

      expect(response.body.status).toBe('RUNNING');
    });

    it('should update to ERROR status', async () => {
      const response = await request(app)
        .put('/api/agents/agent-1/status')
        .send({ status: 'ERROR' })
        .expect(200);

      expect(response.body.status).toBe('ERROR');
    });

    it('should update to OFFLINE status', async () => {
      const response = await request(app)
        .put('/api/agents/agent-1/status')
        .send({ status: 'OFFLINE' })
        .expect(200);

      expect(response.body.status).toBe('OFFLINE');
    });

    it('should preserve other agent properties when updating status', async () => {
      const response = await request(app)
        .put('/api/agents/agent-1/status')
        .send({ status: 'IDLE' })
        .expect(200);

      expect(response.body.name).toBe('TEST_AGENT_1');
      expect(response.body.role).toBe('TEST_ROLE');
      expect(response.body.version).toBe('v1.0.0');
    });

    it('should accept request with application/json content type', async () => {
      const response = await request(app)
        .put('/api/agents/agent-1/status')
        .set('Content-Type', 'application/json')
        .send({ status: 'RUNNING' })
        .expect(200);

      expect(response.body.status).toBe('RUNNING');
    });
  });

  describe('CORS', () => {
    it('should have CORS enabled', async () => {
      const response = await request(app)
        .get('/api/agents')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('JSON Response', () => {
    it('should return JSON content type', async () => {
      const response = await request(app)
        .get('/api/agents')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/json/);
    });
  });
});
