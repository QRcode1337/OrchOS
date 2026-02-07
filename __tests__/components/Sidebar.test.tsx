import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../../components/dashboard/Sidebar';
import { ViewMode } from '../../types';

describe('Sidebar Component', () => {
  const mockOnViewChange = vi.fn();
  const mockOnDeploy = vi.fn();

  const defaultProps = {
    currentView: 'dashboard' as ViewMode,
    onViewChange: mockOnViewChange,
    onDeploy: mockOnDeploy,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render sidebar header', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('CORTEX_DEV')).toBeInTheDocument();
    expect(screen.getByText('QTY: 05')).toBeInTheDocument();
  });

  it('should render all navigation items', () => {
    render(<Sidebar {...defaultProps} />);

    expect(screen.getByText('NEXUS-07')).toBeInTheDocument();
    expect(screen.getByText('CORTEX-ANALYZER')).toBeInTheDocument();
    expect(screen.getByText('SYSTEM_MANUAL')).toBeInTheDocument();
    expect(screen.getByText('CORTEX_DEV')).toBeInTheDocument();
    expect(screen.getByText('LOGIC-GATE')).toBeInTheDocument();
    expect(screen.getByText('SNAPSHOTS')).toBeInTheDocument();
  });

  it('should render deploy button', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('NEW_DEPLOYMENT')).toBeInTheDocument();
  });

  it('should highlight current view', () => {
    render(<Sidebar {...defaultProps} currentView="dashboard" />);

    const dashboardButton = screen.getByText('NEXUS-07').closest('button');
    expect(dashboardButton).toHaveClass('border-gb-green');
  });

  it('should call onViewChange when dashboard button clicked', () => {
    render(<Sidebar {...defaultProps} currentView="synthesis" />);

    const dashboardButton = screen.getByText('NEXUS-07');
    fireEvent.click(dashboardButton);

    expect(mockOnViewChange).toHaveBeenCalledWith('dashboard');
  });

  it('should call onViewChange when synthesis button clicked', () => {
    render(<Sidebar {...defaultProps} />);

    const synthesisButton = screen.getByText('CORTEX-ANALYZER');
    fireEvent.click(synthesisButton);

    expect(mockOnViewChange).toHaveBeenCalledWith('synthesis');
  });

  it('should call onViewChange when docs button clicked', () => {
    render(<Sidebar {...defaultProps} />);

    const docsButton = screen.getByText('SYSTEM_MANUAL');
    fireEvent.click(docsButton);

    expect(mockOnViewChange).toHaveBeenCalledWith('docs');
  });

  it('should call onViewChange when cortex button clicked', () => {
    render(<Sidebar {...defaultProps} />);

    const cortexButton = screen.getAllByText('CORTEX_DEV')[1]; // Second occurrence (nav item)
    fireEvent.click(cortexButton);

    expect(mockOnViewChange).toHaveBeenCalledWith('cortex');
  });

  it('should call onViewChange when cli button clicked', () => {
    render(<Sidebar {...defaultProps} />);

    const cliButton = screen.getByText('LOGIC-GATE');
    fireEvent.click(cliButton);

    expect(mockOnViewChange).toHaveBeenCalledWith('cli');
  });

  it('should call onViewChange when snapshots button clicked', () => {
    render(<Sidebar {...defaultProps} />);

    const snapshotsButton = screen.getByText('SNAPSHOTS');
    fireEvent.click(snapshotsButton);

    expect(mockOnViewChange).toHaveBeenCalledWith('snapshots');
  });

  it('should call onDeploy when deploy button clicked', () => {
    render(<Sidebar {...defaultProps} />);

    const deployButton = screen.getByText('NEW_DEPLOYMENT');
    fireEvent.click(deployButton);

    expect(mockOnDeploy).toHaveBeenCalledTimes(1);
  });

  it('should render status indicators', () => {
    render(<Sidebar {...defaultProps} />);

    expect(screen.getByText('STATUS: PROCESSING')).toBeInTheDocument();
    expect(screen.getByText('STATUS: STANDBY')).toBeInTheDocument();
    expect(screen.getByText('STATUS: READ_ONLY')).toBeInTheDocument();
    expect(screen.getByText('STATUS: ONLINE')).toBeInTheDocument();
    expect(screen.getByText('STATUS: CRITICAL_ERR')).toBeInTheDocument();
    expect(screen.getByText('STATUS: ARCHIVING')).toBeInTheDocument();
  });

  it('should apply different border colors to different views', () => {
    const { rerender } = render(<Sidebar {...defaultProps} currentView="dashboard" />);
    let activeButton = screen.getByText('NEXUS-07').closest('button');
    expect(activeButton).toHaveClass('border-gb-green');

    rerender(<Sidebar {...defaultProps} currentView="synthesis" />);
    activeButton = screen.getByText('CORTEX-ANALYZER').closest('button');
    expect(activeButton).toHaveClass('border-gb-yellow');

    rerender(<Sidebar {...defaultProps} currentView="docs" />);
    activeButton = screen.getByText('SYSTEM_MANUAL').closest('button');
    expect(activeButton).toHaveClass('border-gb-purple');

    rerender(<Sidebar {...defaultProps} currentView="cortex" />);
    activeButton = screen.getAllByText('CORTEX_DEV')[1].closest('button');
    expect(activeButton).toHaveClass('border-gb-blue');

    rerender(<Sidebar {...defaultProps} currentView="cli" />);
    activeButton = screen.getByText('LOGIC-GATE').closest('button');
    expect(activeButton).toHaveClass('border-gb-red');

    rerender(<Sidebar {...defaultProps} currentView="snapshots" />);
    activeButton = screen.getByText('SNAPSHOTS').closest('button');
    expect(activeButton).toHaveClass('border-gb-aqua');
  });

  it('should render status bars for each navigation item', () => {
    const { container } = render(<Sidebar {...defaultProps} />);

    // Each nav item should have a status bar (div with h-3 height)
    const statusBars = container.querySelectorAll('.h-3');
    expect(statusBars.length).toBeGreaterThanOrEqual(6);
  });

  it('should render icons for each navigation item', () => {
    render(<Sidebar {...defaultProps} />);

    // Check for material symbols icons
    expect(screen.getByText('view_cozy')).toBeInTheDocument();
    expect(screen.getByText('grid_goldenratio')).toBeInTheDocument();
    expect(screen.getByText('menu_book')).toBeInTheDocument();
    expect(screen.getByText('dvr')).toBeInTheDocument();
    expect(screen.getByText('terminal')).toBeInTheDocument();
    expect(screen.getByText('photo_camera')).toBeInTheDocument();
  });

  it('should have proper responsive classes', () => {
    const { container } = render(<Sidebar {...defaultProps} />);

    const sidebar = container.querySelector('aside');
    expect(sidebar).toHaveClass('w-20', 'md:w-64');
  });

  it('should show critical error animation on CLI view', () => {
    render(<Sidebar {...defaultProps} />);

    const criticalStatus = screen.getByText('STATUS: CRITICAL_ERR');
    expect(criticalStatus).toHaveClass('animate-pulse');
  });
});
