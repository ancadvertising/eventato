import React, { useState } from 'react';
import { X, Plus, DollarSign, FileText, Send, Building2, Tag, Calendar, ListPlus, Trash2 } from 'lucide-react';
import { VendorCategory, RFQRequest, ThemeMode, CostItem, StaffMember } from '../types';

interface NewRFQModalProps {
  isOpen: boolean;
  categories: VendorCategory[];
  currentUser: StaffMember;
  onClose: () => void;
  onCreateRFQ: (newRfq: RFQRequest) => void;
  onAddCategory: (newCategory: string) => void;
  theme: ThemeMode;
}

export const NewRFQModal: React.FC<NewRFQModalProps> = ({
  isOpen,
  categories,
  currentUser,
  onClose,
  onCreateRFQ,
  onAddCategory,
  theme,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<VendorCategory>(categories[0] || 'ديكور وأجنحة');
  const [isAddingCustomCategory, setIsAddingCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  const [budget, setBudget] = useState<number>(180000);
  const [specifications, setSpecifications] = useState('');
  const [deliveryDeadline, setDeliveryDeadline] = useState('2026-10-10');

  // Rich Items specifications
  const [items, setItems] = useState<CostItem[]>([
    { description: 'تجهيز وتثبيت البند الرئيسي', quantity: 1, unitPrice: 120000, total: 120000 },
    { description: 'تكاليف الشحن والفك والتركيب بالصالة', quantity: 1, unitPrice: 30000, total: 30000 },
  ]);

  const [vendor1, setVendor1] = useState('شركة الأمل للتجهيزات');
  const [offer1Val, setOffer1Val] = useState<number>(150000);

  const handleAddNewCategory = () => {
    if (!customCategoryInput.trim()) return;
    onAddCategory(customCategoryInput.trim());
    setCategory(customCategoryInput.trim());
    setCustomCategoryInput('');
    setIsAddingCustomCategory(false);
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { description: 'بند إضافي جديد', quantity: 1, unitPrice: 10000, total: 10000 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof CostItem, value: any) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updated.total = Number(updated.quantity) * Number(updated.unitPrice);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const itemsTotal = items.reduce((sum, item) => sum + item.total, 0);

    const newRfq: RFQRequest = {
      id: `rfq-${Date.now()}`,
      rfqNumber: `RFQ-2026-${Math.floor(100 + Math.random() * 900)}`,
      title,
      category,
      createdDate: new Date().toISOString().split('T')[0],
      budgetAllocated: budget,
      specifications: specifications || 'التوريد والتنفيذ حسب المواصفات الفنية للجنة المعرض.',
      deliveryDeadline,
      items,
      editorName: currentUser.name,
      offersCount: 1,
      offers: [
        {
          id: `off-${Date.now()}-1`,
          vendorName: vendor1,
          vendorRating: 4.7,
          vendorPhone: '+20 100 000 1122',
          category,
          offerValue: offer1Val || itemsTotal || budget,
          submittedDate: new Date().toISOString().split('T')[0],
          status: 'بانتظار المراجعة',
          deliveryDays: 5,
          warrantyPeriod: 'ضمان طوال المعرض',
          notes: 'عرض مبدئي مقدم مع كراسة الشروط التفصيلية.',
          items: items.length > 0 ? items : [{ description: title, quantity: 1, unitPrice: budget, total: budget }],
          editorName: currentUser.name,
        },
      ],
    };

    onCreateRFQ(newRfq);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className={`w-full max-w-2xl rounded-2xl border p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-black font-cairo flex items-center gap-2 text-blue-400">
            <Plus className="w-5 h-5 text-blue-500" />
            إنشاء طلب عروض أسعار تفصيلي جديد (New RFQ Request)
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold mb-1 text-slate-300">عنوان الطلب / التوريد:</label>
            <input
              type="text"
              required
              placeholder="مثال: توريد شاشات LED لمسرح الافتتاح وسماعات الصوت..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-bold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-300">فئة التوريد (Category):</label>
                <button
                  type="button"
                  onClick={() => setIsAddingCustomCategory(!isAddingCustomCategory)}
                  className="text-[10px] font-bold text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Tag className="w-3 h-3" />
                  + إضافة فئة جديدة
                </button>
              </div>

              {isAddingCustomCategory ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="اسم الفئة الجديدة..."
                    value={customCategoryInput}
                    onChange={(e) => setCustomCategoryInput(e.target.value)}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-bold flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewCategory}
                    className="px-3 py-2 rounded-xl bg-blue-600 text-white font-bold cursor-pointer"
                  >
                    حفظ
                  </button>
                </div>
              ) : (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-bold"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block font-bold mb-1 text-slate-300">الميزانية التقديرية (ج.م):</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-blue-300 font-bold font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1 text-slate-300">تاريخ التسليم المطلوب الميداني:</label>
              <input
                type="date"
                value={deliveryDeadline}
                onChange={(e) => setDeliveryDeadline(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 text-slate-300">اسم المورد صاحب العرض المبدئي:</label>
              <input
                type="text"
                value={vendor1}
                onChange={(e) => setVendor1(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1 text-slate-300">الشروط والمواصفات الفنية التفصيلية:</label>
            <textarea
              rows={2}
              placeholder="كراسة الشروط، المعايير القياسية، الضمان، وفترة الفحص..."
              value={specifications}
              onChange={(e) => setSpecifications(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200"
            />
          </div>

          {/* Dynamic Line-Items Specs Table */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-400 text-[11px] flex items-center gap-1">
                <ListPlus className="w-4 h-4" />
                جدول البنود والكميات المطلوبة (RFQ Line Items):
              </span>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold text-[10px] hover:bg-blue-600/30 cursor-pointer"
              >
                + إضافة بند جديد
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-900 p-2 rounded-xl border border-slate-800">
                  <input
                    type="text"
                    placeholder="وصف البند"
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    className="col-span-6 p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs"
                  />
                  <input
                    type="number"
                    placeholder="الكمية"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                    className="col-span-2 p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs text-center font-mono"
                  />
                  <input
                    type="number"
                    placeholder="سعر الوحدة"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(idx, 'unitPrice', Number(e.target.value))}
                    className="col-span-3 p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="col-span-1 p-2 text-rose-400 hover:text-rose-300 cursor-pointer flex justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 text-[11px] text-blue-300 flex items-center justify-between">
            <span>المحرر المسجل لطلب المناقصة:</span>
            <strong className="font-bold text-white">{currentUser.name}</strong>
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
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black cursor-pointer shadow-md shadow-blue-600/30 flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>إرسال وتعميم طلب RFQ والمواصفات</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
