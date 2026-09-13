import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Monitor, Share2, PlusSquare, X, CheckCircle2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PWAInstallButtonProps {
  activeLanguage: 'ar' | 'en';
  variant?: 'floating' | 'banner' | 'header' | 'button';
  onInstalledToast?: (msg: string) => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  activeLanguage,
  variant = 'header',
  onInstalledToast,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // Always show button unless user literally just completed installation in this session and sees the success state
  // We keep it visible so users can re-open instructions or install on desktop/mobile even inside iframes

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowGuideModal(true);
      return;
    }

    if (isInstallable) {
      const result = await install();
      if (result === 'accepted') {
        setInstallSuccess(true);
        if (onInstalledToast) {
          onInstalledToast(
            activeLanguage === 'ar'
              ? 'تم تثبيت تطبيق Contigo بنجاح على جهازك! 🎉'
              : 'Contigo App installed successfully! 🎉'
          );
        }
      }
    } else {
      // In case beforeinstallprompt hasn't fired or running in desktop browser / preview iframe
      setShowGuideModal(true);
    }
  };

  const isAr = activeLanguage === 'ar';

  return (
    <>
      {/* Header compact button */}
      {variant === 'header' && (
        <button
          id="pwa-install-header-btn"
          onClick={handleInstallClick}
          className="relative group flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black font-extrabold text-xs shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:shadow-[0_0_20px_rgba(245,158,11,0.6)] border border-amber-300 transition-all active:scale-95 cursor-pointer"
          title={isAr ? 'تثبيت تطبيق Contigo على الهاتف أو الحاسوب' : 'Install Contigo App'}
        >
          <span className="p-1 rounded-md bg-black/15">
            <Download className="w-3.5 h-3.5 text-black stroke-[3]" />
          </span>
          <span className="whitespace-nowrap font-sans font-bold">
            {isAr ? '📲 تثبيت التطبيق' : '📲 Install App'}
          </span>
        </button>
      )}

      {/* Floating Action Button (prominent on mobile / desktop) */}
      {variant === 'floating' && (
        <div className="fixed bottom-6 right-6 z-40">
          <motion.button
            id="pwa-install-fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleInstallClick}
            className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-zinc-950 font-bold text-sm shadow-xl shadow-amber-950/50 border border-amber-300/40 backdrop-blur-lg cursor-pointer"
          >
            <div className="p-1 rounded-lg bg-zinc-950/20">
              <Download className="w-4 h-4 text-zinc-950 stroke-[2.5]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-extrabold tracking-wide uppercase">
                {isAr ? 'تثبيت Contigo' : 'Install Contigo'}
              </span>
              <span className="text-[10px] font-medium text-zinc-900/80">
                {isAr ? 'بنقرة زر واحدة' : '1-Click PWA App'}
              </span>
            </div>
          </motion.button>
        </div>
      )}

      {/* Standard Button (used inside menus or banners) */}
      {variant === 'button' && (
        <button
          id="pwa-install-main-btn"
          onClick={handleInstallClick}
          className="w-full flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-amber-950/60 via-amber-900/40 to-stone-900/70 border border-amber-600/40 hover:border-amber-500 text-amber-100 transition shadow-md active:scale-98"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-amber-200">
                {isAr ? 'تثبيت التطبيق على هاتفك أو حاسوبك' : 'Install App on Phone & PC'}
              </div>
              <div className="text-xs text-stone-400">
                {isAr ? 'استمتع بتجربة أسرع بدون متصفح ويعمل بدون إنترنت' : 'Faster experience, full screen, works offline'}
              </div>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-sm">
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{isAr ? 'تثبيت الآن' : 'Install'}</span>
          </div>
        </button>
      )}

      {/* Installation Guide Modal (for iOS or browsers requiring step confirmation) */}
      <AnimatePresence>
        {showGuideModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md rounded-2xl bg-[#1a110a] border border-amber-600/40 p-6 text-stone-200 shadow-2xl overflow-hidden"
              dir={isAr ? 'rtl' : 'ltr'}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowGuideModal(false)}
                className="absolute top-4 left-4 p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 flex items-center justify-center shadow-lg">
                  <img src="/pwa-192x192.png" alt="Contigo Icon" className="w-full h-full rounded-xl object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-amber-200">
                    {isAr ? 'تثبيت تطبيق Contigo Coffee' : 'Install Contigo Coffee'}
                  </h3>
                  <p className="text-xs text-amber-400/80">
                    {isAr ? 'تطبيق ويب تقدمي (PWA) فائق السرعة' : 'Progressive Web App (PWA)'}
                  </p>
                </div>
              </div>

              {/* Instructions based on platform */}
              {isIOS ? (
                <div className="space-y-3.5 py-2">
                  <div className="text-xs text-stone-300 font-medium leading-relaxed">
                    {isAr
                      ? 'على هواتف iPhone و iPad (متصفح Safari)، يمكنك تثبيت التطبيق بخطوتين بسيطتين:'
                      : 'On iPhone and iPad (Safari), you can install the app in 2 easy steps:'}
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-900/70 border border-stone-800">
                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 mt-0.5">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">
                        {isAr ? '1. اضغط على زر المشاركة (Share)' : '1. Tap the Share button'}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        {isAr ? 'الموجود في شريط المتصفح أسفل الشاشة.' : 'In the Safari browser toolbar at the bottom.'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-900/70 border border-stone-800">
                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 mt-0.5">
                      <PlusSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">
                        {isAr ? '2. اختر "إضافة إلى الشاشة الرئيسية"' : '2. Select "Add to Home Screen"'}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        {isAr ? 'ثم اضغط على "إضافة" في الزاوية العليا.' : 'Then tap "Add" in the top corner.'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5 py-2">
                  <div className="text-xs text-stone-300 font-medium leading-relaxed">
                    {isAr
                      ? 'لتثبيت التطبيق على الهاتف (Android) أو الكمبيوتر (Chrome / Edge):'
                      : 'To install on Android or Desktop (Chrome / Edge):'}
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-900/70 border border-stone-800">
                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 mt-0.5">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">
                        {isAr ? 'على الهاتف (Chrome):' : 'On Android (Chrome):'}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        {isAr
                          ? 'اضغط على زر الخيارات (⋮) أعلى المتصفح ثم اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية".'
                          : 'Tap menu (⋮) and tap "Install App" or "Add to Home Screen".'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-900/70 border border-stone-800">
                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 mt-0.5">
                      <Monitor className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">
                        {isAr ? 'على الحاسوب (Windows / Mac):' : 'On Desktop (Chrome / Edge):'}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        {isAr
                          ? 'انقر على أيقونة التثبيت (⊕ أو الشاشة مع السهم) الموجودة في شريط عنوان الرابط أعلى المتصفح.'
                          : 'Click the install icon (⊕ or screen icon) in the browser address bar.'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-stone-800/80 flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowGuideModal(false)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition"
                >
                  {isAr ? 'فهمت، شكراً' : 'Got it, thanks'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
