import React from 'react';
import { 
  Building2, 
  Search, 
  Sun, 
  Moon, 
  ShieldCheck, 
  History, 
  ChevronDown, 
  Plus,
  LogOut,
  MapPin,
  Layers,
  Bell,
  Eraser,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { ExpoEvent, ThemeMode, StaffMember } from '../types';

interface HeaderProps {
  expos: ExpoEvent[];
  selectedExpoId: string;
  onSelectExpo: (id: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenAuditLog: () => void;
  auditCount: number;
  currentUser: StaffMember;
  onOpenLoginModal: () => void;
  onOpenNewRFQ?: () => void;
  onLogout?: () => void;
  onResetWorkspaceToFresh?: () => void;
  onLoadDemoData?: () => void;
  workspaceMode?: 'fresh' | 'demo';
  onOpenNewExpoModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  expos,
  selectedExpoId,
  onSelectExpo,
  searchTerm,
  onSearchChange,
  theme,
  onToggleTheme,
  onOpenAuditLog,
  auditCount,
  currentUser,
  onOpenLoginModal,
  onOpenNewRFQ,
  onLogout,
  onResetWorkspaceToFresh,
  onLoadDemoData,
  workspaceMode = 'fresh',
  onOpenNewExpoModal,
}) => {
  const currentExpo = expos.find((e) => e.id === selectedExpoId) || expos[0] || {
    id: 'default',
    name: 'لا يوجد معرض محدد - أضف معرضاً جديداً',
    city: 'القاهرة',
    dates: '2026'
  };

  return (
    <header className={`border-b transition-colors duration-200 sticky top-0 z-40 backdrop-blur-md ${
      theme === 'dark' 
        ? 'bg-[#080a0f]/95 border-[#181c26] text-slate-100' 
        : 'bg-white/95 border-slate-200 text-slate-800 shadow-xs'
    }`}>
      {/* Main ANC ADVERTISING Header Bar */}
      <div className="px-4 lg:px-6 py-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Right Side: Section Breadcrumb & Title / Search */}
        <div className="flex items-center gap-4 flex-1">
          <div>
            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
              <span>نظام تشغيل ANC</span>
              {workspaceMode === 'fresh' ? (
                <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  مساحة حقيقية من الصفر
                </span>
              ) : (
                <span className="px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                  وضع العرض التجريبي
                </span>
              )}
            </div>
            <h1 className="text-lg font-black text-white font-cairo tracking-tight">
              لوحة المؤشرات والتحكم
            </h1>
          </div>

          <div className="h-8 w-px bg-slate-800 hidden sm:block"></div>

          {/* Expo Selector */}
          <div className="relative group min-w-[200px]">
            <div className={`flex items-center justify-between px-3 py-1.5 rounded-xl border text-xs cursor-pointer transition-all ${
              theme === 'dark'
                ? 'bg-[#0f131d] hover:bg-[#151a28] border-[#1e2332] text-slate-100'
                : 'bg-slate-100 hover:bg-slate-200/80 border-slate-300 text-slate-900'
            }`}>
              <div className="flex items-center gap-2 truncate">
                <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <div className="truncate text-right">
                  <div className="font-bold truncate text-xs">{currentExpo.name}</div>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </div>

            <select
              value={selectedExpoId}
              onChange={(e) => {
                if (e.target.value === 'ADD_NEW' && onOpenNewExpoModal) {
                  onOpenNewExpoModal();
                } else {
                  onSelectExpo(e.target.value);
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              title="اختر المعرض"
            >
              {expos.map((e) => (
                <option key={e.id} value={e.id} className="bg-slate-900 text-white p-2">
                  {e.name}
                </option>
              ))}
              <option value="ADD_NEW" className="bg-emerald-900 text-emerald-200 font-bold p-2">
                + إضافة معرض جديد...
              </option>
            </select>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-xs hidden xl:block">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="بحث شامل..."
              className={`w-full pr-8 pl-3 py-1.5 rounded-xl text-xs transition-all outline-hidden border ${
                theme === 'dark'
                  ? 'bg-[#0d1017] border-[#1e2332] text-slate-100 focus:border-emerald-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>
        </div>

        {/* Left Side: Buttons matching ANC ADVERTISING screenshot */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Workspace Data Switcher */}
          {workspaceMode === 'fresh' ? (
            <button
              onClick={onLoadDemoData}
              className="px-2.5 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="تحميل البيانات التجريبية للتوضيح"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">تحميل نموذج تجريبي</span>
            </button>
          ) : (
            <button
              onClick={onResetWorkspaceToFresh}
              className="px-2.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="تفريغ كل البيانات والبدء ببياناتك من الصفر"
            >
              <Eraser className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">البدء ببيانات فارغة</span>
            </button>
          )}

          {/* New Action Button (+ إضافة جديدة) */}
          <button
            onClick={onOpenNewRFQ}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs hover:from-emerald-400 hover:to-teal-400 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
            <span>إضافة جديدة</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl border border-slate-700 bg-[#0d1017] hover:bg-slate-800 text-slate-300 transition-all cursor-pointer"
            title="تغيير المظهر"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
          </button>

          {/* User Profile Card */}
          <div 
            onClick={onOpenLoginModal}
            className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#0d1017] border border-slate-700 text-right cursor-pointer hover:bg-slate-800/80 transition-all"
            title="إدارة الحساب وتبديل المحرر"
          >
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-7 h-7 rounded-lg object-cover border border-slate-700" />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs">
                {currentUser.name.charAt(0) || 'A'}
              </div>
            )}
            <div className="hidden sm:block text-right">
              <div className="text-xs font-black text-white leading-tight truncate max-w-[110px]">{currentUser.name}</div>
              <div className="text-[9px] text-slate-400 leading-tight truncate max-w-[110px]">{currentUser.role}</div>
            </div>
          </div>

          {/* Approval Requests Pill */}
          <button
            onClick={onOpenAuditLog}
            className="px-2.5 py-1.5 rounded-xl border border-slate-700 bg-[#0d1017] hover:bg-slate-800 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>السجل والاعتماد</span>
            <span className="bg-slate-800 text-slate-300 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
              ({auditCount})
            </span>
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="p-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="تسجيل الخروج"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden xl:inline">خروج</span>
          </button>
        </div>
      </div>
    </header>
  );
};

