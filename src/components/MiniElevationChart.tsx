import React from 'react';

interface MiniElevationChartProps {
  start: number;
  max: number;
  end: number;
}

export const MiniElevationChart: React.FC<MiniElevationChartProps> = ({ start, max, end }) => {
  const w = 50;
  const h = 20;
  
  // Calculate relative positions
  const minAlt = Math.min(start, end) - 300; // Provide some padding below
  const maxAlt = Math.max(start, max, end) + 200; // Provide some padding above
  const range = Math.max(maxAlt - minAlt, 1);

  const getY = (alt: number) => h - ((alt - minAlt) / range) * h;

  const y1 = getY(start);
  const y2 = getY(max);
  const y3 = getY(end);

  // SVG paths
  const linePoints = `0,${y1} ${w/2},${y2} ${w},${y3}`;
  const fillPoints = `0,${h} 0,${y1} ${w/2},${y2} ${w},${y3} ${w},${h}`;

  // Color logic based on trend
  const climb = end - start;
  let themeColor = '#8b5cf6'; // Purple for mixed
  let fillColor = 'rgba(139, 92, 246, 0.15)';

  if (climb > 500) {
    themeColor = '#ef4444'; // Red for heavy climb
    fillColor = 'rgba(239, 68, 68, 0.15)';
  } else if (climb < -500) {
    themeColor = '#10b981'; // Green for heavy drop
    fillColor = 'rgba(16, 185, 129, 0.15)';
  }

  return (
    <div 
      className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-200 shadow-sm" 
      title={`起点海拔: ${start}m\n最高海拔: ${max}m\n终点海拔: ${end}m`}
    >
      <div className="flex flex-col justify-between h-5 text-[9px] font-bold text-slate-400 leading-none">
        <span>{start}</span>
      </div>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
        <polygon points={fillPoints} fill={fillColor} />
        <polyline points={linePoints} fill="none" stroke={themeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="0" cy={y1} r="1.5" fill={themeColor} />
        <circle cx={w/2} cy={y2} r="1.5" fill={themeColor} />
        <circle cx={w} cy={y3} r="1.5" fill={themeColor} />
      </svg>
      <div className="flex flex-col justify-between h-5 text-[9px] font-bold text-slate-600 leading-none">
        <span>{end}m</span>
      </div>
    </div>
  );
};
