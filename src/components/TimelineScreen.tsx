import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  PlayCircle, 
  AlertCircle, 
  Edit3, 
  Users, 
  Sparkles,
  Tag,
  History,
  X
} from 'lucide-react';
import { 
  EventSession, 
  EventSessionCategory, 
  EventSessionStatus, 
  ThemeMode, 
  StaffMember 
} from '../types';

interface TimelineScreenProps {
  sessions: EventSession[];
  currentUser: StaffMember;
  searchTerm: string;
  onAddSession: (session: EventSession) => void;
  onUpdateSessionStatus: (sessionId: string, newStatus: EventSessionStatus) => void;
  theme: ThemeMode;
}

export const TimelineScreen: React.FC<TimelineScreenProps> = ({
  sessions,
  currentUser,
  searchTerm,
  onAddSession,
  onUpdateSessionStatus,
  theme,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('الكل');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for New Session Modal
  const [title, setTitle] = useState('');
  const [speakerName, setSpeakerName] = useState('');
  const [speakerTitle, setSpeakerTitle] = useState('');
  const [day, setDay] = useState('اليوم الأول (15 أكتوبر)');
  const [timeStart, setTimeStart] = useState('10:00');
  const [timeEnd, setTimeEnd] = useState('11:30');
  const [hallLocation, setHallLocation] = useState('القاعة الكبرى A - صالة 1');
  const [category, setCategory] = useState<EventSessionCategory>('جلسة رئيسية');
  const [description, setDescription] = useState('');

  const daysList = ['الكل', 'اليوم الأول (15 أكتوبر)', 'اليوم الثاني (16 أكتوبر)', 'اليوم الثالث (17 أكتوبر)'];
  const categoriesList: EventSessionCategory[] = [
    'جلسة رئيسية',
    'حفل الافتتاح',
    'ورشة عمل',
    'حلقة نقاش',
    'عرض تقني',
    'شبكات أعمال',
  ];

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.speakerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.hallLocation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDay = selectedDay === 'الكل' || session.day === selectedDay;
    const matchesCategory = selectedCategory === 'الكل' || session.category === selectedCategory;

    return matchesSearch && matchesDay && matchesCategory;
  });

  const handleSubmitNewSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !speakerName) return;

    const newSession: EventSession = {
      id: `ses-${Date.now()}`,
      sessionCode: `SES-${Math.floor(100 + Math.random() * 900)}`,
      title,
      speakerName,
      speakerTitle: speakerTitle || 'متحدث رئيسي',
      speakerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      day,
      timeStart,
      timeEnd,
      hallLocation,
      category,
      status: 'قادمة',
      attendeesCount: 150,
      description: description || 'تفاصيل ورشة العمل والبرنامج الزمني المقرر.',
      editorName: currentUser.name,
      lastEditedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    onAddSession(newSession);
    setIsAddModalOpen(false);
    setTitle('');
    setSpeakerName('');
    setSpeakerTitle('');
    setDescription('');
  };

  const getStatusBadge = (status: EventSessionStatus) => {
    switch (status) {
      case 'جارية الآن':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse flex items-center gap-1">
            <PlayCircle className="w-3.5 h-3.5" />
            جارية الآن (Live)
          </span>
        );
      case 'مكتملة':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            مكتملة
          </span>
        );
      case 'تأجيل':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            مؤجلة
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            قادمة
          </span>
        );
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className={`p-6 rounded-3xl border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        theme === 'dark' 
          ? 'bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-indigo-900/50 text-slate-100' 
          : 'bg-gradient-to-r from-indigo-50 via-white to-indigo-50/50 border-indigo-100 text-slate-900'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
            <Sparkles className="w-4 h-4" />
            <span>جدول الفعاليات والمؤتمرات الرسمي (Event Master Program)</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black font-cairo">
            برنامج الحدث والفعاليات الزمنية
          </h2>
          <p className="text-xs text-slate-400">
            متابعة ومزامنة الجلسات، المتحدثين الرئيسيّين، والقاعات الميدانية لحظة بلحظة مع توثيق المحرر المسؤول.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs cursor-pointer shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة فعالية / جلسة جديدة</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 ${
        theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        {/* Days Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            اليوم:
          </span>
          {daysList.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedDay === d
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : theme === 'dark'
                  ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            نوع الجلسة:
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`p-2 rounded-xl text-xs font-bold border cursor-pointer ${
              theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-800'
            }`}
          >
            <option value="الكل">جميع الأنواع</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline Sessions List */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-bold text-sm bg-slate-900/40 rounded-2xl border border-slate-800">
            لا توجد جلسات مطابقة لمعايير البحث الحالية.
          </div>
        ) : (
          filteredSessions.map((session) => (
            <div
              key={session.id}
              className={`p-5 rounded-2xl border transition-all hover:border-indigo-500/50 space-y-4 shadow-lg ${
                theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-xl font-mono text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    {session.sessionCode}
                  </span>
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    {session.day}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {session.timeStart} - {session.timeEnd}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(session.status)}

                  {/* Status Toggle Buttons */}
                  <select
                    value={session.status}
                    onChange={(e) => onUpdateSessionStatus(session.id, e.target.value as EventSessionStatus)}
                    className="p-1.5 rounded-lg text-[10px] font-bold bg-slate-950 border border-slate-700 text-slate-200 cursor-pointer"
                  >
                    <option value="قادمة">تغيير لـ: قادمة</option>
                    <option value="جارية الآن">تغيير لـ: جارية الآن</option>
                    <option value="مكتملة">تغيير لـ: مكتملة</option>
                    <option value="تأجيل">تغيير لـ: مؤجلة</option>
                  </select>
                </div>
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                <div className="lg:col-span-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold text-[10px]">
                      {session.category}
                    </span>
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      {session.hallLocation}
                    </span>
                  </div>

                  <h3 className="text-base font-black font-cairo text-indigo-300">
                    {session.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {session.description}
                  </p>
                </div>

                {/* Speaker & Editor Info */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={session.speakerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                      alt={session.speakerName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/50"
                    />
                    <div>
                      <div className="font-bold text-xs text-slate-100">{session.speakerName}</div>
                      <div className="text-[10px] text-slate-400">{session.speakerTitle}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Users className="w-3 h-3 text-emerald-400" />
                      الحضور المتوقع: <strong className="text-white font-mono">{session.attendeesCount}</strong>
                    </span>

                    {session.editorName && (
                      <span className="text-[9px] text-indigo-300/80 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40 flex items-center gap-1">
                        <History className="w-2.5 h-2.5" />
                        المحرر: {session.editorName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Session Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className={`w-full max-w-lg rounded-2xl border p-6 space-y-5 shadow-2xl ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black font-cairo flex items-center gap-2 text-indigo-400">
                <Plus className="w-5 h-5 text-indigo-500" />
                إضافة جلسة أو فعالية جديدة للحدث
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewSession} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1 text-slate-300">عنوان الجلسة / الفعالية:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: ورشة عمل الذكاء الاصطناعي والمستقبل..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-300">اسم المتحدث الرئيس:</label>
                  <input
                    type="text"
                    required
                    placeholder="د. أحمد علي..."
                    value={speakerName}
                    onChange={(e) => setSpeakerName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-300">المسمى الوظيفي / الجهة:</label>
                  <input
                    type="text"
                    placeholder="مستشار التكنولوجيا..."
                    value={speakerTitle}
                    onChange={(e) => setSpeakerTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-300">اليوم المحدد:</label>
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-bold"
                  >
                    <option value="اليوم الأول (15 أكتوبر)">اليوم الأول (15 أكتوبر)</option>
                    <option value="اليوم الثاني (16 أكتوبر)">اليوم الثاني (16 أكتوبر)</option>
                    <option value="اليوم الثالث (17 أكتوبر)">اليوم الثالث (17 أكتوبر)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-300">تصنيف الفعالية:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EventSessionCategory)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-bold"
                  >
                    {categoriesList.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold mb-1 text-slate-300">وقت البدء:</label>
                  <input
                    type="time"
                    value={timeStart}
                    onChange={(e) => setTimeStart(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-amber-400 font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-300">وقت الانتهاء:</label>
                  <input
                    type="time"
                    value={timeEnd}
                    onChange={(e) => setTimeEnd(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-amber-400 font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-300">القاعة / الموقع:</label>
                  <input
                    type="text"
                    value={hallLocation}
                    onChange={(e) => setHallLocation(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-300">وصف وأجندة الفعالية:</label>
                <textarea
                  rows={2}
                  placeholder="شرح النقاط الرئيسية للجلسة والمحاور..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200"
                />
              </div>

              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-[11px] text-indigo-300 flex items-center justify-between">
                <span>المحرر الحالي المسجل:</span>
                <strong className="font-bold text-white">{currentUser.name}</strong>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black cursor-pointer shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>حفظ وإدراج للبرنامج الزمني</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
