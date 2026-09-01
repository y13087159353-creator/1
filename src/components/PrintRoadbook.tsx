import React from 'react';
import { ITINERARY_DAYS, PHASES } from '../data/itineraryData';
import { Printer, ArrowLeft, Download, Copy, CheckCircle2 } from 'lucide-react';
import { copyToClipboard, downloadTextFile, generateMarkdownRoadbook } from '../utils/exportUtils';

interface PrintRoadbookProps {
  onClose: () => void;
}

export const PrintRoadbook: React.FC<PrintRoadbookProps> = ({ onClose }) => {
  const [copied, setCopied] = React.useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = async () => {
    const md = generateMarkdownRoadbook(ITINERARY_DAYS);
    const success = await copyToClipboard(md);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 print:bg-white print:text-black">
      {/* Floating Print Control Bar (Hidden during actual print) */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur text-slate-900 px-6 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回交互界面</span>
          </button>
          <span className="text-xs font-bold text-slate-500 tracking-wide">
            📄 A4 高清打印 / PDF 导出预览模式
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer transition-colors shadow-sm"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">已复制Markdown!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-blue-600" />
                <span>复制全部表格文本</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>立即打印 / 另存为 PDF (Ctrl+P)</span>
          </button>
        </div>
      </div>

      {/* Printable Document Body */}
      <div className="max-w-4xl mx-auto px-6 sm:px-12 py-10 print:p-0 print:max-w-none text-slate-900 leading-relaxed font-sans">
        {/* Cover Header */}
        <div className="border-b-2 border-slate-900 pb-6 mb-8 text-center sm:text-left">
          <div className="text-xs font-bold tracking-widest text-slate-600 uppercase mb-1">
            AUTONOMOUS ROADBOOK · TIBET EXPEDITION
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight font-serif">
            🚙 通辽 - 318进藏 - 317出藏 22天自驾路书
          </h1>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-700 font-medium">
            <div><strong>📅 总行程日期</strong>：9月15日 — 10月6日 (22天)</div>
            <div><strong>👥 车辆与人员</strong>：1辆SUV，四人同行，三司机轮流驾驶</div>
            <div><strong>💰 整体预算</strong>：总计 40,000 元（人均 10,000 元）</div>
          </div>
        </div>

        {/* 3 Phases Loop */}
        {PHASES.map((phase) => {
          const phaseDays = ITINERARY_DAYS.filter((d) => d.phaseId === phase.id);

          return (
            <section key={phase.id} className="mb-10 page-break-before">
              <div className="bg-slate-100 print:bg-slate-100 p-3 rounded-lg border-l-4 border-slate-900 mb-6">
                <h2 className="text-xl font-bold text-slate-950">
                  {phase.name}
                </h2>
                <div className="text-xs text-slate-600 mt-0.5">
                  行程周期：{phase.dateRange} ｜ 总行驶里程：约 {phase.totalKm} 公里
                </div>
              </div>

              {/* Days Tables in Print */}
              <div className="space-y-8">
                {phaseDays.map((day) => (
                  <div key={day.dayNumber} className="border border-slate-300 rounded-lg p-4 print:p-3 break-inside-avoid shadow-sm print:shadow-none bg-white">
                    <div className="flex items-center justify-between border-b border-slate-300 pb-2 mb-3">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-xs">
                          第{day.dayNumber}天
                        </span>
                        <span>{day.routeTitle}</span>
                      </h3>
                      <span className="text-xs text-slate-600 font-medium">
                        {day.date} ({day.weekday}) ｜ 约 {day.distanceKm} 公里
                      </span>
                    </div>

                    <table className="w-full text-xs text-left border-collapse border border-slate-300">
                      <tbody>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 font-bold bg-slate-50 w-24 border-r border-slate-200">🗓️ 日期</td>
                          <td className="p-2 text-slate-800">{day.date} ({day.weekday})</td>
                          <td className="p-2 font-bold bg-slate-50 w-24 border-r border-slate-200 border-l">🏁 当日路线</td>
                          <td className="p-2 text-slate-800 font-semibold">{day.from} → {day.to}</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 font-bold bg-slate-50 border-r border-slate-200">⏰ 出发时间</td>
                          <td className="p-2 text-slate-800">{day.departureTime}</td>
                          <td className="p-2 font-bold bg-slate-50 border-r border-slate-200 border-l">🕒 预计到达</td>
                          <td className="p-2 text-slate-800">{day.arrivalTime}</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 font-bold bg-slate-50 border-r border-slate-200">🚗 里程路线</td>
                          <td className="p-2 text-slate-800">约 {day.distanceKm} 公里 ({day.roadType})</td>
                          <td className="p-2 font-bold bg-slate-50 border-r border-slate-200 border-l">🧭 导航终点</td>
                          <td className="p-2 text-slate-800 font-semibold">{day.navDestination}</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 font-bold bg-slate-50 border-r border-slate-200">⛽ 加油策略</td>
                          <td colSpan={3} className="p-2 text-slate-800">{day.fuelStrategy}</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 font-bold bg-slate-50 border-r border-slate-200">🍜 午餐</td>
                          <td className="p-2 text-slate-800">{day.lunch}</td>
                          <td className="p-2 font-bold bg-slate-50 border-r border-slate-200 border-l">🍲 晚餐</td>
                          <td className="p-2 text-slate-800">{day.dinner}</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 font-bold bg-slate-50 border-r border-slate-200">🌄 风景</td>
                          <td className="p-2 text-slate-800">{day.scenery}</td>
                          <td className="p-2 font-bold bg-slate-50 border-r border-slate-200 border-l">⭐ 景点</td>
                          <td className="p-2 text-slate-800 font-semibold">{day.attractions}</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 font-bold bg-slate-50 border-r border-slate-200">📸 拍照机位</td>
                          <td colSpan={3} className="p-2 text-slate-800">{day.photoSpots}</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 font-bold bg-slate-50 border-r border-slate-200">🏨 住宿推荐</td>
                          <td className="p-2 text-slate-800">{day.hotelInfo}</td>
                          <td className="p-2 font-bold bg-slate-50 border-r border-slate-200 border-l">💰 当日花费</td>
                          <td className="p-2 text-slate-800 font-semibold">{day.costBreakdown}</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 font-bold bg-slate-50 border-r border-slate-200">⚠️ 路况安全</td>
                          <td colSpan={3} className="p-2 text-red-700 font-medium">{day.roadConditions}</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold bg-slate-50 border-r border-slate-200">🔄 司机轮换</td>
                          <td colSpan={3} className="p-2 text-slate-800">{day.driverNotes}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {/* Budget & Safety Guidelines Section */}
        <section className="mt-10 border-t-2 border-slate-900 pt-6 break-inside-avoid">
          <h2 className="text-xl font-bold text-slate-950 mb-4">
            💡 预算拆解与安全建议
          </h2>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-300 text-xs text-slate-800 space-y-3">
            <div>
              <strong className="text-slate-950 font-bold">【费用拆解】（四人同行总计约 40,000 元，均摊 10,000 元/人）：</strong>
              <ol className="list-decimal list-inside mt-1.5 space-y-1">
                <li><strong>油费 + 过路费</strong>：全程约 7500 公里，四驱 SUV 油费加非节假日高速通行费预估在 7000 - 8000 元。(注：最后几日踩中十一国庆黄金周，可省去大笔高速过路费)</li>
                <li><strong>住宿</strong>：21晚平均每晚 330 元（两间房），共计约 7000 元。</li>
                <li><strong>餐饮</strong>：四人日均餐饮及补给约 500-600 元，22天共计约 12000 元。</li>
                <li><strong>门票及预备金</strong>：布达拉宫、纳木错等门票，以及车辆应急维修、氧气瓶购买储备约 5000 元。<strong>资金预留非常充裕。</strong></li>
              </ol>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <strong className="text-slate-950 font-bold">【高反应对与驾驶建议】：</strong>
              <ul className="list-disc list-inside mt-1.5 space-y-1">
                <li>3位司机轮流驾驶能极大减少疲劳，但进入高原（第7-10天）<strong>切勿洗澡洗头</strong>，防止感冒引发肺水肿。</li>
                <li>出发前一周可提前喝红景天，车内务必备好葡萄糖（补充体力）及多罐便携式氧气。</li>
                <li>G318/G317 山路不仅考验车技，更考验心态，<strong>绝不可盲目弯道超车，下长坡必须使用发动机低档制动！</strong>祝旅途平安，万事顺遂！</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer info in print */}
        <div className="mt-10 text-center text-xs text-slate-500 border-t border-slate-200 pt-4">
          通辽 - 318进藏 - 317出藏 22天自驾路书 · 祝一路顺风，平安凯旋！
        </div>
      </div>
    </div>
  );
};
