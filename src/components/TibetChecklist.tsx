import React from 'react';
import { TIBET_CHECKLIST_INITIAL } from '../data/itineraryData';
import { ChecklistCategory } from '../types';
import { CheckSquare, Square, Plus, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';

export const TibetChecklist: React.FC = () => {
  const [categories, setCategories] = React.useState<ChecklistCategory[]>(() => {
    const saved = localStorage.getItem('tibet_checklist_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return TIBET_CHECKLIST_INITIAL;
      }
    }
    return TIBET_CHECKLIST_INITIAL;
  });

  const [newItemText, setNewItemText] = React.useState('');
  const [targetCategory, setTargetCategory] = React.useState('medical');

  React.useEffect(() => {
    localStorage.setItem('tibet_checklist_state', JSON.stringify(categories));
  }, [categories]);

  const toggleItem = (catId: string, itemId: string) => {
    setCategories(
      categories.map((cat) => {
        if (cat.id !== catId) return cat;
        return {
          ...cat,
          items: cat.items.map((item) => {
            if (item.id !== itemId) return item;
            return { ...item, checked: !item.checked };
          }),
        };
      })
    );
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    setCategories(
      categories.map((cat) => {
        if (cat.id !== targetCategory) return cat;
        return {
          ...cat,
          items: [
            ...cat.items,
            {
              id: `custom-${Date.now()}`,
              label: newItemText.trim(),
              checked: false,
              required: false,
            },
          ],
        };
      })
    );

    setNewItemText('');
  };

  // Calculate totals
  const allItems = categories.flatMap((c) => c.items);
  const totalCount = allItems.length;
  const checkedCount = allItems.filter((i) => i.checked).length;
  const percent = Math.round((checkedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* Progress Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-bold border border-purple-100 mb-2 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>进藏自驾行前装备与物资点验</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              高原准备清单与随车必备品
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
              建议于 <strong className="text-slate-900">9月20日（成都休整日）</strong> 集中补齐全部医用氧气罐、葡萄糖、防滑链等核心物资
            </p>
          </div>

          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-black text-purple-600">
              {checkedCount} / {totalCount}
            </div>
            <div className="text-xs text-slate-500 font-bold tracking-wide">准备进度 {percent}%</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mt-5 border border-slate-200 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-amber-500 transition-all duration-500 rounded-full shadow-sm"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Add Custom Item */}
      <form onSubmit={handleAddItem} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 shadow-sm">
        <select
          value={targetCategory}
          onChange={(e) => setTargetCategory(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 shadow-sm"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="添加自定义清单项 (如：防风打火机、单反三脚架...)"
          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 shadow-sm"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>添加项</span>
        </button>
      </form>

      {/* Checklist Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <span>{cat.name}</span>
              <span className="text-xs text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100 shadow-sm">
                {cat.items.filter((i) => i.checked).length} / {cat.items.length}
              </span>
            </h3>

            <div className="space-y-3">
              {cat.items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleItem(cat.id, item.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 shadow-sm ${
                    item.checked
                      ? 'bg-slate-50 border-slate-200 text-slate-500 opacity-80'
                      : 'bg-white border-slate-200 hover:border-purple-300 hover:bg-slate-50 hover:shadow text-slate-900'
                  }`}
                >
                  <button className="mt-0.5 text-purple-600 flex-shrink-0 transition-transform hover:scale-110">
                    {item.checked ? <CheckSquare className="w-4 h-4 text-purple-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                  </button>

                  <div className="flex-1 text-xs">
                    <div className={`font-bold tracking-wide ${item.checked ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {item.label}
                      {item.required && (
                        <span className="ml-2 text-[10px] bg-red-50 text-red-600 border border-red-100 px-1.5 py-0.5 rounded shadow-sm">
                          必需
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <div className={`text-[11px] mt-1 font-medium ${item.checked ? 'text-slate-400' : 'text-slate-500'}`}>{item.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
