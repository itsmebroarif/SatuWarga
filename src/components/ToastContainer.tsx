import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertTriangle, Info, AlertCircle, X, BellRing, ArrowRight } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let bgColor = 'bg-slate-900 text-white border-slate-700';
        let icon = <Info className="w-5 h-5 text-blue-400 shrink-0" />;

        if (toast.type === 'success') {
          bgColor = 'bg-emerald-950 text-emerald-50 border-emerald-500 shadow-[4px_4px_0px_0px_#065f46]';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
        } else if (toast.type === 'error') {
          bgColor = 'bg-rose-950 text-rose-50 border-rose-500 shadow-[4px_4px_0px_0px_#881337]';
          icon = <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
        } else if (toast.type === 'warning') {
          bgColor = 'bg-amber-950 text-amber-50 border-amber-500 shadow-[4px_4px_0px_0px_#78350f]';
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" style={{ animationDuration: '2s' }} />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border-3 shadow-[5px_5px_0px_0px_#0f172a] flex flex-col gap-2.5 transition-all transform translate-y-0 animate-in fade-in slide-in-from-bottom-2 ${bgColor}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                {icon}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-sm leading-tight">{toast.title}</span>
                    {toast.category && (
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase font-mono bg-white/20 text-white border border-white/30">
                        {toast.category}
                      </span>
                    )}
                  </div>
                  {toast.message && (
                    <p className="text-xs opacity-90 font-medium leading-relaxed">{toast.message}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => onDismiss(toast.id)}
                className="p-1 hover:bg-white/10 rounded-lg transition text-current opacity-70 hover:opacity-100 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action button & Timestamp */}
            {(toast.actionLabel || toast.timestamp) && (
              <div className="flex items-center justify-between border-t border-white/15 pt-2 mt-0.5">
                <span className="text-[10px] font-mono text-white/60">
                  {toast.timestamp || 'Baru Saja'}
                </span>
                {toast.actionLabel && (
                  <button
                    onClick={() => {
                      if (toast.onAction) toast.onAction();
                      onDismiss(toast.id);
                    }}
                    className="px-3 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs border border-slate-900 shadow-xs flex items-center gap-1.5 cursor-pointer transition active:translate-y-0.5"
                  >
                    <span>{toast.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

