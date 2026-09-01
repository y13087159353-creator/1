import { DayItinerary, PhaseInfo } from '../types';
import { PHASES, ITINERARY_DAYS } from '../data/itineraryData';

export function generateMarkdownRoadbook(days: DayItinerary[] = ITINERARY_DAYS): string {
  let md = `# 🚙 通辽 - 318进藏 - 317出藏 22天自驾路书\n\n`;
  md += `**📅 总行程日期**：9月15日 — 10月6日\n`;
  md += `**👥 车辆与人员**：1辆SUV，四人同行，三司机轮流驾驶\n`;
  md += `**💰 整体预算**：总计 40,000 元（人均 10,000 元，覆盖油路、食宿、门票）\n\n`;
  md += `---\n\n`;

  PHASES.forEach((phase) => {
    md += `## ${phase.name}（${phase.dateRange}）\n\n`;
    const phaseDays = days.filter((d) => d.phaseId === phase.id);

    phaseDays.forEach((day) => {
      md += `### 第${day.dayNumber}天：${day.routeTitle}\n`;
      md += `| 项目 | 内容 |\n`;
      md += `| :--- | :--- |\n`;
      md += `| 🗓️ **日期** | ${day.date} |\n`;
      md += `| 🏁 **当日路线** | ${day.from} → ${day.to} |\n`;
      md += `| ⏰ **出发** | ${day.departureTime} |\n`;
      md += `| 🕒 **到达** | ${day.arrivalTime} |\n`;
      md += `| 🚗 **里程** | 约 ${day.distanceKm} 公里 |\n`;
      md += `| 🛣️ **路线** | ${day.roadType} |\n`;
      md += `| 🧭 **导航** | ${day.navDestination} |\n`;
      md += `| ⛽ **加油** | ${day.fuelStrategy} |\n`;
      md += `| 🍜 **午餐** | ${day.lunch} |\n`;
      md += `| 🍲 **晚餐** | ${day.dinner} |\n`;
      md += `| 🌄 **风景** | ${day.scenery} |\n`;
      md += `| ⭐ **景点** | ${day.attractions} |\n`;
      md += `| 📸 **拍照** | ${day.photoSpots} |\n`;
      md += `| 🏨 **住宿** | ${day.hotelInfo} |\n`;
      md += `| 💰 **花费** | ${day.costBreakdown} |\n`;
      md += `| ⚠️ **路况** | ${day.roadConditions} |\n`;
      md += `| 🔄 **司机** | ${day.driverNotes} |\n\n`;
    });
  });

  md += `---\n\n## 💡 预算拆解与安全建议\n\n`;
  md += `**【费用拆解】（四人同行总计约 40,000 元，均摊 10,000 元/人）：**\n`;
  md += `1. **油费 + 过路费**：全程约 7500 公里，四驱 SUV 油费加非节假日高速通行费预估在 7000 - 8000 元。*(注：最后几日踩中十一国庆黄金周，可省去大笔高速过路费)*\n`;
  md += `2. **住宿**：21晚平均每晚 330 元（两间房），共计约 7000 元。\n`;
  md += `3. **餐饮**：四人日均餐饮及补给约 500-600 元，22天共计约 12000 元。\n`;
  md += `4. **门票及预备金**：布达拉宫、纳木错等门票，以及车辆应急维修、氧气瓶购买储备约 5000 元。**资金预留非常充裕。**\n\n`;
  md += `**【高反应对与驾驶建议】**\n`;
  md += `* 3位司机轮流驾驶能极大减少疲劳，但进入高原（第7-10天）**切勿洗澡洗头**，防止感冒引发肺水肿。\n`;
  md += `* 出发前一周可提前喝红景天，车内务必备好葡萄糖（补充体力）及多罐便携式氧气。\n`;
  md += `* G318/G317 山路不仅考验车技，更考验心态，**绝不可盲目弯道超车，下长坡必须使用发动机低档制动！**祝旅途平安，万事顺遂！\n`;

  return md;
}

export function copyToClipboard(text: string): Promise<boolean> {
  return navigator.clipboard.writeText(text).then(
    () => true,
    () => false
  );
}

export function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
