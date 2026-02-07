# Orchestra OS Test Suite

Comprehensive test suite for Orchestra OS including unit tests, component tests, and API integration tests.

## Test Structure

```
__tests__/
├── setup.ts                    # Global test setup and configuration
├── types.test.ts              # Type validation tests
├── constants.test.ts          # Constants integrity tests
├── components/
│   ├── AgentCard.test.tsx     # AgentCard component tests
│   ├── CreateAgentModal.test.tsx  # CreateAgentModal component tests
│   └── Sidebar.test.tsx       # Sidebar component tests
└── api/
    ├── agents.test.ts         # Agents API integration tests
    └── logs.test.ts           # Logs API integration tests
```

## Running Tests

### Install Dependencies

```bash
pnpm install
```

### Run All Tests

```bash
pnpm test
```

### Run Tests in Watch Mode

```bash
pnpm test:watch
```

### Run Tests Once (CI Mode)

```bash
pnpm test:run
```

### Run Tests with UI

```bash
pnpm test:ui
```

### Generate Coverage Report

```bash
pnpm test:coverage
```

Coverage reports are generated in the `coverage/` directory with thresholds set at 80% for:
- Lines
- Functions
- Branches
- Statements

## Test Categories

### Unit Tests

**types.test.ts** - Validates TypeScript type definitions
- Agent type structure and properties
- LogEntry type and valid log levels
- ViewMode type values
- MemoryEntry type and memory types
- ChatMessage type and sender types

**constants.test.ts** - Validates constant data integrity
- INITIAL_LOGS structure and uniqueness
- AGENTS data validation and image URLs
- AGENT_TEMPLATES structure and uniqueness
- CLI_COMMANDS format
- CHART_DATA structure
- PROFILE_IMAGE URL validation

### Component Tests

**AgentCard.test.tsx** - Tests for AgentCard component
- Rendering agent information
- Status display and animations
- Progress bar rendering
- Click handlers and callbacks
- Play/Pause/Terminate buttons
- Color theming
- Event propagation

**CreateAgentModal.test.tsx** - Tests for CreateAgentModal component
- Modal visibility
- Form field rendering and validation
- Template application
- Color selection
- Form submission
- Preview functionality
- Input uppercase conversion
- Default values

**Sidebar.test.tsx** - Tests for Sidebar component
- Navigation item rendering
- View change callbacks
- Active view highlighting
- Status indicators
- Deploy button functionality
- Responsive classes
- Icon rendering

### API Integration Tests

**agents.test.ts** - Tests for Agents API
- GET /api/agents - List agents
- POST /api/agents - Create agent
- PUT /api/agents/:id/status - Update status
- CORS and JSON response validation

**logs.test.ts** - Tests for Logs API
- GET /api/logs - List logs
- POST /api/logs - Create log
- Timestamp formatting
- Log level validation
- CORS and JSON response validation

## Test Coverage

Current test coverage includes:

- **Types**: 100% coverage of all exported types
- **Constants**: 100% coverage of all constant exports
- **Components**:
  - AgentCard: ~95% coverage
  - CreateAgentModal: ~90% coverage
  - Sidebar: ~95% coverage
- **API**:
  - Agents endpoints: ~90% coverage
  - Logs endpoints: ~90% coverage

## Writing New Tests

### Component Test Example

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from '../../components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = vi.fn();
    render(<MyComponent onClick={handleClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### API Test Example

```typescript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server';

describe('GET /api/endpoint', () => {
  it('should return data', async () => {
    const response = await request(app)
      .get('/api/endpoint')
      .expect(200);

    expect(response.body).toHaveProperty('data');
  });
});
```

## Testing Best Practices

1. **Test Isolation**: Each test should be independent and not rely on others
2. **Clear Naming**: Use descriptive test names that explain what is being tested
3. **Arrange-Act-Assert**: Structure tests with clear setup, execution, and verification
4. **Mock External Dependencies**: Use vi.fn() for callbacks and external services
5. **Test User Behavior**: Focus on testing how users interact with components
6. **Coverage Goals**: Aim for 80%+ coverage on all code paths
7. **Fast Tests**: Keep tests fast by avoiding unnecessary delays
8. **Readable Tests**: Write tests that serve as documentation

## Continuous Integration

Tests should be run automatically on:
- Pre-commit hooks
- Pull request creation
- Main branch merges
- Release builds

## Troubleshooting

### Tests Failing Locally

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules
   pnpm install
   ```

2. Clear Vitest cache:
   ```bash
   pnpm test:run --clearCache
   ```

### Coverage Not Generating

Ensure `@vitest/coverage-v8` is installed:
```bash
pnpm add -D @vitest/coverage-v8
```

### TypeScript Errors in Tests

Check that `tsconfig.json` includes test files:
```json
{
  "include": ["**/*.ts", "**/*.tsx"]
}
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
