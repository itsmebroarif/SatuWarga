import React from 'react';
import { AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Ya, Lanjutkan',
  cancelLabel = 'Batal',
  variant = 'warning',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  let headerBg = 'bg-amber-100 text-amber-900 border-amber-900';
  let icon = <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0" />;
  let confirmBtnClass = 'bg-amber-500 hover:bg-amber-600 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]';

  if (variant === 'danger') {
    headerBg = 'bg-rose-100 text-rose-900 border-rose-900';
    icon = <AlertTriangle className="w-6 h-6 text-rose-700 shrink-0" />;
    confirmBtnClass = 'bg-rose-600 hover:bg-rose-700 text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]';
  } else if (variant === 'success') {
    headerBg = 'bg-emerald-100 text-emerald-900 border-emerald-900';
    icon = <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0" />;
    confirmBtnClass = 'bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]';
  } else if (variant === 'info') {
    headerBg = 'bg-blue-100 text-blue-900 border-blue-900';
    icon = <Info className="w-6 h-6 text-blue-700 shrink-0" />;
    confirmBtnClass = 'bg-[#0056b3] hover:bg-blue-700 text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 dark:text-slate-100 border-2 border-slate-900 rounded-3xl shadow-[6px_6px_0px_0px_#0f172a] dark:shadow-[6px_6px_0px_0px_#000000] max-w-md w-full overflow-hidden space-y-0">
        {/* Header */}
        <div className={`p-4 border-b-2 border-slate-900 flex items-center justify-between ${headerBg}`}>
          <div className="flex items-center gap-3">
            {icon}
            <h3 className="font-extrabold text-base leading-tight">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 hover:bg-black/10 rounded-xl transition text-slate-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
          {message}
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t-2 border-slate-900 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-900 dark:text-white border-2 border-slate-900 rounded-xl text-xs font-extrabold shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer ${confirmBtnClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
