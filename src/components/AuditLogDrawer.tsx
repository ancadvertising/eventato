import React from 'react';
import { X, History, ShieldCheck, CheckCircle2, Clock, User, Filter } from 'lucide-react';
import { AuditLogEntry, ThemeMode } from '../types';

interface AuditLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  auditLogs: AuditLogEntry[];
  theme: ThemeMode;
}

export const AuditLogDrawer: React.FC<AuditLogDrawerProps> = ({
  isOpen,
  onClose,
  auditLogs,
  theme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-start bg-slate-950/80 backdrop-blur-xs">
      <div className={`w-full max-w-md h-full border-l p-6 space-y-5 overflow-y-auto shadow-2xl transition-all ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black font-cairo">سجل القرارات البشرية (Audit Trail)</h3>
              <p className="text-[10px] text-slate-400">توثيق زمني كامل لكل قرار واعتماد بشري للنظام</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Log Timeline Entries */}
        <div className="space-y-3">
          {auditLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              لا توجد اعتمادات مسجلة حتى الآن
            </div>
          ) : (
            auditLogs.map((log) => (
              <div
                key={log.id}
                className={`p-3.5 rounded-xl border text-xs space-y-2 transition-all ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-1 text-[10px]">
                  <span className="font-mono text-indigo-400 font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {log.timestamp}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                    {log.type}
                  </span>
                </div>

                <div className="font-black text-slate-100 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{log.action}</span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                  {log.details}
                </p>

                <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-1 border-t border-slate-800/60">
                  <User className="w-3 h-3 text-slate-500" />
                  <span>المسؤول: {log.user}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
