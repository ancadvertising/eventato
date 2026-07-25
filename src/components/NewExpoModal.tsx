import React, { useState } from 'react';
import { X, Building2, MapPin, Calendar, Layers, Plus } from 'lucide-react';
import { ExpoEvent } from '../types';

interface NewExpoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateExpo: (newExpo: ExpoEvent) => void;
}

export const NewExpoModal: React.FC<NewExpoModalProps> = ({
  isOpen,
  onClose,
  onCreateExpo,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [city, setCity] = useState('القاهرة');
  const [location, setLocation] = useState('مركز مصر للمعارض الدولية (EIEC)');
  const [dates, setDates] = useState('15 - 18 نوفمبر 2026');
  const [hallsCount, setHallsCount] = useState(4);
  const [totalBooths, setTotalBooths] = useState(120);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newExpo: ExpoEvent = {
      id: `expo-${Date.now()}`,
      name: name.trim(),
      city,
      location,
      dates,
      hallsCount,
      totalBooths,
      totalExhibitors: 0,
      occupiedBooths: 0,
    };

    onCreateExpo(newExpo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-cairo">
      <div className="bg-[#0d1018] border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl text-right space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-white">إضافة معرض / مؤتمر جديد</h2>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              اسم المعرض / الفعالية *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: معرض القاهرة الدولي للابتكار 2026"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-slate-800 text-white text-xs outline-hidden focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                المدينة
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="القاهرة / دبي / الرياض..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-slate-800 text-white text-xs outline-hidden focus:border-emerald-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                التاريخ والمدة
              </label>
              <input
                type="text"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                placeholder="10 - 15 أكتوبر 2026"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-slate-800 text-white text-xs outline-hidden focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              مكان إقامة المعرض
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="اسم صالة المعارض أو المركز الدولي"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-slate-800 text-white text-xs outline-hidden focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                عدد الصالات / القاعات
              </label>
              <input
                type="number"
                value={hallsCount}
                onChange={(e) => setHallsCount(Number(e.target.value))}
                min={1}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-slate-800 text-white text-xs outline-hidden focus:border-emerald-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                إجمالي عدد الأجنحة المتوقعة
              </label>
              <input
                type="number"
                value={totalBooths}
                onChange={(e) => setTotalBooths(Number(e.target.value))}
                min={1}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-slate-800 text-white text-xs outline-hidden focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة المعرض وتخصيصه كمعرض نشط</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
