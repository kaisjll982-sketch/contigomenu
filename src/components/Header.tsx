import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Languages, Bell } from 'lucide-react';
import { CafeSettings } from '../types';

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

          <button
            onClick={() => setActiveLanguage(activeLanguage === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gold-500/30 bg-gold-950/20 text-gold-400 hover:text-gold-300 hover:border-gold-500/60 hover:bg-gold-500/10 transition-all text-xs font-medium cursor-pointer"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{activeLanguage === 'ar' ? 'English' : 'العربية'}</span>
          </button>
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
              <svg viewBox="0 0 200 200" className="w-full h-full p-2 select-none absolute inset-0 z-10">
                <defs>
                  {/* Gold gradient for maximum fidelity to the logo */}
                  <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFD241" />
                    <stop offset="50%" stopColor="#FFF1AA" />
                    <stop offset="100%" stopColor="#B88200" />
                  </linearGradient>
                </defs>

                {/* Top Ornate Filigree/Scroll design - Recreating the logo's classical flourishes */}
                <g fill="none" stroke="url(#goldGrad)" strokeWidth="1.8" strokeLinecap="round">
                  {/* Left wing curve */}
                  <path d="M 45,98 C 42,75 50,55 70,45 C 80,40 100,50 90,60 C 80,70 65,60 65,55 C 65,50 78,45 85,48 M 46,92 C 55,75 68,78 68,66" />
                  {/* Right wing curve */}
                  <path d="M 155,98 C 158,75 150,55 130,45 C 120,40 100,50 110,60 C 120,70 135,60 135,55 C 135,50 122,45 115,48 M 154,92 C 145,75 132,78 132,66" />

                  {/* Bottom Ornate scroll completing the circle frame */}
                  <path d="M 45,115 C 42,138 52,158 72,168 C 85,174 100,165 92,155 C 85,145 72,152 75,158 C 78,164 90,165 98,166 L 102,166 C 110,165 122,164 125,158 C 128,152 115,145 108,155 C 100,165 115,174 128,168 C 148,158 158,138 155,115" />
                  {/* Lower tiny leaves decoration */}
                  <path d="M 90,175 C 95,182 100,185 100,185 C 100,185 105,182 110,175" strokeWidth="2" />
                  <circle cx="100" cy="186" r="1.5" fill="url(#goldGrad)" />
                </g>

                {/* Artistic Coffee Cup, Saucer and rising dynamic flame-like steam in center */}
                <g transform="translate(0, -6)">
                  {/* Elegant central rising steam flame */}
                  <path d="M 94,80 C 88,72 87,55 100,38 C 107,46 103,58 96,66 C 94,68 97,70 100,72 C 103,74 105,68 106,64 C 108,60 112,50 108,42 C 112,50 112,58 107,66 C 104,70 102,74 96,80 Z" fill="url(#goldGrad)" className="animate-pulse" />

                  {/* Elegant Cup Outline with cross-hatch shading style matching logo */}
                  <path d="M 76,82 L 124,82 C 124,103 114,112 100,112 C 86,112 76,103 76,82 Z" fill="#0c0c10" stroke="url(#goldGrad)" strokeWidth="2.5" />
                  
                  {/* Fine shading lines on cup bottom-right matching engraving look */}
                  <path d="M 112,87 C 112,100 108,106 100,106" fill="none" stroke="url(#goldGrad)" strokeWidth="0.8" strokeDasharray="2,2" />

                  {/* Elegant Cup handle */}
                  <path d="M 124,90 C 132,90 133,98 124,101" fill="none" stroke="url(#goldGrad)" strokeWidth="2" strokeLinecap="round" />

                  {/* Saucer */}
                  <path d="M 70,115 L 130,115 C 122,121 78,121 70,115 Z" fill="#0c0c10" stroke="url(#goldGrad)" strokeWidth="1.8" />
                </g>

                {/* Bold Serif CONTIGO Brand text inside the center-bottom of emblem */}
                <text
                  x="100"
                  y="136"
                  textAnchor="middle"
                  fill="url(#goldGrad)"
                  fontFamily="'Cairo', 'Space Grotesk', serif"
                  fontWeight="900"
                  fontSize="18.5"
                  letterSpacing="1.2"
                  className="font-bold tracking-wider"
                >
                  CONTIGO
                </text>

                {/* Smaller clean RESTAURANT subtitle */}
                <text
                  x="100"
                  y="148"
                  textAnchor="middle"
                  fill="url(#goldGrad)"
                  fontFamily="system-ui, sans-serif"
                  fontWeight="700"
                  fontSize="6"
                  letterSpacing="2.8"
                  opacity="0.9"
                >
                  RESTAURANT
                </text>
              </svg>
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
