import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Send, 
  Filter, 
  Kanban, 
  List, 
  BarChart3, 
  ShieldAlert, 
  UserPlus, 
  ArrowLeft,
  ArrowRight,
  Flame
} from 'lucide-react';
import { TaskCardType, TaskColumnStatus, TeamCategory, StaffMember, ThemeMode } from '../types';

interface WorkforceTaskCenterProps {
  tasks: TaskCardType[];
  staffMembers: StaffMember[];
  searchTerm: string;
  onOpenNewTaskModal: () => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskColumnStatus) => void;
  onDispatchMobileAlert: (staffName: string, phone: string, taskTitle: string) => void;
  theme: ThemeMode;
}

export const WorkforceTaskCenter: React.FC<WorkforceTaskCenterProps> = ({
  tasks,
  staffMembers,
  searchTerm,
  onOpenNewTaskModal,
  onUpdateTaskStatus,
  onDispatchMobileAlert,
  theme,
}) => {
  const [selectedTeam, setSelectedTeam] = useState<string>('الكل');
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'gantt'>('kanban');

  const teams: (TeamCategory | 'الكل')[] = [
    'الكل',
    'إدارة الصالة',
    'الدعم الفني',
    'الحسابات',
    'الأمن والسلامة',
    'النظافة والديكور'
  ];

  const columns: { id: TaskColumnStatus; label: string; color: string; border: string }[] = [
    { id: 'قيد الانتظار', label: 'قيد الانتظار', color: 'bg-slate-800/80 text-slate-300', border: 'border-slate-700' },
    { id: 'جاري التنفيذ', label: 'جاري التنفيذ', color: 'bg-blue-500/20 text-blue-400', border: 'border-blue-500/40' },
    { id: 'بانتظار الاعتماد', label: 'بانتظار الاعتماد', color: 'bg-amber-500/20 text-amber-400', border: 'border-amber-500/40' },
    { id: 'مكتملة', label: 'مكتملة', color: 'bg-emerald-500/20 text-emerald-400', border: 'border-emerald-500/40' },
  ];

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesTeam = selectedTeam === 'الكل' || t.team === selectedTeam;
    const matchesSearch = 
      t.title.includes(searchTerm) ||
      t.taskCode.includes(searchTerm) ||
      t.locationHall.includes(searchTerm) ||
      t.assignedStaff.name.includes(searchTerm);
    return matchesTeam && matchesSearch;
  });

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header Bar: Filter by Team & View Switcher */}
      <div className={`p-4 rounded-2xl border flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 ${
        theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-600/10 text-rose-500 border border-rose-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black font-cairo text-slate-100">
              مركز إدارة وتوزيع المهام وفريق العمل (Workforce & Task Center)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              متابعة مؤشرات الأداء SLA وإرسال التنبيهات المباشرة لجوالات المشرفين والفنيين
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 justify-end">
          {/* Team Filter Dropdown */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none max-w-md">
            {teams.map((team) => (
              <button
                key={team}
                onClick={() => setSelectedTeam(team)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedTeam === team
                    ? 'bg-blue-600 text-white'
                    : theme === 'dark' ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {team}
              </button>
            ))}
          </div>

          {/* View Switcher Toggle */}
          <div className={`p-1 rounded-xl border flex items-center gap-1 text-xs ${
            theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'
          }`}>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-lg font-bold flex items-center gap-1 cursor-pointer ${
                viewMode === 'kanban' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="عرض كانبان Kanban"
            >
              <Kanban className="w-4 h-4" />
              <span className="hidden sm:inline">كانبان</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg font-bold flex items-center gap-1 cursor-pointer ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="عرض القائمة List"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">قائمة</span>
            </button>

            <button
              onClick={() => setViewMode('gantt')}
              className={`p-2 rounded-lg font-bold flex items-center gap-1 cursor-pointer ${
                viewMode === 'gantt' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="عرض مخطط جانت Gantt"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">جانت</span>
            </button>
          </div>

          {/* + Create Task Modal Trigger */}
          <button
            onClick={onOpenNewTaskModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ تعيين مهمة جديدة</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: Kanban Board */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {columns.map((col) => {
            const columnTasks = filteredTasks.filter((t) => t.status === col.id);

            return (
              <div
                key={col.id}
                className={`rounded-2xl border p-4 space-y-4 min-h-[500px] flex flex-col justify-between ${
                  theme === 'dark' ? 'bg-slate-900/80 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                }`}
              >
                {/* Column Header */}
                <div>
                  <div className={`p-3 rounded-xl border flex items-center justify-between font-bold text-xs ${col.color} ${col.border}`}>
                    <span>{col.label}</span>
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[10px] flex items-center justify-center">
                      {columnTasks.length}
                    </span>
                  </div>

                  {/* Task Cards Stack */}
                  <div className="space-y-3 mt-3">
                    {columnTasks.map((task) => {
                      const isHighPriority = task.priority === 'عالية';
                      const isUrgentSla = task.slaRemainingMinutes > 0 && task.slaRemainingMinutes <= 30;

                      return (
                        <div
                          key={task.id}
                          className={`p-4 rounded-xl border space-y-3 transition-all relative ${
                            theme === 'dark'
                              ? 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
                              : 'bg-white border-slate-200 shadow-xs hover:shadow-md'
                          }`}
                        >
                          {/* Task Header & Code */}
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold border border-slate-700">
                              {task.taskCode}
                            </span>

                            {/* Priority Badge */}
                            {task.priority === 'عالية' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                                <Flame className="w-3 h-3 text-rose-400" />
                                أولوية قصوى
                              </span>
                            )}
                            {task.priority === 'متوسطة' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                متوسطة
                              </span>
                            )}
                            {task.priority === 'منخفضة' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                منخفضة
                              </span>
                            )}
                          </div>

                          {/* Title & Description */}
                          <div>
                            <h4 className="font-extrabold text-xs text-slate-100 leading-snug">
                              {task.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          </div>

                          {/* Hall Location Tag */}
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            <span className="truncate">{task.locationHall}</span>
                          </div>

                          {/* Assigned Staff Photo & SLA Timer */}
                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <img
                                src={task.assignedStaff.avatar}
                                alt={task.assignedStaff.name}
                                className="w-7 h-7 rounded-full object-cover border border-blue-500/40"
                              />
                              <div className="text-[10px] text-right">
                                <div className="font-bold text-slate-200 line-clamp-1">{task.assignedStaff.name}</div>
                                <div className="text-slate-400">{task.assignedStaff.team}</div>
                              </div>
                            </div>

                            {/* SLA Countdown Timer */}
                            <div className="text-left">
                              {task.slaRemainingMinutes > 0 ? (
                                <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border ${
                                  isUrgentSla 
                                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' 
                                    : 'bg-slate-900 text-amber-400 border-slate-800'
                                }`}>
                                  <Clock className="w-3 h-3" />
                                  <span>SLA: {task.slaRemainingMinutes} د</span>
                                </div>
                              ) : (
                                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  مكتملة
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Controls: Move Task Status & Dispatch Mobile Alert */}
                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                            <button
                              onClick={() => onDispatchMobileAlert(task.assignedStaff.name, task.assignedStaff.phone, task.title)}
                              className="px-2 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 text-[10px] font-bold border border-blue-500/30 flex items-center gap-1 cursor-pointer"
                              title="إرسال تنبيه مباشر لجوال الموظف"
                            >
                              <Send className="w-3 h-3 text-blue-400" />
                              <span>تنبيه الجوال</span>
                            </button>

                            {/* Shift Column Status Buttons */}
                            <div className="flex items-center gap-1">
                              {task.status !== 'قيد الانتظار' && (
                                <button
                                  onClick={() => {
                                    const prevIdx = columns.findIndex(c => c.id === task.status) - 1;
                                    if (prevIdx >= 0) onUpdateTaskStatus(task.id, columns[prevIdx].id);
                                  }}
                                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] cursor-pointer"
                                  title="إعادة للمرحلة السابقة"
                                >
                                  ←
                                </button>
                              )}

                              {task.status !== 'مكتملة' && (
                                <button
                                  onClick={() => {
                                    const nextIdx = columns.findIndex(c => c.id === task.status) + 1;
                                    if (nextIdx < columns.length) onUpdateTaskStatus(task.id, columns[nextIdx].id);
                                  }}
                                  className="p-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] cursor-pointer font-bold"
                                  title="نقل للمرحلة التالية"
                                >
                                  →
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: List View */}
      {viewMode === 'list' && (
        <div className={`p-4 rounded-2xl border overflow-x-auto ${
          theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <table className="w-full text-right text-xs">
            <thead>
              <tr className={`border-b text-slate-400 font-bold ${
                theme === 'dark' ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'
              }`}>
                <th className="p-3">رمز المهمة</th>
                <th className="p-3">عنوان المهمة</th>
                <th className="p-3">الموقع / الصالة</th>
                <th className="p-3">الموظف المسؤول</th>
                <th className="p-3">الأولوية</th>
                <th className="p-3">عداد SLA</th>
                <th className="p-3 text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTasks.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-blue-400">{t.taskCode}</td>
                  <td className="p-3 font-bold text-slate-100">{t.title}</td>
                  <td className="p-3 text-slate-300">{t.locationHall}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <img src={t.assignedStaff.avatar} alt="" className="w-6 h-6 rounded-full" />
                      <span className="font-bold text-slate-200">{t.assignedStaff.name}</span>
                    </div>
                  </td>
                  <td className="p-3 font-bold">{t.priority}</td>
                  <td className="p-3 text-amber-400 font-mono font-bold">{t.slaRemainingMinutes} دقيقة</td>
                  <td className="p-3 text-center">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW 3: Gantt Chart View */}
      {viewMode === 'gantt' && (
        <div className={`p-5 rounded-2xl border space-y-4 ${
          theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            مخطط جانت الزمني للمهام والتشغيل الميداني (Gantt Schedule)
          </h3>

          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div key={task.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{task.title} ({task.assignedStaff.name})</span>
                  <span className="text-[10px] text-amber-400 font-bold">متبقي {task.slaRemainingMinutes} دقيقة</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-3 border border-slate-800 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full" 
                    style={{ width: `${Math.min(100, Math.max(15, (task.slaRemainingMinutes / 120) * 100))}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
