import { z } from 'zod';

// Valid log levels for the system
export const LogLevel = z.enum(['INF', 'WRN', 'ERR', 'FAT', 'SYS', 'USR']);
export type LogLevelType = z.infer<typeof LogLevel>;

// Valid memory entry types
export const MemoryType = z.enum(['FACT', 'OBSERVATION', 'SYNTHESIS']);
export type MemoryTypeValue = z.infer<typeof MemoryType>;

// Valid agent statuses (matches types.ts)
export const AgentStatus = z.enum(['RUNNING', 'IDLE', 'ERROR', 'OFFLINE']);
export type AgentStatusType = z.infer<typeof AgentStatus>;

// Valid console event types (new)
export const ConsoleEventType = z.enum(['PLAN', 'TRACE', 'ACTION', 'CMD']);
export type ConsoleEventTypeValue = z.infer<typeof ConsoleEventType>;


// Schema for creating a new agent
export const CreateAgentSchema = z.object({
  name: z.string().min(1).max(100),
  role: z.string().min(1).max(100).optional(),
  status: AgentStatus.optional().default('IDLE'),
  version: z.string().max(20).optional(),
  message: z.string().max(500).optional(),
  imageUrl: z.string().max(500).optional(),
  color: z.enum(['blue', 'yellow', 'red', 'green', 'purple', 'aqua', 'orange']).optional(),
  progress: z.number().min(0).max(100).optional(),
});
export type CreateAgentInput = z.infer<typeof CreateAgentSchema>;

// Schema for creating a log entry
export const CreateLogSchema = z.object({
  level: LogLevel,
  source: z.string().min(1).max(50),
  message: z.string().min(1).max(500),
});
export type CreateLogInput = z.infer<typeof CreateLogSchema>;

// Schema for creating a console event (new)
export const CreateConsoleEventSchema = z.object({
  type: ConsoleEventType,
  agent: z.string().min(1).max(100),
  content: z.string().min(1).max(2000),
});
export type CreateConsoleEventInput = z.infer<typeof CreateConsoleEventSchema>;

// Schema for creating a memory entry
export const CreateMemorySchema = z.object({
  key: z.string().min(1).max(100),
  value: z.string().min(1).max(2000),
  type: MemoryType.optional().default('FACT'),
});
export type CreateMemoryInput = z.infer<typeof CreateMemorySchema>;

// Schema for updating agent status
export const UpdateAgentStatusSchema = z.object({
  status: AgentStatus,
});
export type UpdateAgentStatusInput = z.infer<typeof UpdateAgentStatusSchema>;

// Helper function to format Zod errors for API responses
export function formatZodError(error: z.ZodError): { field: string; message: string }[] {
  return error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
}

// Validation result type
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: { field: string; message: string }[] };

// Generic validation function
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: formatZodError(result.error) };
}
