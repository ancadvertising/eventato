import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Check, 
  X, 
  Plus, 
  Edit, 
  Users, 
  Key, 
  Eye, 
  Edit3, 
  ShoppingBag, 
  DollarSign, 
  CheckSquare, 
  Map, 
  Calendar, 
  Shield, 
  Info,
  Sparkles,
  Lock,
  Unlock,
  LayoutDashboard,
  Building2
} from 'lucide-react';
import { 
  SystemRole, 
  StaffMember, 
  PermissionKey, 
  ThemeMode,
  ModuleId,
  AccessMode,
  ModuleAccessMap
} from '../types';

interface RolesPermissionsScreenProps {
  roles: SystemRole[];
  staffMembers: StaffMember[];
  currentUser: StaffMember;
  searchTerm: string;
  onUpdateRole?: (updatedRole: SystemRole) => void;
  onUpdateRolePermissions: (roleId: string, newPermissions: PermissionKey[]) => void;
  onAssignUserRole: (staffId: string, newRoleId: string) => void;
  onCreateNewRole: (newRole: SystemRole) => void;
  theme: ThemeMode;
}

interface ModuleDefinition {
  id: ModuleId;
  name: string;
  description: string;
  icon: React.ReactNode;
  relatedPermissions: PermissionKey[];
}

const MODULE_DEFINITIONS: ModuleDefinition[] = [
  {
    id: 'dashboard',
    name: 'الرئيسية ولوحة المؤشرات (Dashboard)',
    description: 'الصفحة الرئيسية والإحصائيات والملخصات التنفيذية للحدث',
    icon: <LayoutDashboard className="w-4 h-4 text-cyan-400" />,
    relatedPermissions: [],
  },
  {
    id: 'exhibitor_portal',
    name: 'بوابة خدمات العارضين والاشتراك (Exhibitor Portal)',
    description: 'إدارة اشتراكات العارضين، الدفع الإلكتروني، وتذاكر الدعم والخدمات',
    icon: <Building2 className="w-4 h-4 text-teal-400" />,
    relatedPermissions: ['issue_invoice'],
  },
  {
    id: 'procurement',
    name: 'المشتريات والتوريدات (Procurement)',
    description: 'طلبات المناقصات RFQ، عروض الأسعار، اعتماد أومر الشراء وترسية التوريدات',
    icon: <ShoppingBag className="w-4 h-4 text-blue-400" />,
    relatedPermissions: ['approve_po', 'add_categories'],
  },
  {
    id: 'accounting',
    name: 'المالية والمطابقة 3WM (Finance)',
    description: 'تحصيل المستحقات، مطابقة الفواتير الثلاثية، وصرف دفعات الموردين',
    icon: <DollarSign className="w-4 h-4 text-emerald-400" />,
    relatedPermissions: ['disburse_payment', 'record_payment', 'issue_invoice'],
  },
  {
    id: 'workforce',
    name: 'المهام والفرق الميدانية (Workforce)',
    description: 'تعيين وتوجيه كوادر الصالة، متابعة المهام وتنبيهات الجوال',
    icon: <CheckSquare className="w-4 h-4 text-indigo-400" />,
    relatedPermissions: ['assign_task'],
  },
  {
    id: 'floorplan',
    name: 'خريطة الأجنحة والمعرض (Floorplan)',
    description: 'تأجير الأجنحة، تعديل المخططات، تسعير وترقية الأماكن الميدانية',
    icon: <Map className="w-4 h-4 text-amber-400" />,
    relatedPermissions: ['edit_floorplan'],
  },
  {
    id: 'timeline',
    name: 'برنامج الحدث والفعاليات (Timeline)',
    description: 'جدول الندوات والمؤتمرات، حفل الافتتاح، ومتابعة القاعات',
    icon: <Calendar className="w-4 h-4 text-rose-400" />,
    relatedPermissions: ['manage_timeline'],
  },
  {
    id: 'roles',
    name: 'الأدوار والصلاحيات والنظام (Roles & System)',
    description: 'إدارة الأدوار الوظيفية المخصصة وتعيين الصلاحيات للمستخدمين',
    icon: <Shield className="w-4 h-4 text-purple-400" />,
    relatedPermissions: ['manage_roles'],
  },
];

