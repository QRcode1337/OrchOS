import { describe, it, expect } from 'vitest';
import type { Agent, LogEntry, ViewMode, AgentColor, MemoryEntry, ChatMessage } from '../types';

describe('Type Validation Tests', () => {
  describe('Agent Type', () => {
    it('should accept valid agent object', () => {
      const agent: Agent = {
        id: 'test-1',
        name: 'TEST_AGENT',
        role: 'TESTER',
        status: 'RUNNING',
        version: 'v1.0.0',
        message: 'Testing in progress',
        imageUrl: 'https://example.com/image.png',
        color: 'blue',
        progress: 50,
      };

      expect(agent).toBeDefined();
      expect(agent.status).toBe('RUNNING');
      expect(agent.progress).toBe(50);
    });

    it('should support all valid status values', () => {
      const statuses: Agent['status'][] = ['RUNNING', 'IDLE', 'ERROR', 'OFFLINE'];

      statuses.forEach(status => {
        const agent: Agent = {
          id: 'test',
          name: 'TEST',
          role: 'TEST',
          status,
          version: 'v1.0.0',
          message: 'test',
          imageUrl: 'test',
          color: 'blue',
        };
        expect(agent.status).toBe(status);
      });
    });

    it('should support all valid color values', () => {
      const colors: AgentColor[] = ['blue', 'yellow', 'red', 'green', 'purple', 'aqua', 'orange'];

      colors.forEach(color => {
        const agent: Agent = {
          id: 'test',
          name: 'TEST',
          role: 'TEST',
          status: 'IDLE',
          version: 'v1.0.0',
          message: 'test',
          imageUrl: 'test',
          color,
        };
        expect(agent.color).toBe(color);
      });
    });

    it('should support optional progress field', () => {
      const agentWithProgress: Agent = {
        id: 'test',
        name: 'TEST',
        role: 'TEST',
        status: 'RUNNING',
        version: 'v1.0.0',
        message: 'test',
        imageUrl: 'test',
        color: 'blue',
        progress: 75,
      };

      const agentWithoutProgress: Agent = {
        id: 'test',
        name: 'TEST',
        role: 'TEST',
        status: 'IDLE',
        version: 'v1.0.0',
        message: 'test',
        imageUrl: 'test',
        color: 'blue',
      };

      expect(agentWithProgress.progress).toBe(75);
      expect(agentWithoutProgress.progress).toBeUndefined();
    });

    it('should support optional memories field', () => {
      const memory: MemoryEntry = {
        id: 'mem-1',
        agentId: 'agent-1',
        key: 'test-key',
        value: 'test-value',
        type: 'FACT',
        createdAt: '2024-01-01T00:00:00Z',
      };

      const agent: Agent = {
        id: 'test',
        name: 'TEST',
        role: 'TEST',
        status: 'IDLE',
        version: 'v1.0.0',
        message: 'test',
        imageUrl: 'test',
        color: 'blue',
        memories: [memory],
      };

      expect(agent.memories).toHaveLength(1);
      expect(agent.memories?.[0].key).toBe('test-key');
    });
  });

  describe('LogEntry Type', () => {
    it('should accept valid log entry', () => {
      const log: LogEntry = {
        id: 'log-1',
        timestamp: '14:22:01',
        level: 'INF',
        source: 'TEST_AGENT',
        message: 'Test message',
      };

      expect(log).toBeDefined();
      expect(log.level).toBe('INF');
    });

    it('should support all valid log levels', () => {
      const levels: LogEntry['level'][] = ['INF', 'WRN', 'ERR', 'FAT', 'SYS', 'USR'];

      levels.forEach(level => {
        const log: LogEntry = {
          id: 'test',
          timestamp: '00:00:00',
          level,
          source: 'TEST',
          message: 'test',
        };
        expect(log.level).toBe(level);
      });
    });
  });

  describe('ViewMode Type', () => {
    it('should support all valid view modes', () => {
      const modes: ViewMode[] = ['landing', 'dashboard', 'cli', 'docs', 'synthesis', 'cortex', 'snapshots', 'orchestrator'];

      modes.forEach(mode => {
        const viewMode: ViewMode = mode;
        expect(viewMode).toBe(mode);
      });
    });
  });

  describe('MemoryEntry Type', () => {
    it('should accept valid memory entry', () => {
      const memory: MemoryEntry = {
        id: 'mem-1',
        agentId: 'agent-1',
        key: 'user_preference',
        value: 'dark_mode',
        type: 'FACT',
        createdAt: '2024-01-01T00:00:00Z',
      };

      expect(memory).toBeDefined();
      expect(memory.type).toBe('FACT');
    });

    it('should support all valid memory types', () => {
      const types: MemoryEntry['type'][] = ['FACT', 'OBSERVATION', 'SYNTHESIS'];

      types.forEach(type => {
        const memory: MemoryEntry = {
          id: 'test',
          agentId: 'test',
          key: 'test',
          value: 'test',
          type,
          createdAt: '2024-01-01T00:00:00Z',
        };
        expect(memory.type).toBe(type);
      });
    });
  });

  describe('ChatMessage Type', () => {
    it('should accept valid chat message', () => {
      const message: ChatMessage = {
        id: 'msg-1',
        agentId: 'agent-1',
        agentName: 'TEST_AGENT',
        sender: 'user',
        content: 'Hello agent',
        timestamp: '14:22:01',
        color: 'blue',
      };

      expect(message).toBeDefined();
      expect(message.sender).toBe('user');
    });

    it('should support both sender types', () => {
      const senders: ChatMessage['sender'][] = ['user', 'agent'];

      senders.forEach(sender => {
        const message: ChatMessage = {
          id: 'test',
          agentId: 'test',
          agentName: 'TEST',
          sender,
          content: 'test',
          timestamp: '00:00:00',
        };
        expect(message.sender).toBe(sender);
      });
    });
  });
});
