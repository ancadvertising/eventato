/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  EXPOS_DATA, 
  INITIAL_RFQS, 
  INITIAL_EXHIBITOR_ACCOUNTS, 
  INITIAL_THREE_WAY_MATCHING, 
  STAFF_MEMBERS, 
  INITIAL_TASKS, 
  INITIAL_BOOTHS, 
  INITIAL_AUDIT_LOGS,
  INITIAL_VENDOR_CATEGORIES,
  INITIAL_ROLES,
  INITIAL_EVENT_SESSIONS,
  INITIAL_EXHIBITOR_ADDONS,
  INITIAL_ADDON_ORDERS,
  INITIAL_PAYMENT_TRANSACTIONS,
  INITIAL_EXHIBITOR_TICKETS
} from './data/mockData';
import { 
  ThemeMode, 
  RFQRequest, 
  ExhibitorAccount, 
  ThreeWayMatchItem, 
  TaskCardType, 
  BoothItem, 
  AuditLogEntry, 
  TaskColumnStatus,
  EventSession,
  EventSessionStatus,
  SystemRole,
  PermissionKey,
  StaffMember,
  VendorCategory,
  ExhibitorServiceAddon,
  ExhibitorAddonOrder,
  ExhibitorPaymentTransaction,
  ExhibitorServiceTicket,
  ExpoEvent
} from './types';

import { Header } from './components/Header';
import { NavigationTabs, ActiveTab } from './components/NavigationTabs';
import { AncSidebar } from './components/AncSidebar';
import { DashboardScreen } from './components/DashboardScreen';
import { ProcurementScreen } from './components/ProcurementScreen';
import { DualAccountingScreen } from './components/DualAccountingScreen';
import { WorkforceTaskCenter } from './components/WorkforceTaskCenter';
import { InteractiveFloorPlan } from './components/InteractiveFloorPlan';
import { TimelineScreen } from './components/TimelineScreen';
import { RolesPermissionsScreen } from './components/RolesPermissionsScreen';
import { ExhibitorPortalScreen } from './components/ExhibitorPortalScreen';

import { NewRFQModal } from './components/NewRFQModal';
import { NewPaymentModal } from './components/NewPaymentModal';
import { ManualInvoiceModal } from './components/ManualInvoiceModal';
import { NewTaskModal } from './components/NewTaskModal';
import { LoginModal } from './components/LoginModal';
import { AuditLogDrawer } from './components/AuditLogDrawer';
import { ToastNotice, ToastMessage } from './components/ToastNotice';
import { AuthScreen } from './components/AuthScreen';
import { NewExpoModal } from './components/NewExpoModal';

// Local Storage Helpers
function loadStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load key:', key, e);
  }
  return fallback;
}

function saveStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save key:', key, e);
  }
}

