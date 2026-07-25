import React, { useState } from 'react';
import { 
  Building2, 
  LogIn, 
  UserPlus, 
  Sparkles, 
  ShieldCheck, 
  KeyRound, 
  Mail, 
  User, 
  Building, 
  Phone, 
  Check, 
  Eraser, 
  Layers, 
  ArrowRight,
  ShieldAlert,
  Eye,
  EyeOff
} from 'lucide-react';
import { StaffMember, SystemRole, ThemeMode } from '../types';

interface AuthScreenProps {
  onLoginSuccess: (user: StaffMember, startFresh: boolean) => void;
  roles: SystemRole[];
  registeredUsers: StaffMember[];
  onRegisterUser: (newUser: StaffMember) => void;
  theme: ThemeMode;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  roles,
  registeredUsers,
  onRegisterUser,
  theme,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('+20 100 000 0000');
  const [regCompany, setRegCompany] = useState('');
  const [regRoleId, setRegRoleId] = useState<string>(roles[0]?.id || 'role-admin');
  const [startFreshWorkspace, setStartFreshWorkspace] = useState(true);

  // Quick Demo Preset Selection
  const handleQuickDemoLogin = (user: StaffMember) => {
    onLoginSuccess(user, false);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim()) {
      setLoginError('يرجى إدخال البريد الإلكتروني');
      return;
    }

