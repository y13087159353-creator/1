import React from 'react';
import { AlertTriangle, MapPin, Navigation, Info, Mountain, Wind, Car } from 'lucide-react';
import { DayItinerary } from '../types';

interface Props {
  todayItinerary: DayItinerary | undefined;
  onJump: (dayNum: number) => void;
}

export const TodayBriefing: React.FC<Props> = ({ todayItinerary, onJump }) => {
  if (!todayItinerary) return null;

  const isHighAlt = todayItinerary.maxAltitude >= 4000;
  const isHighRisk = todayItinerary.riskLevel === 'high' || todayItinerary.riskLevel === 'extreme';

  return (
    <div className={`mb-6 p-4 sm:p-5 rounded-2xl border shadow-sm relative overflow-hidden ${
      isHighRisk 
        ? 'bg-red-50 border-red-200' 
        : isHighAlt 
          ? 'bg-amber-50 border-amber-200' 
          : 'bg-emerald-50 border-emerald-200'
    }`}>
      <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
        {isHighAlt ? <Mountain className="w-32 h-32" /> : <Navigation className="w-32 h-32" />}
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        <div className={`px-2 py-1 rounded-md text-xs font-bold ${
          isHighRisk ? 'bg-red-600 text-white' : isHighAlt ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
        }`}>
          今日行程
        </div>
        <h2 className="text-lg font-bold text-slate-900">
          第{todayItinerary.dayNumber}天：{todayItinerary.routeTitle}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-slate-500" />
            <p className="text-sm font-medium text-slate-700">
              {todayItinerary.from} ➔ {todayItinerary.to} ({todayItinerary.distanceKm}km)
            </p>
          </div>
          
          <div className="flex items-start gap-2">
            <Mountain className={`w-4 h-4 mt-0.5 shrink-0 ${isHighAlt ? 'text-amber-600' : 'text-slate-500'}`} />
            <p className="text-sm font-medium text-slate-700">
              最高海拔：<span className={isHighAlt ? 'text-amber-700 font-bold' : ''}>{todayItinerary.maxAltitude}米</span>
              {todayItinerary.maxAltitudeLocation && ` (${todayItinerary.maxAltitudeLocation})`}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {todayItinerary.riskTags.map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-xs text-slate-600 font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {todayItinerary.driverNotes && (
            <div className="flex items-start gap-2 bg-white/60 p-2.5 rounded-lg border border-white/40">
              <Car className="w-4 h-4 mt-0.5 shrink-0 text-blue-600" />
              <p className="text-xs font-medium text-slate-700">{todayItinerary.driverNotes}</p>
            </div>
          )}
          
          <div className="flex items-start gap-2 bg-white/60 p-2.5 rounded-lg border border-white/40">
            <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${isHighRisk ? 'text-red-600' : 'text-amber-600'}`} />
            <div className="flex flex-col gap-1">
              {todayItinerary.tips.slice(0, 2).map((tip, idx) => (
                <p key={idx} className="text-xs font-medium text-slate-700">• {tip}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-slate-900/10 flex justify-end relative z-10">
        <button 
          onClick={() => onJump(todayItinerary.dayNumber)}
          className="text-xs font-bold text-slate-700 hover:text-blue-700 transition-colors flex items-center gap-1"
        >
          查看完整路书 &rarr;
        </button>
      </div>
    </div>
  );
};
