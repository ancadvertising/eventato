import React, { useState } from 'react';
import { X, Receipt, Printer, Send } from 'lucide-react';
import { ExhibitorAccount, ThemeMode } from '../types';

interface ManualInvoiceModalProps {
  isOpen: boolean;
  exhibitor: ExhibitorAccount | null;
  onClose: () => void;
  onIssueInvoice: (exhibitorName: string, invoiceNum: string, amount: number) => void;
  theme: ThemeMode;
}

export const ManualInvoiceModal: React.FC<ManualInvoiceModalProps> = ({
  isOpen,
  exhibitor,
  onClose,
  onIssueInvoice,
  theme,
}) => {
  if (!isOpen || !exhibitor) return null;

  const invoiceNum = `INV-EX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const [invoiceAmount, setInvoiceAmount] = useState<number>(exhibitor.contractValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onIssueInvoice(exhibitor.companyName, invoiceNum, invoiceAmount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className={`w-full max-w-lg rounded-2xl border p-6 space-y-5 shadow-2xl ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-black font-cairo flex items-center gap-2 text-blue-400">
            <Receipt className="w-5 h-5 text-blue-500" />
            إصدار فاتورة يدوية رسمية (Issue Manual Invoice)
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400">رقم الفاتورة الصادرة:</span>
              <span className="font-mono font-bold text-blue-400 text-sm">{invoiceNum}</span>
            </div>
            <div className="font-bold text-slate-100 text-sm">{exhibitor.companyName}</div>
            <div className="text-[11px] text-slate-400">
              الجناح: {exhibitor.boothNumber} • مسؤول التواصل: {exhibitor.contactPerson} ({exhibitor.phone})
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1 text-slate-300">قيمة الفاتورة الإجمالية (ج.م):</label>
            <input
              type="number"
              required
              value={invoiceAmount}
              onChange={(e) => setInvoiceAmount(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-blue-300 font-black font-mono text-sm"
            />
          </div>

          <div>
            <label className="block font-bold mb-1 text-slate-300">ملاحظات وشروط الفاتورة:</label>
            <textarea
              rows={2}
              defaultValue="تستحق هذه الفاتورة خلال 7 أيام عمل من تاريخ صدورها. يشمل حجز المساحة وتجهيز النقاط الكهربائية."
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-300"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black cursor-pointer shadow-md shadow-blue-600/30 flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>إصدار الفاتورة وإرسالها للعارض</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
