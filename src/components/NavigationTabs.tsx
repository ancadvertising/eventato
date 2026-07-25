import React from 'react';
import { LayoutDashboard, ShoppingCart, FileCheck2, Users, LayoutGrid, CalendarRange, ShieldCheck, Building2, Eye } from 'lucide-react';
import { ThemeMode, ModuleAccessMap } from '../types';

export type ActiveTab = 'dashboard' | 'procurement' | 'accounting' | 'workforce' | 'floorplan' | 'timeline' | 'roles' | 'exhibitor_portal';

interface NavigationTabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  pendingRfqCount: number;
  unverified3WMCount: number;
  pendingTasksCount: number;
  availableBoothsCount: number;
  sessionsCount?: number;
  rolesCount?: number;
  exhibitorsCount?: number;
  theme: ThemeMode;
  moduleAccess?: ModuleAccessMap;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  pendingRfqCount,
  unverified3WMCount,
  pendingTasksCount,
  availableBoothsCount,
  sessionsCount = 3,
  rolesCount = 5,
  exhibitorsCount = 6,
  theme,
  moduleAccess,
}) => {
  const allTabs = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'الرئيسية (لوحة المؤشرات)',
      sublabel: 'نظرة عامة + الإحصائيات الحية',
      icon: LayoutDashboard,
      badge: 'الرئيسية',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'procurement' as ActiveTab,
      label: '1. التوريدات والموردين',
      sublabel: 'عروض الأسعار مقارنة يدوية + PO',
      icon: ShoppingCart,
      badge: pendingRfqCount > 0 ? `${pendingRfqCount} طلبات عروض` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'accounting' as ActiveTab,
      label: '2. الحسابات المزدوجة',
      sublabel: 'مقبوضات العارضين + مطابقة 3-Way',
      icon: FileCheck2,
      badge: unverified3WMCount > 0 ? `${unverified3WMCount} مطابقة` : null,
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    {
      id: 'workforce' as ActiveTab,
      label: '3. المهام والفرق الميدانية',
      sublabel: 'لوحة كانبان + SLA + الكوادر',
      icon: Users,
      badge: pendingTasksCount > 0 ? `${pendingTasksCount} مهام` : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
    {
      id: 'floorplan' as ActiveTab,
      label: '4. الخريطة والتأجير',
      sublabel: '2D/3D + Inspector Panel + تعديل',
      icon: LayoutGrid,
      badge: `${availableBoothsCount} جناح متاح`,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'timeline' as ActiveTab,
      label: '5. برنامج الحدث',
      sublabel: 'جدول الفعاليات والجلسات الزمني',
      icon: CalendarRange,
      badge: `${sessionsCount} جلسات`,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
    {
      id: 'roles' as ActiveTab,
      label: '6. الأدوار والصلاحيات',
      sublabel: 'RBAC + تتبع أذونات الأشخاص والمحرر',
      icon: ShieldCheck,
      badge: `${rolesCount} أدوار`,
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    {
      id: 'exhibitor_portal' as ActiveTab,
      label: '7. بوابة العارضين',
      sublabel: 'اشتراك + دفع إلكتروني + خدمات إضافية',
      icon: Building2,
      badge: `${exhibitorsCount} عارضين`,
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    },
  ];

  // Filter tabs dynamically based on user's active role permissions
  const tabs = allTabs.filter((tab) => {
    if (!moduleAccess) return true;
    return moduleAccess[tab.id] !== 'none';
  });

  return (
    <div className={`border-b transition-colors ${
      theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="px-4 lg:px-6">
        <nav className="flex space-x-1 space-x-reverse overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border shrink-0 ${
                  isActive
                    ? theme === 'dark'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-300 shadow-sm shadow-blue-900/30 ring-1 ring-blue-500/30'
                      : 'bg-white border-blue-600 text-blue-700 shadow-sm ring-1 ring-blue-600/20'
                    : theme === 'dark'
                      ? 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      : 'bg-transparent border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="text-right">
                  <div className="font-bold text-xs">{tab.label}</div>
                  <div className={`text-[10px] font-normal ${
                    isActive 
                      ? 'text-blue-400 font-medium' 
                      : theme === 'dark' ? 'text-slate-500' : 'text-slate-500'
                  }`}>
                    {tab.sublabel}
                  </div>
                </div>

                {tab.badge && (
                  <span className={`mr-2 px-2 py-0.5 rounded-md text-[10px] font-bold border ${tab.badgeColor}`}>
                    {tab.badge}
                  </span>
                )}

                {moduleAccess && moduleAccess[tab.id] === 'view_only' && (
                  <span className="mr-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1" title="صلاحية مشاهدة فقط">
                    <Eye className="w-3 h-3 text-slate-400" />
                    <span>مشاهدة</span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