    // Find in registered users
    const foundUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === loginEmail.trim().toLowerCase()
    );

    if (foundUser) {
      onLoginSuccess(foundUser, false);
    } else {
      // Create user on the fly with this email if not found
      const roleObj = roles.find((r) => r.id === regRoleId) || roles[0];
      const nameFromEmail = loginEmail.split('@')[0] || 'مستخدم جديد';
      const createdUser: StaffMember = {
        id: `usr-${Date.now()}`,
        name: nameFromEmail,
        role: roleObj?.name || 'مدير النظام',
        roleId: roleObj?.id || 'role-admin',
        team: 'إدارة المعرض',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(nameFromEmail)}`,
        phone: '+20 100 123 4567',
        email: loginEmail,
        activeTasksCount: 0,
        status: 'متاح',
      };
      onRegisterUser(createdUser);
      onLoginSuccess(createdUser, false);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      setLoginError('يرجى ملء جميع البيانات الأساسية');
      return;
    }

    const roleObj = roles.find((r) => r.id === regRoleId) || roles[0];
    const newUser: StaffMember = {
      id: `usr-${Date.now()}`,
      name: regName.trim(),
      role: roleObj?.name || 'مدير المعرض والإنتاج',
      roleId: regRoleId,
      team: regCompany || 'إدارة ANC المعارض',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(regName)}`,
      phone: regPhone,
      email: regEmail.trim(),
      activeTasksCount: 0,
      status: 'متاح',
    };

    onRegisterUser(newUser);
    onLoginSuccess(newUser, startFreshWorkspace);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-between font-cairo selection:bg-emerald-500 selection:text-black">
      {/* Dynamic Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      {/* Top Brand Bar */}
      <div className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-[#0a0d14]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
            ANC
          </div>
          <div>
            <div className="font-black text-base text-white tracking-tight">ANC Expo Management Portal</div>
            <div className="text-xs text-slate-400 font-medium">منظومة إدارة وتجهيز المعارض والمؤتمرات الدولية</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            نظام تشغيل حقيقي v3.2
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-5xl w-full mx-auto px-4 py-8 flex-1 flex flex-col lg:flex-row items-center justify-center gap-12">
        
        {/* Left Side: System Info & Value Prop */}
        <div className="flex-1 space-y-6 text-right max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>نظام إدارة معتمد للشركات والمنظمين</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            ابدأ في إدارة معارضك ومورديك <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">من الصفر ببياناتك الحقيقية</span>
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed font-sans">
            منظومة متكاملة لإدارة كراسات الشروط (RFQs)، الاعتمادات الثنائية للمحاسبة والموردين، إدارة مساحات الأجنحة، وخطط التنفيذ الميدانية. يمكنك إنشاء حسابك الجديد والبدء بقواعد بيانات فارغة تماماً.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-[#0e121d] border border-slate-800 text-right">
              <div className="text-emerald-400 font-black text-lg mb-0.5">100%</div>
              <div className="text-xs font-bold text-slate-200">حفظ تلقائي للبيانات</div>
              <div className="text-[11px] text-slate-400 mt-1">يتم حفظ جميع التغييرات محلياً بأمان</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0e121d] border border-slate-800 text-right">
              <div className="text-teal-400 font-black text-lg mb-0.5">Dual-Approval</div>
              <div className="text-xs font-bold text-slate-200">مطابقة محاسبية ثنائية</div>
              <div className="text-[11px] text-slate-400 mt-1">ربط المشتريات بالصرف الفعلي</div>
            </div>
          </div>

          {/* Quick Preset Selector for Easy Exploration */}
          <div className="pt-4 border-t border-slate-800/80">
            <div className="text-xs font-bold text-slate-400 mb-3">أو استكشف بالنقر السريع على أحد الحسابات التجريبية:</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {registeredUsers.slice(0, 3).map((usr) => (
                <button
                  key={usr.id}
                  type="button"
                  onClick={() => handleQuickDemoLogin(usr)}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 transition-all text-right group cursor-pointer"
                >
                  <img src={usr.avatar} alt={usr.name} className="w-7 h-7 rounded-lg object-cover" />
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-200 truncate group-hover:text-emerald-300">{usr.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{usr.role}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card Form */}
        <div className="w-full max-w-md bg-[#0d1018] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Form Header Tabs */}
          <div className="flex items-center p-1 rounded-2xl bg-[#07090e] border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                authMode === 'login'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                authMode === 'register'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>إنشاء حساب جديد</span>
            </button>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {authMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-right">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@anc-expo.com"
                    required
                    className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-[#07090e] border border-slate-800 text-white text-xs outline-hidden focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  كلمة المرور
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pr-10 pl-10 py-2.5 rounded-xl bg-[#07090e] border border-slate-800 text-white text-xs outline-hidden focus:border-emerald-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>دخول إلى لوحة التحكم</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const demoUser = registeredUsers[0];
                    if (demoUser) onLoginSuccess(demoUser, false);
                  }}
                  className="text-xs text-slate-400 hover:text-emerald-400 underline font-medium transition-colors"
                >
                  أو الدخول المباشر بالنسخة التوضيحية (Demo Login)
                </button>
              </div>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-right">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="مثال: المهندس أحمد علي"
                    required
                    className="w-full pr-10 pl-3 py-2 rounded-xl bg-[#07090e] border border-slate-800 text-white text-xs outline-hidden focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full pr-10 pl-3 py-2 rounded-xl bg-[#07090e] border border-slate-800 text-white text-xs outline-hidden focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    كلمة المرور
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-[#07090e] border border-slate-800 text-white text-xs outline-hidden focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    رقم الهاتف
                  </label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+20 100..."
                    className="w-full px-3 py-2 rounded-xl bg-[#07090e] border border-slate-800 text-white text-xs outline-hidden focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  المؤسسة / الشركة المنظمة
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regCompany}
                    onChange={(e) => setRegCompany(e.target.value)}
                    placeholder="ANC Expo Advertising / اسم شركتك"
                    className="w-full pr-10 pl-3 py-2 rounded-xl bg-[#07090e] border border-slate-800 text-white text-xs outline-hidden focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  الدور والصلاحيات بالنظام
                </label>
                <select
                  value={regRoleId}
                  onChange={(e) => setRegRoleId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#07090e] border border-slate-800 text-white text-xs outline-hidden focus:border-emerald-500 transition-all"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                      {r.name} - ({r.description})
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Fresh Workspace Checkbox */}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1.5">
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={startFreshWorkspace}
                    onChange={(e) => setStartFreshWorkspace(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                      <Eraser className="w-3.5 h-3.5" />
                      <span>تهيئة المساحة والبدء من الصفر (Start Fresh Workspace)</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      عند التفعيل سيتم مسح البيانات التوضيحية لتبدأ بإدخال معارضك ومورديك الحقيقيين.
                    </div>
                  </div>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>إنشاء الحساب والبدء الآن</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 px-6 py-4 text-center border-t border-slate-800/80 bg-[#0a0d14]/80 text-xs text-slate-500">
        ANC Expo Management Platform © 2026 - جميع الحقوق محفوظة لـ ANC Advertising Agency
      </div>
    </div>
  );
};
