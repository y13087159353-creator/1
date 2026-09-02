import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudLightning, Snowflake, AlertCircle, Loader2 } from 'lucide-react';

const CITY_COORDINATES: Record<string, { lat: number, lon: number }> = {
  '保定市': { lat: 38.8739, lon: 115.4648 },
  '十堰市': { lat: 32.6293, lon: 110.7979 },
  '重庆市': { lat: 29.5630, lon: 106.5516 },
  '重庆市内': { lat: 29.5630, lon: 106.5516 },
  '成都市': { lat: 30.5728, lon: 104.0668 },
  '成都市内': { lat: 30.5728, lon: 104.0668 },
  '新都桥镇': { lat: 30.0465, lon: 101.5173 },
  '巴塘县': { lat: 30.0054, lon: 98.9328 },
  '左贡县': { lat: 29.6738, lon: 97.8427 },
  '八宿县': { lat: 30.0544, lon: 96.7161 },
  '波密县': { lat: 29.8596, lon: 95.7663 },
  '林芝市': { lat: 29.6543, lon: 94.3621 },
  '拉萨市': { lat: 29.6500, lon: 91.1000 },
  '拉萨市区': { lat: 29.6500, lon: 91.1000 },
  '纳木错（当雄）': { lat: 30.4776, lon: 91.1009 },
  '索县': { lat: 31.8821, lon: 93.7743 },
  '昌都市（类乌齐）': { lat: 31.2144, lon: 96.6022 },
  '德格县': { lat: 31.8062, lon: 98.5815 },
  '马尔康市': { lat: 31.8996, lon: 102.2064 },
  '绵阳市': { lat: 31.4675, lon: 104.6796 },
  '西安市': { lat: 34.3416, lon: 108.9398 },
  '通辽市': { lat: 43.6146, lon: 122.2599 },
};

interface WeatherWidgetProps {
  destination: string;
  dateStr: string; // "YYYY-MM-DD"
}

interface WeatherData {
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ destination, dateStr }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchWeather = async () => {
      const coords = CITY_COORDINATES[destination];
      if (!coords) {
        if (isMounted) setError("暂不支持该城市");
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Query Open-Meteo for 14-day forecast
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=14`
        );
        
        if (!res.ok) throw new Error("API返回错误");
        
        const data = await res.json();
        const dates: string[] = data.daily.time;
        
        // Find the matching date in the forecast
        const dateIndex = dates.indexOf(dateStr);
        
        if (dateIndex !== -1) {
          if (isMounted) {
            setWeather({
              maxTemp: data.daily.temperature_2m_max[dateIndex],
              minTemp: data.daily.temperature_2m_min[dateIndex],
              weatherCode: data.daily.weather_code[dateIndex],
            });
          }
        } else {
          if (isMounted) {
            setError("日期超出14天预报范围");
          }
        }
      } catch (err) {
        if (isMounted) setError("天气获取失败");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    fetchWeather();
    
    return () => {
      isMounted = false;
    };
  }, [destination, dateStr]);

  const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) return <Sun className="w-4 h-4 text-orange-500" />;
    if (code === 2 || code === 3) return <Cloud className="w-4 h-4 text-slate-400" />;
    if (code >= 45 && code <= 48) return <Cloud className="w-4 h-4 text-slate-300" />;
    if (code >= 51 && code <= 67) return <CloudRain className="w-4 h-4 text-blue-500" />;
    if (code >= 71 && code <= 77) return <Snowflake className="w-4 h-4 text-sky-300" />;
    if (code >= 80 && code <= 82) return <CloudRain className="w-4 h-4 text-blue-600" />;
    if (code >= 95 && code <= 99) return <CloudLightning className="w-4 h-4 text-purple-600" />;
    return <Sun className="w-4 h-4 text-orange-500" />;
  };

  const getWeatherText = (code: number) => {
    if (code === 0) return "晴";
    if (code === 1 || code === 2 || code === 3) return "多云";
    if (code >= 45 && code <= 48) return "雾";
    if (code >= 51 && code <= 67) return "雨";
    if (code >= 71 && code <= 77) return "雪";
    if (code >= 80 && code <= 82) return "阵雨";
    if (code >= 95 && code <= 99) return "雷雨";
    return "未知";
  };

  if (loading) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>获取天气...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100" title={error}>
        <AlertCircle className="w-3.5 h-3.5" />
        <span>天气暂不可用</span>
      </div>
    );
  }

  if (weather) {
    return (
      <div className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-blue-50/50 px-2.5 py-1 rounded-md border border-blue-100 shadow-sm">
        {getWeatherIcon(weather.weatherCode)}
        <span>{getWeatherText(weather.weatherCode)}</span>
        <span className="text-slate-400 mx-0.5">|</span>
        <span className="text-blue-700">{Math.round(weather.minTemp)}°C ~ {Math.round(weather.maxTemp)}°C</span>
      </div>
    );
  }

  return null;
};
