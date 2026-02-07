import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import cors from 'cors';

// Create a test server instance
const createTestServer = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Mock data
  const logs = [
    {
      id: 'log-1',
      timestamp: '14:22:01',
      level: 'INF',
      source: 'TEST_AGENT',
      message: 'Test log message',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'log-2',
      timestamp: '14:22:02',
      level: 'WRN',
      source: 'SYSTEM',
      message: 'Warning message',
      createdAt: new Date().toISOString(),
    },
  ];

  // Routes
  app.get('/api/logs', (req, res) => {
    const formattedLogs = logs.map(l => ({
      ...l,
      timestamp: new Date(l.createdAt).toLocaleTimeString('en-US', { hour12: false }),
    }));
    res.json(formattedLogs);
  });

  app.post('/api/logs', (req, res) => {
    const newLog = {
      id: `log-${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString(),
    };
    logs.push(newLog);
    res.json(newLog);
  });

  return app;
};

describe('Logs API Integration Tests', () => {
  let app: express.Express;

  beforeAll(() => {
    app = createTestServer();
  });

  describe('GET /api/logs', () => {
    it('should return list of logs', async () => {
      const response = await request(app)
        .get('/api/logs')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return logs with correct structure', async () => {
      const response = await request(app)
        .get('/api/logs')
        .expect(200);

      const log = response.body[0];
      expect(log).toHaveProperty('id');
      expect(log).toHaveProperty('timestamp');
      expect(log).toHaveProperty('level');
      expect(log).toHaveProperty('source');
      expect(log).toHaveProperty('message');
    });

    it('should format timestamp correctly', async () => {
      const response = await request(app)
        .get('/api/logs')
        .expect(200);

      response.body.forEach((log: any) => {
        // Timestamp should be in HH:MM:SS format
        expect(log.timestamp).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      });
    });

    it('should return valid log levels', async () => {
      const response = await request(app)
        .get('/api/logs')
        .expect(200);

      const validLevels = ['INF', 'WRN', 'ERR', 'FAT', 'SYS', 'USR'];
      response.body.forEach((log: any) => {
        expect(validLevels).toContain(log.level);
      });
    });

    it('should return logs with non-empty messages', async () => {
      const response = await request(app)
        .get('/api/logs')
        .expect(200);

      response.body.forEach((log: any) => {
        expect(log.message).toBeDefined();
        expect(log.message.length).toBeGreaterThan(0);
      });
    });

    it('should return logs with source information', async () => {
      const response = await request(app)
        .get('/api/logs')
        .expect(200);

      response.body.forEach((log: any) => {
        expect(log.source).toBeDefined();
        expect(typeof log.source).toBe('string');
      });
    });
  });

  describe('POST /api/logs', () => {
    it('should create a new log entry', async () => {
      const newLog = {
        level: 'INF',
        source: 'TEST_SOURCE',
        message: 'New test log message',
      };

      const response = await request(app)
        .post('/api/logs')
        .send(newLog)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.level).toBe('INF');
      expect(response.body.source).toBe('TEST_SOURCE');
      expect(response.body.message).toBe('New test log message');
    });

    it('should assign unique ID to created log', async () => {
      const newLog = {
        level: 'WRN',
        source: 'WARNING_SOURCE',
        message: 'Warning log',
      };

      const response = await request(app)
        .post('/api/logs')
        .send(newLog)
        .expect(200);

      expect(response.body.id).toBeDefined();
      expect(typeof response.body.id).toBe('string');
      expect(response.body.id).toMatch(/^log-/);
    });

    it('should create log with INF level', async () => {
      const response = await request(app)
        .post('/api/logs')
        .send({
          level: 'INF',
          source: 'INFO_SOURCE',
          message: 'Information log',
        })
        .expect(200);

      expect(response.body.level).toBe('INF');
    });

    it('should create log with WRN level', async () => {
      const response = await request(app)
        .post('/api/logs')
        .send({
          level: 'WRN',
          source: 'WARN_SOURCE',
          message: 'Warning log',
        })
        .expect(200);

      expect(response.body.level).toBe('WRN');
    });

    it('should create log with ERR level', async () => {
      const response = await request(app)
        .post('/api/logs')
        .send({
          level: 'ERR',
          source: 'ERROR_SOURCE',
          message: 'Error log',
        })
        .expect(200);

      expect(response.body.level).toBe('ERR');
    });

    it('should create log with FAT level', async () => {
      const response = await request(app)
        .post('/api/logs')
        .send({
          level: 'FAT',
          source: 'FATAL_SOURCE',
          message: 'Fatal error log',
        })
        .expect(200);

      expect(response.body.level).toBe('FAT');
    });

    it('should create log with SYS level', async () => {
      const response = await request(app)
        .post('/api/logs')
        .send({
          level: 'SYS',
          source: 'SYSTEM',
          message: 'System log',
        })
        .expect(200);

      expect(response.body.level).toBe('SYS');
    });

    it('should create log with USR level', async () => {
      const response = await request(app)
        .post('/api/logs')
        .send({
          level: 'USR',
          source: 'USER',
          message: 'User action log',
        })
        .expect(200);

      expect(response.body.level).toBe('USR');
    });

    it('should add createdAt timestamp', async () => {
      const response = await request(app)
        .post('/api/logs')
        .send({
          level: 'INF',
          source: 'TEST',
          message: 'Test',
        })
        .expect(200);

      expect(response.body.createdAt).toBeDefined();
      expect(new Date(response.body.createdAt).toString()).not.toBe('Invalid Date');
    });

    it('should accept request with application/json content type', async () => {
      const response = await request(app)
        .post('/api/logs')
        .set('Content-Type', 'application/json')
        .send({
          level: 'INF',
          source: 'JSON_TEST',
          message: 'JSON test log',
        })
        .expect(200);

      expect(response.body.source).toBe('JSON_TEST');
    });
  });

  describe('CORS', () => {
    it('should have CORS enabled', async () => {
      const response = await request(app)
        .get('/api/logs')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('JSON Response', () => {
    it('should return JSON content type', async () => {
      const response = await request(app)
        .get('/api/logs')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/json/);
    });
  });
});