export default function App() {
  // Authentication & Workspace Mode State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => 
    loadStorage('anc_expo_authenticated', true)
  );
  const [workspaceMode, setWorkspaceMode] = useState<'fresh' | 'demo'>(() => 
    loadStorage('anc_expo_workspace_mode', 'fresh')
  );

  // Theme & Tab Navigation
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [selectedExpoId, setSelectedExpoId] = useState<string>('expo-cairo-2026');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Active Logged-In User / Editor Tracking State
  const [staffList, setStaffList] = useState<StaffMember[]>(() => 
    loadStorage('anc_expo_staff', STAFF_MEMBERS)
  );
  const [currentUser, setCurrentUser] = useState<StaffMember>(() => 
    loadStorage('anc_expo_current_user', STAFF_MEMBERS[0])
  );
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Dynamic Categories, Roles & Event Sessions State
  const [categories, setCategories] = useState<VendorCategory[]>(() => 
    loadStorage('anc_expo_categories', INITIAL_VENDOR_CATEGORIES)
  );
  const [roles, setRoles] = useState<SystemRole[]>(() => 
    loadStorage('anc_expo_roles', INITIAL_ROLES)
  );
  const [sessions, setSessions] = useState<EventSession[]>(INITIAL_EVENT_SESSIONS);

  // Exhibitor Portal Dedicated Data
  const [addonsCatalog, setAddonsCatalog] = useState<ExhibitorServiceAddon[]>(INITIAL_EXHIBITOR_ADDONS);
  const [addonOrders, setAddonOrders] = useState<ExhibitorAddonOrder[]>(() => 
    loadStorage('anc_expo_addon_orders', INITIAL_ADDON_ORDERS)
  );
  const [paymentTransactions, setPaymentTransactions] = useState<ExhibitorPaymentTransaction[]>(() => 
    loadStorage('anc_expo_payments', INITIAL_PAYMENT_TRANSACTIONS)
  );
  const [serviceTickets, setServiceTickets] = useState<ExhibitorServiceTicket[]>(() => 
    loadStorage('anc_expo_tickets', INITIAL_EXHIBITOR_TICKETS)
  );

  // Domain Core Data
  const [expos, setExpos] = useState<ExpoEvent[]>(() => 
    loadStorage('anc_expo_expos', EXPOS_DATA)
  );
  const [rfqs, setRfqs] = useState<RFQRequest[]>(() => 
    loadStorage('anc_expo_rfqs', INITIAL_RFQS)
  );
  const [exhibitors, setExhibitors] = useState<ExhibitorAccount[]>(() => 
    loadStorage('anc_expo_exhibitors', INITIAL_EXHIBITOR_ACCOUNTS)
  );
  const [threeWayMatches, setThreeWayMatches] = useState<ThreeWayMatchItem[]>(() => 
    loadStorage('anc_expo_3way', INITIAL_THREE_WAY_MATCHING)
  );
  const [tasks, setTasks] = useState<TaskCardType[]>(() => 
    loadStorage('anc_expo_tasks', INITIAL_TASKS)
  );
  const [booths, setBooths] = useState<BoothItem[]>(() => 
    loadStorage('anc_expo_booths', INITIAL_BOOTHS)
  );
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => 
    loadStorage('anc_expo_audit_logs', INITIAL_AUDIT_LOGS)
  );

  // Modals visibility state
  const [isNewRFQModalOpen, setIsNewRFQModalOpen] = useState(false);
  const [isNewPaymentModalOpen, setIsNewPaymentModalOpen] = useState(false);
  const [selectedExhibitorForPayment, setSelectedExhibitorForPayment] = useState<ExhibitorAccount | null>(null);
  const [isManualInvoiceModalOpen, setIsManualInvoiceModalOpen] = useState(false);
  const [selectedExhibitorForInvoice, setSelectedExhibitorForInvoice] = useState<ExhibitorAccount | null>(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isAuditLogDrawerOpen, setIsAuditLogDrawerOpen] = useState(false);
  const [isNewExpoModalOpen, setIsNewExpoModalOpen] = useState(false);

  // Save to LocalStorage effects
  useEffect(() => { saveStorage('anc_expo_authenticated', isAuthenticated); }, [isAuthenticated]);
  useEffect(() => { saveStorage('anc_expo_workspace_mode', workspaceMode); }, [workspaceMode]);
  useEffect(() => { saveStorage('anc_expo_staff', staffList); }, [staffList]);
  useEffect(() => { saveStorage('anc_expo_current_user', currentUser); }, [currentUser]);
  useEffect(() => { saveStorage('anc_expo_expos', expos); }, [expos]);
  useEffect(() => { saveStorage('anc_expo_rfqs', rfqs); }, [rfqs]);
  useEffect(() => { saveStorage('anc_expo_exhibitors', exhibitors); }, [exhibitors]);
  useEffect(() => { saveStorage('anc_expo_tasks', tasks); }, [tasks]);
  useEffect(() => { saveStorage('anc_expo_booths', booths); }, [booths]);
  useEffect(() => { saveStorage('anc_expo_audit_logs', auditLogs); }, [auditLogs]);
  useEffect(() => { saveStorage('anc_expo_payments', paymentTransactions); }, [paymentTransactions]);

  // Auth Handlers
  const handleLoginSuccess = (user: StaffMember, startFresh: boolean) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    saveStorage('anc_expo_authenticated', true);

    if (startFresh) {
      handleResetWorkspaceToFresh();
    } else {
      addToast('مرحباً بك', `تم تسجيل الدخول بنجاح للحساب ${user.name}`);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    saveStorage('anc_expo_authenticated', false);
  };

  const handleRegisterUserInAuth = (newUser: StaffMember) => {
    setStaffList((prev) => [...prev, newUser]);
  };

  const handleResetWorkspaceToFresh = () => {
    setWorkspaceMode('fresh');
    saveStorage('anc_expo_workspace_mode', 'fresh');
    setRfqs([]);
    setExhibitors([]);
    setThreeWayMatches([]);
    setTasks([]);
    setBooths([]);
    setAddonOrders([]);
    setPaymentTransactions([]);
    setServiceTickets([]);
    
    // Add default initial expo if empty
    const freshExpo: ExpoEvent = {
      id: `expo-${Date.now()}`,
      name: 'المعرض الجديد 2026',
      city: 'القاهرة',
      location: 'مركز المعارض الدولية',
      dates: 'نوفمبر 2026',
      hallsCount: 3,
      totalBooths: 100,
      totalExhibitors: 0,
      occupiedBooths: 0,
    };
    setExpos([freshExpo]);
    setSelectedExpoId(freshExpo.id);

    addAuditLog('تهيئة المساحة ببيانات فارغة', `تم بدء مساحة عمل جديدة فارغة تماماً بواسطة ${currentUser.name}.`, 'task');
    addToast('تمت التهيئة للعمل الفعلي', 'تمت إزالة كافة البيانات التجريبية، ويمكنك الآن إضافة معارضك ومورديك الحقيقيين من الصفر.');
  };

  const handleLoadDemoData = () => {
    setWorkspaceMode('demo');
    saveStorage('anc_expo_workspace_mode', 'demo');
    setExpos(EXPOS_DATA);
    setRfqs(INITIAL_RFQS);
    setExhibitors(INITIAL_EXHIBITOR_ACCOUNTS);
    setThreeWayMatches(INITIAL_THREE_WAY_MATCHING);
    setTasks(INITIAL_TASKS);
    setBooths(INITIAL_BOOTHS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setAddonOrders(INITIAL_ADDON_ORDERS);
    setPaymentTransactions(INITIAL_PAYMENT_TRANSACTIONS);
    setServiceTickets(INITIAL_EXHIBITOR_TICKETS);
    setSelectedExpoId(EXPOS_DATA[0].id);

    addToast('تم تحميل النموذج التجريبي', 'تم استرجاع البيانات التوضيحية للعرض والاستكشاف.');
  };

  const handleCreateExpo = (newExpo: ExpoEvent) => {
    setExpos((prev) => [newExpo, ...prev]);
    setSelectedExpoId(newExpo.id);
    addAuditLog('إضافة معرض جديد', `تم إنشاء المعرض "${newExpo.name}" بالمنظومة.`, 'task');
    addToast('تم إنشاء المعرض بنجاح', `تم إضافة وتحديد "${newExpo.name}" كمعرض نشط.`);
  };

  // Toast Notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message: string, type: 'success' | 'warning' | 'info' = 'success') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}`,
      title,
      message,
      type,
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 4));

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addAuditLog = (action: string, details: string, type: AuditLogEntry['type']) => {
    const newEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      user: `${currentUser.name} (${currentUser.role})`,
      action,
      details,
      type,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // --- Handlers for Categories ---
  const handleAddCategory = (newCat: string) => {
    if (!categories.includes(newCat)) {
      setCategories((prev) => [...prev, newCat]);
      addAuditLog('إضافة فئة توريد جديدة', `تمت إضافة الفئة "${newCat}" بقائمة فئات التوريدات المعايرة.`, 'procurement');
      addToast('تمت إضافة فئة جديدة', `أضيفت فئة التوريد "${newCat}" لقوائم النظام.`);
    }
  };

  // --- Handlers for User Accounts & Avatar Profile Edits ---
  const handleSelectUser = (user: StaffMember) => {
    setCurrentUser(user);
    addAuditLog('تسجيل دخول / تبديل المحرر', `تم التبديل إلى الحساب "${user.name}" (${user.role}).`, 'task');
    addToast('تم تسجيل الدخول', `مرحباً بك ${user.name}، جميع القرارات مسجلة باسمك الآن.`);
  };

  const handleUpdateAvatar = (userId: string, newAvatarUrl: string) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === userId ? { ...s, avatar: newAvatarUrl } : s))
    );
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, avatar: newAvatarUrl }));
    }
    addAuditLog('تعديل الصورة الشخصية', `تم تحديث صورة البروفايل للمستخدم ${currentUser.name}.`, 'task');
    addToast('تم تحديث البروفايل', 'تم حفظ وتعميم صورتك الشخصية الجديدة بنجاح.');
  };

  const handleCreateUser = (newUser: StaffMember) => {
    setStaffList((prev) => [...prev, newUser]);
    addAuditLog('إضافة حساب مستخدم جديد', `تم إنشاء الحساب ${newUser.name} بمهام ${newUser.role}.`, 'task');
    addToast('تم إنشاء الحساب', `تم تسجيل حساب ${newUser.name} بالنظام.`);
  };

  // --- Handlers for Screen 1: Procurement ---
  const handleApprovePO = (rfqId: string, offerId: string, vendorName: string, amount: number) => {
    const poNumber = `PO-2026-${Math.floor(100 + Math.random() * 900)}`;

    setRfqs((prev) =>
      prev.map((r) => {
        if (r.id === rfqId) {
          return {
            ...r,
            selectedVendorId: offerId,
            poNumber,
            editorName: currentUser.name,
            offers: r.offers.map((o) => ({
              ...o,
              status: o.id === offerId ? 'مقبول' : 'مرفوض',
              editorName: currentUser.name,
            })),
          };
        }
        return r;
      })
    );

    addAuditLog(
      `اعتماد أمر شراء ${poNumber}`,
      `توقيع العرض المالي يدوياً لصالح ${vendorName} بقيمة ${amount.toLocaleString('ar-EG')} ج.م (المحرر: ${currentUser.name}).`,
      'procurement'
    );

    addToast(
      'تم اعتماد أمر الشراء بنجاح (PO Approved)',
      `تم إصدار امر الشراء ${poNumber} لصالح ${vendorName} بقيمة ${amount.toLocaleString('ar-EG')} ج.م.`
    );
  };

  const handleRejectOffer = (rfqId: string, offerId: string) => {
    setRfqs((prev) =>
      prev.map((r) => {
        if (r.id === rfqId) {
          return {
            ...r,
            editorName: currentUser.name,
            offers: r.offers.map((o) => (o.id === offerId ? { ...o, status: 'مرفوض', editorName: currentUser.name } : o)),
          };
        }
        return r;
      })
    );

    addToast('تم رفض العرض', 'تم تغيير حالة عرض السعر إلى مرفوض يدويًا.', 'warning');
  };

  const handleCreateRFQ = (newRfq: RFQRequest) => {
    setRfqs((prev) => [newRfq, ...prev]);
    addAuditLog('إنشاء طلب عروض أسعار جديد', `نشر الطلب ${newRfq.rfqNumber} - ${newRfq.title} (المحرر: ${currentUser.name}).`, 'procurement');
    addToast('تم إنشاء طلب RFQ بنجاح', `تم تعميم الطلب ${newRfq.rfqNumber} وتوفير كراسة الشروط.`);
  };

  // --- Handlers for Screen 2: Dual Accounting ---
  const handleOpenPaymentModal = (exhibitor: ExhibitorAccount) => {
    setSelectedExhibitorForPayment(exhibitor);
    setIsNewPaymentModalOpen(true);
  };

  const handleOpenInvoiceModal = (exhibitor: ExhibitorAccount) => {
    setSelectedExhibitorForInvoice(exhibitor);
    setIsManualInvoiceModalOpen(true);
  };

  const handleRecordPayment = (exhibitorId: string, amountPaid: number, method: string) => {
    setExhibitors((prev) =>
      prev.map((ex) => {
        if (ex.id === exhibitorId) {
          const newPaid = ex.amountPaid + amountPaid;
          const newRem = Math.max(0, ex.contractValue - newPaid);
          const newStatus = newRem === 0 ? 'مكتمل' : 'جزئي';

          addAuditLog(
            `تحصيل دفعة مالية من ${ex.companyName}`,
            `سداد مبلغ ${amountPaid.toLocaleString('ar-EG')} ج.م عبر ${method}. المتبقي: ${newRem.toLocaleString('ar-EG')} ج.م (المحرر: ${currentUser.name}).`,
            'accounting'
          );

          addToast(
            'تم تسجيل الدفعة المالية',
            `تم قيد مبلغ ${amountPaid.toLocaleString('ar-EG')} ج.م بحساب ${ex.companyName} عبر ${method}.`
          );

          return {
            ...ex,
            amountPaid: newPaid,
            remainingBalance: newRem,
            paymentStatus: newStatus,
            lastPaymentDate: new Date().toISOString().split('T')[0],
            editorName: currentUser.name,
          };
        }
        return ex;
      })
    );
  };

  const handleIssueInvoice = (exhibitorName: string, invoiceNum: string, amount: number) => {
    addAuditLog(
      `إصدار فاتورة رسمية ${invoiceNum}`,
      `إصدار فاتورة يدوية بمبلغ ${amount.toLocaleString('ar-EG')} ج.م لصالح ${exhibitorName} (المحرر: ${currentUser.name}).`,
      'accounting'
    );

    addToast('تم إصدار الفاتورة اليدوية', `صدرت الفاتورة ${invoiceNum} بقيمة ${amount.toLocaleString('ar-EG')} ج.م.`);
  };

  const handleSendReminder = (exhibitorName: string, phone: string) => {
    addToast(
      'تم إرسال تذكير الدفع',
      `تم إرسال رسالة SMS تذكيرية برصيد الحساب إلى ${exhibitorName} (${phone}).`,
      'info'
    );
  };

  const handleToggle3WMCheckbox = (
    matchId: string,
    checkKey: 'checkInvoiceVsPO' | 'checkPOReciptVsDelivery' | 'checkQualityInspection'
  ) => {
    setThreeWayMatches((prev) =>
      prev.map((item) => {
        if (item.id === matchId) {
          return {
            ...item,
            [checkKey]: !item[checkKey],
            editorName: currentUser.name,
          };
        }
        return item;
      })
    );
  };

  const handleDisburseVendorPayment = (matchId: string, vendorName: string, amount: number) => {
    setThreeWayMatches((prev) =>
      prev.map((item) => {
        if (item.id === matchId) {
          return {
            ...item,
            status: 'تم صرف الدفعة',
            approvedBy: `${currentUser.name} (${currentUser.role})`,
            approvedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            editorName: currentUser.name,
          };
        }
        return item;
      })
    );

    addAuditLog(
      `صرف دفعة مالية للمورد ${vendorName}`,
      `توقيع مطابقة 3-Way Matching وصرف مبلغ ${amount.toLocaleString('ar-EG')} ج.م (المحرر: ${currentUser.name}).`,
      'accounting'
    );

    addToast(
      'تم صرف الدفعة المالية للمورد',
      `تمت المطابقة الثلاثية واعتماد صرف مبلغ ${amount.toLocaleString('ar-EG')} ج.م لصالح ${vendorName}.`
    );
  };

  // --- Handlers for Screen 3: Workforce & Tasks ---
  const handleCreateTask = (newTask: TaskCardType) => {
    const taskWithEditor = { ...newTask, editorName: currentUser.name };
    setTasks((prev) => [taskWithEditor, ...prev]);

    addAuditLog(
      `تعيين مهمة ${newTask.taskCode}`,
      `إضافة المهمة "${newTask.title}" وإسنادها للموظف ${newTask.assignedStaff.name} (المحرر: ${currentUser.name}).`,
      'task'
    );

    addToast(
      'تم تعيين المهمة بنجاح',
      `تم إسناد ${newTask.title} إلى ${newTask.assignedStaff.name} وتنبيه جواله.`
    );
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskColumnStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus, editorName: currentUser.name } : t))
    );

    addToast('تم تحديث مرحلة المهمة', `تم تغيير الحالة إلى ${newStatus}.`, 'info');
  };

  const handleDispatchMobileAlert = (staffName: string, phone: string, taskTitle: string) => {
    addToast(
      'تم إرسال تنبيه مباشر للجوال',
      `تنبيه عاجل أُرسل إلى جوال ${staffName} (${phone}) بخصوص "${taskTitle}".`
    );
  };

  // --- Handlers for Screen 4: Floorplan ---
  const handleUpdateBooth = (updatedBooth: BoothItem) => {
    const boothWithEditor = { ...updatedBooth, editorName: currentUser.name };
    setBooths((prev) => prev.map((b) => (b.id === updatedBooth.id ? boothWithEditor : b)));

    addAuditLog(
      `تعديل بيانات الجناح ${updatedBooth.code}`,
      `الحالة: ${updatedBooth.status} • العارض: ${updatedBooth.assignedExhibitorName || 'خالي'} (المحرر: ${currentUser.name}).`,
      'floorplan'
    );

    addToast('تم تحديث الجناح بنجاح', `تم حفظ التغيرات والحالة الجديدة للجناح ${updatedBooth.code}.`);
  };

  // --- Handlers for Screen 5: Timeline ---
  const handleAddSession = (newSession: EventSession) => {
    setSessions((prev) => [newSession, ...prev]);
    addAuditLog('إضافة فعالية لبرنامج الحدث', `أدرجت الجلسة "${newSession.title}" بـ ${newSession.day} (المحرر: ${currentUser.name}).`, 'task');
    addToast('تمت إضافة الجلسة', `أدرجت ${newSession.title} بجدول المعرض.`);
  };

  const handleUpdateSessionStatus = (sessionId: string, newStatus: EventSessionStatus) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: newStatus, editorName: currentUser.name } : s))
    );
    addAuditLog('تحديث حالة جلسة بالجدول', `تحديث حالة الجلسة إلى "${newStatus}" (المحرر: ${currentUser.name}).`, 'task');
    addToast('تم تحديث الجلسة', `تغيرت حالة الفعالية إلى ${newStatus}.`, 'info');
  };

  // --- Handlers for Screen 6: Roles & Permissions ---
  const handleUpdateRole = (updatedRole: SystemRole) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === updatedRole.id ? updatedRole : r))
    );
    addAuditLog('تحديث بيانات دور وظيفي', `تم تحديث صلاحيات وإعدادات الدور "${updatedRole.name}" (المحرر: ${currentUser.name}).`, 'task');
    addToast('تم تحديث الدور', `حُفظت إعدادات وصلاحيات ${updatedRole.name} بنجاح.`);
  };

  const handleUpdateRolePermissions = (roleId: string, newPermissions: PermissionKey[]) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === roleId ? { ...r, permissions: newPermissions } : r))
    );
    const targetRole = roles.find((r) => r.id === roleId);
    addAuditLog('تحديث صلاحيات دور وظيفي', `تمت إعادة ضبط مصفوفة صلاحيات "${targetRole?.name}" (المحرر: ${currentUser.name}).`, 'task');
    addToast('تم تحديث الصلاحيات', `حُفظت الصلاحيات الجديدة لـ ${targetRole?.name}.`);
  };

  const handleAssignUserRole = (staffId: string, newRoleId: string) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, roleId: newRoleId } : s))
    );
    const targetStaff = staffList.find((s) => s.id === staffId);
    const targetRole = roles.find((r) => r.id === newRoleId);

    addAuditLog('تعديل دور وظيفي لمستخدم', `تم تغيير دور "${targetStaff?.name}" إلى "${targetRole?.name}" (المحرر: ${currentUser.name}).`, 'task');
    addToast('تم تغيير الدور الوظيفي', `أصبح ${targetStaff?.name} ينتمي لـ ${targetRole?.name}.`);
  };

  const handleCreateNewRole = (newRole: SystemRole) => {
    setRoles((prev) => [...prev, newRole]);
    addAuditLog('إنشاء دور وظيفي جديد', `تم إنشاء الدور ${newRole.name} بـ ${newRole.permissions.length} صلاحيات (المحرر: ${currentUser.name}).`, 'task');
    addToast('تم إنشاء الدور', `تمت إضافة دور ${newRole.name} بنجاح.`);
  };

  // --- Handlers for Screen 7: Exhibitor Portal ---
  const handleRegisterExhibitor = (newExhibitor: ExhibitorAccount, selectedBoothId?: string) => {
    setExhibitors((prev) => [newExhibitor, ...prev]);

    if (selectedBoothId) {
      setBooths((prev) =>
        prev.map((b) =>
          b.id === selectedBoothId
            ? {
                ...b,
                status: 'محجوزة',
                assignedExhibitorId: newExhibitor.id,
                assignedExhibitorName: newExhibitor.companyName,
                paymentStatus: newExhibitor.paymentStatus,
              }
            : b
        )
      );
    }

    addAuditLog('تسجيل اشتراك عارض جديد', `تم تسجيل شركة "${newExhibitor.companyName}" وحجز الجناح (${newExhibitor.boothNumber}) بقيمة عقد ${newExhibitor.contractValue.toLocaleString('ar-EG')} ج.م.`, 'accounting');
    addToast('تم اشتراك العارض بنجاح', `أصبحت ${newExhibitor.companyName} عارضاً معتمداً بالمعرض.`);
  };

  const handleOrderAddon = (order: ExhibitorAddonOrder, addonPrice: number) => {
    setAddonOrders((prev) => [order, ...prev]);

    // Update Exhibitor contract value & remaining balance
    setExhibitors((prev) =>
      prev.map((ex) => {
        if (ex.id === order.exhibitorId) {
          const newContract = ex.contractValue + addonPrice;
          const newRemaining = ex.remainingBalance + addonPrice;
          return {
            ...ex,
            contractValue: newContract,
            remainingBalance: newRemaining,
          };
        }
        return ex;
      })
    );

    addAuditLog('طلب إضافة للجناح', `طلب العارض إضافات بقيمة ${addonPrice.toLocaleString('ar-EG')} ج.م (${order.addonTitle}).`, 'accounting');
    addToast('تم إضافة الخدمة للجناح', `حُفظ طلب ${order.addonTitle} بتميز.`);
  };

  const handleProcessPayment = (transaction: ExhibitorPaymentTransaction) => {
    setPaymentTransactions((prev) => [transaction, ...prev]);

    // Update exhibitor financial ledger
    setExhibitors((prev) =>
      prev.map((ex) => {
        if (ex.id === transaction.exhibitorId) {
          const newPaid = ex.amountPaid + transaction.amount;
          const newRemaining = Math.max(0, ex.remainingBalance - transaction.amount);
          const newStatus = newRemaining === 0 ? 'مكتمل' : 'جزئي';

          return {
            ...ex,
            amountPaid: newPaid,
            remainingBalance: newRemaining,
            paymentStatus: newStatus,
            lastPaymentDate: transaction.timestamp.split(' ')[0],
          };
        }
        return ex;
      })
    );

    addAuditLog('سداد إلكتروني للعارض', `تم استلام سداد بمبلغ ${transaction.amount.toLocaleString('ar-EG')} ج.م لـ ${transaction.companyName} عبر ${transaction.paymentMethod}.`, 'accounting');
    addToast('تم السداد بنجاح', `صُدرت الفاتورة رقم ${transaction.invoiceNumber} معتمدة.`);
  };

  const handleCreateTicket = (ticket: ExhibitorServiceTicket) => {
    setServiceTickets((prev) => [ticket, ...prev]);
    addAuditLog('فتح بلاغ دعم ميداني', `قدم الجناح ${ticket.boothNumber} (${ticket.companyName}) بلاغاً بـ "${ticket.subject}".`, 'task');
    addToast('تم إرسال بلاغ الدعم', `سيتوجه فني الصالة للجناح ${ticket.boothNumber} فوراً.`);
  };

  const handleUpdateTicketStatus = (ticketId: string, newStatus: ExhibitorServiceTicket['status'], responseNote: string) => {
    setServiceTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus, responseNote } : t))
    );
    addAuditLog('تحديث حالة بلاغ دعم ميداني', `تم تغيير حالة التذكرة إلى "${newStatus}" (الرد: ${responseNote}) بواسطة ${currentUser.name}.`, 'task');
    addToast('تم تحديث حالة البلاغ', `أصبحت حالة التذكرة "${newStatus}".`);
  };

  const currentExpo = expos.find((e) => e.id === selectedExpoId) || expos[0];
  const pendingRfqsCount = rfqs.filter((r) => !r.offers.some((o) => o.status === 'مقبول')).length;
  const unverified3WMCount = threeWayMatches.filter((m) => m.status !== 'تم صرف الدفعة').length;
  const pendingTasksCount = tasks.filter((t) => t.status === 'قيد الانتظار' || t.status === 'جاري التنفيذ').length;
  const availableBoothsCount = booths.filter((b) => b.status === 'متاح').length;

  // Active Role and RBAC Access Configuration
  const currentRole = roles.find((r) => r.id === currentUser.roleId) || roles[0];
  const currentModuleAccess = currentRole?.moduleAccess || {
    dashboard: 'view_edit',
    exhibitor_portal: 'view_edit',
    procurement: 'view_edit',
    accounting: 'view_edit',
    workforce: 'view_edit',
    floorplan: 'view_edit',
    timeline: 'view_edit',
    roles: 'view_edit',
  };

  const currentTabAccessMode = currentModuleAccess[activeTab] || 'view_edit';

  if (!isAuthenticated) {
    return (
      <AuthScreen
        onLoginSuccess={handleLoginSuccess}
        roles={roles}
        registeredUsers={staffList}
        onRegisterUser={handleRegisterUserInAuth}
        theme={theme}
      />
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 font-sans ${
      theme === 'dark' ? 'bg-[#080a0f] text-slate-100' : 'bg-slate-100 text-slate-800'
    }`}>
      {/* ANC ADVERTISING Sidebar */}
      <AncSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        pendingRfqsCount={pendingRfqsCount}
        unverified3WMCount={unverified3WMCount}
        overdueTasksCount={pendingTasksCount}
        availableBoothsCount={availableBoothsCount}
        sessionsCount={sessions.length}
        rolesCount={roles.length}
        exhibitorsCount={exhibitors.length}
        theme={theme}
        onOpenAuditLog={() => setIsAuditLogDrawerOpen(true)}
        auditCount={auditLogs.length}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        moduleAccess={currentModuleAccess}
      />

      {/* Main App Workspace */}
      <div className={`transition-all duration-300 ${
        isSidebarCollapsed ? 'pr-16' : 'pr-64 lg:pr-72'
      }`}>
        {/* Top Header Bar */}
        <Header
          expos={expos}
          selectedExpoId={selectedExpoId}
          onSelectExpo={setSelectedExpoId}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          theme={theme}
          onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          onOpenAuditLog={() => setIsAuditLogDrawerOpen(true)}
          auditCount={auditLogs.length}
          currentUser={currentUser}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          onOpenNewRFQ={() => setIsNewRFQModalOpen(true)}
          onLogout={handleLogout}
          onResetWorkspaceToFresh={handleResetWorkspaceToFresh}
          onLoadDemoData={handleLoadDemoData}
          workspaceMode={workspaceMode}
          onOpenNewExpoModal={() => setIsNewExpoModalOpen(true)}
        />

        {/* Horizontal Navigation Tabs */}
        <NavigationTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          pendingRfqCount={pendingRfqsCount}
          unverified3WMCount={unverified3WMCount}
          pendingTasksCount={pendingTasksCount}
          availableBoothsCount={availableBoothsCount}
          sessionsCount={sessions.length}
          rolesCount={roles.length}
          exhibitorsCount={exhibitors.length}
          theme={theme}
          moduleAccess={currentModuleAccess}
        />

        {/* Active Screen Content */}
        <main className="p-4 lg:p-6 max-w-7xl mx-auto pb-12">
          {activeTab === 'dashboard' && (
            <DashboardScreen
              expos={expos}
              exhibitors={exhibitors}
              rfqs={rfqs}
              threeWayMatches={threeWayMatches}
              onNavigateTab={setActiveTab}
              onOpenNewRFQ={() => setIsNewRFQModalOpen(true)}
              onOpenNewPayment={() => {
                setSelectedExhibitorForPayment(exhibitors[0] || null);
                setIsNewPaymentModalOpen(true);
              }}
              theme={theme}
            />
          )}

          {activeTab === 'procurement' && (
            <ProcurementScreen
              rfqs={rfqs}
              currentExpo={currentExpo}
              searchTerm={searchTerm}
              onOpenNewRFQModal={() => setIsNewRFQModalOpen(true)}
              onApprovePO={handleApprovePO}
              onRejectOffer={handleRejectOffer}
              theme={theme}
            />
          )}

        {activeTab === 'accounting' && (
          <DualAccountingScreen
            exhibitors={exhibitors}
            threeWayMatches={threeWayMatches}
            searchTerm={searchTerm}
            onOpenNewPaymentModal={handleOpenPaymentModal}
            onOpenManualInvoiceModal={handleOpenInvoiceModal}
            onSendReminder={handleSendReminder}
            onToggleMatchCheckbox={handleToggle3WMCheckbox}
            onDisburseVendorPayment={handleDisburseVendorPayment}
            theme={theme}
          />
        )}

        {activeTab === 'workforce' && (
          <WorkforceTaskCenter
            tasks={tasks}
            staffMembers={staffList}
            searchTerm={searchTerm}
            onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onDispatchMobileAlert={handleDispatchMobileAlert}
            theme={theme}
          />
        )}

        {activeTab === 'floorplan' && (
          <InteractiveFloorPlan
            booths={booths}
            exhibitors={exhibitors}
            searchTerm={searchTerm}
            onUpdateBooth={handleUpdateBooth}
            theme={theme}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineScreen
            sessions={sessions}
            currentUser={currentUser}
            searchTerm={searchTerm}
            onAddSession={handleAddSession}
            onUpdateSessionStatus={handleUpdateSessionStatus}
            theme={theme}
          />
        )}

        {activeTab === 'roles' && (
          <RolesPermissionsScreen
            roles={roles}
            staffMembers={staffList}
            currentUser={currentUser}
            searchTerm={searchTerm}
            onUpdateRole={handleUpdateRole}
            onUpdateRolePermissions={handleUpdateRolePermissions}
            onAssignUserRole={handleAssignUserRole}
            onCreateNewRole={handleCreateNewRole}
            theme={theme}
          />
        )}

        {activeTab === 'exhibitor_portal' && (
          <ExhibitorPortalScreen
            exhibitors={exhibitors}
            booths={booths}
            addonsCatalog={addonsCatalog}
            addonOrders={addonOrders}
            paymentTransactions={paymentTransactions}
            serviceTickets={serviceTickets}
            searchTerm={searchTerm}
            onRegisterExhibitor={handleRegisterExhibitor}
            onOrderAddon={handleOrderAddon}
            onProcessPayment={handleProcessPayment}
            onCreateTicket={handleCreateTicket}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            theme={theme}
            accessMode={currentTabAccessMode}
          />
        )}
      </main>
      </div>

      {/* Modals & Overlay Components */}
      <NewRFQModal
        isOpen={isNewRFQModalOpen}
        categories={categories}
        currentUser={currentUser}
        onClose={() => setIsNewRFQModalOpen(false)}
        onCreateRFQ={handleCreateRFQ}
        onAddCategory={handleAddCategory}
        theme={theme}
      />

      <NewPaymentModal
        isOpen={isNewPaymentModalOpen}
        exhibitor={selectedExhibitorForPayment}
        onClose={() => setIsNewPaymentModalOpen(false)}
        onRecordPayment={handleRecordPayment}
        theme={theme}
      />

      <ManualInvoiceModal
        isOpen={isManualInvoiceModalOpen}
        exhibitor={selectedExhibitorForInvoice}
        onClose={() => setIsManualInvoiceModalOpen(false)}
        onIssueInvoice={handleIssueInvoice}
        theme={theme}
      />

      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        staffMembers={staffList}
        onClose={() => setIsNewTaskModalOpen(false)}
        onCreateTask={handleCreateTask}
        theme={theme}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        currentUser={currentUser}
        staffMembers={staffList}
        roles={roles}
        onClose={() => setIsLoginModalOpen(false)}
        onSelectUser={handleSelectUser}
        onUpdateAvatar={handleUpdateAvatar}
        onCreateUser={handleCreateUser}
        theme={theme}
      />

      <NewExpoModal
        isOpen={isNewExpoModalOpen}
        onClose={() => setIsNewExpoModalOpen(false)}
        onCreateExpo={handleCreateExpo}
      />

      <AuditLogDrawer
        isOpen={isAuditLogDrawerOpen}
        onClose={() => setIsAuditLogDrawerOpen(false)}
        auditLogs={auditLogs}
        theme={theme}
      />

      {/* Floating Toast Notification System */}
      <ToastNotice toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
