import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Languages, Bell } from 'lucide-react';
import { CafeSettings } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  settings: CafeSettings;
  activeLanguage: 'ar' | 'en';
  setActiveLanguage: (lang: 'ar' | 'en') => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  activeLanguage,
  setActiveLanguage,
}) => {
  return (
    <header className="relative w-full overflow-hidden border-b border-gold-600/20 bg-gradient-to-b from-[#121218]/90 to-[#0B0B0F]/95 py-6 px-4 md:px-8">
      {/* Background golden ambient glow blur */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-gold-600/10 blur-[90px] pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Top Control Bar */}
        <div className="w-full flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2 text-xs font-mono text-gold-500/80 bg-gold-900/40 px-3 py-1.5 rounded-full border border-gold-600/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
            </span>
            <span className="mr-1">{activeLanguage === 'ar' ? 'مفتوح الآن' : 'Open Now'}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <PWAInstallButton activeLanguage={activeLanguage} variant="header" />

            <button
              onClick={() => setActiveLanguage(activeLanguage === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gold-500/30 bg-gold-950/20 text-gold-400 hover:text-gold-300 hover:border-gold-500/60 hover:bg-gold-500/10 transition-all text-xs font-medium cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{activeLanguage === 'ar' ? 'English' : 'العربية'}</span>
            </button>
          </div>
        </div>

        {/* Exquisite Logo recreation of the exact circular emblem uploaded */}
        <div className="relative w-44 h-44 md:w-48 md:h-48 mb-6 flex items-center justify-center select-none">
          {/* Subtle slow rotating ambient aura ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            className="absolute inset-[1px] rounded-full border border-gold-600/30 border-dashed"
          />

          {/* Master Logo circular container containing exquisite details */}
          <div className="absolute inset-2 bg-gradient-to-br from-[#0a0a0d] to-[#121217] rounded-full border-2 border-gold-500 shadow-[0_4px_30px_rgba(223,177,91,0.25)] flex flex-col items-center justify-center overflow-hidden">
            {/* Ambient gold radial shine effect inside the logo container */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(223,177,91,0.06)_0%,transparent_70%)] pointer-events-none" />

            {settings.customLogoUrl ? (
              <img
                src={settings.customLogoUrl}
                alt="Cafe custom logo"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            ) : (
              <img
                src="/contigo-logo.png"
                alt="Contigo Logo"
                className="w-full h-full object-cover rounded-full select-none"
              />
            )}
          </div>
        </div>

        {/* Cafe Names & Slogans using Cairo for Arabic and Playfair for accenting */}
        <div className="text-center px-4">
          <h1 className="text-3xl md:text-4.5xl font-serif font-black tracking-wide gold-shimmer mb-3.5 filter drop-shadow-[0_2px_10px_rgba(223,177,91,0.15)]">
            {activeLanguage === 'ar' ? settings.nameAr : settings.nameEn}
          </h1>
          <p className="text-sm md:text-base text-gray-300 font-sans max-w-lg mx-auto font-medium leading-relaxed opacity-95">
            {activeLanguage === 'ar' ? settings.taglineAr : settings.taglineEn}
          </p>
          {/* Subtle golden divider */}
          <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-gold-500/50 to-transparent mx-auto mt-4" />
        </div>

        {/* Scrolling Announcement banner */}
        {((activeLanguage === 'ar' && settings.announcementAr) || (activeLanguage === 'en' && settings.announcementEn)) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mt-6 bg-gradient-to-r from-gold-950/20 via-gold-500/10 to-gold-950/20 rounded-xl p-3 border border-gold-500/15 flex items-center gap-3 text-sm text-gold-200"
          >
            <Bell className="w-4 h-4 text-gold-500 shrink-0" />
            <div className="overflow-hidden relative w-full h-5">
              <span className={`absolute whitespace-nowrap text-xs md:text-sm inline-block hover:pause ${
                activeLanguage === 'ar' 
                  ? 'animate-[scrollTextAr_20s_linear_infinite]' 
                  : 'animate-[scrollTextEn_20s_linear_infinite]'
              }`}>
                {activeLanguage === 'ar' ? settings.announcementAr : settings.announcementEn}
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Styled css keyframe injected online for fallback scrolling */}
      <style>{`
        @keyframes scrollTextEn {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes scrollTextAr {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </header>
  );
};
