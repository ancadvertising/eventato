import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  FileCheck2,
  Users,
  LayoutGrid,
  CalendarRange,
  ShieldCheck,
  Building2,
  FolderKanban,
  FileText,
  CreditCard,
  Building,
  History,
  Settings,
  ChevronLeft,
  Megaphone,
  Palette
} from 'lucide-react';
import { ActiveTab } from './NavigationTabs';
import { ThemeMode, ModuleAccessMap } from '../types';

interface AncSidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  pendingRfqsCount: number;
  unverified3WMCount: number;
  overdueTasksCount: number;
  availableBoothsCount: number;
  sessionsCount?: number;
  rolesCount?: number;
  exhibitorsCount?: number;
  theme: ThemeMode;
  onOpenAuditLog: () => void;
  auditCount: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  moduleAccess?: ModuleAccessMap;
}

export const AncSidebar: React.FC<AncSidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingRfqsCount,
  unverified3WMCount,
  overdueTasksCount,
  availableBoothsCount,
  sessionsCount = 3,
  rolesCount = 5,
  exhibitorsCount = 6,
  theme,
  onOpenAuditLog,
  auditCount,
  isCollapsed = false,
  onToggleCollapse,
  moduleAccess,
}) => {
  const rawCategories = [
    {
      groupTitle: 'الإدارة',
      items: [
        {
          id: 'dashboard' as ActiveTab,
          label: 'لوحة المؤشرات',
          icon: LayoutDashboard,
          badge: null,
        },
        {
          id: 'exhibitor_portal' as ActiveTab,
          label: 'العملاء والعارضين',
          icon: Building2,
          badge: `${exhibitorsCount}`,
          badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
        },
        {
          id: 'floorplan' as ActiveTab,
          label: 'المشروعات والصالات',
          icon: FolderKanban,
          badge: `${availableBoothsCount} شاغرة`,
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        },
        {
          id: 'procurement' as ActiveTab,
          label: 'الطلبات والمشتريات',
          icon: ShoppingCart,
          badge: pendingRfqsCount > 0 ? `${pendingRfqsCount} جديد` : null,
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        },
      ],
    },
    {
      groupTitle: 'التنفيذ والعمليات',
      items: [
        {
          id: 'procurement' as ActiveTab,
          label: 'الإعلانات والمشتريات',
          icon: Megaphone,
          badge: null,
        },
        {
          id: 'workforce' as ActiveTab,
          label: 'المهام والتسليمات',
          icon: Users,
          badge: overdueTasksCount > 0 ? `${overdueTasksCount} متأخر` : null,
          badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        },
        {
          id: 'floorplan' as ActiveTab,
          label: 'خريطة المعرض',
          icon: LayoutGrid,
          badge: null,
        },
      ],
    },
    {
      groupTitle: 'المالية والحسابات',
      items: [
        {
          id: 'accounting' as ActiveTab,
          label: 'الفواتير والمدفوعات',
          icon: FileText,
          badge: unverified3WMCount > 0 ? `${unverified3WMCount} مطابقة` : null,
          badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        },
        {
          id: 'accounting' as ActiveTab,
          label: 'البنك والحركات (3-Way)',
          icon: CreditCard,
          badge: null,
        },
        {
          id: 'exhibitor_portal' as ActiveTab,
          label: 'بوابة سداد العارضين',
          icon: Building,
          badge: 'دفع إلكتروني',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        },
      ],
    },
    {
      groupTitle: 'النظام والصلاحيات',
      items: [
        {
          id: 'roles' as ActiveTab,
          label: 'الموظفون والصلاحيات',
          icon: ShieldCheck,
          badge: `${rolesCount} أدوار`,
          badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        },
        {
          id: 'timeline' as ActiveTab,
          label: 'الجدول الزمني للفعاليات',
          icon: CalendarRange,
          badge: `${sessionsCount} جلسات`,
          badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        },
      ],
    },
  ];

  // Filter categories and items based on moduleAccess
  const categories = rawCategories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter((item) => {
        if (!moduleAccess) return true;
        return moduleAccess[item.id] !== 'none';
      }),
    }))
    .filter((cat) => cat.items.length > 0);

  return (
    <aside
      className={`fixed right-0 top-0 h-screen z-50 flex flex-col transition-all duration-300 border-l ${
        theme === 'dark'
          ? 'bg-[#080a0f] border-[#181c26] text-slate-200'
          : 'bg-slate-900 border-slate-800 text-slate-100'
      } ${isCollapsed ? 'w-16' : 'w-64 lg:w-72'}`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-[#181c26] flex items-center justify-between gap-3">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 font-black text-lg tracking-wider font-cairo text-white">
              <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center font-black text-xs shadow-md">
                ANC
              </div>
              <span>ANC</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider">
              ADVERTISING
            </span>
            <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 text-[9px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>LIVE</span>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="mx-auto w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-black text-xs shadow-md">
            ANC
          </div>
        )}

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title={isCollapsed ? 'توسيع القائمة' : 'طي القائمة'}
          >
            <ChevronLeft
              className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {categories.map((cat, idx) => (
          <div key={idx} className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 text-[10px] font-bold text-slate-400 tracking-wider mb-2">
                {cat.groupTitle}
              </div>
            )}

            {cat.items.map((item, itemIdx) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={`${item.id}-${itemIdx}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all group ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-md shadow-white/10 font-black'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-[#121622]'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-white'
                      }`}
                    />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!isCollapsed && item.badge && !isActive && (
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full border font-bold shrink-0 ${
                        item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}

        {/* Audit Log Quick Trigger in Sidebar */}
        <div className="pt-2 border-t border-[#181c26]">
          <button
            onClick={onOpenAuditLog}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-[#121622] transition-all`}
          >
            <div className="flex items-center gap-2.5">
              <History className="w-4 h-4 text-slate-300" />
              {!isCollapsed && <span>سجل النشاط والقرارات</span>}
            </div>
            {!isCollapsed && (
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[9px] px-2 py-0.5 rounded-full font-bold">
                {auditCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* User Profile Footer in Sidebar */}
      <div className="p-3 border-t border-[#181c26] bg-[#06070a]">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-[#0e121b] border border-[#1b202e]">
          <div className="w-8 h-8 rounded-lg bg-white text-black font-extrabold flex items-center justify-center shrink-0 shadow-xs">
            A
          </div>
          {!isCollapsed && (
            <div className="truncate text-right">
              <div className="text-xs font-bold text-white truncate">ANC ERP</div>
              <div className="text-[10px] text-slate-400 truncate dir-ltr">
                anc.adv.agency@gmail.com
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
