import React, { useState } from 'react';
import { 
  Building2, 
  CreditCard, 
  ShoppingBag, 
  Ticket, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  FileText, 
  Printer, 
  Send, 
  Zap, 
  Tv, 
  Wifi, 
  Armchair, 
  Users, 
  Sparkles, 
  Sun, 
  Coffee, 
  ChevronRight, 
  Layers, 
  MapPin, 
  Download, 
  ShieldCheck, 
  Filter, 
  Search, 
  Check, 
  PhoneCall, 
  Mail, 
  Info,
  QrCode,
  ArrowRight
} from 'lucide-react';
import { 
  ExhibitorAccount, 
  BoothItem, 
  ExhibitorServiceAddon, 
  ExhibitorAddonOrder, 
  ExhibitorPaymentTransaction, 
  ExhibitorServiceTicket, 
  ThemeMode,
  ExhibitorServiceAddonCategory
} from '../types';

interface ExhibitorPortalScreenProps {
  exhibitors: ExhibitorAccount[];
  booths: BoothItem[];
  addonsCatalog: ExhibitorServiceAddon[];
  addonOrders: ExhibitorAddonOrder[];
  paymentTransactions: ExhibitorPaymentTransaction[];
  serviceTickets: ExhibitorServiceTicket[];
  searchTerm: string;
  onRegisterExhibitor: (newExhibitor: ExhibitorAccount, selectedBoothId?: string) => void;
  onOrderAddon: (order: ExhibitorAddonOrder, addonPrice: number) => void;
  onProcessPayment: (transaction: ExhibitorPaymentTransaction) => void;
  onCreateTicket: (ticket: ExhibitorServiceTicket) => void;
  onUpdateTicketStatus?: (ticketId: string, status: ExhibitorServiceTicket['status'], responseNote: string) => void;
  theme: ThemeMode;
  accessMode?: 'none' | 'view_only' | 'view_edit';
}

