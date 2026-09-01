import React from 'react';
import { ITINERARY_DAYS } from '../data/itineraryData';
import { Car, Clock, ShieldAlert, Users, Play, Pause, RotateCcw, AlertTriangle, CheckCircle2, Phone, Edit2 } from 'lucide-react';
import { subscribeToDriverTracker, updateDriverTracker } from '../lib/dataService';


export const DriverRotationTracker: React.FC = () => {
  // 3 Drivers state
  const [drivers, setDrivers] = React.useState([
    { id: '1', name: '司机 1 (主驾/老司机)', phone: '138****1111', role: '山路与险路主力' },
    { id: '2', name: '司机 2 (副驾/轮换)', phone: '139****2222', role: '高速巡航与导航看路' },
    { id: '3', name: '司机 3 (轮换/机动)', phone: '137****3333', role: '平原赶路与休息替补' },
  ]);

  const [currentActiveDriverIndex, setCurrentActiveDriverIndex] = React.useState(0);

  React.useEffect(() => {
    const unsub = subscribeToDriverTracker((data) => {
      if (data.drivers) setDrivers(data.drivers);
      if (data.currentActiveDriverIndex !== undefined) setCurrentActiveDriverIndex(data.currentActiveDriverIndex);
    });
    return () => unsub();
  }, []);

  const updateSharedState = async (newDrivers: any[], newIndex: number) => {
    try {
      await updateDriverTracker({ drivers: newDrivers, currentActiveDriverIndex: newIndex });
    } catch (e) {
      console.error("Error updating driver state:", e);
    }
  };

  const [editingDriverId, setEditingDriverId] = React.useState<string | null>(null);
  const [tempName, setTempName] = React.useState('');

  // 3-hour shift timer state (3 hours = 10800 seconds)
  const SHIFT_DURATION = 3 * 60 * 60;
  const [timeLeft, setTimeLeft] = React.useState(SHIFT_DURATION);
  const [isTimerRunning, setIsTimerRunning] = React.useState(false);

  React.useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextDriver = () => {
    const nextIndex = (currentActiveDriverIndex + 1) % 3;
    setCurrentActiveDriverIndex(nextIndex);
    updateSharedState(drivers, nextIndex);
    setTimeLeft(SHIFT_DURATION);
    setIsTimerRunning(true);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(SHIFT_DURATION);
  };

  const handleSaveDriverName = (id: string) => {
    if (tempName.trim()) {
      const updatedDrivers = drivers.map(d => d.id === id ? { ...d, name: tempName.trim() } : d);
      setDrivers(updatedDrivers);
      updateSharedState(updatedDrivers, currentActiveDriverIndex);
    }
    setEditingDriverId(null);
  };

  return (
    <div className="space-y-6">
      {/* Timer & Active Driver Shift Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">
              <Clock className="w-3.5 h-3.5" />
              <span>3小时强制换班防疲劳计时器</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              当前当班驾驶员：
              <span className="text-blue-600 ml-2">{drivers[currentActiveDriverIndex].name}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-lg">
              高原山路及超长途行车，切勿单人单次驾驶超过3小时。换班时副驾同步提醒休息！
            </p>
          </div>

          {/* Big Digital Timer Display */}
          <div className="flex flex-col items-center bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm shrink-0">
            <div className="text-[10px] text-slate-500 font-bold tracking-wider uppercase mb-1">
              本班次剩余驾驶时间
            </div>
            <div className="text-3xl sm:text-4xl font-mono font-extrabold text-blue-600 tracking-wider">
              {formatTime(timeLeft)}
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
                  isTimerRunning
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isTimerRunning ? '暂停计时' : '开始计时'}</span>
              </button>

              <button
                onClick={handleNextDriver}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 cursor-pointer shadow-sm transition-colors"
                title="换下一位司机上车并重置3小时"
              >
                <Users className="w-3.5 h-3.5" />
                <span>换班给下一位</span>
              </button>

              <button
                onClick={handleResetTimer}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 bg-white border border-slate-200 cursor-pointer shadow-sm transition-colors"
                title="重置计时"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3 Driver Profile Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100">
          {drivers.map((d, idx) => (
            <div
              key={d.id}
              className={`p-4 rounded-xl border transition-all cursor-pointer shadow-sm ${
                currentActiveDriverIndex === idx
                  ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-600/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
              onClick={() => {
                setCurrentActiveDriverIndex(idx);
                updateSharedState(drivers, idx);
              }}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${currentActiveDriverIndex === idx ? 'text-blue-700' : 'text-slate-500'}`}>司机 0{idx + 1}</span>
                {currentActiveDriverIndex === idx && (
                  <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                    当前驾驶中
                  </span>
                )}
              </div>
              
              {editingDriverId === d.id ? (
                <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onBlur={() => handleSaveDriverName(d.id)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveDriverName(d.id)}
                    autoFocus
                    className="w-full text-sm font-bold text-slate-900 bg-white border border-blue-400 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              ) : (
                <div 
                  className="text-sm font-bold text-slate-900 mt-2 hover:text-blue-600 flex justify-between items-center group/edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingDriverId(d.id);
                    setTempName(d.name);
                  }}
                  title="点击修改司机名字"
                >
                  <span className="truncate">{d.name}</span>
                  <Edit2 className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover/edit:opacity-100 transition-opacity shrink-0 ml-2" />
                </div>
              )}

              <div className="text-[11px] text-slate-500 mt-1 font-medium">{d.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Driver Rules & High-Intensity Driving Warning */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-red-600 font-bold text-sm mb-4">
            <AlertTriangle className="w-4 h-4" />
            <span>极限驾驶日与重点盯防路段</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-slate-700">
              <div className="flex justify-between font-bold text-red-800 mb-1">
                <span>第22天：西安 → 通辽 (1350km 收官之战)</span>
                <span>最高强度</span>
              </div>
              <p className="text-red-600/90 font-medium leading-relaxed">
                全线最长单日里程！3位司机必须强制每3小时轮换，副驾驶严禁睡觉，全程保持清醒陪聊看路！
              </p>
            </div>

            <div className="p-3 rounded-xl bg-orange-50 border border-orange-100 text-slate-700">
              <div className="flex justify-between font-bold text-orange-800 mb-1">
                <span>第1、2天：通辽 → 保定(980km) / 十堰(1020km)</span>
                <span>长途高速</span>
              </div>
              <p className="text-orange-700/90 font-medium leading-relaxed">
                出城大赶路，逢双服务区进站换人休整，避免第一阶段体能透支。
              </p>
            </div>

            <div className="p-3 rounded-xl bg-orange-50 border border-orange-100 text-slate-700">
              <div className="flex justify-between font-bold text-orange-800 mb-1">
                <span>第9、10天：觉巴山悬崖 + 怒江72拐长下坡</span>
                <span>险峻山路</span>
              </div>
              <p className="text-orange-700/90 font-medium leading-relaxed">
                由最具山路经验的老司机掌舵，严禁空挡滑行，利用发动机牵引制动防刹车热衰竭。
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm mb-4">
            <CheckCircle2 className="w-4 h-4" />
            <span>自驾车组协同守则 (4人车规)</span>
          </div>

          <ul className="text-xs text-slate-600 space-y-3 leading-relaxed">
            <li className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-blue-600 font-black text-sm">1.</span>
              <span><strong className="text-slate-900">主驾专注，副驾看路</strong>：副驾驶员为领航员，负责实时观察高德导航测速、落石路段预警及大货车盲区。</span>
            </li>
            <li className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-blue-600 font-black text-sm">2.</span>
              <span><strong className="text-slate-900">后排司机保障睡眠</strong>：轮换下来的司机进入后排闭目休养，保证交接时精力充沛。</span>
            </li>
            <li className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-blue-600 font-black text-sm">3.</span>
              <span><strong className="text-slate-900">高反身体不适即刻报告</strong>：有轻微头晕脑胀的司机切勿逞强驾驶，第一时间换人。</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 22-Day Driver Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 overflow-hidden shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Car className="w-4 h-4 text-blue-600" />
          <span>22天每日建议主驾与驾驶策略对照表</span>
        </h3>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="p-3 font-bold">天数</th>
                <th className="p-3 font-bold">行程</th>
                <th className="p-3 font-bold">里程</th>
                <th className="p-3 font-bold">路况难度</th>
                <th className="p-3 font-bold">建议主驾与轮换频次</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {ITINERARY_DAYS.map((d) => (
                <tr key={d.dayNumber} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-blue-600">D{d.dayNumber}</td>
                  <td className="p-3 font-bold text-slate-900">{d.routeTitle}</td>
                  <td className="p-3 text-slate-600 font-medium">{d.distanceKm} km</td>
                  <td className="p-3">
                    {d.distanceKm >= 900 ? (
                      <span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded">极高负荷</span>
                    ) : d.maxAltitude >= 4000 ? (
                      <span className="text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded">高海拔山路</span>
                    ) : (
                      <span className="text-emerald-600 font-medium">常规路段</span>
                    )}
                  </td>
                  <td className="p-3 text-slate-700">{d.driverNotes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
