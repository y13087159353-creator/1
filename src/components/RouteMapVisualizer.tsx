import React from 'react';
import { ITINERARY_DAYS, PHASES } from '../data/itineraryData';
import { MapPin, Navigation, Flag, CheckCircle2, ChevronRight, Compass } from 'lucide-react';

interface RouteMapVisualizerProps {
  onSelectDay: (dayNumber: number) => void;
}

export const RouteMapVisualizer: React.FC<RouteMapVisualizerProps> = ({ onSelectDay }) => {
  const [selectedPhase, setSelectedPhase] = React.useState<number | 'all'>('all');

  const filteredDays = selectedPhase === 'all' 
    ? ITINERARY_DAYS 
    : ITINERARY_DAYS.filter((d) => d.phaseId === selectedPhase);

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100 mb-2 shadow-sm">
              <Compass className="w-3.5 h-3.5" />
              <span>7500公里进出藏自驾大环线全景</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              通辽 — 318进藏 — 317出藏 途经城市与路网节点
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
              穿越内蒙古、河北、河南、湖北、重庆、四川、西藏、青海、陕西等省区市
            </p>
          </div>

          {/* Phase Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedPhase('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
                selectedPhase === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-slate-500 border border-slate-200 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              全部22天
            </button>
            {PHASES.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPhase(p.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-sm ${
                  selectedPhase === p.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-500 border border-slate-200 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                第{p.id}阶段
              </button>
            ))}
          </div>
        </div>

        {/* Visual Timeline Nodes */}
        <div className="mt-6 space-y-4">
          {filteredDays.map((day, idx) => {
            const isPhaseStart = day.dayNumber === 1 || day.dayNumber === 7 || day.dayNumber === 14;
            const phase = PHASES.find((p) => p.id === day.phaseId);

            return (
              <div key={day.dayNumber} className="relative">
                {isPhaseStart && (
                  <div className="mb-4 mt-6 first:mt-0 flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-slate-50 text-blue-700 border border-slate-200 shadow-sm uppercase tracking-wider">
                      {phase?.name} ({phase?.dateRange})
                    </span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>
                )}

                <div
                  onClick={() => onSelectDay(day.dayNumber)}
                  className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    {/* Node Dot */}
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-blue-700 text-sm flex-shrink-0 group-hover:border-blue-300 group-hover:bg-white shadow-sm">
                      D{day.dayNumber}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{day.date}</span>
                        <span className="text-sm font-bold text-slate-900 group-hover:text-blue-700">
                          {day.routeTitle}
                        </span>
                        {day.isRestDay && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                            休整日
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 font-medium">
                        <span className="flex items-center gap-1 text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                          <Navigation className="w-3 h-3" />
                          <span>{day.distanceKm} km</span>
                        </span>
                        <span className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{day.roadType}</span>
                        <span className="text-purple-600 truncate max-w-xs">{day.attractions}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="text-right text-xs">
                      <div className="text-slate-700 font-bold">{day.hotelInfo.split('（')[0]}</div>
                      <div className="text-[11px] text-slate-500 font-mono font-medium mt-0.5">{day.costBreakdown.split('（')[0]}</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
