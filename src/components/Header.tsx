import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  Copy, 
  Download, 
  CheckCircle2, 
  Car, 
  Compass, 
  Coins, 
  CheckSquare, 
  TrendingUp, 
  Calendar,
  Users,
  ShieldAlert,
  Sparkles,
  Clock,
  Camera
} from 'lucide-react';
import { copyToClipboard, downloadTextFile, generateMarkdownRoadbook } from '../utils/exportUtils';
import { ITINERARY_DAYS } from '../data/itineraryData';

interface HeaderProps {
  activeTab: 'itinerary' | 'elevation' | 'drivers' | 'budget' | 'checklist' | 'map' | 'photos';
  setActiveTab: (tab: 'itinerary' | 'elevation' | 'drivers' | 'budget' | 'checklist' | 'map' | 'photos') => void;
  onPrint: () => void;
  completedDaysCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onPrint,
  completedDaysCount,
}) => {
  const [copied, setCopied] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);

  // Constants for Circular Progress Bar
  const totalDays = 22;
  const progressPercentage = (completedDaysCount / totalDays) * 100;
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  useEffect(() => {
    // Countdown to Sept 15, 2026 (assuming current year is 2026 based on the context)
    const targetDate = new Date('2026-09-15T00:00:00').getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance > 0) {
        setDaysRemaining(Math.ceil(distance / (1000 * 60 * 60 * 24)));
      } else {
        setDaysRemaining(0);
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000 * 60 * 60); // update every hour
    return () => clearInterval(interval);
  }, []);

  const handleCopyMarkdown = async () => {
    const md = generateMarkdownRoadbook(ITINERARY_DAYS);
    const success = await copyToClipboard(md);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdownRoadbook(ITINERARY_DAYS);
    downloadTextFile('通辽-318进藏-317出藏22天自驾路书.md', md);
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm flex flex-col">
      {/* Main Hero Header */}
      <div className="flex flex-col lg:flex-row items-center justify-between px-4 sm:px-8 py-4 w-full">
        <div className="flex items-center gap-4 w-full lg:w-auto mb-4 lg:mb-0">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              通辽 - 川藏318/317 自驾路书
            </h1>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
              9月15日 — 10月6日 | 22天极致越野
            </p>
          </div>
        </div>

        <div className="flex gap-4 sm:gap-6 items-center w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {/* Circular Progress Bar */}
          <div className="flex items-center gap-3 shrink-0 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-200" />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="text-emerald-500 transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute text-[10px] font-bold text-slate-700">{completedDaysCount}/{totalDays}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">行程进度</span>
              <span className="text-xs font-bold text-slate-800">{Math.round(progressPercentage)}%</span>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200 shrink-0 hidden sm:block"></div>

          {/* Countdown Timer */}
          <div className="flex flex-col items-center shrink-0 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
             <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider flex items-center gap-1"><Clock className="w-3 h-3"/>距离出发仅剩</span>
             <div className="flex items-baseline gap-1">
               <span className="text-lg font-black text-blue-700">{daysRemaining}</span>
               <span className="text-xs text-blue-600 font-medium">天</span>
             </div>
          </div>

          <div className="h-8 w-px bg-slate-200 shrink-0 hidden sm:block"></div>

          <div className="text-right shrink-0">
            <p className="text-xs text-slate-400 font-medium">团队预算</p>
            <p className="text-lg font-bold text-blue-600">¥40,000 <span className="text-[10px] text-slate-400">/ 4人</span></p>
          </div>
          <div className="h-10 w-px bg-slate-200 shrink-0"></div>
          
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="copy-markdown-btn"
              onClick={handleCopyMarkdown}
              className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded text-sm font-medium flex items-center gap-2 cursor-pointer transition-colors"
              title="复制全部22天Markdown排版表格"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-blue-600" />}
              <span className="hidden sm:inline">{copied ? '已复制' : '复制 MD'}</span>
            </button>
            <button
              id="download-md-btn"
              onClick={handleDownloadMarkdown}
              className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded text-sm font-medium flex items-center gap-2 cursor-pointer transition-colors"
              title="下载.md文本文件"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">下载 MD</span>
            </button>
            <button
              id="export-pdf-btn"
              onClick={onPrint}
              className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded text-sm font-medium transition-colors cursor-pointer flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>导出 PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-4 sm:px-8 border-t border-slate-100 bg-slate-50 flex items-center gap-1 overflow-x-auto pt-2 pb-2 scrollbar-none">
        <button
          id="tab-itinerary"
          onClick={() => setActiveTab('itinerary')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'itinerary'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>每日路书</span>
        </button>
        <button
          id="tab-elevation"
          onClick={() => setActiveTab('elevation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'elevation'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>海拔剖面</span>
        </button>
        <button
          id="tab-map"
          onClick={() => setActiveTab('map')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'map'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>全景图</span>
        </button>
        <button
          id="tab-drivers"
          onClick={() => setActiveTab('drivers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'drivers'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>驾驶排班</span>
        </button>
        <button
          id="tab-budget"
          onClick={() => setActiveTab('budget')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'budget'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>预算分摊</span>
        </button>
        <button
          id="tab-checklist"
          onClick={() => setActiveTab('checklist')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'checklist'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>高原物资</span>
        </button>
        <button
          id="tab-photos"
          onClick={() => setActiveTab('photos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'photos'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>公共图库</span>
        </button>
      </div>
    </header>
  );
};
