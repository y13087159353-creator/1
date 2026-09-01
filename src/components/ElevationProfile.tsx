import React from 'react';
import { ITINERARY_DAYS } from '../data/itineraryData';
import { Mountain, AlertTriangle, HeartPulse, Activity, Shield, Sparkles } from 'lucide-react';

interface ElevationProfileProps {
  onSelectDay?: (dayNumber: number) => void;
}

export const ElevationProfile: React.FC<ElevationProfileProps> = ({ onSelectDay }) => {
  const [hoveredDay, setHoveredDay] = React.useState<number | null>(null);

  // Highest mountain passes highlighted
  const keyPasses = [
    { dayNumber: 7, name: '折多山垭口', alt: 4298, tag: '川藏第一关' },
    { dayNumber: 8, name: '理塘高城 / 海子山', alt: 4685, tag: '世界高城' },
    { dayNumber: 9, name: '东达山垭口', alt: 5130, tag: '318第二高垭口' },
    { dayNumber: 10, name: '业拉山 (怒江72拐)', alt: 4658, tag: '天路72拐长下坡' },
    { dayNumber: 12, name: '色季拉山', alt: 4728, tag: '远眺南迦巴瓦' },
    { dayNumber: 13, name: '米拉山', alt: 4752, tag: '拉萨门户' },
    { dayNumber: 15, name: '那根拉山口', alt: 5190, tag: '全线最高5190m' },
    { dayNumber: 17, name: '孜珠寺 / 斜拉山', alt: 4800, tag: '天空之城' },
    { dayNumber: 19, name: '雀儿山隧道', alt: 4378, tag: '昔日川藏第一险' },
  ];

  const maxAlt = 5500;
  const minAlt = 0;

  return (
    <div className="space-y-6">
      {/* Top Banner & Overview Cards */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100 mb-2">
              <Mountain className="w-3.5 h-3.5" />
              <span>全景地形起伏 & 极限垭口监测</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              22天全线海拔变化剖面图
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
              由科尔沁草原 (180m) 攀升至青藏高原极境 (那根拉山口 5190m / 东达山 5130m)，再沿G317及秦岭平稳回程
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span>超高风险区 (&gt;4500m)</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span>高原警戒区 (3500-4500m)</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>低海拔舒适区 (&lt;2500m)</span>
            </div>
          </div>
        </div>

        {/* SVG Interactive Altitude Chart */}
        <div className="mt-6 relative overflow-x-auto pb-4">
          <div className="min-w-[840px] h-[360px] relative bg-slate-50 rounded-2xl p-4 border border-slate-200 shadow-inner">
            
            {/* Chart Area (Common coordinate system for grid and bars) */}
            <div className="absolute inset-x-6 top-10 bottom-10">
              {/* Grid lines */}
              <div className="absolute inset-0 pointer-events-none text-[10px] font-mono font-medium z-0">
                {/* 5000m Line */}
                <div className="absolute w-full border-t border-red-200 flex justify-between" style={{ bottom: `${(5000 / 5500) * 100}%` }}>
                  <span className="-mt-4 text-red-600 font-bold">5000m (极限高寒区)</span>
                  <span className="-mt-4 text-red-600 font-bold">那根拉 5190m / 东达山 5130m</span>
                </div>
                {/* 4000m Line */}
                <div className="absolute w-full border-t border-orange-200 flex justify-between" style={{ bottom: `${(4000 / 5500) * 100}%` }}>
                  <span className="-mt-4 text-orange-600 font-bold">4000m (高反高发区)</span>
                  <span className="-mt-4 text-orange-600 font-bold">理塘 4014m / 业拉山 4658m</span>
                </div>
                {/* 3000m Line */}
                <div className="absolute w-full border-t border-blue-200 flex justify-between" style={{ bottom: `${(3000 / 5500) * 100}%` }}>
                  <span className="-mt-4 text-blue-600 font-bold">3000m (轻微高反区)</span>
                  <span className="-mt-4 text-blue-600 font-bold">拉萨 3650m / 林芝 2900m</span>
                </div>
                {/* 2000m Line */}
                <div className="absolute w-full border-t border-emerald-200/50 flex justify-between" style={{ bottom: `${(2000 / 5500) * 100}%` }}>
                  <span className="-mt-4 text-emerald-600/80 font-bold">2000m (过渡区)</span>
                </div>
                {/* 1000m Line */}
                <div className="absolute w-full border-t border-emerald-200 flex justify-between" style={{ bottom: `${(1000 / 5500) * 100}%` }}>
                  <span className="-mt-4 text-emerald-600 font-bold">1000m (平原/低山)</span>
                  <span className="-mt-4 text-emerald-600 font-bold">保定 20m / 重庆 280m / 成都 500m</span>
                </div>
                {/* 0m Line */}
                <div className="absolute w-full border-t border-slate-200 flex justify-between" style={{ bottom: '0%' }}>
                  <span className="mt-1 text-slate-400">0m 海平面</span>
                  <span className="mt-1 text-slate-400">通辽 180m</span>
                </div>
              </div>

              {/* SVG Visual Bars / Curve */}
              <div className="absolute inset-0 flex items-end justify-between z-10">
                {ITINERARY_DAYS.map((day) => {
                  const heightPercent = ((day.maxAltitude - minAlt) / (maxAlt - minAlt)) * 100;
                  const isPass = keyPasses.find((p) => p.dayNumber === day.dayNumber);
                  const isHovered = hoveredDay === day.dayNumber;

                  // Color calculation
                  let barColor = 'from-emerald-500 to-emerald-400';
                  if (day.maxAltitude >= 4800) {
                    barColor = 'from-red-500 via-red-400 to-orange-400';
                  } else if (day.maxAltitude >= 4000) {
                    barColor = 'from-orange-500 to-orange-400';
                  } else if (day.maxAltitude >= 2500) {
                    barColor = 'from-blue-500 to-blue-400';
                  }

                  return (
                    <div
                      key={day.dayNumber}
                      className="flex-1 flex flex-col items-center group relative cursor-pointer mx-1 h-full justify-end"
                      onMouseEnter={() => setHoveredDay(day.dayNumber)}
                      onMouseLeave={() => setHoveredDay(null)}
                      onClick={() => onSelectDay && onSelectDay(day.dayNumber)}
                    >
                      {/* Hover Card Tooltip */}
                      {isHovered && (
                        <div className="absolute -top-32 z-30 bg-white border border-slate-200 shadow-xl rounded-xl p-3 w-48 text-left pointer-events-none transform -translate-x-1/2 left-1/2">
                          <div className="text-[11px] font-bold text-blue-600">
                            第{day.dayNumber}天 · {day.date}
                          </div>
                          <div className="text-xs font-bold text-slate-900 truncate mt-1">
                            {day.routeTitle}
                          </div>
                          <div className="text-[11px] text-slate-700 font-semibold mt-1">
                            最高: {day.maxAltitude}m ({day.maxAltitudeLocation})
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            终点海拔: {day.endAltitude}m ｜ {day.distanceKm}km
                          </div>
                        </div>
                      )}

                      {/* Pass Marker Label */}
                      {isPass && (
                        <div className="absolute flex flex-col items-center pointer-events-none z-20" style={{ bottom: `${Math.max(heightPercent, 1) + 2}%` }}>
                          <span className="text-[9px] font-bold text-white bg-slate-900 px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                            {isPass.alt}m
                          </span>
                          <div className="w-0.5 h-3 bg-slate-900 mt-0.5" />
                        </div>
                      )}

                      {/* The Bar */}
                      <div
                        style={{ height: `${Math.max(heightPercent, 1)}%` }}
                        className={`w-full max-w-[20px] rounded-t-md bg-gradient-to-t ${barColor} transition-all duration-300 group-hover:brightness-110 group-hover:scale-y-105 shadow-sm opacity-90 origin-bottom`}
                      />

                      {/* Day Number Label */}
                      <span className="absolute -bottom-7 text-[10px] font-bold text-slate-400 group-hover:text-blue-600">
                        D{day.dayNumber}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Highlighted Pass Checklist */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>核心垭口与高海拔地标速查</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
            {keyPasses.map((pass) => (
              <div
                key={pass.dayNumber}
                onClick={() => onSelectDay && onSelectDay(pass.dayNumber)}
                className="bg-white p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer group shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-blue-600">第{pass.dayNumber}天</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-bold">
                    {pass.alt}m
                  </span>
                </div>
                <div className="font-bold text-slate-900 group-hover:text-blue-700 truncate">
                  {pass.name}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 truncate font-medium">
                  {pass.tag}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Crucial Altitude Sickness (高反) Medical Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2.5 text-orange-600 font-bold text-sm mb-4">
            <HeartPulse className="w-5 h-5 text-orange-500" />
            <span>初入高原防高反黄金铁律</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-3 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <span><strong className="text-slate-900">进藏前4天坚决不洗澡洗头</strong>：折多山至巴塘期间毛孔张开极易受风着凉，感冒发烧会迅速诱发急性肺水肿。</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <span><strong className="text-slate-900">多饮温热水</strong>：每日补充3000ml以上水分，促进新陈代谢与血液携氧能力。</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <span><strong className="text-slate-900">放慢动作节律</strong>：下车拍照切勿奔跑跳跃，下坡慢走，深呼吸。</span>
            </li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2.5 text-blue-600 font-bold text-sm mb-4">
            <Activity className="w-5 h-5 text-blue-500" />
            <span>急救药品与吸氧策略</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-3 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span><strong className="text-slate-900">便携氧气罐随手可取</strong>：放置于车门储物槽或副驾随手处，出现头晕胸闷即间歇吸氧。</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span><strong className="text-slate-900">葡萄糖+散列通</strong>：轻度神经性高反头痛可服用散列通/布洛芬，搭配葡萄糖快速供能。</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span><strong className="text-slate-900">拉萨弥散供氧酒店</strong>：拉萨推荐选择配备集中弥散供氧的房间，保障深度睡眠。</span>
            </li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2.5 text-red-600 font-bold text-sm mb-4">
            <Shield className="w-5 h-5 text-red-500" />
            <span>高山险路行车安全法则</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-3 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">•</span>
              <span><strong className="text-slate-900">怒江72拐严禁空挡</strong>：几十公里连续盘山长下坡，必须挂入手动低档/L档利用发动机制动。</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">•</span>
              <span><strong className="text-slate-900">觉巴山/G317悬崖盲区</strong>：弯道提前按喇叭，严禁盲区强行超车，礼让上坡车与军车车队。</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">•</span>
              <span><strong className="text-slate-900">防范“醉氧”嗜睡</strong>：从高原返回平原（D20-D22）氧气突然变浓易犯困，副驾务必全程陪聊！</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
