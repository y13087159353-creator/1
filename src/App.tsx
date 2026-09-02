import React from 'react';
import { Header } from './components/Header';
import { DayCard } from './components/DayCard';
import { ElevationProfile } from './components/ElevationProfile';
import { DriverRotationTracker } from './components/DriverRotationTracker';
import { BudgetCalculator } from './components/BudgetCalculator';
import { TibetChecklist } from './components/TibetChecklist';
import { RouteMapVisualizer } from './components/RouteMapVisualizer';
import { PrintRoadbook } from './components/PrintRoadbook';
import { OfflineGuide } from './components/OfflineGuide';
import { ITINERARY_DAYS, PHASES } from './data/itineraryData';
import { 
  Search, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  ChevronRight, 
  ShieldAlert, 
  PhoneCall, 
  Printer, 
  Car, 
  HelpCircle,
  WifiOff
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { subscribeToRoadbookState, updateRoadbookState } from './lib/dataService';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<'itinerary' | 'elevation' | 'drivers' | 'budget' | 'checklist' | 'map'>('itinerary');
  const [isPrintMode, setIsPrintMode] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedPhaseFilter, setSelectedPhaseFilter] = React.useState<number | 'all'>('all');
  const [filterTag, setFilterTag] = React.useState<'all' | 'rest' | 'rush' | 'high-alt'>('all');

  // Track completed days in LocalStorage
  const [completedDays, setCompletedDays] = React.useState<number[]>(() => {
    const saved = localStorage.getItem('tibet_roadbook_completed_days');
    return saved ? JSON.parse(saved) : [];
  });

  // Track user notes per day in LocalStorage
  const [userNotes, setUserNotes] = React.useState<Record<number, string>>(() => {
    const saved = localStorage.getItem('tibet_roadbook_notes');
    return saved ? JSON.parse(saved) : {};
  });

  React.useEffect(() => {
    localStorage.setItem('tibet_roadbook_completed_days', JSON.stringify(completedDays));
  }, [completedDays]);

  React.useEffect(() => {
    localStorage.setItem('tibet_roadbook_notes', JSON.stringify(userNotes));
  }, [userNotes]);

  React.useEffect(() => {
    const unsubscribe = subscribeToRoadbookState((data) => {
      if (data.completedDays) {
        setCompletedDays(data.completedDays);
        localStorage.setItem('tibet_roadbook_completed_days', JSON.stringify(data.completedDays));
      }
      if (data.userNotes) {
        setUserNotes(data.userNotes);
        localStorage.setItem('tibet_roadbook_notes', JSON.stringify(data.userNotes));
      }
    });
    return unsubscribe;
  }, []);

  const handleToggleComplete = (dayNumber: number) => {
    let next: number[];
    if (completedDays.includes(dayNumber)) {
      next = completedDays.filter((d) => d !== dayNumber);
      setCompletedDays(next);
    } else {
      next = [...completedDays, dayNumber];
      setCompletedDays(next);

      // Trigger confetti on milestone days (e.g. Day 13 reached Lhasa, or Day 22 returned to Tongliao!)
      if (dayNumber === 13 || dayNumber === 22 || next.length === 22) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
    updateRoadbookState({ completedDays: next });
  };

  const handleSaveNote = (dayNumber: number, note: string) => {
    setUserNotes((prev) => {
      const next = {
        ...prev,
        [dayNumber]: note,
      };
      updateRoadbookState({ userNotes: next });
      return next;
    });
  };

  // Filter days logic
  const filteredDays = ITINERARY_DAYS.filter((day) => {
    // Phase filter
    if (selectedPhaseFilter !== 'all' && day.phaseId !== selectedPhaseFilter) {
      return false;
    }

    // Tag filter
    if (filterTag === 'rest' && !day.isRestDay) return false;
    if (filterTag === 'rush' && day.distanceKm < 800) return false;
    if (filterTag === 'high-alt' && day.maxAltitude < 4000) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        day.routeTitle.toLowerCase().includes(q) ||
        day.from.toLowerCase().includes(q) ||
        day.to.toLowerCase().includes(q) ||
        day.attractions.toLowerCase().includes(q) ||
        day.scenery.toLowerCase().includes(q) ||
        day.hotelInfo.toLowerCase().includes(q) ||
        day.date.includes(q) ||
        day.lunch.toLowerCase().includes(q) ||
        day.dinner.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const jumpToDay = (dayNum: number) => {
    setActiveTab('itinerary');
    
    // 清除可能导致该天被隐藏的筛选条件
    setSelectedPhaseFilter('all');
    setFilterTag('all');
    setSearchQuery('');

    // 延迟等待 React 渲染完成（切换 Tab 及取消过滤）后再执行滚动
    setTimeout(() => {
      const el = document.getElementById(`day-card-${dayNum}`);
      if (el) {
        // 滚动到该元素
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // 可选：添加一个高亮闪烁效果
        el.classList.add('ring-4', 'ring-blue-500', 'ring-offset-2', 'transition-all', 'duration-500');
        setTimeout(() => {
          el.classList.remove('ring-4', 'ring-blue-500', 'ring-offset-2');
        }, 1500);
      }
    }, 150);
  };

  if (isPrintMode) {
    return <PrintRoadbook onClose={() => setIsPrintMode(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white font-sans">
      {/* App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onPrint={() => setIsPrintMode(true)}
        completedDaysCount={completedDays.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: 22 Days Daily Itinerary */}
        {activeTab === 'itinerary' && (
          <div className="space-y-6">
            {/* Offline Alert Prompt */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start sm:items-center gap-3 shadow-sm">
              <WifiOff className="w-5 h-5 text-blue-600 shrink-0 sm:mt-0 mt-0.5" />
              <div className="text-sm text-blue-800 flex-1">
                <strong className="font-bold">离线访问提示：</strong> 川藏线沿途部分地区无网络信号，强烈建议在有网时将本应用保存至手机桌面，以便无网环境离线查看路书。
              </div>
              <a href="#offline-guide" className="shrink-0 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors shadow-sm">
                查看教程
              </a>
            </div>

            {/* Filter & Quick Navigation Jump Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索城市、景点、美食 (如: 理塘, 72拐, 石锅鸡)..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                    >
                      清空
                    </button>
                  )}
                </div>

                {/* Phase Filter Chips */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setSelectedPhaseFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedPhaseFilter === 'all'
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    全部阶段 (22天)
                  </button>
                  {PHASES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPhaseFilter(p.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                        selectedPhaseFilter === p.id
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      {p.name.split('：')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tag Quick Filters & Day Quick Jump Rail */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 font-medium">筛选特征：</span>
                  <button
                    onClick={() => setFilterTag('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                      filterTag === 'all' ? 'bg-slate-200 text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    全部
                  </button>
                  <button
                    onClick={() => setFilterTag('rest')}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                      filterTag === 'rest' ? 'bg-emerald-100 text-emerald-800 font-bold' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    🟢 休整日 (3天)
                  </button>
                  <button
                    onClick={() => setFilterTag('rush')}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                      filterTag === 'rush' ? 'bg-red-100 text-red-800 font-bold' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    ⚡ 大赶路 (&gt;800km)
                  </button>
                  <button
                    onClick={() => setFilterTag('high-alt')}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                      filterTag === 'high-alt' ? 'bg-blue-100 text-blue-800 font-bold' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    🏔️ 高海拔 (&gt;4000m)
                  </button>
                </div>

                {/* Day Jump Number Rail */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-[11px] text-slate-400 font-mono flex-shrink-0 mr-1">跳转:</span>
                  {ITINERARY_DAYS.map((d) => (
                    <button
                      key={d.dayNumber}
                      onClick={() => jumpToDay(d.dayNumber)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center flex-shrink-0 cursor-pointer ${
                        completedDays.includes(d.dayNumber)
                          ? 'bg-emerald-600 text-white font-extrabold'
                          : 'bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-500'
                      }`}
                      title={`第${d.dayNumber}天: ${d.routeTitle}`}
                    >
                      {d.dayNumber}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Daily Cards List */}
            {filteredDays.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
                <Search className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">未找到符合条件的行程</h3>
                <p className="text-xs text-slate-500 mt-1">请尝试修改搜索词或重置筛选条件</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedPhaseFilter('all');
                    setFilterTag('all');
                  }}
                  className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded text-sm transition-colors"
                >
                  重置筛选条件
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredDays.map((day) => (
                  <DayCard
                    key={day.dayNumber}
                    day={day}
                    isCompleted={completedDays.includes(day.dayNumber)}
                    onToggleComplete={handleToggleComplete}
                    userNote={userNotes[day.dayNumber] || ''}
                    onSaveNote={handleSaveNote}
                  />
                ))}
              </div>
            )}

            {/* Offline Guide Section */}
            <div id="offline-guide" className="scroll-mt-6">
              <OfflineGuide />
            </div>
          </div>
        )}

        {/* TAB 2: Elevation & Hypoxia Safety */}
        {activeTab === 'elevation' && <ElevationProfile onSelectDay={jumpToDay} />}

        {/* TAB 3: Route Map Visualizer */}
        {activeTab === 'map' && <RouteMapVisualizer onSelectDay={jumpToDay} />}

        {/* TAB 4: Driver Rotation & Fatigue Prevention */}
        {activeTab === 'drivers' && <DriverRotationTracker />}

        {/* TAB 5: Budget & Expense Split */}
        {activeTab === 'budget' && <BudgetCalculator />}

        {/* TAB 6: Tibet Checklist & Emergency Kit */}
        {activeTab === 'checklist' && <TibetChecklist />}
      </main>

      {/* Emergency & Safe Return Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-slate-500 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold">
              🚙
            </div>
            <div>
              <div className="text-slate-900 font-bold">通辽 - 川藏318/317 自驾路书</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                9月15日出发 — 10月6日收官 ｜ 1车4人3司机 ｜ 40,000元预算规划
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setIsPrintMode(true)}
              className="hover:text-blue-600 flex items-center gap-1 cursor-pointer font-medium"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>导出 PDF / 打印</span>
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-600 font-semibold">祝全员自驾一路平安，万事顺遂！</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
