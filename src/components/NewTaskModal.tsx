import React, { useState } from 'react';
import { X, Plus, Users, Send, Clock, Flame, MapPin } from 'lucide-react';
import { StaffMember, TeamCategory, TaskPriority, TaskCardType, ThemeMode } from '../types';

interface NewTaskModalProps {
  isOpen: boolean;
  staffMembers: StaffMember[];
  onClose: () => void;
  onCreateTask: (newTask: TaskCardType) => void;
  theme: ThemeMode;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  staffMembers,
  onClose,
  onCreateTask,
  theme,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [team, setTeam] = useState<TeamCategory>('إدارة الصالة');
  const [priority, setPriority] = useState<TaskPriority>('عالية');
  const [assignedStaffId, setAssignedStaffId] = useState<string>(staffMembers[0]?.id || '');
  const [locationHall, setLocationHall] = useState('صالة 1 - جناح B102');
  const [slaMinutes, setSlaMinutes] = useState<number>(60);

  const teams: TeamCategory[] = [
    'إدارة الصالة',
    'الدعم الفني',
    'الحسابات',
    'الأمن والسلامة',
    'النظافة والديكور'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const staff = staffMembers.find((s) => s.id === assignedStaffId) || staffMembers[0];

    const newTask: TaskCardType = {
      id: `tsk-${Date.now()}`,
      taskCode: `TSK-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      description,
      assignedStaff: staff,
      priority,
      status: 'قيد الانتظار',
      slaRemainingMinutes: slaMinutes,
      locationHall,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      team,
    };

    onCreateTask(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className={`w-full max-w-lg rounded-2xl border p-6 space-y-5 shadow-2xl ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-black font-cairo flex items-center gap-2 text-rose-400">
            <Plus className="w-5 h-5 text-rose-500" />
            تعيين مهمة جديدة لموظف (Assign New Task)
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold mb-1 text-slate-300">عنوان المهمة الميدانية:</label>
            <input
              type="text"
              required
              placeholder="مثال: توصيل تغذية كهربائية 380V - جناح B102..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-bold"
            />
          </div>

          <div>
            <label className="block font-bold mb-1 text-slate-300">تفاصيل وتوجيهات المهمة:</label>
            <textarea
              rows={2}
              required
              placeholder="شرح الخطوات المطلوبة والتأكد من السلامة..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1 text-slate-300">الفريق المسؤول:</label>
              <select
                value={team}
                onChange={(e) => setTeam(e.target.value as TeamCategory)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-bold"
              >
                {teams.map((tm) => (
                  <option key={tm} value={tm}>{tm}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold mb-1 text-slate-300">الموقع / الصالة / الجناح:</label>
              <input
                type="text"
                required
                value={locationHall}
                onChange={(e) => setLocationHall(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1 text-slate-300">الأولوية:</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-bold"
              >
                <option value="عالية">عالية (High)</option>
                <option value="متوسطة">متوسطة (Medium)</option>
                <option value="منخفضة">منخفضة (Low)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-1 text-slate-300">مهلة الإنجاز SLA (بالدقائق):</label>
              <input
                type="number"
                value={slaMinutes}
                onChange={(e) => setSlaMinutes(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-amber-400 font-bold font-mono"
              />
            </div>
          </div>

          {/* Manual Staff Selector with Workload Indicators */}
          <div>
            <label className="block font-bold mb-1 text-slate-300 flex items-center justify-between">
              <span>اختيار الموظف المسؤول (حسب عبء العمل الحالي):</span>
            </label>

            <select
              value={assignedStaffId}
              onChange={(e) => setAssignedStaffId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-bold"
            >
              {staffMembers.map((s) => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                  {s.name} ({s.team}) — {s.activeTasksCount} مهام نشطة [{s.status}]
                </option>
              ))}
            </select>
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
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black cursor-pointer shadow-md shadow-rose-600/30 flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>تعيين وإرسال تنبيه مباشر لجوال الموظف</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
