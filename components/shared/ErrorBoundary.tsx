import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ORCHESTRA_OS] Uncaught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gb-bg-h flex items-center justify-center p-8 font-mono">
          <div className="max-w-xl w-full border-3 border-gb-red bg-gb-bg0 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)]">
            <div className="bg-gb-red px-6 py-3 flex items-center gap-3">
              <span className="material-symbols-outlined text-gb-bg-h text-xl">error</span>
              <span className="text-gb-bg-h font-display font-bold uppercase tracking-widest text-sm">SYSTEM_FAULT_DETECTED</span>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-2 text-gb-red">
                <span className="w-2 h-2 bg-gb-red animate-ping" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Critical Runtime Exception</span>
              </div>
              <div className="bg-black/40 border-l-2 border-gb-red p-4">
                <p className="text-gb-fg text-xs leading-relaxed break-all">
                  {this.state.error?.message || 'An unexpected error occurred in the application runtime.'}
                </p>
              </div>
              <div className="text-[10px] text-gb-gray space-y-1">
                <p>RECOVERY_PROTOCOL: Manual restart recommended</p>
                <p>TIMESTAMP: {new Date().toISOString()}</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={this.handleReset}
                  className="flex-1 bg-gb-aqua text-gb-bg-h font-display font-bold uppercase py-3 text-sm tracking-wider border-b-4 border-r-4 border-gb-bg-h active:border-0 active:translate-y-1 active:translate-x-1 transition-all hover:brightness-110"
                >
                  Reinitialize System
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 border-2 border-gb-gray text-gb-gray font-display font-bold uppercase py-3 text-sm tracking-wider hover:bg-gb-fg hover:text-gb-bg-h transition-colors"
                >
                  Full Restart
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
