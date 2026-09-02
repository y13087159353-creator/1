import React from 'react';
import { 
  Navigation, 
  Fuel, 
  Utensils, 
  Camera, 
  Hotel, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Mountain, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  ExternalLink,
  Edit3,
  Save,
  Share2
} from 'lucide-react';
import { DayItinerary } from '../types';
import { WeatherWidget } from './WeatherWidget';
import { MiniElevationChart } from './MiniElevationChart';

interface DayCardProps {
  day: DayItinerary;
  isCompleted: boolean;
  onToggleComplete: (dayNumber: number) => void;
  userNote: string;
  onSaveNote: (dayNumber: number, note: string) => void;
}

export const DayCard: React.FC<DayCardProps> = ({
  day,
  isCompleted,
  onToggleComplete,
  userNote,
  onSaveNote,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isEditingNote, setIsEditingNote] = React.useState(false);
  const [noteText, setNoteText] = React.useState(userNote);

  const handleSaveNote = () => {
    onSaveNote(day.dayNumber, noteText);
    setIsEditingNote(false);
  };

  const getRiskBadgeColor = (level: DayItinerary['riskLevel']) => {
    switch (level) {
      case 'extreme':
        return 'bg-red-500/10 text-red-400 border-red-500/40';
      case 'high':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/40';
      case 'medium':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/40';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40';
    }
  };

  const openMapSearch = (keyword: string) => {
    const url = `https://uri.amap.com/search?keyword=${encodeURIComponent(keyword)}`;
    window.open(url, '_blank');
  };

  return (
    <div 
      id={`day-card-${day.dayNumber}`}
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isCompleted 
          ? 'bg-slate-50 border-emerald-200 shadow-sm opacity-80' 
          : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
      }`}
    >
      {/* Card Top Banner */}
      <div className="p-4 sm:p-6 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-4">
            {/* Day Number Badge */}
            <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 text-center flex-shrink-0">
              <span className="text-[10px] font-bold tracking-wider text-blue-400 uppercase">DAY</span>
              <span className="text-xl font-extrabold text-blue-600">{day.dayNumber}</span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  {day.date} · {day.weekday}
                </span>
                {day.isRestDay && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200">
                    🟢 休整日
                  </span>
                )}
                {day.distanceKm >= 900 && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-200">
                    ⚡ 极限大赶路
                  </span>
                )}
                {day.maxAltitude >= 4000 && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200 flex items-center gap-1">
                    <Mountain className="w-3 h-3" />
                    <span>最高 {day.maxAltitude}m</span>
                  </span>
                )}
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex flex-col sm:flex-row sm:items-center gap-2 mt-1.5">
                <span>{day.routeTitle}</span>
                <div className="flex flex-wrap items-center gap-2">
                  <WeatherWidget destination={day.to} dateStr={day.fullDate} />
                  <MiniElevationChart start={day.startAltitude} max={day.maxAltitude} end={day.endAltitude} />
                </div>
              </h3>
            </div>
          </div>

          {/* Right Action: Completion Checkbox & Expand Toggle */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              id={`complete-day-${day.dayNumber}`}
              onClick={() => onToggleComplete(day.dayNumber)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
              title="标记今日行程已完成打卡"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isCompleted ? '已打卡完成' : '打卡今日'}</span>
            </button>

            <button
              id={`expand-day-${day.dayNumber}`}
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all cursor-pointer"
              title={isExpanded ? '收起表格详情' : '展开表格详情'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="text-slate-500 flex items-center gap-1.5 mb-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>起止时间</span>
            </div>
            <div className="font-bold text-slate-800">{day.departureTime} → {day.arrivalTime}</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="text-slate-500 flex items-center gap-1.5 mb-1 font-medium">
              <Navigation className="w-3.5 h-3.5 text-blue-500" />
              <span>行驶里程</span>
            </div>
            <div className="font-bold text-slate-800">{day.distanceKm} 公里 ({day.roadType})</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="text-slate-500 flex items-center gap-1.5 mb-1 font-medium">
              <Hotel className="w-3.5 h-3.5 text-blue-500" />
              <span>当日住宿</span>
            </div>
            <div className="font-bold text-slate-800 truncate" title={day.hotelInfo}>{day.hotelInfo}</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="text-slate-500 flex items-center gap-1.5 mb-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              <span>核心导航</span>
            </div>
            <div className="font-bold text-slate-800 truncate flex items-center justify-between">
              <span className="truncate">{day.navDestination}</span>
              <button 
                onClick={() => openMapSearch(day.navDestination)}
                className="text-blue-500 hover:text-blue-600 ml-1 flex-shrink-0 bg-white p-0.5 rounded border border-slate-200" 
                title="在高德地图中搜索"
              >
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Danger Warning Alert Banner if any high/extreme */}
        {day.roadConditions.includes('严禁') || day.roadConditions.includes('长下坡') || day.roadConditions.includes('险') || day.riskLevel === 'extreme' ? (
          <div className="mt-3 flex items-start gap-2 bg-red-50 border border-red-200 px-3 py-2.5 rounded-xl text-xs text-red-700">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-red-800 font-bold">重点安全警示：</strong> {day.roadConditions}
            </div>
          </div>
        ) : null}
      </div>

      {/* Structured Table Section (Expanded or Main View) */}
      <div className={`p-4 sm:p-6 bg-slate-50/50 ${isExpanded ? 'block' : 'hidden md:block'}`}>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="py-3 px-4 font-bold w-28 sm:w-36">项目</th>
                <th className="py-3 px-4 font-bold">详细行程内容与建议</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-500 flex items-center gap-1.5">
                  <span>🗓️</span> <strong>日期</strong>
                </td>
                <td className="py-3 px-4 font-medium text-slate-900">{day.date} ({day.weekday})</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-500">
                  <span>🏁</span> <strong>当日路线</strong>
                </td>
                <td className="py-3 px-4 text-blue-700 font-bold">{day.from} → {day.to}</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-500">
                  <span>⏰</span> <strong>出发 / 到达</strong>
                </td>
                <td className="py-3 px-4">出发 <strong className="text-slate-900">{day.departureTime}</strong> ｜ 到达 <strong className="text-slate-900">{day.arrivalTime}</strong></td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-500">
                  <span>🚗</span> <strong>里程 / 路线</strong>
                </td>
                <td className="py-3 px-4">约 <strong className="text-slate-900">{day.distanceKm}</strong> 公里 ｜ {day.roadType}</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-500">
                  <span>🧭</span> <strong>导航终点</strong>
                </td>
                <td className="py-3 px-4 flex items-center gap-2">
                  <span className="font-bold text-slate-800">{day.navDestination}</span>
                  <button 
                    onClick={() => openMapSearch(day.navDestination)}
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100 font-medium transition-colors"
                  >
                    <span>地图导航</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-500">
                  <span>⛽</span> <strong>加油补给</strong>
                </td>
                <td className="py-3 px-4 text-slate-700">{day.fuelStrategy}</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-500">
                  <span>🍜</span> <strong>午餐推荐</strong>
                </td>
                <td className="py-3 px-4 text-slate-700">{day.lunch}</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-500">
                  <span>🍲</span> <strong>晚餐推荐</strong>
                </td>
                <td className="py-3 px-4 text-slate-800 font-medium">{day.dinner}</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-500">
                  <span>🌄</span> <strong>沿途风景</strong>
                </td>
                <td className="py-3 px-4 text-slate-700">{day.scenery}</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-500">
                  <span>⭐</span> <strong>核心景点</strong>
                </td>
                <td className="py-3 px-4 text-emerald-700 font-bold">{day.attractions}</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-500">
                  <span>📸</span> <strong>摄影机位</strong>
                </td>
                <td className="py-3 px-4 text-purple-700 font-medium">{day.photoSpots}</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-500">
                  <span>🏨</span> <strong>推荐住宿</strong>
                </td>
                <td className="py-3 px-4 text-slate-700">{day.hotelInfo}</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-500">
                  <span>💰</span> <strong>预估花费</strong>
                </td>
                <td className="py-3 px-4 font-bold text-emerald-600">{day.costBreakdown}</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-500">
                  <span>⚠️</span> <strong>路况安全</strong>
                </td>
                <td className="py-3 px-4 text-red-600 font-medium">{day.roadConditions}</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-500">
                  <span>🔄</span> <strong>司机轮换</strong>
                </td>
                <td className="py-3 px-4 text-blue-700 font-medium">{day.driverNotes}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Altitude & Safety Tips Section */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-3 text-xs shadow-sm">
            <Mountain className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-500 font-semibold">海拔起伏：</span>
              <span className="text-slate-800 font-bold ml-1">
                {day.startAltitude}m → {day.endAltitude}m (最高点: {day.maxAltitudeLocation} {day.maxAltitude}m)
              </span>
              <div className="text-slate-600 mt-1.5 font-medium bg-slate-50 p-2 rounded">
                {day.maxAltitude >= 4000 ? '⚠️ 高海拔地区动作放缓，多饮温水，注意防风保暖' : '海拔适宜，注意适应气温变化'}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-3 text-xs shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-500 font-semibold">车友实用贴士：</span>
              <ul className="list-disc list-outside ml-4 text-slate-700 mt-1.5 space-y-1">
                {day.tips.map((tip, idx) => (
                  <li key={idx} className="pl-1">{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* User Personal Diary / Notes on this Day */}
        <div className="mt-6 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <Edit3 className="w-4 h-4 text-blue-500" />
              <span>今日备忘 / 实际加油与路况记录</span>
            </span>
            {!isEditingNote && (
              <button
                onClick={() => setIsEditingNote(true)}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer bg-blue-50 px-2 py-1 rounded"
              >
                <span>{userNote ? '编辑记录' : '添加备忘'}</span>
              </button>
            )}
          </div>

          {isEditingNote ? (
            <div className="space-y-3 mt-3">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="记录今日实际油费、驾驶体验、突发路况或风景打卡感想..."
                className="w-full p-3 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-y min-h-[100px] shadow-sm"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsEditingNote(false)}
                  className="px-4 py-2 rounded-lg text-sm bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveNote}
                  className="px-4 py-2 rounded-lg text-sm bg-blue-600 text-white font-bold hover:bg-blue-700 flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>保存笔记</span>
                </button>
              </div>
            </div>
          ) : (
            userNote && (
              <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed shadow-sm">
                {userNote}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
