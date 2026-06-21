/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export type ToastType = 'success' | 'error';

export interface ToastAction {
  label: string;
  onClick?: () => void;
  to?: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  action?: ToastAction;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType, action?: ToastAction) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType, action?: ToastAction) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => {
      const newToasts = [...prev, { id, message, type, action }];
      // Keep only max 3 toasts
      return newToasts.slice(-3);
    });

    // Auto remove after 5s
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.type === 'error' ? 'alert' : 'status'}
            aria-live="polite"
            className="pointer-events-auto flex items-start gap-3 w-80 p-4 rounded-xl shadow-lg border bg-white animate-in slide-in-from-bottom-5 fade-in duration-300"
            style={{
              borderColor: toast.type === 'success' ? '#22c55e' : '#ef4444',
            }}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            )}
            
            <div className="flex-1">
              <p className="text-sm text-gray-800 font-medium">{toast.message}</p>
              {toast.action && (
                <div className="mt-2">
                  {toast.action.to ? (
                    <Link
                      to={toast.action.to}
                      className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline"
                      onClick={() => {
                        toast.action?.onClick?.();
                        removeToast(toast.id);
                      }}
                    >
                      {toast.action.label}
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        toast.action?.onClick?.();
                        removeToast(toast.id);
                      }}
                      className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      {toast.action.label}
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 shrink-0 p-1"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
