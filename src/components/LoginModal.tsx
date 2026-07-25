import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  User, 
  LogIn, 
  Camera, 
  Sparkles, 
  Shield, 
  Plus, 
  Image, 
  CheckCircle2, 
  Mail, 
  Phone 
} from 'lucide-react';
import { StaffMember, SystemRole, ThemeMode } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  currentUser: StaffMember;
  staffMembers: StaffMember[];
  roles: SystemRole[];
  onClose: () => void;
  onSelectUser: (user: StaffMember) => void;
  onUpdateAvatar: (userId: string, newAvatarUrl: string) => void;
  onCreateUser: (newUser: StaffMember) => void;
  theme: ThemeMode;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  currentUser,
  staffMembers,
  roles,
  onClose,
  onSelectUser,
  onUpdateAvatar,
  onCreateUser,
  theme,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'switch' | 'avatar' | 'create'>('switch');
  const [avatarUrlInput, setAvatarUrlInput] = useState(currentUser.avatar);
  const [isAvatarUpdated, setIsAvatarUpdated] = useState(false);

  // New User Form State
  const [newName, setNewName] = useState('');
  const [newRoleTitle, setNewRoleTitle] = useState('مدير مشروع ميداني');
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.id || 'role-admin');
  const [newPhone, setNewPhone] = useState('+20 100 888 9900');
  const [newEmail, setNewEmail] = useState('');
  const [newAvatar, setNewAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150');

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
  ];

  const handleSaveAvatar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!avatarUrlInput) return;

    onUpdateAvatar(currentUser.id, avatarUrlInput);
    setIsAvatarUpdated(true);
    setTimeout(() => {
      setIsAvatarUpdated(false);
      onClose();
    }, 1200);
  };

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const roleObj = roles.find((r) => r.id === selectedRoleId) || roles[0];

    const newUser: StaffMember = {
      id: `usr-${Date.now()}`,
      name: newName,
      role: newRoleTitle || roleObj.name,
      roleId: selectedRoleId,
      team: 'إدارة الصالة',
      avatar: newAvatar,
      phone: newPhone,
      email: newEmail || `${newName.replace(/\s+/g, '.')}@expo.com`,
      activeTasksCount: 0,
      status: 'متاح',
    };

    onCreateUser(newUser);
    onSelectUser(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`w-full max-w-2xl rounded-3xl border p-6 space-y-6 shadow-2xl ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <LogIn className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black font-cairo">صفحة تسجيل الدخول وتبديل المحرر</h3>
              <p className="text-xs text-slate-400">اختر حسابك المعتمد لنسب التعديلات وقرارات الاعتماد لاسِمك</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-white cursor-pointer bg-slate-800/50">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs font-bold">
          <button
            onClick={() => setActiveTab('switch')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'switch'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>تسجيل الدخول / تبديل الحساب</span>
          </button>

          <button
            onClick={() => setActiveTab('avatar')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'avatar'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>تعديل صورتي الشخصية (Avatar)</span>
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'create'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مستخدم جديد</span>
          </button>
        </div>

        {/* Tab 1: Login Account Switcher */}
        {activeTab === 'switch' && (
          <div className="space-y-4">
            <div className="text-xs font-bold text-slate-400 flex items-center justify-between">
              <span>اختر الحساب النشط الحالي (اسم المحرر النشط):</span>
              <span className="text-indigo-400 font-mono">الحسابات المعتمدة ({staffMembers.length})</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto p-1">
              {staffMembers.map((user) => {
                const isSelected = user.id === currentUser.id;
                const roleObj = roles.find((r) => r.id === user.roleId);

                return (
                  <div
                    key={user.id}
                    onClick={() => {
                      onSelectUser(user);
                      onClose();
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 relative ${
                      isSelected
                        ? 'bg-indigo-950/80 border-indigo-500 text-white ring-2 ring-indigo-500/30 shadow-lg'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-200 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/50 shrink-0"
                    />

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="font-bold text-xs truncate flex items-center justify-between">
                        <span>{user.name}</span>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                            نشط الآن
                          </span>
                        )}
                      </div>

                      <div className="text-[10px] text-slate-400 truncate">{user.role}</div>

                      {roleObj && (
                        <span className={`inline-block px-2 py-0.2 rounded text-[9px] font-bold border ${roleObj.color}`}>
                          {roleObj.name.split('(')[0]}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Edit Profile Avatar Photo */}
        {activeTab === 'avatar' && (
          <form onSubmit={handleSaveAvatar} className="space-y-5 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center gap-5">
              <div className="relative group">
                <img
                  src={avatarUrlInput}
                  alt={currentUser.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500/50 shadow-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150';
                  }}
                />
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="space-y-1.5 text-center sm:text-right">
                <h4 className="text-sm font-black text-slate-100 font-cairo">{currentUser.name}</h4>
                <p className="text-[11px] text-slate-400">{currentUser.role}</p>
                <p className="text-[10px] text-indigo-400 font-bold">
                  سيتم تطبيق الصورة الشخصية الجديدة عبر جميع الوظائف وسجلات التحرير.
                </p>
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1.5 text-slate-300">رابط صورة شخصية مباشرة (Image URL):</label>
              <input
                type="url"
                required
                placeholder="https://..."
                value={avatarUrlInput}
                onChange={(e) => setAvatarUrlInput(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-bold mb-2 text-slate-300">أو اختر من معرض الصور المعتمدة جاهزة:</label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {presetAvatars.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrlInput(url)}
                    className={`rounded-full overflow-hidden border-2 transition-all p-0.5 cursor-pointer ${
                      avatarUrlInput === url ? 'border-indigo-500 scale-110 ring-2 ring-indigo-500/50' : 'border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <img src={url} alt="preset" className="w-10 h-10 rounded-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {isAvatarUpdated && (
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>تم حفظ وتغيير صورتك الشخصية بنجاح!</span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black cursor-pointer shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
              >
                <Camera className="w-4 h-4" />
                <span>حفظ صورة البروفايل</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Create Brand New User */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreateUserSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1 text-slate-300">الاسم الكامل:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: م. خالد عبد الرحمن..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-300">الدور بالنظام (Role):</label>
                <select
                  value={selectedRoleId}
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-bold"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1 text-slate-300">رقم الجوال:</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-300">البريد الإلكتروني:</label>
                <input
                  type="email"
                  placeholder="name@expo.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1 text-slate-300">رابط صورة البروفايل:</label>
              <input
                type="url"
                value={newAvatar}
                onChange={(e) => setNewAvatar(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono"
              />
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black cursor-pointer shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>إنشاء الحساب وتسجيل الدخول فوراً</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
