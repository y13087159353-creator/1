import React from "react";
import {
  Coins,
  Plus,
  Trash2,
  PieChart,
  Users,
  DollarSign,
  Wallet,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";
import { INITIAL_EXPENSE_PRESET } from "../data/itineraryData";
import { ExpenseRecord } from "../types";
import {
  subscribeToExpenses,
  addExpense,
  deleteExpense,
} from "../lib/dataService";

export const BudgetCalculator: React.FC = () => {
  const TOTAL_BUDGET = 40000;
  const TOTAL_PEOPLE = 4;

  const [expenses, setExpenses] = React.useState<ExpenseRecord[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = subscribeToExpenses((expenseData) => {
      setExpenses(expenseData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const [newTitle, setNewTitle] = React.useState("");
  const [newAmount, setNewAmount] = React.useState("");
  const [newCategory, setNewCategory] =
    React.useState<ExpenseRecord["category"]>("fuel");
  const [newPayer, setNewPayer] = React.useState("公账");
  const [newNotes, setNewNotes] = React.useState("");

  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remainingBudget = TOTAL_BUDGET - totalSpent;
  const perPersonTotal = totalSpent / TOTAL_PEOPLE;

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAmount || parseFloat(newAmount) <= 0) return;

    try {
      await addExpense({
        dayNumber: 1,
        category: newCategory,
        title: newTitle.trim(),
        amount: parseFloat(newAmount),
        paidBy: newPayer,
        timestamp: new Date().toLocaleDateString(),
        notes: newNotes,
        createdAt: new Date().getTime(),
      });
      setNewTitle("");
      setNewAmount("");
      setNewNotes("");
    } catch (error) {
      console.error("Error adding expense: ", error);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpense(id);
    } catch (error) {
      console.error("Error deleting expense: ", error);
    }
  };

  const getCategoryLabel = (cat: ExpenseRecord["category"]) => {
    switch (cat) {
      case "fuel":
        return {
          label: "⛽ 燃油加油",
          color: "text-amber-400 bg-amber-500/10",
        };
      case "toll":
        return { label: "🛣️ 过路通行", color: "text-sky-400 bg-sky-500/10" };
      case "hotel":
        return {
          label: "🏨 住宿酒店",
          color: "text-purple-400 bg-purple-500/10",
        };
      case "food":
        return {
          label: "🍲 餐饮特色",
          color: "text-emerald-400 bg-emerald-500/10",
        };
      case "ticket":
        return { label: "🎟️ 门票景区", color: "text-rose-400 bg-rose-500/10" };
      case "supplies":
        return { label: "💊 氧气物资", color: "text-teal-400 bg-teal-500/10" };
      default:
        return {
          label: "📦 机动应急",
          color: "text-slate-400 bg-slate-500/10",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-medium">
            <span>总规划预算 (4人)</span>
            <Wallet className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            ¥ {TOTAL_BUDGET.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            人均规划预算 ¥ 10,000
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-medium">
            <span>已登记花费</span>
            <Coins className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            ¥ {totalSpent.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            占预算 {((totalSpent / TOTAL_BUDGET) * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-medium">
            <span>剩余可用预算 / 备用金</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div
            className={`text-2xl font-black ${remainingBudget >= 0 ? "text-emerald-600" : "text-red-600"}`}
          >
            ¥ {remainingBudget.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            资金非常充裕可覆盖应急
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-medium">
            <span>当前人均分摊</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600">
            ¥ {Math.round(perPersonTotal).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            4人均摊 (覆盖油路食宿门票)
          </div>
        </div>
      </div>

      {/* Add New Expense Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-blue-600" />
          <span>快速记一笔新开销</span>
        </h3>

        <form
          onSubmit={handleAddExpense}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3"
        >
          <div className="lg:col-span-2">
            <label className="block text-[11px] text-slate-500 mb-1 font-medium">
              费用名称 / 事项
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="例如：理塘加油、鲁朗石锅鸡、纳木错门票"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-500 mb-1 font-medium">
              金额 (元)
            </label>
            <input
              type="number"
              required
              min="0"
              step="any"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-mono shadow-sm"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-500 mb-1 font-medium">
              类别
            </label>
            <select
              value={newCategory}
              onChange={(e) =>
                setNewCategory(e.target.value as ExpenseRecord["category"])
              }
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm"
            >
              <option value="fuel">⛽ 燃油加油</option>
              <option value="toll">🛣️ 高速过路</option>
              <option value="hotel">🏨 住宿酒店</option>
              <option value="food">🍲 餐饮美食</option>
              <option value="ticket">🎟️ 景区门票</option>
              <option value="supplies">💊 氧气物资</option>
              <option value="other">📦 机动其他</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-500 mb-1 font-medium">
              付款人 / 资金池
            </label>
            <input
              type="text"
              value={newPayer}
              onChange={(e) => setNewPayer(e.target.value)}
              placeholder="公账 / 司机1垫付"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>记入账单</span>
            </button>
          </div>
        </form>
      </div>

      {/* Expense History Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <span>自驾开销明细表</span>
          </h3>
          <span className="text-xs text-slate-500">
            共 {expenses.length} 条记录
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="p-3 font-bold">分类</th>
                <th className="p-3 font-bold">费用名称 / 备注</th>
                <th className="p-3 font-bold">付款方式</th>
                <th className="p-3 font-bold text-right">总金额</th>
                <th className="p-3 font-bold text-right">4人人均</th>
                <th className="p-3 font-bold text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {expenses.map((item) => {
                const cat = getCategoryLabel(item.category);
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${cat.color}`}
                      >
                        {cat.label}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">
                        {item.title}
                      </div>
                      {item.notes && (
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {item.notes}
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-slate-500">{item.paidBy}</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-600">
                      ¥ {item.amount.toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-mono text-slate-600 font-medium">
                      ¥ {Math.round(item.amount / 4).toLocaleString()}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDeleteExpense(item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        title="删除此笔记录"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
