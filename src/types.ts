export type ThemeMode = 'dark' | 'light';

export type ExpoEvent = {
  id: string;
  name: string;
  city?: string;
  location: string;
  dates?: string;
  startDate?: string;
  endDate?: string;
  hallsCount?: number;
  totalBudget?: number;
  approvedPOs?: number;
  actualExpenses?: number;
  totalExhibitors: number;
  occupiedBooths: number;
  totalBooths: number;
};

export type VendorCategory = string;

export type RFQStatus = 'بانتظار المراجعة' | 'مقبول' | 'مرفوض';

export type CostItem = {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type VendorOffer = {
  id: string;
  vendorName: string;
  vendorRating: number;
  vendorPhone: string;
  category: VendorCategory;
  offerValue: number;
  submittedDate: string;
  status: RFQStatus;
  deliveryDays: number;
  warrantyPeriod: string;
  items: CostItem[];
  notes?: string;
  editorName?: string;
};

export type RFQRequest = {
  id: string;
  rfqNumber: string;
  title: string;
  category: VendorCategory;
  createdDate: string;
  budgetAllocated: number;
  offersCount: number;
  selectedVendorId?: string;
  poNumber?: string;
  offers: VendorOffer[];
  specifications?: string;
  deliveryDeadline?: string;
  items?: CostItem[];
  editorName?: string;
};

export type ExhibitorPaymentStatus = 'مكتمل' | 'جزئي' | 'متأخر';

export type ExhibitorAccount = {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  boothNumber: string;
  contractValue: number;
  amountPaid: number;
  remainingBalance: number;
  paymentStatus: ExhibitorPaymentStatus;
  lastPaymentDate: string;
  dueDate: string;
  notes?: string;
  editorName?: string;
};

export type ThreeWayMatchItem = {
  id: string;
  vendorName: string;
  category: VendorCategory;
  invoiceNumber: string;
  invoiceAmount: number;
  invoiceDate: string;
  poNumber: string;
  poAmount: number;
  receivingNoteNumber: string;
  receivingNoteStatus: 'مطابق بالكامل' | 'فرق بسيط' | 'تحت الفحص الميداني';
  
  // 3-way matching checkboxes for manual human verification
  checkInvoiceVsPO: boolean;
  checkPOReciptVsDelivery: boolean;
  checkQualityInspection: boolean;
  
  status: 'بانتظار المطابقة' | 'تمت المطابقة - جاهز للصرف' | 'تم صرف الدفعة' | 'مرفوض للمراجعة';
  approvedBy?: string;
  approvedAt?: string;
  editorName?: string;
};

export type TaskPriority = 'عالية' | 'متوسطة' | 'منخفضة';
export type TaskColumnStatus = 'قيد الانتظار' | 'جاري التنفيذ' | 'بانتظار الاعتماد' | 'مكتملة';
export type TeamCategory = 'إدارة المعرض' | 'إدارة الصالة' | 'الدعم الفني' | 'الحسابات' | 'الأمن والسلامة' | 'النظافة والديكور';

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  roleId?: string;
  team: TeamCategory;
  avatar: string;
  phone: string;
  email?: string;
  activeTasksCount: number;
  status: 'متاح' | 'مشغول' | 'خارج الخدمة';
  customPermissions?: PermissionKey[];
};

export type TaskCardType = {
  id: string;
  taskCode: string;
  title: string;
  description: string;
  assignedStaff: StaffMember;
  priority: TaskPriority;
  status: TaskColumnStatus;
  slaRemainingMinutes: number; // SLA in minutes
  locationHall: string;
  boothCode?: string;
  createdAt: string;
  team: TeamCategory;
  editorName?: string;
};

export type BoothStatus = 'متاح' | 'مبيعة' | 'محجوزة' | 'مغلقة';
export type BoothCategory = 'أجنحة ممتازة A' | 'أجنحة قياسية B' | 'أجنحة صغيرة C' | 'مناطق مفتوحة';

export type BoothExtraService = {
  id: string;
  name: string;
  price: number;
  selected: boolean;
};

export type BoothItem = {
  id: string;
  code: string; // e.g. "A101", "B204"
  hall: string; // "صالة 1" or "صالة 2"
  dimensions: string; // e.g. "6m x 4m"
  areaSqM: number;
  category: BoothCategory;
  status: BoothStatus;
  basePrice: number;
  manualPriceOverride?: number;
  priceOverrideReason?: string;
  isLocked: boolean;
  assignedExhibitorId?: string;
  assignedExhibitorName?: string;
  paymentStatus?: ExhibitorPaymentStatus;
  services: BoothExtraService[];
  x: number; // grid position percentage or canvas coordinate
  y: number;
  width: number;
  height: number;
  editorName?: string;
};

