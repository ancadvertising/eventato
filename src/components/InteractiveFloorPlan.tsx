import React, { useState } from 'react';
import { 
  LayoutGrid, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Lock, 
  Unlock, 
  Check, 
  DollarSign, 
  UserCheck, 
  CheckCircle2, 
  Building2, 
  Sparkles, 
  Sliders, 
  ShieldCheck, 
  Info,
  Maximize2,
  Edit3
} from 'lucide-react';
import { BoothItem, BoothStatus, BoothCategory, ExhibitorAccount, ThemeMode } from '../types';

interface InteractiveFloorPlanProps {
  booths: BoothItem[];
  exhibitors: ExhibitorAccount[];
  searchTerm: string;
  onUpdateBooth: (updatedBooth: BoothItem) => void;
  theme: ThemeMode;
}

export const InteractiveFloorPlan: React.FC<InteractiveFloorPlanProps> = ({
  booths,
  exhibitors,
  searchTerm,
  onUpdateBooth,
  theme,
}) => {
  const [selectedBoothId, setSelectedBoothId] = useState<string>(booths[0]?.id || '');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('الكل');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('الكل');
  const [selectedHall, setSelectedHall] = useState<string>('صالة 1');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Inspector form states for editing
  const selectedBooth = booths.find((b) => b.id === selectedBoothId) || booths[0];

  const [manualPrice, setManualPrice] = useState<number>(
    selectedBooth.manualPriceOverride || selectedBooth.basePrice
  );
  const [overrideReason, setOverrideReason] = useState<string>(selectedBooth.priceOverrideReason || '');
  const [assignedExhibitorId, setAssignedExhibitorId] = useState<string>(selectedBooth.assignedExhibitorId || '');

  // Keep inspector form synchronized when selected booth changes
  React.useEffect(() => {
    if (selectedBooth) {
      setManualPrice(selectedBooth.manualPriceOverride || selectedBooth.basePrice);
      setOverrideReason(selectedBooth.priceOverrideReason || '');
      setAssignedExhibitorId(selectedBooth.assignedExhibitorId || '');
    }
  }, [selectedBoothId]);

  // Filter booths
  const filteredBooths = booths.filter((b) => {
    const matchesHall = b.hall === selectedHall;
    const matchesCat = selectedCategoryFilter === 'الكل' || b.category === selectedCategoryFilter;
    const matchesStatus = selectedStatusFilter === 'الكل' || b.status === selectedStatusFilter;
    const matchesSearch = 
      b.code.includes(searchTerm) || 
      (b.assignedExhibitorName && b.assignedExhibitorName.includes(searchTerm));
    return matchesHall && matchesCat && matchesStatus && matchesSearch;
  });

  // Category list
  const categories: (BoothCategory | 'الكل')[] = [
    'الكل',
    'أجنحة ممتازة A',
    'أجنحة قياسية B',
    'أجنحة صغيرة C',
    'مناطق مفتوحة'
  ];

  // Helper for booth status colors
  const getBoothColor = (status: BoothStatus) => {
    switch (status) {
      case 'متاح':
        return 'bg-emerald-500/20 border-emerald-500 text-emerald-300 hover:bg-emerald-500/30';
      case 'مبيعة':
        return 'bg-rose-500/20 border-rose-500 text-rose-300 hover:bg-rose-500/30';
      case 'محجوزة':
        return 'bg-amber-500/20 border-amber-500 text-amber-300 hover:bg-amber-500/30';
      case 'مغلقة':
        return 'bg-slate-700/50 border-slate-600 text-slate-400 opacity-60';
      default:
        return 'bg-slate-800 border-slate-700 text-slate-300';
    }
  };

  // Handle saving booth status change
  const handleSetBoothStatus = (newStatus: BoothStatus) => {
    const exhibitor = exhibitors.find((e) => e.id === assignedExhibitorId);
    
    const updated: BoothItem = {
      ...selectedBooth,
      status: newStatus,
      manualPriceOverride: manualPrice !== selectedBooth.basePrice ? manualPrice : undefined,
      priceOverrideReason: overrideReason,
      assignedExhibitorId: assignedExhibitorId || undefined,
      assignedExhibitorName: exhibitor ? exhibitor.companyName : selectedBooth.assignedExhibitorName,
      paymentStatus: exhibitor ? exhibitor.paymentStatus : selectedBooth.paymentStatus,
    };

    onUpdateBooth(updated);
  };

  // Toggle service checkbox
  const handleToggleService = (serviceId: string) => {
    const updatedServices = selectedBooth.services.map((s) => 
      s.id === serviceId ? { ...s, selected: !s.selected } : s
    );

    const updated: BoothItem = {
      ...selectedBooth,
      services: updatedServices,
    };

    onUpdateBooth(updated);
  };

  // Toggle Booth Lock
  const handleToggleLock = () => {
    const updated: BoothItem = {
      ...selectedBooth,
      isLocked: !selectedBooth.isLocked,
    };
    onUpdateBooth(updated);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top Header & Toolbar Controls */}
      <div className={`p-4 rounded-2xl border flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 ${
        theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-600/10 text-emerald-500 border border-emerald-500/20">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black font-cairo text-slate-100">
              المخطط التفاعلي للصالة وتخصيص الأجنحة (Interactive Floor Plan)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              خريطة الصالة التفاعلية الملونة حسب الحالة + لوحة المعاينة وتعديل الأسعار والخدمات يدوياً
            </p>
          </div>
        </div>

        {/* Toolbar: Category Filters, Hall Selector, Zoom & Lock Controls */}
        <div className="flex flex-wrap items-center gap-3 justify-end text-xs">
          {/* Hall Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            {['صالة 1', 'صالة 2'].map((h) => (
              <button
                key={h}
                onClick={() => setSelectedHall(h)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedHall === h ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {h}
              </button>
            ))}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategoryFilter === cat
                    ? 'bg-blue-600 text-white'
                    : theme === 'dark' ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Instant Status Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
            {['الكل', 'متاح', 'محجوزة', 'مبيعة', 'مغلقة'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  selectedStatusFilter === st
                    ? st === 'متاح' ? 'bg-emerald-600 text-white'
                      : st === 'محجوزة' ? 'bg-amber-600 text-white'
                      : st === 'مبيعة' ? 'bg-rose-600 text-white'
                      : st === 'مغلقة' ? 'bg-slate-700 text-white'
                      : 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.5))}
              className="p-1.5 text-slate-300 hover:text-white cursor-pointer"
              title="تكبير المخطط Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono px-1 text-blue-400 font-bold">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.7))}
              className="p-1.5 text-slate-300 hover:text-white cursor-pointer"
              title="تصغير المخطط Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 text-slate-300 hover:text-white cursor-pointer"
              title="إعادة ضبط الرؤية Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Floorplan Canvas + Inspector Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Floor Plan Visual Canvas (8 Columns) */}
        <div className={`lg:col-span-8 rounded-2xl border p-5 space-y-4 ${
          theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          {/* Status Color Legend */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              دليل حالات الأجنحة (Status Legend):
            </span>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500"></span>
                <span className="text-emerald-400 font-bold">الأخضر = متاح</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-500"></span>
                <span className="text-amber-400 font-bold">الأصفر = محجوزة</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-rose-500"></span>
                <span className="text-rose-400 font-bold">الأحمر = مبيعة</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-slate-600"></span>
                <span className="text-slate-400 font-bold">الرمادي = مغلقة للتنظيم</span>
              </div>
            </div>
          </div>

          {/* Interactive 2D Hall Floor Grid Canvas */}
          <div className="relative border border-slate-800/80 rounded-2xl p-6 bg-slate-950/90 min-h-[520px] overflow-hidden flex flex-col justify-between">
            {/* Background Hall Grid Lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none"></div>

            {/* Hall Title Banner on Canvas */}
            <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-blue-400 font-cairo">
                  مخطط المعرض التفاعلي - {selectedHall}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  {filteredBooths.length} جناح مجهّز
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                انقر على أي جناح لمعاينة التفاصيل وإدارته يدوياً
              </div>
            </div>

            {/* Booths Grid Stage */}
            <div 
              className="relative w-full h-[400px] mt-4 transition-transform duration-300 origin-top-right"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {filteredBooths.map((booth) => {
                const isSelected = booth.id === selectedBooth?.id;
                const statusColor = getBoothColor(booth.status);

                return (
                  <div
                    key={booth.id}
                    onClick={() => setSelectedBoothId(booth.id)}
                    style={{
                      left: `${booth.x}%`,
                      top: `${booth.y}%`,
                      width: `${booth.width}%`,
                      height: `${booth.height}%`,
                    }}
                    className={`absolute rounded-xl border-2 p-2 flex flex-col justify-between transition-all cursor-pointer shadow-md ${statusColor} ${
                      isSelected ? 'ring-4 ring-blue-500 border-white scale-105 z-20 shadow-xl' : 'z-10'
                    }`}
                  >
                    {/* Booth Code & Lock Icon */}
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono font-black text-xs tracking-wider">
                        {booth.code}
                      </span>
                      {booth.isLocked && (
                        <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                    </div>

                    {/* Dimensions & Exhibitor Name */}
                    <div className="text-center my-auto">
                      <div className="text-[10px] font-bold opacity-80">{booth.dimensions}</div>
                      {booth.assignedExhibitorName && (
                        <div className="text-[10px] font-extrabold line-clamp-1 mt-0.5 text-slate-100">
                          {booth.assignedExhibitorName}
                        </div>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="text-left font-bold text-[9px] opacity-90">
                      {booth.status}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side Inspector Panel (لوحة معاينة وتخصيص الجناح المباشرة - 4 Columns) */}
        <div className={`lg:col-span-4 rounded-2xl border p-5 space-y-5 ${
          theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          {selectedBooth ? (
            <>
              {/* Booth Inspector Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg font-mono text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-xl border border-blue-500/30">
                    {selectedBooth.code}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-100">
                      لوحة تخصيص الجناح (Inspector)
                    </h3>
                    <div className="text-[10px] text-slate-400">{selectedBooth.category} • {selectedBooth.dimensions} ({selectedBooth.areaSqM}m²)</div>
                  </div>
                </div>

                <button
                  onClick={handleToggleLock}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    selectedBooth.isLocked
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
                  }`}
                  title={selectedBooth.isLocked ? 'الجناح مقفول يدوياً' : 'الجناح غير مقفول'}
                >
                  {selectedBooth.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </button>
              </div>

              {/* Exhibitor Manual Assignment */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-400" />
                  اسم العارض المخصص للجناح:
                </label>

                <select
                  value={assignedExhibitorId}
                  onChange={(e) => setAssignedExhibitorId(e.target.value)}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold border transition-all ${
                    theme === 'dark'
                      ? 'bg-slate-950 border-slate-700 text-slate-100 focus:border-blue-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="">-- خالي (بدون تخصيص) --</option>
                  {exhibitors.map((ex) => (
                    <option key={ex.id} value={ex.id} className="bg-slate-900 text-white">
                      {ex.companyName} ({ex.boothNumber}) - {ex.paymentStatus}
                    </option>
                  ))}
                </select>

                {selectedBooth.paymentStatus && (
                  <div className="flex items-center gap-2 text-xs pt-1">
                    <span className="text-slate-400 text-[10px]">حالة السداد:</span>
                    <span className="font-bold text-emerald-400">{selectedBooth.paymentStatus}</span>
                  </div>
                )}
              </div>

              {/* Extra Services Checklist */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  قائمة الخدمات الإضافية للجناح:
                </label>

                <div className="space-y-1.5">
                  {selectedBooth.services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleToggleService(service.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg border text-xs text-right transition-all cursor-pointer ${
                        service.selected
                          ? 'bg-blue-950/40 border-blue-500/50 text-blue-300 font-bold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="text-[11px]">{service.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-amber-400 font-bold">+{service.price.toLocaleString('ar-EG')} ج.م</span>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          service.selected ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-600'
                        }`}>
                          {service.selected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual Price Modification Input Box (تعديل السعر يدوياً) */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                    تعديل سعر الجناح يدوياً:
                  </span>
                  <span className="text-[10px] text-slate-400">
                    الأساسي: {selectedBooth.basePrice.toLocaleString('ar-EG')} ج.م
                  </span>
                </label>

                <div className="relative">
                  <input
                    type="number"
                    value={manualPrice}
                    onChange={(e) => setManualPrice(Number(e.target.value))}
                    className={`w-full p-2.5 pl-12 rounded-lg text-xs font-bold font-mono border ${
                      theme === 'dark' ? 'bg-slate-900 border-slate-700 text-blue-300' : 'bg-white border-slate-300 text-blue-800'
                    }`}
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">ج.م</span>
                </div>

                <input
                  type="text"
                  placeholder="سبب تعديل السعر يدوياً (مثال: خصم خاص B2B)..."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className={`w-full p-2 rounded-lg text-[10px] border ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              {/* Manual Status Changer Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <label className="text-xs font-bold text-slate-300">
                  تغيير حالة الجناح يدوياً (Explicit Manual Decision):
                </label>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => handleSetBoothStatus('متاح')}
                    className="p-2 rounded-xl font-bold bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 transition-all cursor-pointer"
                  >
                    تعيين "متاح"
                  </button>

                  <button
                    onClick={() => handleSetBoothStatus('محجوزة')}
                    className="p-2 rounded-xl font-bold bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/40 transition-all cursor-pointer"
                  >
                    تعيين "محجوزة"
                  </button>

                  <button
                    onClick={() => handleSetBoothStatus('مبيعة')}
                    className="p-2 rounded-xl font-bold bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 transition-all cursor-pointer"
                  >
                    تعيين "مبيعة"
                  </button>

                  <button
                    onClick={() => handleSetBoothStatus('مغلقة')}
                    className="p-2 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
                  >
                    تعيين "مغلقة"
                  </button>
                </div>
              </div>

              {/* Booth Financial Profitability Analytics Card (تحليل أرباح وتكاليف الجناح) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" />
                    التحليل المالي وربحية الجناح ({selectedBooth.code}):
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    هامش صياغة الميزانية
                  </span>
                </div>

                {(() => {
                  const rev = selectedBooth.manualPriceOverride || selectedBooth.basePrice;
                  const estBuildCost = selectedBooth.areaSqM * 750;
                  const addonsCost = selectedBooth.services.filter((s) => s.selected).reduce((sum, s) => sum + s.price * 0.5, 0);
                  const totalEstCost = Math.round(estBuildCost + addonsCost);
                  const netProfit = Math.max(0, rev - totalEstCost);
                  const profitMargin = rev > 0 ? Math.round((netProfit / rev) * 100) : 0;

                  return (
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>إيراد عقد التأجير:</span>
                        <span className="text-blue-300 font-bold">{rev.toLocaleString('ar-EG')} ج.م</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>تكلفة التجهيز والتشغيل التقديرية:</span>
                        <span className="text-rose-300 font-bold">-{totalEstCost.toLocaleString('ar-EG')} ج.م</span>
                      </div>
                      <div className="flex items-center justify-between pt-1.5 border-t border-slate-800 text-slate-200 font-sans">
                        <span className="font-bold text-xs">صافي الربح المتوقع:</span>
                        <span className="font-mono font-black text-emerald-400 text-sm">{netProfit.toLocaleString('ar-EG')} ج.م ({profitMargin}%)</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              حدد جناحاً من المخطط لعرض لوحة التفاصيل
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
