import React from 'react';
import { WifiOff, Share, MoreVertical, Smartphone } from 'lucide-react';

export function OfflineGuide() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-start gap-3 md:items-center">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 border border-blue-200 shadow-sm">
          <WifiOff className="w-5 h-5 text-blue-700" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">藏区无信号？如何离线访问此路书</h3>
          <p className="text-sm text-slate-700 mt-1">
            川藏线沿途（如觉巴山、怒江72拐、无人区等）经常没有手机信号。为了确保您随时都能查看行程，强烈建议在出发前将本应用添加到手机桌面，实现<strong className="text-blue-700 font-bold">免流量、无网环境下的离线访问</strong>。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 pt-5 border-t border-blue-200/60">
        {/* iOS Guide */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🍎</span>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              苹果 iOS <span className="text-xs text-slate-500 font-medium">(Safari 浏览器)</span>
            </h4>
          </div>
          <ol className="text-sm text-slate-600 space-y-3 list-decimal list-outside ml-4">
            <li className="pl-1">
              在 Safari 浏览器底部点击 
              <span className="inline-flex items-center justify-center bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 align-middle mx-1 shadow-sm font-medium text-slate-700">
                <Share className="w-3.5 h-3.5 mr-1 text-blue-600" />分享
              </span> 
              图标
            </li>
            <li className="pl-1">
              在弹出的菜单中向上滑动，找到并点击 <strong className="text-slate-900">添加到主屏幕</strong> (Add to Home Screen)
            </li>
            <li className="pl-1">
              确认名称后，点击右上角的 <strong className="text-slate-900">添加</strong>
            </li>
            <li className="pl-1 text-blue-700 font-medium">
              ✨ 完成！之后您可以直接从手机桌面点击图标，即使完全没有网络也能秒开路书！
            </li>
          </ol>
        </div>

        {/* Android Guide */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🤖</span>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              安卓 Android <span className="text-xs text-slate-500 font-medium">(Chrome / 自带浏览器)</span>
            </h4>
          </div>
          <ol className="text-sm text-slate-600 space-y-3 list-decimal list-outside ml-4">
            <li className="pl-1">
              在浏览器右上角（或底部）点击 
              <span className="inline-flex items-center justify-center bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 align-middle mx-1 shadow-sm font-medium text-slate-700">
                <MoreVertical className="w-3.5 h-3.5 mr-0.5 text-blue-600" />菜单
              </span> 
              图标
            </li>
            <li className="pl-1">
              在下拉菜单中找到并点击 <strong className="text-slate-900">添加到主屏幕</strong> 或 <strong className="text-slate-900">安装应用</strong>
            </li>
            <li className="pl-1">
              确认添加，并等待系统自动生成桌面快捷方式
            </li>
            <li className="pl-1 text-blue-700 font-medium">
              ✨ 完成！返回手机桌面找到该图标，后续点开即可在无网环境下随时查阅！
            </li>
          </ol>
        </div>
      </div>
      
      <div className="mt-4 flex items-start gap-2 bg-slate-900 rounded-xl p-3 text-white shadow-sm">
        <Smartphone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed font-medium">
          <span className="text-emerald-400 font-bold">技术提示：</span> 本应用已开启 Progressive Web App (PWA) 离线缓存支持。当您使用上述方法将其添加到主屏幕后，系统会自动下载离线资源。请在 <strong className="text-white">网络良好的环境下（如酒店 Wi-Fi）先加载一次全页</strong>，之后即可安心断网使用。
        </p>
      </div>
    </div>
  );
}
