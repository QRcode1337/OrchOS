import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AgentCard from '../../components/dashboard/AgentCard';
import { Agent } from '../../types';

describe('AgentCard Component', () => {
  const mockAgent: Agent = {
    id: 'test-agent-1',
    name: 'TEST_AGENT',
    role: 'TEST_ROLE',
    status: 'RUNNING',
    version: 'v1.0.0',
    message: 'Processing test data...',
    imageUrl: 'https://example.com/agent.png',
    color: 'blue',
    progress: 75,
  };

  it('should render agent information', () => {
    render(<AgentCard agent={mockAgent} />);

    expect(screen.getByText('TEST_AGENT')).toBeInTheDocument();
    expect(screen.getByText('PROCESSING')).toBeInTheDocument();
    expect(screen.getByText('"Processing test data..."')).toBeInTheDocument();
    expect(screen.getByText('v1.0.0')).toBeInTheDocument();
  });

  it('should display correct status text for RUNNING', () => {
    render(<AgentCard agent={mockAgent} />);
    expect(screen.getByText('Status: RUNNING')).toBeInTheDocument();
    expect(screen.getByText('PROCESSING')).toBeInTheDocument();
  });

  it('should display correct status text for IDLE', () => {
    const idleAgent = { ...mockAgent, status: 'IDLE' as const };
    render(<AgentCard agent={idleAgent} />);
    expect(screen.getByText('Status: IDLE')).toBeInTheDocument();
    expect(screen.getByText('IDLE')).toBeInTheDocument();
  });

  it('should display correct status text for ERROR', () => {
    const errorAgent = { ...mockAgent, status: 'ERROR' as const };
    render(<AgentCard agent={errorAgent} />);
    expect(screen.getByText('Status: ERROR')).toBeInTheDocument();
  });

  it('should render progress bar with correct width', () => {
    const { container } = render(<AgentCard agent={mockAgent} />);
    const progressBar = container.querySelector('[style*="width: 75%"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('should render agent image', () => {
    render(<AgentCard agent={mockAgent} />);
    const image = screen.getByAltText('TEST_AGENT');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/agent.png');
  });

  it('should call onClick when card is clicked', () => {
    const handleClick = vi.fn();
    render(<AgentCard agent={mockAgent} onClick={handleClick} />);

    const card = screen.getByText('TEST_AGENT').closest('div')?.parentElement;
    if (card) {
      fireEvent.click(card);
      expect(handleClick).toHaveBeenCalledTimes(1);
    }
  });

  it('should show pause button when agent is RUNNING', () => {
    render(<AgentCard agent={mockAgent} />);
    const pauseButton = screen.getByTitle('Pause Agent Execution');
    expect(pauseButton).toBeInTheDocument();
  });

  it('should show play button when agent is not RUNNING', () => {
    const idleAgent = { ...mockAgent, status: 'IDLE' as const };
    render(<AgentCard agent={idleAgent} />);
    const playButton = screen.getByTitle('Resume Agent Task');
    expect(playButton).toBeInTheDocument();
  });

  it('should call onUpdateStatus with RUNNING when play button clicked', () => {
    const handleUpdateStatus = vi.fn();
    const idleAgent = { ...mockAgent, status: 'IDLE' as const };
    render(<AgentCard agent={idleAgent} onUpdateStatus={handleUpdateStatus} />);

    const playButton = screen.getByTitle('Resume Agent Task');
    fireEvent.click(playButton);

    expect(handleUpdateStatus).toHaveBeenCalledWith('test-agent-1', 'RUNNING');
  });

  it('should call onUpdateStatus with IDLE when pause button clicked', () => {
    const handleUpdateStatus = vi.fn();
    render(<AgentCard agent={mockAgent} onUpdateStatus={handleUpdateStatus} />);

    const pauseButton = screen.getByTitle('Pause Agent Execution');
    fireEvent.click(pauseButton);

    expect(handleUpdateStatus).toHaveBeenCalledWith('test-agent-1', 'IDLE');
  });

  it('should call onUpdateStatus with OFFLINE when terminate button clicked', () => {
    const handleUpdateStatus = vi.fn();
    render(<AgentCard agent={mockAgent} onUpdateStatus={handleUpdateStatus} />);

    const terminateButton = screen.getByTitle('Terminate Process');
    fireEvent.click(terminateButton);

    expect(handleUpdateStatus).toHaveBeenCalledWith('test-agent-1', 'OFFLINE');
  });

  it('should show pulse animation for RUNNING status', () => {
    const { container } = render(<AgentCard agent={mockAgent} />);
    const pulseIndicator = container.querySelector('.animate-pulse');
    expect(pulseIndicator).toBeInTheDocument();
  });

  it('should show ping animation for ERROR status', () => {
    const errorAgent = { ...mockAgent, status: 'ERROR' as const };
    const { container } = render(<AgentCard agent={errorAgent} />);
    const pingIndicator = container.querySelector('.animate-ping');
    expect(pingIndicator).toBeInTheDocument();
  });

  it('should handle 0% progress', () => {
    const zeroProgressAgent = { ...mockAgent, progress: 0 };
    const { container } = render(<AgentCard agent={zeroProgressAgent} />);
    const progressBar = container.querySelector('[style*="width: 0%"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('should handle 100% progress', () => {
    const fullProgressAgent = { ...mockAgent, progress: 100 };
    const { container } = render(<AgentCard agent={fullProgressAgent} />);
    const progressBar = container.querySelector('[style*="width: 100%"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('should apply correct color class', () => {
    const { container } = render(<AgentCard agent={mockAgent} />);
    expect(container.querySelector('.bg-gb-blue')).toBeInTheDocument();
  });

  it('should stop propagation when control buttons are clicked', () => {
    const handleClick = vi.fn();
    const handleUpdateStatus = vi.fn();
    render(
      <AgentCard
        agent={mockAgent}
        onClick={handleClick}
        onUpdateStatus={handleUpdateStatus}
      />
    );

    const pauseButton = screen.getByTitle('Pause Agent Execution');
    fireEvent.click(pauseButton);

    expect(handleUpdateStatus).toHaveBeenCalledTimes(1);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