export type EventSessionCategory =
  | 'جلسة رئيسية'
  | 'حفل الافتتاح'
  | 'ورشة عمل'
  | 'حلقة نقاش'
  | 'عرض تقني'
  | 'شبكات أعمال';

export type EventSessionStatus = 'قادمة' | 'جارية الآن' | 'مكتملة' | 'تأجيل';

export type EventSession = {
  id: string;
  sessionCode: string;
  title: string;
  speakerName: string;
  speakerTitle: string;
  speakerAvatar?: string;
  day: string; // e.g. "اليوم الأول - 12 مارس"
  timeStart: string; // e.g. "10:00"
  timeEnd: string; // e.g. "11:30"
  hallLocation: string; // e.g. "القاعة الكبرى A"
  category: EventSessionCategory;
  status: EventSessionStatus;
  attendeesCount: number;
  description: string;
  editorName?: string;
  lastEditedAt?: string;
};

export type ModuleId = 'dashboard' | 'procurement' | 'accounting' | 'workforce' | 'floorplan' | 'timeline' | 'roles' | 'exhibitor_portal';

export type AccessMode = 'none' | 'view_only' | 'view_edit';

export type ModuleAccessMap = {
  dashboard: AccessMode;
  procurement: AccessMode;
  accounting: AccessMode;
  workforce: AccessMode;
  floorplan: AccessMode;
  timeline: AccessMode;
  roles: AccessMode;
  exhibitor_portal: AccessMode;
};

export type ExhibitorServiceAddonCategory = 'كهرباء وطاقة' | 'أثاث وتجهيزات' | 'شاشات وتقنيات' | 'ضيافة وكوادر' | 'نظافة وأمن' | 'تسويق ورعايات';

export type ExhibitorServiceAddon = {
  id: string;
  title: string;
  description: string;
  category: ExhibitorServiceAddonCategory;
  price: number;
  unitLabel: string; // e.g. "لكل يوم", "قطعة واحد", "اشتراك شامل"
  iconName: string;
  isPopular?: boolean;
};

export type ExhibitorAddonOrder = {
  id: string;
  exhibitorId: string;
  addonId: string;
  addonTitle: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: 'مطلوبة' | 'قيد التجهيز' | 'مكتملة' | 'ملغاة';
  orderedAt: string;
};

export type ExhibitorPaymentTransaction = {
  id: string;
  exhibitorId: string;
  companyName: string;
  amount: number;
  paymentMethod: 'بطاقة ائتمانية (Visa/MasterCard)' | 'تحويل بنكي سويفت (SWIFT)' | 'فودافون كاش / فوري' | 'سداد نقدي بالمعرض';
  referenceNumber: string;
  status: 'ناجحة' | 'قيد المراجعة' | 'مرفوضة';
  timestamp: string;
  invoiceNumber: string;
  notes?: string;
};

export type ExhibitorServiceTicket = {
  id: string;
  exhibitorId: string;
  companyName: string;
  boothNumber: string;
  subject: string;
  category: 'كهرباء وديكور' | 'نظافة وضيافة' | 'تصاريح ودخول' | 'إنترنت وشاشات' | 'دعم محاسبي';
  priority: 'عاجل' | 'عادي' | 'منخفض';
  status: 'جديد' | 'قيد المعالجة' | 'تم الحل';
  createdAt: string;
  responseNote?: string;
};

export type PermissionKey =
  | 'approve_po'            // اعتماد أمر الشراء
  | 'disburse_payment'      // صرف دفعة الموردين
  | 'record_payment'        // تحصيل دفعة العارض
  | 'issue_invoice'        // إصدار فاتورة
  | 'assign_task'          // تعيين مهمة
  | 'edit_floorplan'       // تعديل الخريطة
  | 'manage_timeline'      // إدارة جدول الفعاليات
  | 'manage_roles'         // إدارة الصلاحيات والأدوار
  | 'add_categories';      // إضافة فئات توريد

export type SystemRole = {
  id: string;
  name: string;
  color: string;
  description: string;
  permissions: PermissionKey[];
  moduleAccess?: ModuleAccessMap;
};

export type AuditLogEntry = {
  id: string;
  timestamp: string;
  user: string;
  userAvatar?: string;
  action: string;
  details: string;
  type: 'procurement' | 'accounting' | 'task' | 'floorplan' | 'timeline' | 'roles' | 'system';
  targetModule?: string;
};