export const ExhibitorPortalScreen: React.FC<ExhibitorPortalScreenProps> = ({
  exhibitors,
  booths,
  addonsCatalog,
  addonOrders,
  paymentTransactions,
  serviceTickets,
  searchTerm,
  onRegisterExhibitor,
  onOrderAddon,
  onProcessPayment,
  onCreateTicket,
  onUpdateTicketStatus,
  theme,
  accessMode = 'view_edit',
}) => {
  // Selected Active Exhibitor Session
  const [activeExhibitorId, setActiveExhibitorId] = useState<string>(
    exhibitors[0]?.id || ''
  );

  // Sub-tabs in Exhibitor Portal
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'payments' | 'addons' | 'tickets' | 'badges' | 'subscribe'>('overview');

  // Filter state for addons
  const [selectedAddonCategory, setSelectedAddonCategory] = useState<string>('الكل');

  // Payment Form State
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<ExhibitorPaymentTransaction['paymentMethod']>('بطاقة ائتمانية (Visa/MasterCard)');
  const [payNotes, setPayNotes] = useState('');

  // Invoice Modal State
  const [selectedInvoiceTx, setSelectedInvoiceTx] = useState<ExhibitorPaymentTransaction | null>(null);

  // New Ticket Form State
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<ExhibitorServiceTicket['category']>('كهرباء وديكور');
  const [ticketPriority, setTicketPriority] = useState<ExhibitorServiceTicket['priority']>('عادي');

  // New Subscription Registration Form State
  const [regCompanyName, setRegCompanyName] = useState('');
  const [regContactPerson, setRegContactPerson] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regSelectedBoothId, setRegSelectedBoothId] = useState<string>('');
  const [regNotes, setRegNotes] = useState('');

  // Current selected active exhibitor
  const currentExhibitor = exhibitors.find((e) => e.id === activeExhibitorId) || exhibitors[0];

  // Current exhibitor's orders, transactions, and tickets
  const currentAddonOrders = addonOrders.filter((o) => o.exhibitorId === activeExhibitorId);
  const currentTransactions = paymentTransactions.filter((t) => t.exhibitorId === activeExhibitorId);
  const currentTickets = serviceTickets.filter((t) => t.exhibitorId === activeExhibitorId);

  // Calculate total add-ons cost for this exhibitor
  const totalAddonsCost = currentAddonOrders.reduce((acc, o) => acc + o.totalPrice, 0);

  // Available booths for new subscription
  const availableBooths = booths.filter((b) => b.status === 'متاح');

  // Helper icon map for addons
  const getAddonIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Tv': return <Tv className="w-5 h-5 text-blue-400" />;
      case 'Wifi': return <Wifi className="w-5 h-5 text-emerald-400" />;
      case 'Armchair': return <Armchair className="w-5 h-5 text-purple-400" />;
      case 'Users': return <Users className="w-5 h-5 text-rose-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-cyan-400" />;
      case 'Sun': return <Sun className="w-5 h-5 text-yellow-400" />;
      case 'Coffee': return <Coffee className="w-5 h-5 text-amber-600" />;
      default: return <ShoppingBag className="w-5 h-5 text-indigo-400" />;
    }
  };

  // Handlers
  const handleOpenPaymentModal = () => {
    if (!currentExhibitor) return;
    setPayAmount(currentExhibitor.remainingBalance > 0 ? currentExhibitor.remainingBalance : 10000);
    setPayNotes(`سداد إلكتروني لحساب شركة ${currentExhibitor.companyName}`);
    setIsPayModalOpen(true);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentExhibitor || payAmount <= 0) return;

    const newTx: ExhibitorPaymentTransaction = {
      id: `tx-${Date.now()}`,
      exhibitorId: currentExhibitor.id,
      companyName: currentExhibitor.companyName,
      amount: payAmount,
      paymentMethod: payMethod,
      referenceNumber: `PAY-EX-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'ناجحة',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      notes: payNotes.trim() || 'سداد دفعة إلكترونية عبر بوابة العارضين.',
    };

    onProcessPayment(newTx);
    setIsPayModalOpen(false);
  };

  const handleOrderAddonClick = (addon: ExhibitorServiceAddon) => {
    if (!currentExhibitor) return;

    const newOrder: ExhibitorAddonOrder = {
      id: `ord-${Date.now()}`,
      exhibitorId: currentExhibitor.id,
      addonId: addon.id,
      addonTitle: addon.title,
      quantity: 1,
      unitPrice: addon.price,
      totalPrice: addon.price,
      status: 'مطلوبة',
      orderedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    onOrderAddon(newOrder, addon.price);
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentExhibitor || !ticketSubject.trim()) return;

    const newTicket: ExhibitorServiceTicket = {
      id: `tkt-${Date.now()}`,
      exhibitorId: currentExhibitor.id,
      companyName: currentExhibitor.companyName,
      boothNumber: currentExhibitor.boothNumber,
      subject: ticketSubject.trim(),
      category: ticketCategory,
      priority: ticketPriority,
      status: 'جديد',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    onCreateTicket(newTicket);
    setTicketSubject('');
  };

  const handleSubmitNewSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regCompanyName.trim() || !regPhone.trim()) return;

    const selectedBooth = booths.find((b) => b.id === regSelectedBoothId);
    const boothCode = selectedBooth ? selectedBooth.code : 'A-PENDING';
    const contractVal = selectedBooth ? selectedBooth.basePrice : 120000;

    const newExhibitor: ExhibitorAccount = {
      id: `ex-${Date.now()}`,
      companyName: regCompanyName.trim(),
      contactPerson: regContactPerson.trim() || 'مدير المعرض',
      phone: regPhone.trim(),
      email: regEmail.trim() || 'info@company.com',
      boothNumber: boothCode,
      contractValue: contractVal,
      amountPaid: 0,
      remainingBalance: contractVal,
      paymentStatus: 'متأخر',
      lastPaymentDate: '-',
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      notes: regNotes.trim() || 'اشتراك جديد عبر بوابة العارضين الإلكترونية.',
    };

    onRegisterExhibitor(newExhibitor, regSelectedBoothId);

    // Switch to newly created exhibitor
    setActiveExhibitorId(newExhibitor.id);
    setActiveSubTab('overview');

    // Reset Form
    setRegCompanyName('');
    setRegContactPerson('');
    setRegPhone('');
    setRegEmail('');
    setRegSelectedBoothId('');
    setRegNotes('');
  };

  const filteredAddons = addonsCatalog.filter((a) => {
    const matchesCategory = selectedAddonCategory === 'الكل' || a.category === selectedAddonCategory;
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 md:p-6 space-y-6 font-sans">
      {/* Top Banner & Exhibitor Session Switcher */}
      <div className={`p-6 rounded-3xl border shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border-blue-900/50 text-slate-100'
          : 'bg-gradient-to-r from-blue-50 via-white to-blue-50/50 border-blue-100 text-slate-900'
      }`}>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
            <Building2 className="w-4 h-4" />
            <span>بوابة العارضين للخدمات والمحاسبة الإلكترونية (Exhibitor Portal)</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black font-cairo">
            منصة إدارة اشتراك العارض، الدفع، وخدمات الجناح
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            يمكن للعارضين متابعة رصيد العقد، سداد المستحقات إلكترونياً، طلب التجهيزات والإضافات اللوجستية، وطباعة الفواتير الضريبية المعتمدة.
          </p>
        </div>

        {/* Session Selector / Register New Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400">العارض الحساب النشط:</label>
            <select
              value={activeExhibitorId}
              onChange={(e) => setActiveExhibitorId(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-950 border border-slate-700 text-blue-300 focus:outline-none focus:border-blue-500 cursor-pointer max-w-xs truncate"
            >
              {exhibitors.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.companyName} ({ex.boothNumber})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setActiveSubTab('subscribe')}
            className="mt-4 sm:mt-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs cursor-pointer shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>اشتراك عارض جديد</span>
          </button>
        </div>
      </div>

      {/* Portal Navigation Sub-Tabs */}
      <div className={`p-2 rounded-2xl border flex items-center gap-2 overflow-x-auto scrollbar-none ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'overview'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>ملخص الجناح والجاهزية</span>
        </button>

        <button
          onClick={() => setActiveSubTab('payments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'payments'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>الدفع والمحاسبة والشفافية</span>
          {currentExhibitor && currentExhibitor.remainingBalance > 0 && (
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-500/30 text-rose-300 font-mono">
              مطلوب سداد
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('addons')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'addons'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>متجر الإضافات والتجهيزات</span>
          {currentAddonOrders.length > 0 && (
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/30 text-emerald-300 font-mono">
              {currentAddonOrders.length} إضافات
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('tickets')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'tickets'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>طلب دعم وتجهيز ميداني</span>
          {currentTickets.length > 0 && (
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-indigo-500/30 text-indigo-300 font-mono">
              {currentTickets.length} تذاكر
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('badges')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'badges'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
          }`}
        >
          <QrCode className="w-4 h-4 text-purple-400" />
          <span>بطاقات ودخول العارضين (Badges)</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-500/30 text-purple-300 font-mono">
            QR / Barcode
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('subscribe')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'subscribe'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>حجز جناح واشتراك جديد</span>
        </button>
      </div>

      {/* SUB-TAB 1: OVERVIEW & BOOTH STATUS */}
      {activeSubTab === 'overview' && currentExhibitor && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-5 rounded-2xl border space-y-2 ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                <span>قيمة عقد الجناح الإجمالي</span>
                <Building2 className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-xl font-black font-mono text-slate-100">
                {currentExhibitor.contractValue.toLocaleString('ar-EG')} <span className="text-xs font-sans text-slate-400">ج.م</span>
              </div>
              <div className="text-[10px] text-slate-400">
                رقم الجناح: <span className="font-bold text-blue-300">{currentExhibitor.boothNumber}</span>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border space-y-2 ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                <span>المسدد فعلیاً حتى الآن</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-black font-mono text-emerald-400">
                {currentExhibitor.amountPaid.toLocaleString('ar-EG')} <span className="text-xs font-sans text-slate-400">ج.م</span>
              </div>
              <div className="text-[10px] text-slate-400">
                آخر سداد: <span className="font-bold text-slate-300">{currentExhibitor.lastPaymentDate}</span>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border space-y-2 ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                <span>الرصيد المتبقي للسداد</span>
                <AlertCircle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-xl font-black font-mono text-rose-400">
                {currentExhibitor.remainingBalance.toLocaleString('ar-EG')} <span className="text-xs font-sans text-slate-400">ج.م</span>
              </div>
              <div className="text-[10px] text-slate-400">
                تاريخ الاستحقاق: <span className="font-bold text-amber-300">{currentExhibitor.dueDate}</span>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border space-y-2 flex flex-col justify-between ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                <span>حالة الحساب المالي</span>
                <ShieldCheck className="w-4 h-4 text-purple-400" />
              </div>
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  currentExhibitor.paymentStatus === 'مكتمل'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : currentExhibitor.paymentStatus === 'جزئي'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}>
                  {currentExhibitor.paymentStatus === 'مكتمل' && 'مكتمل السداد 100%'}
                  {currentExhibitor.paymentStatus === 'جزئي' && 'سداد جزئي قيد المتابعة'}
                  {currentExhibitor.paymentStatus === 'متأخر' && 'سداد متأخر - يُرجى الدفع'}
                </span>

                <button
                  onClick={handleOpenPaymentModal}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-md shadow-blue-600/30 transition-all"
                >
                  سداد الآن
                </button>
              </div>
            </div>
          </div>

          {/* Exhibition Booth Readiness Progress Tracker */}
          <div className={`p-6 rounded-3xl border space-y-4 shadow-xl ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className="text-base font-black font-cairo text-blue-400 flex items-center gap-2">
              <Layers className="w-5 h-5" />
              <span>جدول مراحل جاهزية وتجهيز الجناح الميداني ({currentExhibitor.boothNumber})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
              {[
                { title: '1. حجز العقد والتوقيع', status: 'done', desc: 'تم توقيع عقد الشروط والأحكام' },
                { title: '2. سداد الدفعة الأولى', status: currentExhibitor.amountPaid > 0 ? 'done' : 'pending', desc: 'تأكيد الحجز المالي' },
                { title: '3. اعتماد مخطط الديكور', status: 'done', desc: 'موافقة الاستشاري الفني' },
                { title: '4. التغذية الكهربائية', status: totalAddonsCost > 0 ? 'done' : 'in_progress', desc: 'توصيل العداد والتجربة' },
                { title: '5. التسليم واستلام التصاريح', status: currentExhibitor.remainingBalance === 0 ? 'done' : 'in_progress', desc: 'تسليم مفاتيح الجناح' },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border space-y-2 relative overflow-hidden ${
                    step.status === 'done'
                      ? 'bg-emerald-950/20 border-emerald-800/50 text-emerald-200'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{step.title}</span>
                    {step.status === 'done' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Company Details & Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-3xl border space-y-4 shadow-xl ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h3 className="text-sm font-black font-cairo text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
                <Building2 className="w-4 h-4 text-blue-400" />
                <span>بيانات الشركة والمسؤول المعتمد</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">اسم الشركة العارضة:</span>
                  <span className="font-bold text-slate-100">{currentExhibitor.companyName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">المسؤول التفيذي:</span>
                  <span className="font-bold text-slate-100">{currentExhibitor.contactPerson}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">رقم الهاتف للجوال:</span>
                  <span className="font-mono font-bold text-blue-300">{currentExhibitor.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">البريد الإلكتروني:</span>
                  <span className="font-mono text-slate-300">{currentExhibitor.email}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                  <span className="text-slate-400">ملاحظات وشروط خاصة:</span>
                  <span className="text-[11px] text-amber-300 font-medium">{currentExhibitor.notes || 'لا يوجد'}</span>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-3xl border space-y-4 shadow-xl flex flex-col justify-between ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="space-y-3">
                <h3 className="text-sm font-black font-cairo text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <span>ملخص الإضافات والخدمات المطلوبة للجناح</span>
                </h3>

                {currentAddonOrders.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 text-center space-y-2">
                    <p className="text-xs text-slate-400">لم تقم بإضافة أي خدمات أو إضافات لوجستية حتى الآن.</p>
                    <button
                      onClick={() => setActiveSubTab('addons')}
                      className="px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-bold cursor-pointer transition-all"
                    >
                      تصفح متجر الإضافات
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {currentAddonOrders.map((ord) => (
                      <div key={ord.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-200">{ord.addonTitle}</div>
                          <div className="text-[10px] text-slate-400">الكمية: {ord.quantity} • التاريخ: {ord.orderedAt}</div>
                        </div>
                        <div className="font-mono font-bold text-emerald-400">
                          {ord.totalPrice.toLocaleString('ar-EG')} ج.م
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">إجمالي تكلفة الإضافات:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {totalAddonsCost.toLocaleString('ar-EG')} ج.م
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PAYMENTS & FINANCIAL LEDGER */}
      {activeSubTab === 'payments' && currentExhibitor && (
        <div className="space-y-6">
          {/* Financial Statement Header */}
          <div className={`p-6 rounded-3xl border space-y-4 shadow-xl ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-black font-cairo text-blue-400 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  <span>كشف الحساب المالي وسجل التحويلات لشركة {currentExhibitor.companyName}</span>
                </h3>
                <p className="text-xs text-slate-400">شفافية كاملة لجميع الدفعات، الفواتير الإلكترونية، وإيصالات السداد المعتمدة</p>
              </div>

              <button
                onClick={handleOpenPaymentModal}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs cursor-pointer shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all shrink-0"
              >
                <DollarSign className="w-4 h-4" />
                <span>إجراء دفعة أو سداد جديد</span>
              </button>
            </div>

            {/* Financial Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                <span className="text-slate-400">قيمة إيجار الجناح الأساسية:</span>
                <div className="text-lg font-black font-mono text-slate-200">
                  {currentExhibitor.contractValue.toLocaleString('ar-EG')} ج.م
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                <span className="text-slate-400">تكلفة الإضافات والخدمات:</span>
                <div className="text-lg font-black font-mono text-emerald-400">
                  +{totalAddonsCost.toLocaleString('ar-EG')} ج.م
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                <span className="text-slate-400">إجمالي المسدد بالفعل:</span>
                <div className="text-lg font-black font-mono text-blue-400">
                  {currentExhibitor.amountPaid.toLocaleString('ar-EG')} ج.م
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                <span className="text-slate-400">المتبقي المطلوب سداده:</span>
                <div className="text-lg font-black font-mono text-rose-400">
                  {currentExhibitor.remainingBalance.toLocaleString('ar-EG')} ج.م
                </div>
              </div>
            </div>
          </div>

          {/* Transactions & Invoices Table */}
          <div className={`p-6 rounded-3xl border space-y-4 shadow-xl ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h4 className="text-sm font-black font-cairo text-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>سجل التحويلات والفواتير الصادرة ({currentTransactions.length} عمليات):</span>
            </h4>

            {currentTransactions.length === 0 ? (
              <div className="p-8 text-center space-y-3 bg-slate-950/40 rounded-2xl border border-slate-800">
                <CreditCard className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">لم يتم تسجيل أي عمليات سداد إلكتروني هذا الحساب بعد.</p>
                <button
                  onClick={handleOpenPaymentModal}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs cursor-pointer"
                >
                  سداد أول دفعة الآن
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-bold bg-slate-950/50">
                      <th className="p-3">رقم الفاتورة / الإيصال</th>
                      <th className="p-3">قيمة الدفعة</th>
                      <th className="p-3">طريقة السداد</th>
                      <th className="p-3">الرقم المرجعي (Ref)</th>
                      <th className="p-3">التاريخ والوقت</th>
                      <th className="p-3">الحالة</th>
                      <th className="p-3 text-center">عرض الفاتورة الضريبية</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {currentTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3 font-mono font-bold text-blue-300">{tx.invoiceNumber}</td>
                        <td className="p-3 font-mono font-bold text-emerald-400">
                          {tx.amount.toLocaleString('ar-EG')} ج.م
                        </td>
                        <td className="p-3 text-slate-200">{tx.paymentMethod}</td>
                        <td className="p-3 font-mono text-slate-400">{tx.referenceNumber}</td>
                        <td className="p-3 text-slate-400">{tx.timestamp}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {tx.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => setSelectedInvoiceTx(tx)}
                            className="px-3 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-[11px] font-bold cursor-pointer transition-all flex items-center justify-center gap-1 mx-auto"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>طباعة الفاتورة</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ADD-ONS & TECHNICAL SERVICES STORE */}
      {activeSubTab === 'addons' && currentExhibitor && (
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl border space-y-4 shadow-xl ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-black font-cairo text-emerald-400 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  <span>متجر التجهيزات والخدمات اللوجستية الإضافية للجناح</span>
                </h3>
                <p className="text-xs text-slate-400">اختر التجهيزات والخدمات التقنية المطلوبة للجناح وسيتم إضافتها تلقائياً لكشف الحساب المالي</p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                {['الكل', 'كهرباء وطاقة', 'شاشات وتقنيات', 'أثاث وتجهيزات', 'ضيافة وكوادر', 'نظافة وأمن'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedAddonCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      selectedAddonCategory === cat
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Addons Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {filteredAddons.map((addon) => {
                const isAlreadyOrdered = currentAddonOrders.some((o) => o.addonId === addon.id);

                return (
                  <div
                    key={addon.id}
                    className={`p-5 rounded-2xl border space-y-4 transition-all flex flex-col justify-between relative overflow-hidden ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200'
                    }`}
                  >
                    {addon.isPopular && (
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> الأكثر طلباً
                      </span>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                          {getAddonIcon(addon.iconName)}
                        </div>
                        <div>
                          <span className="text-[10px] text-emerald-400 font-bold block">{addon.category}</span>
                          <h4 className="font-bold text-slate-100 text-xs leading-snug">{addon.title}</h4>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {addon.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <div>
                        <div className="text-base font-black font-mono text-emerald-400">
                          {addon.price.toLocaleString('ar-EG')} <span className="text-xs font-sans text-slate-400">ج.م</span>
                        </div>
                        <span className="text-[10px] text-slate-500 block">{addon.unitLabel}</span>
                      </div>

                      <button
                        onClick={() => handleOrderAddonClick(addon)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                          isAlreadyOrdered
                            ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
                        }`}
                      >
                        {isAlreadyOrdered ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>مطلوب للجناح</span>
                          </>
                        ) : (
                          <>
                            <PlusCircle className="w-4 h-4" />
                            <span>طلب الإضافة</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: SUPPORT TICKETS & FIELD REQUESTS */}
      {activeSubTab === 'tickets' && currentExhibitor && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create New Ticket Form */}
          <div className={`p-6 rounded-3xl border space-y-4 shadow-xl ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className="text-sm font-black font-cairo text-indigo-400 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Ticket className="w-4 h-4" />
              <span>تقديم طلب دعم فني أو بلاغ صيانة للجناح</span>
            </h3>

            <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-slate-300">موضوع الطلب / الخدمة المطلوبة:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: زيادة طاقة الكشافات، طلب خط إنترنت إضافي..."
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-bold focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-300">تصنيف قسم الخدمة:</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 cursor-pointer font-bold"
                >
                  <option value="كهرباء وديكور">كهرباء وديكور الجناح</option>
                  <option value="نظافة وضيافة">نظافة وضيافة</option>
                  <option value="تصاريح ودخول">تصاريح ودخول الفرق</option>
                  <option value="إنترنت وشاشات">إنترنت وشاشات تقنية</option>
                  <option value="دعم محاسبي">دعم محاسبي ومالي</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-300">درجة الأهمية (Priority):</label>
                <select
                  value={ticketPriority}
                  onChange={(e) => setTicketPriority(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 cursor-pointer font-bold"
                >
                  <option value="عادي">عادي (خلال اليوم)</option>
                  <option value="عاجل">عاجل جداً (تدخل عاجل)</option>
                  <option value="منخفض">منخفض (استفسار عام)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black cursor-pointer shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>إرسال البلاغ لفريق صالة المعرض</span>
              </button>
            </form>
          </div>

          {/* Tickets List */}
          <div className={`lg:col-span-2 p-6 rounded-3xl border space-y-4 shadow-xl ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className="text-sm font-black font-cairo text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Ticket className="w-4 h-4 text-indigo-400" />
              <span>تذاكر الدعم السابقة ومتابعة الاستجابة الميدانية ({currentTickets.length})</span>
            </h3>

            {currentTickets.length === 0 ? (
              <div className="p-8 text-center space-y-2 bg-slate-950/40 rounded-2xl border border-slate-800">
                <Ticket className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">لا توجد تذاكر دعم مسجلة باسم هذا العارض حتى الآن.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentTickets.map((tkt) => (
                  <div key={tkt.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-100 text-xs">{tkt.subject}</span>
                          <span className={`px-2 py-0.2 rounded text-[9px] font-bold ${
                            tkt.priority === 'عاجل' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {tkt.priority}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          القسم: <span className="text-indigo-300">{tkt.category}</span> • التاريخ: {tkt.createdAt}
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        tkt.status === 'تم الحل'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : tkt.status === 'قيد المعالجة'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      }`}>
                        {tkt.status}
                      </span>
                    </div>

                    {tkt.responseNote && (
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-emerald-300 font-medium">
                        رد فريق التشغيل: {tkt.responseNote}
                      </div>
                    )}

                    {/* Quick Staff Ticket Resolution Controls */}
                    {accessMode !== 'view_only' && onUpdateTicketStatus && (
                      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-400 font-bold">تحديث حالة البلاغ (إدارة الصالة):</span>
                        <div className="flex items-center gap-2">
                          {tkt.status !== 'قيد المعالجة' && (
                            <button
                              onClick={() => onUpdateTicketStatus(tkt.id, 'قيد المعالجة', 'توجيه فني الصالة للبدء بالتنفيذ')}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold cursor-pointer hover:bg-amber-500/30 transition-all"
                            >
                              تعيين "قيد المعالجة"
                            </button>
                          )}
                          {tkt.status !== 'تم الحل' && (
                            <button
                              onClick={() => onUpdateTicketStatus(tkt.id, 'تم الحل', 'تم تنفيذ وتأجير الخدمة المطلوبة واختبارها بنجاح')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold cursor-pointer hover:bg-emerald-500/30 transition-all"
                            >
                              اعتماد "تم الحل"
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB: EXHIBITOR BADGES & ENTRY PASS GENERATOR */}
      {activeSubTab === 'badges' && currentExhibitor && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Header Banner */}
          <div className={`p-6 rounded-3xl border space-y-3 shadow-xl ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-black font-cairo text-purple-400 flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  <span>مولّد وصانع بطاقات دخول العارضين الرسمية (Official Pass & Badge)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  بطاقة دخول ذكية مجهزة بكود QR وبار كود مسح البوابات الإلكترونية، جاهزة للطباعة أو التنزيل فورياً.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة البطاقة الرسمية</span>
                </button>
                <button
                  onClick={() => alert(`تم تحميل تصريح دخول العارض (${currentExhibitor.companyName}) بنجاح!`)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer border border-slate-700 flex items-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>تحميل PDF / Image</span>
                </button>
              </div>
            </div>
          </div>

          {/* Badge Display Mockup Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-purple-500/40 shadow-2xl text-slate-100 max-w-lg mx-auto relative overflow-hidden space-y-6">
            {/* Top Lanyard Hole Visual */}
            <div className="w-12 h-3 mx-auto rounded-full bg-slate-800 border border-slate-700 shadow-inner"></div>

            {/* Header / Brand */}
            <div className="text-center space-y-1 border-b border-slate-800/80 pb-4">
              <div className="flex items-center justify-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white text-black font-black text-xs flex items-center justify-center">ANC</div>
                <span className="font-black text-sm tracking-widest text-white">ANC ADVERTISING</span>
              </div>
              <div className="text-xs font-bold text-purple-400 font-cairo">معرض القاهرة الدولي للتقنية والتسويق 2026</div>
              <div className="text-[10px] text-slate-400">Cairo International Expo Center</div>
            </div>

            {/* Exhibitor Pass Title Badge */}
            <div className="text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-black text-xs tracking-wider">
                EXHIBITOR PASS • تصريح عارض معتمد
              </span>
            </div>

            {/* Profile Info */}
            <div className="text-center space-y-2 py-2">
              <h2 className="text-2xl font-black font-cairo text-white tracking-wide">
                {currentExhibitor.companyName}
              </h2>
              <div className="text-sm font-bold text-slate-300">
                المسؤول: <span className="text-purple-300">{currentExhibitor.contactPerson}</span>
              </div>
              <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-1">
                <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 font-bold font-mono text-blue-300">
                  الجناح: {currentExhibitor.boothNumber}
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 font-bold font-mono text-emerald-300">
                  صالة المعرض: صالة 1
                </span>
              </div>
            </div>

            {/* QR Code and Barcode Box */}
            <div className="p-4 rounded-2xl bg-white text-black text-center space-y-3 shadow-inner">
              <div className="flex items-center justify-center gap-4">
                {/* SVG QR Code Simulation */}
                <div className="w-24 h-24 bg-black p-1.5 rounded-lg shrink-0 flex items-center justify-center">
                  <div className="w-full h-full bg-white p-1 grid grid-cols-5 gap-0.5">
                    <div className="bg-black col-span-2 row-span-2"></div>
                    <div className="bg-black"></div>
                    <div className="bg-black col-span-2 row-span-2"></div>
                    <div className="bg-black col-span-1"></div>
                    <div className="bg-black col-span-3"></div>
                    <div className="bg-black col-span-2"></div>
                    <div className="bg-black col-span-2 row-span-2"></div>
                    <div className="bg-black"></div>
                    <div className="bg-black col-span-2"></div>
                  </div>
                </div>

                <div className="text-right space-y-1 font-sans">
                  <div className="text-[11px] font-bold text-slate-700">الرقم المرجعي للتصريح:</div>
                  <div className="text-xs font-mono font-black text-black dir-ltr">
                    EX-{currentExhibitor.id.toUpperCase()}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold pt-1">
                    ✓ معتمد بالبوابة الإلكترونية
                  </div>
                  <div className="text-[9px] text-slate-500">صالح طوال فترة المعرض 2026</div>
                </div>
              </div>

              {/* Barcode Lines */}
              <div className="pt-2 border-t border-slate-200 text-center">
                <div className="font-mono text-lg font-black tracking-widest text-slate-800 select-none">
                  ||| | |||| | ||||| ||| ||| | ||
                </div>
                <div className="text-[9px] font-mono text-slate-500 mt-0.5">2026-EXHIBITOR-GATE-SCAN-CODE</div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
              يرجى تعليق البطاقة بوضوح عند دخول كافة صالات ومرافق المعرض.
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: NEW EXHIBITOR SUBSCRIPTION & BOOTH REGISTRATION FORM */}
      {activeSubTab === 'subscribe' && (
        <div className={`p-6 rounded-3xl border space-y-6 shadow-2xl max-w-4xl mx-auto ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="border-b border-slate-800 pb-4 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <PlusCircle className="w-4 h-4" />
              <span>اشتراك وحجز جناح جديد لمعرض القاهرة الدولي 2026</span>
            </div>
            <h3 className="text-lg font-black font-cairo text-slate-100">
              نموذج تسجيل عارض جديد واختيار الجناح المناسب
            </h3>
            <p className="text-xs text-slate-400">
              قم بإدخال بيانات الشركة العارضة واختيار الجناح المتاح ليتم إنشاء كشف الحساب والفاتورة فورياً.
            </p>
          </div>

          <form onSubmit={handleSubmitNewSubscription} className="space-y-6 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block font-bold text-slate-300">اسم الشركة العارضة / المؤسسة:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: شركة النظم العالمية للذكاء الاصطناعي"
                  value={regCompanyName}
                  onChange={(e) => setRegCompanyName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-bold focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-300">اسم المسؤول المعتمد:</label>
                <input
                  type="text"
                  required
                  placeholder="اسم مدير التسويق أو المشاركة"
                  value={regContactPerson}
                  onChange={(e) => setRegContactPerson(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-bold focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-300">رقم الهاتف والجوال:</label>
                <input
                  type="tel"
                  required
                  placeholder="+20 100 000 0000"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-bold focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-300">البريد الإلكتروني للشركة:</label>
                <input
                  type="email"
                  required
                  placeholder="contact@company.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-bold focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Booth Selector */}
              <div className="md:col-span-2 space-y-1">
                <label className="block font-bold text-slate-300">اختيار الجناح المتاح من الخريطة الميدانية:</label>
                <select
                  value={regSelectedBoothId}
                  onChange={(e) => setRegSelectedBoothId(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-emerald-300 font-bold cursor-pointer"
                >
                  <option value="">-- اختر جناحاً متاحاً بالمعرض --</option>
                  {availableBooths.map((b) => (
                    <option key={b.id} value={b.id}>
                      الجناح {b.code} ({b.hall}) - المساحة: {b.dimensions} ({b.areaSqM} م²) - السعر: {b.basePrice.toLocaleString('ar-EG')} ج.م
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400">إذا لم يتم تحديد جناح، سيتم تخصيص جناح مؤقت لحين مراجعة قسم المبيعات.</p>
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="block font-bold text-slate-300">ملاحظات العقد أو متطلبات خاصة:</label>
                <textarea
                  rows={2}
                  placeholder="متطلبات خاصة بالكهرباء أو المساحة المفتوحة..."
                  value={regNotes}
                  onChange={(e) => setRegNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveSubTab('overview')}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black cursor-pointer shadow-lg shadow-emerald-600/30 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تأكيد الاشتراك وحجز الجناح فوراً</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ONLINE PAYMENT MODAL */}
      {isPayModalOpen && currentExhibitor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className={`w-full max-w-lg rounded-3xl border p-6 space-y-6 shadow-2xl ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-blue-400">
                <CreditCard className="w-5 h-5" />
                <h3 className="text-base font-black font-cairo">بوابة السداد الإلكتروني - حساب العارض</h3>
              </div>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400">الشركة العارضة:</span>
                <div className="font-bold text-slate-100 text-sm">{currentExhibitor.companyName} ({currentExhibitor.boothNumber})</div>
                <div className="text-[11px] text-slate-400">
                  الرصيد المتبقي المستحق: <span className="font-bold text-rose-400">{currentExhibitor.remainingBalance.toLocaleString('ar-EG')} ج.م</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-300">المبلغ المراد سداده الآن (ج.م):</label>
                <input
                  type="number"
                  required
                  min={100}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 font-mono font-bold text-base focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-300">وسيلة السداد المعتمدة:</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 cursor-pointer font-bold"
                >
                  <option value="بطاقة ائتمانية (Visa/MasterCard)">بطاقة ائتمانية (Visa / MasterCard)</option>
                  <option value="تحويل بنكي سويفت (SWIFT)">تحويل بنكي سويفت (SWIFT Bank Transfer)</option>
                  <option value="فودافون كاش / فوري">محفظة فودافون كاش / شبكة فوري (Fawry)</option>
                  <option value="سداد نقدي بالمعرض">سداد نقدي بمكتب محاسبة المعرض</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-300">بيانات الإشعار / ملاحظات:</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black shadow-lg shadow-blue-600/30 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تأكيد عملية السداد والتوليد</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAX INVOICE PRINT VIEW MODAL */}
      {selectedInvoiceTx && currentExhibitor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white text-slate-900 rounded-3xl p-8 space-y-6 shadow-2xl relative border border-slate-300">
            <button
              onClick={() => setSelectedInvoiceTx(null)}
              className="absolute top-4 left-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              ✕
            </button>

            {/* Header / Logo */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="space-y-1">
                <div className="text-xs font-bold text-blue-700">معرض القاهرة الدولي للتقنية 2026</div>
                <h2 className="text-xl font-black font-cairo">فاتورة ضريبية وإيصال سداد إلكتروني</h2>
                <span className="text-[11px] font-mono text-slate-500">Tax Invoice & Official Receipt</span>
              </div>
              <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 text-center">
                <QrCode className="w-12 h-12 text-slate-800 mx-auto" />
                <span className="text-[9px] font-mono text-slate-500 block mt-1">المكافئ المعتمد</span>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">العارص / الشركة:</span>
                <span className="font-bold text-slate-900">{currentExhibitor.companyName}</span>
                <span className="text-[10px] text-slate-500 block">رقم الجناح: {currentExhibitor.boothNumber}</span>
              </div>

              <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">رقم الفاتورة المرجعي:</span>
                <span className="font-mono font-bold text-blue-700">{selectedInvoiceTx.invoiceNumber}</span>
                <span className="text-[10px] text-slate-500 block">التاريخ: {selectedInvoiceTx.timestamp}</span>
              </div>
            </div>

            {/* Financial Line Items */}
            <div className="border rounded-2xl overflow-hidden border-slate-200 text-xs">
              <table className="w-full text-right">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">البيان / الخدمة</th>
                    <th className="p-2.5">وسيلة السداد</th>
                    <th className="p-2.5">الرقم المرجعي</th>
                    <th className="p-2.5 text-left">المبلغ الصافي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  <tr>
                    <td className="p-2.5">{selectedInvoiceTx.notes}</td>
                    <td className="p-2.5">{selectedInvoiceTx.paymentMethod}</td>
                    <td className="p-2.5 font-mono">{selectedInvoiceTx.referenceNumber}</td>
                    <td className="p-2.5 text-left font-mono font-bold text-emerald-700">
                      {selectedInvoiceTx.amount.toLocaleString('ar-EG')} ج.م
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-xs">
              <div className="text-slate-500">
                حالة السداد: <span className="font-bold text-emerald-700">سداد مقبول ومعتمد 100%</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[10px]">المبلغ الإجمالي المسدد:</span>
                <span className="text-xl font-black font-mono text-emerald-700">
                  {selectedInvoiceTx.amount.toLocaleString('ar-EG')} ج.م
                </span>
              </div>
            </div>

            {/* Print Footer Button */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">طُبعت إلكترونياً عبر منصة إدارة معرض القاهرة 2026</span>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs cursor-pointer flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الإيصال الفوري</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
