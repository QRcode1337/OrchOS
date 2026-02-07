import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateAgentModal from '../../components/dashboard/CreateAgentModal';
import { AGENT_TEMPLATES } from '../../constants';

describe('CreateAgentModal Component', () => {
  const mockOnClose = vi.fn();
  const mockOnCreate = vi.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onCreate: mockOnCreate,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render modal when isOpen is true', () => {
    render(<CreateAgentModal {...defaultProps} />);
    expect(screen.getByText('Initialize New Agent')).toBeInTheDocument();
  });

  it('should not render modal when isOpen is false', () => {
    render(<CreateAgentModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Initialize New Agent')).not.toBeInTheDocument();
  });

  it('should render form fields', () => {
    render(<CreateAgentModal {...defaultProps} />);

    expect(screen.getByLabelText(/Agent Designation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Operational Role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Avatar URL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/System Color/i)).toBeInTheDocument();
  });

  it('should render template buttons', () => {
    render(<CreateAgentModal {...defaultProps} />);

    expect(screen.getByText('LOAD SQUAD TEMPLATE:')).toBeInTheDocument();
    AGENT_TEMPLATES.forEach(template => {
      expect(screen.getByText(template.role)).toBeInTheDocument();
    });
  });

  it('should render preview section', () => {
    render(<CreateAgentModal {...defaultProps} />);
    expect(screen.getByText('Visual Preview')).toBeInTheDocument();
  });

  it('should render deploy button', () => {
    render(<CreateAgentModal {...defaultProps} />);
    expect(screen.getByRole('button', { name: /Deploy Unit/i })).toBeInTheDocument();
  });

  it('should have default form values', () => {
    render(<CreateAgentModal {...defaultProps} />);

    const nameInput = screen.getByLabelText(/Agent Designation/i) as HTMLInputElement;
    const roleInput = screen.getByLabelText(/Operational Role/i) as HTMLInputElement;

    expect(nameInput.value).toBe('NEW_AGENT_01');
    expect(roleInput.value).toBe('GENERAL_PURPOSE');
  });

  it('should update name field on input', async () => {
    const user = userEvent.setup();
    render(<CreateAgentModal {...defaultProps} />);

    const nameInput = screen.getByLabelText(/Agent Designation/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'custom_agent');

    expect(nameInput).toHaveValue('CUSTOM_AGENT');
  });

  it('should update role field on input', async () => {
    const user = userEvent.setup();
    render(<CreateAgentModal {...defaultProps} />);

    const roleInput = screen.getByLabelText(/Operational Role/i);
    await user.clear(roleInput);
    await user.type(roleInput, 'custom_role');

    expect(roleInput).toHaveValue('CUSTOM_ROLE');
  });

  it('should update imageUrl field on input', async () => {
    const user = userEvent.setup();
    render(<CreateAgentModal {...defaultProps} />);

    const imageInput = screen.getByLabelText(/Avatar URL/i);
    await user.type(imageInput, 'https://example.com/image.png');

    expect(imageInput).toHaveValue('https://example.com/image.png');
  });

  it('should apply template when template button clicked', async () => {
    render(<CreateAgentModal {...defaultProps} />);

    const template = AGENT_TEMPLATES[0];
    const templateButton = screen.getByText(template.role);
    fireEvent.click(templateButton);

    await waitFor(() => {
      const nameInput = screen.getByLabelText(/Agent Designation/i) as HTMLInputElement;
      expect(nameInput.value).toBe(template.name);
    });
  });

  it('should change color when color button clicked', async () => {
    render(<CreateAgentModal {...defaultProps} />);

    const colorButtons = screen.getAllByRole('button').filter(
      btn => btn.className.includes('w-8 h-8')
    );

    expect(colorButtons.length).toBeGreaterThan(0);
    fireEvent.click(colorButtons[0]);

    // Color selection should update the preview
    await waitFor(() => {
      expect(colorButtons[0]).toHaveClass('scale-110');
    });
  });

  it('should call onCreate with correct data on form submit', async () => {
    const user = userEvent.setup();
    render(<CreateAgentModal {...defaultProps} />);

    const nameInput = screen.getByLabelText(/Agent Designation/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'test_agent');

    const roleInput = screen.getByLabelText(/Operational Role/i);
    await user.clear(roleInput);
    await user.type(roleInput, 'test_role');

    const deployButton = screen.getByRole('button', { name: /Deploy Unit/i });
    fireEvent.click(deployButton);

    await waitFor(() => {
      expect(mockOnCreate).toHaveBeenCalledTimes(1);
      const createdAgent = mockOnCreate.mock.calls[0][0];
      expect(createdAgent.name).toBe('TEST_AGENT');
      expect(createdAgent.role).toBe('TEST_ROLE');
      expect(createdAgent.status).toBe('IDLE');
      expect(createdAgent.version).toBe('v1.0.0');
      expect(createdAgent.progress).toBe(0);
      expect(createdAgent).toHaveProperty('id');
    });
  });

  it('should call onClose after successful creation', async () => {
    render(<CreateAgentModal {...defaultProps} />);

    const deployButton = screen.getByRole('button', { name: /Deploy Unit/i });
    fireEvent.click(deployButton);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('should use default image if no imageUrl provided', async () => {
    render(<CreateAgentModal {...defaultProps} />);

    const deployButton = screen.getByRole('button', { name: /Deploy Unit/i });
    fireEvent.click(deployButton);

    await waitFor(() => {
      const createdAgent = mockOnCreate.mock.calls[0][0];
      expect(createdAgent.imageUrl).toMatch(/^https?:\/\//);
    });
  });

  it('should require name field', async () => {
    render(<CreateAgentModal {...defaultProps} />);

    const nameInput = screen.getByLabelText(/Agent Designation/i);
    expect(nameInput).toHaveAttribute('required');
  });

  it('should require role field', async () => {
    render(<CreateAgentModal {...defaultProps} />);

    const roleInput = screen.getByLabelText(/Operational Role/i);
    expect(roleInput).toHaveAttribute('required');
  });

  it('should validate URL type for imageUrl', () => {
    render(<CreateAgentModal {...defaultProps} />);

    const imageInput = screen.getByLabelText(/Avatar URL/i);
    expect(imageInput).toHaveAttribute('type', 'url');
  });

  it('should convert name to uppercase', async () => {
    const user = userEvent.setup();
    render(<CreateAgentModal {...defaultProps} />);

    const nameInput = screen.getByLabelText(/Agent Designation/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'lowercase');

    expect(nameInput).toHaveValue('LOWERCASE');
  });

  it('should convert role to uppercase', async () => {
    const user = userEvent.setup();
    render(<CreateAgentModal {...defaultProps} />);

    const roleInput = screen.getByLabelText(/Operational Role/i);
    await user.clear(roleInput);
    await user.type(roleInput, 'lowercase');

    expect(roleInput).toHaveValue('LOWERCASE');
  });

  it('should render all color options', () => {
    render(<CreateAgentModal {...defaultProps} />);

    const colorButtons = screen.getAllByRole('button').filter(
      btn => btn.className.includes('w-8 h-8')
    );

    // 7 colors: blue, yellow, red, green, purple, aqua, orange
    expect(colorButtons.length).toBe(7);
  });

  it('should render preview card with current form data', async () => {
    const user = userEvent.setup();
    render(<CreateAgentModal {...defaultProps} />);

    const nameInput = screen.getByLabelText(/Agent Designation/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'preview_test');

    // The preview should show the updated name
    await waitFor(() => {
      expect(screen.getAllByText('PREVIEW_TEST').length).toBeGreaterThan(0);
    });
  });
});
