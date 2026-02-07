import { describe, it, expect } from 'vitest';
import { INITIAL_LOGS, AGENTS, AGENT_TEMPLATES, CLI_COMMANDS, CHART_DATA, PROFILE_IMAGE } from '../constants';

describe('Constants Integrity Tests', () => {
  describe('INITIAL_LOGS', () => {
    it('should contain valid log entries', () => {
      expect(INITIAL_LOGS).toBeDefined();
      expect(Array.isArray(INITIAL_LOGS)).toBe(true);
      expect(INITIAL_LOGS.length).toBeGreaterThan(0);
    });

    it('should have valid log entry structure', () => {
      INITIAL_LOGS.forEach(log => {
        expect(log).toHaveProperty('id');
        expect(log).toHaveProperty('timestamp');
        expect(log).toHaveProperty('level');
        expect(log).toHaveProperty('source');
        expect(log).toHaveProperty('message');

        expect(typeof log.id).toBe('string');
        expect(typeof log.timestamp).toBe('string');
        expect(['INF', 'WRN', 'ERR', 'FAT', 'SYS', 'USR']).toContain(log.level);
        expect(typeof log.source).toBe('string');
        expect(typeof log.message).toBe('string');
      });
    });

    it('should have unique log IDs', () => {
      const ids = INITIAL_LOGS.map(log => log.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid timestamp format', () => {
      INITIAL_LOGS.forEach(log => {
        // Timestamp should be in HH:MM:SS format
        expect(log.timestamp).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      });
    });
  });

  describe('AGENTS', () => {
    it('should contain valid agent entries', () => {
      expect(AGENTS).toBeDefined();
      expect(Array.isArray(AGENTS)).toBe(true);
      expect(AGENTS.length).toBeGreaterThan(0);
    });

    it('should have valid agent structure', () => {
      AGENTS.forEach(agent => {
        expect(agent).toHaveProperty('id');
        expect(agent).toHaveProperty('name');
        expect(agent).toHaveProperty('role');
        expect(agent).toHaveProperty('status');
        expect(agent).toHaveProperty('version');
        expect(agent).toHaveProperty('message');
        expect(agent).toHaveProperty('imageUrl');
        expect(agent).toHaveProperty('color');
        expect(agent).toHaveProperty('progress');

        expect(typeof agent.id).toBe('string');
        expect(typeof agent.name).toBe('string');
        expect(['RUNNING', 'IDLE', 'ERROR', 'OFFLINE']).toContain(agent.status);
        expect(['blue', 'yellow', 'red', 'green', 'purple', 'aqua', 'orange']).toContain(agent.color);
        expect(typeof agent.progress).toBe('number');
        expect(agent.progress).toBeGreaterThanOrEqual(0);
        expect(agent.progress).toBeLessThanOrEqual(100);
      });
    });

    it('should have unique agent IDs', () => {
      const ids = AGENTS.map(agent => agent.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid image URLs', () => {
      AGENTS.forEach(agent => {
        expect(agent.imageUrl).toMatch(/^https?:\/\//);
      });
    });
  });

  describe('AGENT_TEMPLATES', () => {
    it('should contain valid template entries', () => {
      expect(AGENT_TEMPLATES).toBeDefined();
      expect(Array.isArray(AGENT_TEMPLATES)).toBe(true);
      expect(AGENT_TEMPLATES.length).toBeGreaterThan(0);
    });

    it('should have valid template structure', () => {
      AGENT_TEMPLATES.forEach(template => {
        expect(template).toHaveProperty('name');
        expect(template).toHaveProperty('role');
        expect(template).toHaveProperty('color');
        expect(template).toHaveProperty('imageUrl');
        expect(template).toHaveProperty('message');

        expect(typeof template.name).toBe('string');
        expect(typeof template.role).toBe('string');
        expect(['blue', 'yellow', 'red', 'green', 'purple', 'aqua', 'orange']).toContain(template.color);
        expect(template.imageUrl).toMatch(/^https?:\/\//);
        expect(typeof template.message).toBe('string');
      });
    });

    it('should have unique template names', () => {
      const names = AGENT_TEMPLATES.map(t => t.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });
  });

  describe('CLI_COMMANDS', () => {
    it('should contain valid CLI command entries', () => {
      expect(CLI_COMMANDS).toBeDefined();
      expect(Array.isArray(CLI_COMMANDS)).toBe(true);
      expect(CLI_COMMANDS.length).toBeGreaterThan(0);
    });

    it('should have valid command structure', () => {
      CLI_COMMANDS.forEach(command => {
        expect(command).toHaveProperty('cmd');
        expect(command).toHaveProperty('desc');
        expect(typeof command.cmd).toBe('string');
        expect(typeof command.desc).toBe('string');
        expect(command.cmd.length).toBeGreaterThan(0);
        expect(command.desc.length).toBeGreaterThan(0);
      });
    });
  });

  describe('CHART_DATA', () => {
    it('should contain valid chart data', () => {
      expect(CHART_DATA).toBeDefined();
      expect(Array.isArray(CHART_DATA)).toBe(true);
      expect(CHART_DATA.length).toBeGreaterThan(0);
    });

    it('should have valid data point structure', () => {
      CHART_DATA.forEach(point => {
        expect(point).toHaveProperty('name');
        expect(point).toHaveProperty('uv');
        expect(typeof point.name).toBe('string');
        expect(typeof point.uv).toBe('number');
        expect(point.uv).toBeGreaterThan(0);
      });
    });

    it('should have sequential time names', () => {
      const names = CHART_DATA.map(point => point.name);
      names.forEach(name => {
        expect(name).toMatch(/^\d{2}$/);
      });
    });
  });

  describe('PROFILE_IMAGE', () => {
    it('should be a valid URL', () => {
      expect(PROFILE_IMAGE).toBeDefined();
      expect(typeof PROFILE_IMAGE).toBe('string');
      expect(PROFILE_IMAGE).toMatch(/^https?:\/\//);
    });
  });
});
