import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  DollarSign, 
  Sparkles, 
  Award, 
  ChevronLeft, 
  Building2, 
  ShieldCheck, 
  Phone, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { RFQRequest, VendorOffer, VendorCategory, ExpoEvent, ThemeMode } from '../types';

interface ProcurementScreenProps {
  rfqs: RFQRequest[];
  currentExpo: ExpoEvent;
  searchTerm: string;
  onOpenNewRFQModal: () => void;
  onApprovePO: (rfqId: string, offerId: string, vendorName: string, amount: number) => void;
  onRejectOffer: (rfqId: string, offerId: string) => void;
  theme: ThemeMode;
}

export const ProcurementScreen: React.FC<ProcurementScreenProps> = ({
  rfqs,
  currentExpo,
  searchTerm,
  onOpenNewRFQModal,
  onApprovePO,
  onRejectOffer,
  theme,
}) => {
  const [selectedRfqId, setSelectedRfqId] = useState<string>(rfqs[0]?.id || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  // Filter RFQs
  const filteredRfqs = rfqs.filter((rfq) => {
    const matchesCategory = selectedCategory === 'الكل' || rfq.category === selectedCategory;
    const matchesSearch = 
      rfq.title.includes(searchTerm) ||
      rfq.rfqNumber.includes(searchTerm) ||
      rfq.offers.some((o) => o.vendorName.includes(searchTerm));
    return matchesCategory && matchesSearch;
  });

  const selectedRfq = rfqs.find((r) => r.id === selectedRfqId) || filteredRfqs[0] || rfqs[0];

  // Budget calculations
  const totalAllocatedBudget = currentExpo.totalBudget;
  const approvedPOValue = rfqs.reduce((acc, r) => {
    const approvedOffer = r.offers.find((o) => o.status === 'مقبول');
    return acc + (approvedOffer ? approvedOffer.offerValue : 0);
  }, 0);
  const actualSpent = currentExpo.actualExpenses;
  const budgetPercentage = Math.min(Math.round((approvedPOValue / totalAllocatedBudget) * 100), 100);

  const categories: VendorCategory[] = [
    'ديكور وأجنحة',
    'صوتيات وإضاءة',
    'حراسة وأمن',
    'نظافة وضيافة',
    'شاشات ودعاية',
    'تقنية وشبكات'
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top Header Controls & Cost Summary */}
      <div className={`p-5 rounded-2xl border flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-6 transition-all ${
        theme === 'dark' 
          ? 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl shadow-slate-950/50' 
          : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        {/* Left Info: Expo Name & Action Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 bg-blue-600/10 text-blue-500 rounded-xl border border-blue-500/20">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-400">إدارة المشتريات والتوريدات</span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs font-semibold text-emerald-400">عقود B2B معتمدة</span>
            </div>
            <h2 className="text-xl font-black font-cairo tracking-tight mt-0.5">
              {currentExpo.name}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              إشراف بشري مباشر 100% لمقارنة العروض وتوقيع أوامر الشراء (PO)
            </p>
          </div>

          <button
            onClick={onOpenNewRFQModal}
            className="sm:mr-auto flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ إنشاء طلب عروض أسعار (RFQ)</span>
          </button>
        </div>

        {/* Financial Cost Summary Badge */}
        <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 ${
          theme === 'dark' ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-medium">الميزانية التقديرية المعتمدة</div>
            <div className="text-base font-black text-slate-200">
              {totalAllocatedBudget.toLocaleString('ar-EG')} <span className="text-xs font-normal text-slate-400">ج.م</span>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-800 hidden sm:block"></div>

          <div className="text-right">
            <div className="text-[10px] text-blue-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              أوامر الشراء المعتمدة (POs)
            </div>
            <div className="text-base font-black text-blue-400">
              {approvedPOValue.toLocaleString('ar-EG')} <span className="text-xs font-normal text-blue-300">ج.م</span>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-800 hidden sm:block"></div>

          <div className="text-right">
            <div className="text-[10px] text-emerald-400 font-medium">المصروفات الفعلية المسددة</div>
            <div className="text-base font-black text-emerald-400">
              {actualSpent.toLocaleString('ar-EG')} <span className="text-xs font-normal text-emerald-300">ج.م</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split View Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Right Side: RFQ & Vendor Offers Table (5 Columns on Large Screen) */}
        <div className={`lg:col-span-5 rounded-2xl border overflow-hidden flex flex-col ${
          theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          {/* Table Header & Category Filter */}
          <div className="p-4 border-b border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                جدول طلبات عروض الأسعار (RFQ Requests)
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {filteredRfqs.length} طلبات نشطة
              </span>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
              <button
                onClick={() => setSelectedCategory('الكل')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === 'الكل'
                    ? 'bg-blue-600 text-white'
                    : theme === 'dark' ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                الكل
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : theme === 'dark' ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* RFQ Cards List */}
          <div className="divide-y divide-slate-800/60 max-h-[600px] overflow-y-auto">
            {filteredRfqs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                لا توجد طلبات عروض أسعار تطابق البحث الحالي
              </div>
            ) : (
              filteredRfqs.map((rfq) => {
                const isSelected = rfq.id === selectedRfq?.id;
                const hasApprovedPO = rfq.offers.some((o) => o.status === 'مقبول');
                const approvedOffer = rfq.offers.find((o) => o.status === 'مقبول');

                return (
                  <div
                    key={rfq.id}
                    onClick={() => setSelectedRfqId(rfq.id)}
                    className={`p-4 transition-all cursor-pointer relative ${
                      isSelected
                        ? theme === 'dark'
                          ? 'bg-blue-900/30 border-r-4 border-r-blue-500'
                          : 'bg-blue-50/80 border-r-4 border-r-blue-600'
                        : theme === 'dark'
                          ? 'hover:bg-slate-800/50'
                          : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-blue-300 font-bold border border-slate-700">
                        {rfq.rfqNumber}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {rfq.createdDate}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs mt-2 text-slate-100 line-clamp-2">
                      {rfq.title}
                    </h4>

                    <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-800/40 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-medium">
                          {rfq.category}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {rfq.offers.length} عروض مقدمة
                        </span>
                      </div>

                      <div className="text-left">
                        {hasApprovedPO ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            موقّع PO ({approvedOffer?.offerValue.toLocaleString('ar-EG')} ج.م)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            بانتظار الاعتماد البشري
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Left Side: Manual Offer Comparison Cards (7 Columns on Large Screen) */}
        <div className={`lg:col-span-7 rounded-2xl border p-5 space-y-5 ${
          theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          {selectedRfq ? (
            <>
              {/* Selected RFQ Overview Banner */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                theme === 'dark' ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">
                      {selectedRfq.rfqNumber}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">{selectedRfq.category}</span>
                  </div>
                  <h3 className="font-black text-base font-cairo text-slate-100 mt-1">
                    {selectedRfq.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    مقارنة تفصيلية يدوية بين 3 عروض أسعار معتمدة من الموردين
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <div className="text-[10px] text-slate-400">الميزانية المرصودة للطلب</div>
                  <div className="text-base font-extrabold text-blue-400">
                    {selectedRfq.budgetAllocated.toLocaleString('ar-EG')} ج.م
                  </div>
                </div>
              </div>

              {/* Side-By-Side Comparison Cards for 3 Vendor Offers */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    عروض الأسعار المقدمة للمقارنة (Side-by-Side Comparison)
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    انقر على "اعتماد أمر الشراء (PO)" لتوقيع العرض المفضل يدوياً
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedRfq.offers.map((offer, idx) => {
                    const isApproved = offer.status === 'مقبول';
                    const isRejected = offer.status === 'مرفوض';

                    return (
                      <div
                        key={offer.id}
                        className={`rounded-xl border p-4 flex flex-col justify-between transition-all relative ${
                          isApproved
                            ? 'bg-emerald-950/30 border-emerald-500/60 ring-2 ring-emerald-500/20'
                            : isRejected
                              ? 'bg-slate-950/40 border-slate-800 opacity-60'
                              : theme === 'dark'
                                ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                                : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        {/* Offer Badge Header */}
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              عرض #{idx + 1}
                            </span>
                            <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
                              ★ {offer.vendorRating}
                            </div>
                          </div>

                          <h5 className="font-extrabold text-xs text-slate-100 line-clamp-1" title={offer.vendorName}>
                            {offer.vendorName}
                          </h5>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {offer.vendorPhone}
                          </div>

                          {/* Total Cost Highlight */}
                          <div className="mt-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
                            <div className="text-[10px] text-slate-400">إجمالي قيمة العرض</div>
                            <div className="text-base font-black text-blue-400">
                              {offer.offerValue.toLocaleString('ar-EG')} <span className="text-xs font-normal text-slate-300">ج.م</span>
                            </div>
                          </div>

                          {/* Itemized Cost Breakdown */}
                          <div className="mt-3 space-y-1.5 text-[11px]">
                            <div className="font-bold text-slate-300 text-[10px] border-b border-slate-800 pb-1">
                              تفاصيل التكلفة لكل بند:
                            </div>
                            {offer.items.map((item, i) => (
                              <div key={i} className="flex items-start justify-between gap-1 text-[10px] text-slate-400">
                                <span className="line-clamp-1">{item.description}</span>
                                <span className="font-bold text-slate-200 whitespace-nowrap">
                                  {item.total.toLocaleString('ar-EG')} ج.م
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Delivery & Warranty Specs */}
                          <div className="mt-3 pt-2 border-t border-slate-800 space-y-1 text-[10px] text-slate-400">
                            <div>• مدة التنفيذ: <span className="font-bold text-slate-200">{offer.deliveryDays} أيام</span></div>
                            <div>• الضمان: <span className="font-bold text-slate-200">{offer.warrantyPeriod}</span></div>
                            {offer.notes && (
                              <p className="text-[10px] text-slate-400 italic mt-1 line-clamp-2">
                                "{offer.notes}"
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Explicit Human Decision Button */}
                        <div className="mt-4 pt-3 border-t border-slate-800">
                          {isApproved ? (
                            <div className="w-full py-2 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span>تم اعتماد أمر الشراء PO</span>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <button
                                onClick={() => onApprovePO(selectedRfq.id, offer.id, offer.vendorName, offer.offerValue)}
                                className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer active:scale-95"
                              >
                                <Award className="w-4 h-4" />
                                <span>اعتماد أمر الشراء (PO)</span>
                              </button>

                              {!isRejected && (
                                <button
                                  onClick={() => onRejectOffer(selectedRfq.id, offer.id)}
                                  className="w-full py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 text-[11px] font-semibold transition-all border border-slate-700 hover:border-rose-800 flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>رفض العرض</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">
              اختر طلب عروض أسعار من الجدول على اليمين للمقارنة والاعتماد
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Budget Tracking Progress Bar */}
      <div className={`p-5 rounded-2xl border space-y-3 ${
        theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              متابعة ميزانية التوريدات والمصروفات المعتمدة (Budget Allocation Tracker)
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              نسبة استهلاك الميزانية من واقع أوامر الشراء المعتمدة (POs) والمصروفات المسددة
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="text-blue-400">
              المعتمَد: {approvedPOValue.toLocaleString('ar-EG')} ج.م ({budgetPercentage}%)
            </span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-300">
              الإجمالي: {totalAllocatedBudget.toLocaleString('ar-EG')} ج.م
            </span>
          </div>
        </div>

        {/* Progress Bar Visual */}
        <div className="w-full bg-slate-950 rounded-full h-4 p-0.5 border border-slate-800 overflow-hidden relative">
          <div 
            className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${budgetPercentage}%` }}
          ></div>
        </div>

        {/* Budget Metric Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] text-slate-400">إجمالي الميزانية المرصودة</div>
            <div className="font-black text-slate-200 text-sm mt-0.5">
              {totalAllocatedBudget.toLocaleString('ar-EG')} ج.م
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] text-blue-400">أوامر شراء معتمدة (POs)</div>
            <div className="font-black text-blue-400 text-sm mt-0.5">
              {approvedPOValue.toLocaleString('ar-EG')} ج.م
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] text-emerald-400">مصروفات فعلية مدفوعة</div>
            <div className="font-black text-emerald-400 text-sm mt-0.5">
              {actualSpent.toLocaleString('ar-EG')} ج.م
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] text-amber-400">المتبقي الشاغر للميزانية</div>
            <div className="font-black text-amber-400 text-sm mt-0.5">
              {(totalAllocatedBudget - approvedPOValue).toLocaleString('ar-EG')} ج.م
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