const COLOR_OPTIONS = [
  { name: 'بنفسجي متألق', value: 'bg-purple-500/20 text-purple-400 border-purple-500/40' },
  { name: 'أزرق تقني', value: 'bg-blue-500/20 text-blue-400 border-blue-500/40' },
  { name: 'زمردي مالي', value: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
  { name: 'كهروماني ميداني', value: 'bg-amber-500/20 text-amber-400 border-amber-500/40' },
  { name: 'وردي فعاليات', value: 'bg-rose-500/20 text-rose-400 border-rose-500/40' },
  { name: 'سماوي ذكي', value: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' },
  { name: 'رمادي إداري', value: 'bg-slate-500/20 text-slate-300 border-slate-500/40' },
];

const DEFAULT_MODULE_ACCESS: ModuleAccessMap = {
  dashboard: 'view_only',
  exhibitor_portal: 'view_only',
  procurement: 'view_only',
  accounting: 'view_only',
  workforce: 'view_only',
  floorplan: 'view_only',
  timeline: 'view_only',
  roles: 'none',
};

export const RolesPermissionsScreen: React.FC<RolesPermissionsScreenProps> = ({
  roles,
  staffMembers,
  currentUser,
  searchTerm,
  onUpdateRole,
  onUpdateRolePermissions,
  onAssignUserRole,
  onCreateNewRole,
  theme,
}) => {
  // Role Modal state (for create OR edit)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);

  // Form State
  const [roleName, setRoleName] = useState('');
  const [roleDesc, setRoleDesc] = useState('');
  const [roleColor, setRoleColor] = useState(COLOR_OPTIONS[0].value);
  const [roleModuleAccess, setRoleModuleAccess] = useState<ModuleAccessMap>(DEFAULT_MODULE_ACCESS);
  const [roleActionPerms, setRoleActionPerms] = useState<PermissionKey[]>([
    'approve_po',
    'assign_task',
  ]);

  const allPermissionsList: { key: PermissionKey; label: string; group: string; moduleId: ModuleId }[] = [
    { key: 'approve_po', label: 'اعتماد أوامر الشراء وترسية المناقصات (Approve PO)', group: 'المشتريات', moduleId: 'procurement' },
    { key: 'add_categories', label: 'إضافة وتعديل فئات التوريد المعايرة (Add Categories)', group: 'المشتريات', moduleId: 'procurement' },
    { key: 'disburse_payment', label: 'صرف المستحقات المالية للموردين (Disburse Payments)', group: 'المالية', moduleId: 'accounting' },
    { key: 'record_payment', label: 'تحصيل دفعات وسداد العارضين (Record Income)', group: 'المالية', moduleId: 'accounting' },
    { key: 'issue_invoice', label: 'إصدار الفواتير الرسمية واليدوية (Issue Invoices)', group: 'المالية', moduleId: 'accounting' },
    { key: 'assign_task', label: 'تعيين وتوجيه المهام للكوادر (Assign Tasks)', group: 'العمليات', moduleId: 'workforce' },
    { key: 'edit_floorplan', label: 'تعديل خريطة الأجنحة وتأجير المكان (Edit Floorplan)', group: 'العمليات', moduleId: 'floorplan' },
    { key: 'manage_timeline', label: 'إدارة الجدول الزمني وفعاليات الحدث (Manage Timeline)', group: 'البرنامج', moduleId: 'timeline' },
    { key: 'manage_roles', label: 'إدارة الصلاحيات وحسابات المستخدمين (Manage Roles)', group: 'النظام', moduleId: 'roles' },
  ];

  const filteredStaff = staffMembers.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Helper to resolve access mode for a role and a module
  const getRoleAccess = (role: SystemRole, moduleId: ModuleId): AccessMode => {
    if (role.moduleAccess && role.moduleAccess[moduleId] !== undefined) {
      return role.moduleAccess[moduleId];
    }
    // Fallback based on explicit permissions array
    if (moduleId === 'procurement') {
      return role.permissions.includes('approve_po') || role.permissions.includes('add_categories') ? 'view_edit' : 'view_only';
    }
    if (moduleId === 'accounting') {
      return role.permissions.includes('disburse_payment') || role.permissions.includes('record_payment') || role.permissions.includes('issue_invoice') ? 'view_edit' : 'view_only';
    }
    if (moduleId === 'workforce') {
      return role.permissions.includes('assign_task') ? 'view_edit' : 'view_only';
    }
    if (moduleId === 'floorplan') {
      return role.permissions.includes('edit_floorplan') ? 'view_edit' : 'view_only';
    }
    if (moduleId === 'timeline') {
      return role.permissions.includes('manage_timeline') ? 'view_edit' : 'view_only';
    }
    if (moduleId === 'roles') {
      return role.permissions.includes('manage_roles') ? 'view_edit' : 'none';
    }
    return 'view_only';
  };

  // Handlers for Modal
  const openCreateModal = () => {
    setIsEditMode(false);
    setEditingRoleId(null);
    setRoleName('');
    setRoleDesc('');
    setRoleColor(COLOR_OPTIONS[0].value);
    setRoleModuleAccess({
      dashboard: 'view_edit',
      procurement: 'view_edit',
      accounting: 'view_only',
      workforce: 'view_edit',
      floorplan: 'view_only',
      timeline: 'view_only',
      roles: 'none',
      exhibitor_portal: 'view_edit',
    });
    setRoleActionPerms(['approve_po', 'assign_task']);
    setIsRoleModalOpen(true);
  };

  const openEditModal = (role: SystemRole) => {
    setIsEditMode(true);
    setEditingRoleId(role.id);
    setRoleName(role.name);
    setRoleDesc(role.description);
    setRoleColor(role.color);

    // Populate current module access
    const currentAccess: ModuleAccessMap = {
      dashboard: getRoleAccess(role, 'dashboard'),
      procurement: getRoleAccess(role, 'procurement'),
      accounting: getRoleAccess(role, 'accounting'),
      workforce: getRoleAccess(role, 'workforce'),
      floorplan: getRoleAccess(role, 'floorplan'),
      timeline: getRoleAccess(role, 'timeline'),
      roles: getRoleAccess(role, 'roles'),
      exhibitor_portal: getRoleAccess(role, 'exhibitor_portal'),
    };
    setRoleModuleAccess(currentAccess);
    setRoleActionPerms([...role.permissions]);
    setIsRoleModalOpen(true);
  };

  // Toggle Module Checkboxes: "مشاهدة فقط" (View) vs "مشاهدة وتعديل" (Edit)
  const handleToggleModuleView = (modId: ModuleId, isChecked: boolean) => {
    setRoleModuleAccess((prev) => {
      const current = prev[modId];
      let updatedMode: AccessMode = 'none';

      if (isChecked) {
        // If checking view, default to view_only (unless edit was already on)
        updatedMode = current === 'view_edit' ? 'view_edit' : 'view_only';
      } else {
        // If unchecking view, turn off access completely
        updatedMode = 'none';
      }

      return { ...prev, [modId]: updatedMode };
    });
  };

  const handleToggleModuleEdit = (modId: ModuleId, isChecked: boolean) => {
    setRoleModuleAccess((prev) => {
      let updatedMode: AccessMode = 'none';

      if (isChecked) {
        // Checking edit automatically grants view as well!
        updatedMode = 'view_edit';
      } else {
        // Unchecking edit leaves view_only if view was active, otherwise none
        updatedMode = prev[modId] === 'view_edit' ? 'view_only' : 'none';
      }

      return { ...prev, [modId]: updatedMode };
    });
  };

  const handleToggleActionPerm = (permKey: PermissionKey) => {
    setRoleActionPerms((prev) =>
      prev.includes(permKey) ? prev.filter((p) => p !== permKey) : [...prev, permKey]
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) return;

    if (isEditMode && editingRoleId) {
      // Update existing role
      const updatedRole: SystemRole = {
        id: editingRoleId,
        name: roleName.trim(),
        color: roleColor,
        description: roleDesc.trim() || 'دور وظيفي مخصص بالنظام.',
        permissions: roleActionPerms,
        moduleAccess: roleModuleAccess,
      };

      if (onUpdateRole) {
        onUpdateRole(updatedRole);
      } else {
        onUpdateRolePermissions(editingRoleId, roleActionPerms);
      }
    } else {
      // Create new custom role
      const newRole: SystemRole = {
        id: `role-${Date.now()}`,
        name: roleName.trim(),
        color: roleColor,
        description: roleDesc.trim() || 'دور مخصص لمنظومة المعرض.',
        permissions: roleActionPerms,
        moduleAccess: roleModuleAccess,
      };

      onCreateNewRole(newRole);
    }

    setIsRoleModalOpen(false);
  };

  return (
    <div className="p-4 md:p-6 space-y-8">
      {/* Header Banner */}
      <div className={`p-6 rounded-3xl border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border-purple-900/50 text-slate-100'
          : 'bg-gradient-to-r from-purple-50 via-white to-purple-50/50 border-purple-100 text-slate-900'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>نظام التحكم في الوصول والأدوار المخصصة (Custom RBAC Matrix)</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black font-cairo">
            إدارة الأدوار والصلاحيات ومستويات التحكم
          </h2>
          <p className="text-xs text-slate-400 max-w-3xl">
            إضافة أدوار بأسماء مخصصة والتحكم الدقيق في أذونات وصول كل دور لموديولات النظام: سواء <span className="text-amber-400 font-bold">مشاهدة فقط</span> أو <span className="text-emerald-400 font-bold">مشاهدة وتعديل</span> عبر خانات الاختيار (Checkboxes).
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs cursor-pointer shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة دور جديد باسم مخصص</span>
        </button>
      </div>

      {/* System Roles Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black font-cairo flex items-center gap-2 text-purple-400">
            <Key className="w-4 h-4" />
            <span>الأدوار الوظيفية ومصفوفة الصلاحيات ({roles.length} أدوار):</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">
            انقر على <span className="text-purple-300 font-bold">تعديل</span> لتحديد صلاحيات المشاهدة والتعديل لأي دور
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => {
            const assignedCount = staffMembers.filter((s) => s.roleId === role.id).length;

            return (
              <div
                key={role.id}
                className={`p-5 rounded-2xl border space-y-4 transition-all relative overflow-hidden flex flex-col justify-between ${
                  theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border inline-block ${role.color}`}>
                        {role.name}
                      </span>
                      <p className="text-[11px] text-slate-400 leading-snug mt-1">
                        {role.description}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                        {assignedCount} مستخدمين
                      </span>
                      <button
                        onClick={() => openEditModal(role)}
                        className="px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>تعديل الدور</span>
                      </button>
                    </div>
                  </div>

                  {/* Modules Access Mode Badges */}
                  <div className="pt-3 border-t border-slate-800/60 space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 flex items-center justify-between">
                      <span>مستوى صلاحيات الموديولات:</span>
                      <span className="text-[9px] text-purple-400 font-mono">(مشاهدة / تعديل)</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {MODULE_DEFINITIONS.map((mod) => {
                        const access = getRoleAccess(role, mod.id);

                        return (
                          <div
                            key={mod.id}
                            className={`p-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-between gap-1 ${
                              access === 'view_edit'
                                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                                : access === 'view_only'
                                ? 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                                : 'bg-slate-950/40 border-slate-800/80 text-slate-500'
                            }`}
                          >
                            <span className="truncate flex items-center gap-1 text-[10px]">
                              {mod.icon}
                              <span>{mod.name.split(' ')[0]}</span>
                            </span>

                            <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.2 rounded border">
                              {access === 'view_edit' && (
                                <span className="text-emerald-400 border-emerald-500/30">مشاهدة وتعديل</span>
                              )}
                              {access === 'view_only' && (
                                <span className="text-amber-400 border-amber-500/30">مشاهدة فقط</span>
                              )}
                              {access === 'none' && (
                                <span className="text-slate-500 border-slate-700">محظور</span>
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Specific Actions Counter */}
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span>الصلاحيات الإجرائية المباشرة:</span>
                  <span className="font-bold text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/50">
                    {role.permissions.length} إجراءات ممكّنة
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Staff & User Permissions Matrix Table */}
      <div className={`rounded-3xl border overflow-hidden shadow-xl space-y-4 p-5 ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="text-base font-black font-cairo">جدول صلاحيات المستخدمين والكوادر الميدانية</h3>
              <p className="text-[11px] text-slate-400">تغيير دور المستخدم وتتبع مستوى إمكانيات التحكم المتاحة له مباشرة بالنظام</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className={`border-b text-[11px] font-bold ${
                theme === 'dark' ? 'border-slate-800 text-slate-400 bg-slate-950/50' : 'border-slate-200 text-slate-600 bg-slate-50'
              }`}>
                <th className="p-3">المستخدم / الكادر</th>
                <th className="p-3">الدور الوظيفي المخصص</th>
                <th className="p-3">المشتريات & RFQ</th>
                <th className="p-3">المالية والمطابقة</th>
                <th className="p-3">المهام الميدانية</th>
                <th className="p-3">خريطة المعرض</th>
                <th className="p-3">الجدول الزمني</th>
                <th className="p-3 text-center">التحكم بالصلاحيات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredStaff.map((staff) => {
                const currentRole = roles.find((r) => r.id === staff.roleId) || roles[0];

                const renderAccessBadge = (modId: ModuleId) => {
                  const mode = getRoleAccess(currentRole, modId);
                  if (mode === 'view_edit') {
                    return (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                        <Edit3 className="w-3 h-3" /> مشاهدة وتعديل
                      </span>
                    );
                  }
                  if (mode === 'view_only') {
                    return (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit">
                        <Eye className="w-3 h-3" /> مشاهدة فقط
                      </span>
                    );
                  }
                  return (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-500 border border-slate-700 flex items-center gap-1 w-fit">
                      <Lock className="w-3 h-3" /> محظور
                    </span>
                  );
                };

                return (
                  <tr key={staff.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={staff.avatar}
                          alt={staff.name}
                          className="w-9 h-9 rounded-full object-cover border border-purple-500/40"
                        />
                        <div>
                          <div className="font-bold text-slate-100 flex items-center gap-1.5">
                            {staff.name}
                            {staff.id === currentUser.id && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                                أنت (المحرر الحالي)
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">{staff.email || staff.phone}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <select
                        value={staff.roleId || roles[0]?.id}
                        onChange={(e) => onAssignUserRole(staff.id, e.target.value)}
                        className="p-2 rounded-xl text-xs font-bold bg-slate-950 border border-slate-700 text-purple-300 cursor-pointer hover:border-purple-500 transition-colors"
                      >
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-3">{renderAccessBadge('procurement')}</td>
                    <td className="p-3">{renderAccessBadge('accounting')}</td>
                    <td className="p-3">{renderAccessBadge('workforce')}</td>
                    <td className="p-3">{renderAccessBadge('floorplan')}</td>
                    <td className="p-3">{renderAccessBadge('timeline')}</td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => openEditModal(currentRole)}
                        className="p-2 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white cursor-pointer transition-all border border-purple-500/30"
                        title="تعديل أذونات هذا الدور"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Creation / Editing Modal with Checkboxes Matrix */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className={`w-full max-w-3xl rounded-3xl border p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-purple-500" />
                <div>
                  <h3 className="text-lg font-black font-cairo text-purple-400">
                    {isEditMode ? `تعديل صلاحيات دور: ${roleName}` : 'إضافة دور وظيفي مخصص جديد'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    حدد الاسم ولون الشارة وضبط مستويات التحكم (مشاهدة فقط / مشاهدة وتعديل) لكل قسم بالنظام
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6 text-xs">
              {/* Basic Role Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-300">اسم الدور الوظيفي المخصص:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: منسق البروتوكول، مشرف الصيانة، تدقيق خارجي..."
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-bold focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-300">لون شارة الدور (Badge Style):</label>
                  <select
                    value={roleColor}
                    onChange={(e) => setRoleColor(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-purple-300 font-bold cursor-pointer"
                  >
                    {COLOR_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="block font-bold text-slate-300">وصف ونطاق مسؤوليات هذا الدور:</label>
                  <textarea
                    rows={2}
                    placeholder="شرح موجز للأنشطة والمسؤوليات المسندة لحاملي هذا الدور..."
                    value={roleDesc}
                    onChange={(e) => setRoleDesc(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Per-Module Access Checkboxes Matrix */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="block font-black text-sm text-purple-400 font-cairo flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>مصفوفة التحكم في موديولات النظام (Checkboxes Matrix):</span>
                  </label>
                  <span className="text-[10px] text-slate-400">
                    حدد أذونات كل قسم: مشاهدة فقط أم مشاهدة وتعديل
                  </span>
                </div>

                <div className="space-y-3">
                  {MODULE_DEFINITIONS.map((mod) => {
                    const currentMode = roleModuleAccess[mod.id] || 'none';
                    const canView = currentMode === 'view_only' || currentMode === 'view_edit';
                    const canEdit = currentMode === 'view_edit';

                    return (
                      <div
                        key={mod.id}
                        className={`p-4 rounded-2xl border space-y-3 transition-all ${
                          canEdit
                            ? 'bg-emerald-950/20 border-emerald-800/50'
                            : canView
                            ? 'bg-amber-950/20 border-amber-800/50'
                            : 'bg-slate-950/40 border-slate-800/80'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                              {mod.icon}
                            </div>
                            <div>
                              <div className="font-bold text-slate-100 text-xs flex items-center gap-2">
                                {mod.name}
                                {canEdit && (
                                  <span className="px-2 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                                    تحكم وتعديل كامل
                                  </span>
                                )}
                                {canView && !canEdit && (
                                  <span className="px-2 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                                    مشاهدة فقط
                                  </span>
                                )}
                                {!canView && (
                                  <span className="px-2 py-0.2 rounded text-[9px] bg-slate-800 text-slate-500 border border-slate-700">
                                    وصول محظور
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-400 mt-0.5">{mod.description}</p>
                            </div>
                          </div>

                          {/* Checkboxes Row */}
                          <div className="flex items-center gap-3 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 shrink-0">
                            {/* View Checkbox */}
                            <label className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white transition-colors">
                              <input
                                type="checkbox"
                                checked={canView}
                                onChange={(e) => handleToggleModuleView(mod.id, e.target.checked)}
                                className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700 focus:ring-amber-500 cursor-pointer"
                              />
                              <span className={`font-bold text-xs ${canView ? 'text-amber-300' : 'text-slate-400'}`}>
                                مشاهدة فقط (Read)
                              </span>
                            </label>

                            <div className="w-px h-4 bg-slate-800" />

                            {/* Edit Checkbox */}
                            <label className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white transition-colors">
                              <input
                                type="checkbox"
                                checked={canEdit}
                                onChange={(e) => handleToggleModuleEdit(mod.id, e.target.checked)}
                                className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 focus:ring-emerald-500 cursor-pointer"
                              />
                              <span className={`font-bold text-xs ${canEdit ? 'text-emerald-400' : 'text-slate-400'}`}>
                                مشاهدة وتعديل (Write)
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Specific Action Permissions Checkboxes */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <label className="block font-black text-sm text-purple-400 font-cairo">
                  الصلاحيات الإجرائية المباشرة (Action Triggers Checkboxes):
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  {allPermissionsList.map((perm) => {
                    const isChecked = roleActionPerms.includes(perm.key);

                    return (
                      <label
                        key={perm.key}
                        className={`flex items-center gap-2.5 p-2 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-purple-950/40 border-purple-800/80 text-purple-200'
                            : 'bg-slate-900/40 border-slate-800/50 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleActionPerm(perm.key)}
                          className="w-4 h-4 rounded text-purple-600 bg-slate-900 border-slate-700 focus:ring-purple-500 cursor-pointer"
                        />
                        <div className="space-y-0.5">
                          <span className="font-bold text-xs block">{perm.label}</span>
                          <span className="text-[9px] text-slate-500 font-mono">القسم: {perm.group}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Submit / Cancel Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer transition-all"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black cursor-pointer shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isEditMode ? 'حفظ وتحديث الدور والصلاحيات' : 'اعتماد الدور المخصص بالنظام'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
