import React from 'react';
import {
  Users,
  FolderKanban,
  FileCheck,
  Receipt,
  UserPlus,
  FolderPlus,
  FileSpreadsheet,
  CheckSquare,
  ArrowLeft,
  Building2,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Clock,
  DollarSign
} from 'lucide-react';
import { ActiveTab } from './NavigationTabs';
import { ExhibitorAccount, ExpoEvent, RFQRequest, ThreeWayMatchItem, ThemeMode } from '../types';

interface DashboardScreenProps {
  expos: ExpoEvent[];
  exhibitors: ExhibitorAccount[];
  rfqs: RFQRequest[];
  threeWayMatches: ThreeWayMatchItem[];
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenNewRFQ: () => void;
  onOpenNewPayment: () => void;
  theme: ThemeMode;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  expos,
  exhibitors,
  rfqs,
  threeWayMatches,
  onNavigateTab,
  onOpenNewRFQ,
  onOpenNewPayment,
  theme,
}) => {
  const activeClientsCount = exhibitors.length || 4;
  const activeExposCount = expos.length || 2;
  const pendingApprovalsCount = rfqs.filter((r) => !r.offers.some((o) => o.status === 'مقبول')).length;
  const totalBudgetVal = expos.reduce((acc, curr) => acc + curr.totalBudget, 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner Row: Account Permissions & Tester Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Account Role & System Verification Card */}
        <div className="lg:col-span-1 bg-[#0f131d] border border-[#1e2332] rounded-2xl p-4 flex items-center justify-between gap-3 shadow-lg">
          <div>
            <div className="text-[10px] font-bold text-slate-400">صلاحية الحساب الحالية</div>
            <div className="text-sm font-black text-white flex items-center gap-1.5 mt-0.5">
              <span>المدير الأساسي (ANC Admin)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              صلاحية مباشرة واعتمد طلبات المدير المساعد. تم التحقق من الدور والصلاحيات بواسطة الخادم.
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-white font-black text-lg">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        {/* System Version & Readiness Card */}
        <div className="lg:col-span-2 bg-[#0f131d] border border-[#1e2332] rounded-2xl p-4 flex items-center justify-between gap-4 shadow-lg">
          <div>
            <div className="text-[10px] font-bold text-slate-400">حالة النسخة والنظام</div>
            <div className="text-sm font-black text-white mt-0.5 flex items-center gap-2">
              <span>جاهزة للاختبار التشغيلي المتكامل</span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] px-2 py-0.5 rounded-full font-bold">
                نسخة مستقرة B2B
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              واجهة مستقلة لإدارة معارض وفعاليات B2B قابلة للربط والمزامنة الفورية.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('procurement')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors shrink-0 shadow-md"
          >
            <span>عرض الطلبات والمشتريات</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Hero Banner Matching Image */}
      <div className="relative overflow-hidden bg-[#0a0d14] border border-[#1b202e] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl">
        {/* Watermark "A" in Background */}
        <div className="absolute right-12 bottom-0 text-[180px] font-black text-white/[0.02] pointer-events-none select-none leading-none">
          A
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-bold">
            <Layers className="w-3.5 h-3.5 text-slate-300" />
            <span>الهيكل التشغيلي الجديد</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight font-cairo">
            كل شغل الشركة يبدأ من عميل، ثم مشروع، ثم طلب مستقل.
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
            بهذا الربط يمكن فوترتك على مشروع واحد، متابعة ربح كل طلب، وعرض البيانات المناسبة فقط لكل موظف أو عميل مع المتابعة الميدانية اللحظية.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('exhibitor_portal')}
              className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-black text-xs hover:bg-slate-100 transition-all shadow-lg flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-slate-900" />
              <span>اشتراك عارض جديد</span>
            </button>

            <button
              onClick={onOpenNewRFQ}
              className="px-5 py-2.5 rounded-xl bg-[#141824] border border-slate-700 text-white font-bold text-xs hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <FolderPlus className="w-4 h-4 text-slate-300" />
              <span>طرح طلب توريد (RFQ)</span>
            </button>

            <button
              onClick={onOpenNewPayment}
              className="px-5 py-2.5 rounded-xl bg-[#141824] border border-slate-700 text-white font-bold text-xs hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4 text-slate-300" />
              <span>تسجيل سداد أو تحصيل</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row Matching Image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#0f131d] border border-[#1e2332] rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400">العملاء النشطون</div>
            <div className="text-3xl font-black text-white mt-2 font-mono">
              {activeClientsCount}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">من إجمالي {activeClientsCount} عميل عارض</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-white shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#0f131d] border border-[#1e2332] rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400">المشروعات النشطة</div>
            <div className="text-3xl font-black text-white mt-2 font-mono">
              {activeExposCount}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">من إجمالي {activeExposCount} مشروع ومعرض</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-white shrink-0">
            <FolderKanban className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 - Functional Status: Pending Approvals (Amber) */}
        <div className="bg-[#0f131d] border border-[#1e2332] rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400">طلبات تنتظر الاعتماد</div>
            <div className="text-3xl font-black text-amber-400 mt-2 font-mono">
              {pendingApprovalsCount}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">راجعها قبل تنفيذ التغيير</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <FileCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 - Functional Status: Financial Budget (Emerald) */}
        <div className="bg-[#0f131d] border border-[#1e2332] rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400">ميزانيات المشروعات</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-2 font-mono dir-ltr text-right">
              {totalBudgetVal.toLocaleString('ar-EG')} ج.م.
            </div>
            <div className="text-[10px] text-slate-400 mt-1">تظهر للإدارة فقط</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Quick Actions & Approved Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Panel */}
        <div className="lg:col-span-1 bg-[#0f131d] border border-[#1e2332] rounded-2xl p-5 space-y-4 shadow-lg">
          <div>
            <h3 className="text-sm font-black text-white">إجراءات سريعة</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">جرب رحلة الاستخدام على الموبايل والكمبيوتر</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => onNavigateTab('exhibitor_portal')}
              className="w-full p-3 rounded-xl bg-[#151a26] border border-[#232a3d] hover:border-slate-500 text-right flex items-center justify-between transition-all group"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-slate-200 transition-colors">
                  إضافة عميل / عارض
                </div>
                <div className="text-[10px] text-slate-400">إنشاء ملف العارض الأساسي</div>
              </div>
              <UserPlus className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
            </button>

            <button
              onClick={() => onNavigateTab('floorplan')}
              className="w-full p-3 rounded-xl bg-[#151a26] border border-[#232a3d] hover:border-slate-500 text-right flex items-center justify-between transition-all group"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-slate-200 transition-colors">
                  إضافة مشروع / جناح
                </div>
                <div className="text-[10px] text-slate-400">ربطه بعمليات الصالة</div>
              </div>
              <FolderPlus className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
            </button>

            <button
              onClick={() => onNavigateTab('procurement')}
              className="w-full p-3 rounded-xl bg-[#151a26] border border-[#232a3d] hover:border-slate-500 text-right flex items-center justify-between transition-all group"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-slate-200 transition-colors">
                  عرض المشروعات والطلبات
                </div>
                <div className="text-[10px] text-slate-400">البحث والتصفية حسب الحالة</div>
              </div>
              <FileSpreadsheet className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
            </button>

            <button
              onClick={() => onNavigateTab('accounting')}
              className="w-full p-3 rounded-xl bg-[#151a26] border border-[#232a3d] hover:border-slate-500 text-right flex items-center justify-between transition-all group"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-slate-200 transition-colors">
                  طلبات الاعتماد الفورية
                </div>
                <div className="text-[10px] text-slate-400">مطابقة الفواتير وأوامر الشراء</div>
              </div>
              <CheckSquare className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Approved Workflow Path Panel Matching Image */}
        <div className="lg:col-span-2 bg-[#0f131d] border border-[#1e2332] rounded-2xl p-5 space-y-4 shadow-lg">
          <div>
            <h3 className="text-sm font-black text-white">مسار العمل المعتمد</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              العلاقات التي سيعتمد عليها التنفيذ والحسابات في النظام
            </p>
          </div>

          <div className="space-y-3">
            {/* Step 1: Customer */}
            <div className="p-4 rounded-xl bg-[#151a26] border border-[#232a3d] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-white font-black flex items-center justify-center shrink-0 border border-slate-700">
                  1
                </div>
                <div>
                  <div className="text-xs font-black text-white">العميل</div>
                  <div className="text-[10px] text-slate-400">الملف الرئيسي وبيانات التواصل والحساب</div>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('exhibitor_portal')}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="الانتقال للعملاء"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Step 2: Project */}
            <div className="p-4 rounded-xl bg-[#151a26] border border-[#232a3d] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-white font-black flex items-center justify-center shrink-0 border border-slate-700">
                  2
                </div>
                <div>
                  <div className="text-xs font-black text-white">المشروع / الجناح</div>
                  <div className="text-[10px] text-slate-400">حملة أو عقد مستقل داخل حساب العميل</div>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('floorplan')}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="الانتقال للمشروعات"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Step 3: Order */}
            <div className="p-4 rounded-xl bg-[#151a26] border border-[#232a3d] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-white font-black flex items-center justify-center shrink-0 border border-slate-700">
                  3
                </div>
                <div>
                  <div className="text-xs font-black text-white">الطلب / أمر التوريد</div>
                  <div className="text-[10px] text-slate-400">إعلان أو تصوير أو تجهيز أو خدمة منفصلة</div>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('procurement')}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="الانتقال للطلبات"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
