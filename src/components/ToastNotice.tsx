import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastMessage = {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info';
};

interface ToastNoticeProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastNotice: React.FC<ToastNoticeProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-3.5 rounded-2xl border text-xs shadow-2xl flex items-start justify-between gap-3 backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200 ${
            toast.type === 'success'
              ? 'bg-slate-900/95 border-emerald-500/60 text-emerald-300 ring-1 ring-emerald-500/20'
              : toast.type === 'warning'
                ? 'bg-slate-900/95 border-amber-500/60 text-amber-300 ring-1 ring-amber-500/20'
                : 'bg-slate-900/95 border-blue-500/60 text-blue-300 ring-1 ring-blue-500/20'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />}

            <div>
              <div className="font-black text-slate-100 text-xs">{toast.title}</div>
              <div className="text-[11px] text-slate-300 mt-0.5 leading-snug">{toast.message}</div>
            </div>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
