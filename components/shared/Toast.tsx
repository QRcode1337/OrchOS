import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

type ToastLevel = 'error' | 'warning' | 'info' | 'success';

interface Toast {
  id: string;
  level: ToastLevel;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  addToast: (level: ToastLevel, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

const LEVEL_CONFIG: Record<ToastLevel, { icon: string; border: string; text: string; bg: string }> = {
  error:   { icon: 'error',        border: 'border-gb-red',    text: 'text-gb-red',    bg: 'bg-gb-red' },
  warning: { icon: 'warning',      border: 'border-gb-yellow', text: 'text-gb-yellow', bg: 'bg-gb-yellow' },
  info:    { icon: 'info',         border: 'border-gb-blue',   text: 'text-gb-blue',   bg: 'bg-gb-blue' },
  success: { icon: 'check_circle', border: 'border-gb-green',  text: 'text-gb-green',  bg: 'bg-gb-green' },
};

const ToastItem: React.FC<{ toast: Toast; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  const config = LEVEL_CONFIG[toast.level];

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration || 5000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div className={`flex items-start gap-3 bg-gb-bg0 border-2 ${config.border} p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)] animate-[slideIn_0.3s_ease-out] font-mono max-w-sm`}>
      <div className={`${config.bg} w-6 h-6 flex items-center justify-center shrink-0`}>
        <span className="material-symbols-outlined text-gb-bg-h text-sm">{config.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-[10px] font-bold uppercase tracking-[0.15em] ${config.text} mb-1`}>
          {toast.level === 'error' ? 'SYS_ERROR' : toast.level === 'warning' ? 'SYS_WARN' : toast.level === 'success' ? 'SYS_OK' : 'SYS_INFO'}
        </p>
        <p className="text-xs text-gb-fg leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-gb-gray hover:text-gb-fg transition-colors shrink-0"
      >
        <span className="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((level: ToastLevel, message: string, duration?: number) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts(prev => [...prev, { id, level, message, duration }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast container - fixed bottom-right */}
      {toasts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3">
          {toasts.map(toast => (
            <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
};
