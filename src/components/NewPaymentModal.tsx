import React, { useState } from 'react';
import { X, CreditCard, DollarSign, CheckCircle2 } from 'lucide-react';
import { ExhibitorAccount, ThemeMode } from '../types';

interface NewPaymentModalProps {
  isOpen: boolean;
  exhibitor: ExhibitorAccount | null;
  onClose: () => void;
  onRecordPayment: (exhibitorId: string, amountPaid: number, method: string) => void;
  theme: ThemeMode;
}

export const NewPaymentModal: React.FC<NewPaymentModalProps> = ({
  isOpen,
  exhibitor,
  onClose,
  onRecordPayment,
  theme,
}) => {
  if (!isOpen || !exhibitor) return null;

  const [amount, setAmount] = useState<number>(exhibitor.remainingBalance || 10000);
  const [method, setMethod] = useState<string>('تحويل بنكي مباشر');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRecordPayment(exhibitor.id, amount, method);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className={`w-full max-w-md rounded-2xl border p-6 space-y-5 shadow-2xl ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-black font-cairo flex items-center gap-2 text-emerald-400">
            <CreditCard className="w-5 h-5 text-emerald-500" />
            تسجيل دفعة سداد للعارض (Record Payment)
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="font-bold text-slate-200 text-sm">{exhibitor.companyName}</div>
            <div className="text-[11px] text-slate-400 mt-1">
              الجناح: <span className="font-mono text-blue-400 font-bold">{exhibitor.boothNumber}</span> • المتبقي المستحق: <span className="text-rose-400 font-bold">{exhibitor.remainingBalance.toLocaleString('ar-EG')} ج.م</span>
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1 text-slate-300">المبلغ المسدد الآن (ج.م):</label>
            <input
              type="number"
              required
              max={exhibitor.remainingBalance || exhibitor.contractValue}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 font-black font-mono text-sm"
            />
          </div>

          <div>
            <label className="block font-bold mb-1 text-slate-300">طريقة الدفع وسند التحصيل:</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-bold"
            >
              <option value="تحويل بنكي مباشر">تحويل بنكي مباشر (Bank Wire Transfer)</option>
              <option value="شيك مقبول الدفع">شيك مقبول الدفع (Certified Check)</option>
              <option value="نقداً خزينة المعرض">نقداً خزينة المعرض (Cash Deposit)</option>
              <option value="دفع إلكتروني B2B Gateway">دفع إلكتروني B2B Gateway</option>
            </select>
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
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black cursor-pointer shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>اعتماد وتأكيد الدفعة</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
