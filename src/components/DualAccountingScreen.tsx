import React, { useState } from 'react';
import { 
  FileCheck2, 
  Receipt, 
  CreditCard, 
  Bell, 
  CheckSquare, 
  Square, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Search, 
  DollarSign, 
  FileSpreadsheet, 
  Send, 
  Plus, 
  ShieldCheck,
  UserCheck,
  Building,
  ArrowRightLeft
} from 'lucide-react';
import { ExhibitorAccount, ThreeWayMatchItem, ThemeMode } from '../types';

interface DualAccountingScreenProps {
  exhibitors: ExhibitorAccount[];
  threeWayMatches: ThreeWayMatchItem[];
  searchTerm: string;
  onOpenNewPaymentModal: (exhibitor: ExhibitorAccount) => void;
  onOpenManualInvoiceModal: (exhibitor: ExhibitorAccount) => void;
  onSendReminder: (exhibitorName: string, phone: string) => void;
  onToggleMatchCheckbox: (matchId: string, checkKey: 'checkInvoiceVsPO' | 'checkPOReciptVsDelivery' | 'checkQualityInspection') => void;
  onDisburseVendorPayment: (matchId: string, vendorName: string, amount: number) => void;
  theme: ThemeMode;
}

export const DualAccountingScreen: React.FC<DualAccountingScreenProps> = ({
  exhibitors,
  threeWayMatches,
  searchTerm,
  onOpenNewPaymentModal,
  onOpenManualInvoiceModal,
  onSendReminder,
  onToggleMatchCheckbox,
  onDisburseVendorPayment,
  theme,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'receivables' | 'payables'>('receivables');
  const [filterStatus, setFilterStatus] = useState<string>('الكل');

  // Filter Receivables (Exhibitors)
  const filteredExhibitors = exhibitors.filter((ex) => {
    const matchesStatus = filterStatus === 'الكل' || ex.paymentStatus === filterStatus;
    const matchesSearch = 
      ex.companyName.includes(searchTerm) ||
      ex.boothNumber.includes(searchTerm) ||
      ex.contactPerson.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  // Calculate Receivables Financial Metrics
  const totalContractValues = exhibitors.reduce((acc, e) => acc + e.contractValue, 0);
  const totalCollectedAmount = exhibitors.reduce((acc, e) => acc + e.amountPaid, 0);
  const totalRemainingBalance = exhibitors.reduce((acc, e) => acc + e.remainingBalance, 0);

  // Filter Payables (3WM)
  const filteredPayables = threeWayMatches.filter((item) => {
    return (
      item.vendorName.includes(searchTerm) ||
      item.invoiceNumber.includes(searchTerm) ||
      item.poNumber.includes(searchTerm)
    );
  });

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top Header Toggle Switcher */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
        theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div>
          <h2 className="text-lg font-black font-cairo flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-blue-500" />
            لوحة الحسابات المزدوجة (Dual Accounting Dashboard)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            فصل تام بين مقبوضات العارضين ومصروفات الموردين مع نظام المطابقة الثلاثية 3-Way Matching
          </p>
        </div>

        {/* The Core Toggle Switcher */}
        <div className={`p-1.5 rounded-xl border flex items-center gap-1 ${
          theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'
        }`}>
          <button
            onClick={() => setActiveSubTab('receivables')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'receivables'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>[ حسابات المقبوضات - العارضين ]</span>
          </button>

          <button
            onClick={() => setActiveSubTab('payables')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'payables'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>[ حسابات المصروفات - الموردين ]</span>
            {threeWayMatches.filter(m => m.status !== 'تم صرف الدفعة').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            )}
          </button>
        </div>
      </div>

      {/* VIEW A: Exhibitor Receivables (حسابات العارضين - المقبوضات) */}
      {activeSubTab === 'receivables' && (
        <div className="space-y-6">
          {/* Receivables Summary Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl border ${
              theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="text-xs text-slate-400 font-medium">إجمالي عقود حجز الأجنحة</div>
              <div className="text-xl font-black text-slate-100 mt-1">
                {totalContractValues.toLocaleString('ar-EG')} <span className="text-xs font-normal text-slate-400">ج.م</span>
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${
              theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                المبالغ المحصلة الفكرية
              </div>
              <div className="text-xl font-black text-emerald-400 mt-1">
                {totalCollectedAmount.toLocaleString('ar-EG')} <span className="text-xs font-normal text-emerald-300">ج.م</span>
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${
              theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="text-xs text-rose-400 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                المتبقي المستحق على العارضين
              </div>
              <div className="text-xl font-black text-rose-400 mt-1">
                {totalRemainingBalance.toLocaleString('ar-EG')} <span className="text-xs font-normal text-rose-300">ج.م</span>
              </div>
            </div>
          </div>

          {/* Table Controls & Filter Chips */}
          <div className={`p-4 rounded-2xl border space-y-4 ${
            theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-blue-400" />
                سجل حسابات وتحصيلات الشركات العارضة (Exhibitors Ledger)
              </h3>

              {/* Status Filters */}
              <div className="flex items-center gap-1.5 text-xs">
                {['الكل', 'مكتمل', 'جزئي', 'متأخر'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      filterStatus === st
                        ? 'bg-blue-600 text-white'
                        : theme === 'dark' ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Exhibitors Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className={`border-b text-slate-400 font-bold ${
                    theme === 'dark' ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <th className="p-3">اسم الشركة العارضة</th>
                    <th className="p-3 text-center">رقم الجناح</th>
                    <th className="p-3">قيمة العقد</th>
                    <th className="p-3">المبلغ المدفوع</th>
                    <th className="p-3">المتبقي</th>
                    <th className="p-3 text-center">حالة الدفع</th>
                    <th className="p-3 text-center">أزرار الإجراءات السريعة (Quick Actions)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredExhibitors.map((ex) => (
                    <tr 
                      key={ex.id}
                      className={`transition-all ${
                        theme === 'dark' ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="p-3 font-bold text-slate-100">
                        <div>{ex.companyName}</div>
                        <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                          {ex.contactPerson} • {ex.phone}
                        </div>
                      </td>

                      <td className="p-3 text-center">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold font-mono">
                          {ex.boothNumber}
                        </span>
                      </td>

                      <td className="p-3 font-bold text-slate-200">
                        {ex.contractValue.toLocaleString('ar-EG')} ج.م
                      </td>

                      <td className="p-3 font-bold text-emerald-400">
                        {ex.amountPaid.toLocaleString('ar-EG')} ج.م
                      </td>

                      <td className="p-3 font-bold text-rose-400">
                        {ex.remainingBalance.toLocaleString('ar-EG')} ج.م
                      </td>

                      <td className="p-3 text-center">
                        {ex.paymentStatus === 'مكتمل' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            مكتمل السداد
                          </span>
                        )}
                        {ex.paymentStatus === 'جزئي' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            سداد جزئي
                          </span>
                        )}
                        {ex.paymentStatus === 'متأخر' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                            متأخر عن الموعد
                          </span>
                        )}
                      </td>

                      {/* Quick Action Buttons */}
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => onOpenManualInvoiceModal(ex)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 text-[11px] font-bold transition-all border border-slate-700 flex items-center gap-1 cursor-pointer"
                            title="إصدار فاتورة رسمية يدوياً"
                          >
                            <Receipt className="w-3.5 h-3.5 text-blue-400" />
                            <span>إصدار فاتورة يدوية</span>
                          </button>

                          <button
                            onClick={() => onOpenNewPaymentModal(ex)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                            title="تسجيل دفعة نقدية أو بنكية"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>تسجيل دفعة</span>
                          </button>

                          <button
                            onClick={() => onSendReminder(ex.companyName, ex.phone)}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[11px] font-bold transition-all border border-amber-500/30 flex items-center gap-1 cursor-pointer"
                            title="إرسال رسالة تذكير هاتفية"
                          >
                            <Bell className="w-3.5 h-3.5 text-amber-400" />
                            <span>إرسال تذكير</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW B: Vendor Accounts & 3-Way Matching (حسابات الموردين - المطابقة الثلاثية) */}
      {activeSubTab === 'payables' && (
        <div className="space-y-6">
          {/* 3WM Informational Banner */}
          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            theme === 'dark' ? 'bg-slate-950/90 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-100">
                  نظام المطابقة الثلاثية للمصروفات (3-Way Matching Control)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  مطابقة بشرية صارمة بين: [ فاتورة المورد ] + [ أمر الشراء PO ] + [ إشعار الاستلام الميداني ] قبل الصرف
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              يتطلب موافقة بشرية 100% لكل بند
            </span>
          </div>

          {/* Payables Grid / Checklist Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPayables.map((item) => {
              const allChecked = item.checkInvoiceVsPO && item.checkPOReciptVsDelivery && item.checkQualityInspection;
              const isPaid = item.status === 'تم صرف الدفعة';

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-5 space-y-4 transition-all relative ${
                    isPaid
                      ? 'bg-slate-900/40 border-slate-800 opacity-80'
                      : allChecked
                        ? 'bg-blue-950/20 border-blue-500/60 ring-2 ring-blue-500/20'
                        : theme === 'dark'
                          ? 'bg-slate-900/90 border-slate-800'
                          : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  {/* Vendor Header */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-blue-300 border border-slate-700">
                        {item.category}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-100 mt-1">
                        {item.vendorName}
                      </h4>
                    </div>

                    <div className="text-left">
                      <div className="text-[10px] text-slate-400">قيمة الفاتورة المستحقة</div>
                      <div className="text-lg font-black text-blue-400">
                        {item.invoiceAmount.toLocaleString('ar-EG')} ج.م
                      </div>
                    </div>
                  </div>

                  {/* The 3 Documents Comparison Box */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-bold">1. فاتورة المورد</div>
                      <div className="font-mono text-blue-400 font-bold mt-0.5">{item.invoiceNumber}</div>
                      <div className="text-[10px] text-slate-300 mt-0.5">{item.invoiceAmount.toLocaleString('ar-EG')} ج.م</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-bold">2. أمر الشراء PO</div>
                      <div className="font-mono text-indigo-400 font-bold mt-0.5">{item.poNumber}</div>
                      <div className="text-[10px] text-slate-300 mt-0.5">{item.poAmount.toLocaleString('ar-EG')} ج.م</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-bold">3. الاستلام الميداني</div>
                      <div className="font-mono text-emerald-400 font-bold mt-0.5">{item.receivingNoteNumber}</div>
                      <div className="text-[10px] text-emerald-300 font-semibold mt-0.5">{item.receivingNoteStatus}</div>
                    </div>
                  </div>

                  {/* Manual Review Checklist Checkboxes */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                    <div className="font-bold text-slate-300 text-[11px] mb-1">
                      قائمة الفحص والمطابقة اليدوية (Human Checkpoints):
                    </div>

                    <button
                      disabled={isPaid}
                      onClick={() => onToggleMatchCheckbox(item.id, 'checkInvoiceVsPO')}
                      className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all text-right cursor-pointer ${
                        item.checkInvoiceVsPO 
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="text-xs">1. مطابقة مطابقة أرقام وقيم الفاتورة مع أمر الشراء PO</span>
                      {item.checkInvoiceVsPO ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                    </button>

                    <button
                      disabled={isPaid}
                      onClick={() => onToggleMatchCheckbox(item.id, 'checkPOReciptVsDelivery')}
                      className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all text-right cursor-pointer ${
                        item.checkPOReciptVsDelivery 
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="text-xs">2. مطابقة كميات وأصناف إشعار الاستلام الميداني المعتمد</span>
                      {item.checkPOReciptVsDelivery ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                    </button>

                    <button
                      disabled={isPaid}
                      onClick={() => onToggleMatchCheckbox(item.id, 'checkQualityInspection')}
                      className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all text-right cursor-pointer ${
                        item.checkQualityInspection 
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="text-xs">3. تأكيد جودة التنفيذ وعدم وجود أي مخالفات أو تلفيات بالصالة</span>
                      {item.checkQualityInspection ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                    </button>
                  </div>

                  {/* Primary Action Button: "صرف الدفعة المالية" */}
                  <div className="pt-2 border-t border-slate-800">
                    {isPaid ? (
                      <div className="p-3 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>تم صرف الدفعة المالية بنجاح (اعتماد: {item.approvedBy})</span>
                      </div>
                    ) : (
                      <button
                        disabled={!allChecked}
                        onClick={() => onDisburseVendorPayment(item.id, item.vendorName, item.invoiceAmount)}
                        className={`w-full py-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                          allChecked
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 active:scale-95'
                            : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>صرف الدفعة المالية (Disburse Payment)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
