import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { motion } from 'motion/react';
import { 
  Download, 
  Sparkles, 
  RefreshCw, 
  Check, 
  Copy, 
  Share2, 
  Coffee, 
  Heart, 
  Star, 
  Printer, 
  Smartphone, 
  Layers, 
  Palette,
  ExternalLink 
} from 'lucide-react';

interface ContigoQRCodeProps {
  activeLanguage: 'ar' | 'en';
}

export const ContigoQRCode: React.FC<ContigoQRCodeProps> = ({ activeLanguage }) => {
  const [url, setUrl] = useState('https://contigoappmenu.netlify.app/');
  const [theme, setTheme] = useState<'luxury' | 'classic' | 'warm'>('luxury');
  const [centerLogo, setCenterLogo] = useState<'coffee' | 'heart' | 'star' | 'plain'>('coffee');
  const [copied, setCopied] = useState(false);
  const [qrSize, setQrSize] = useState<number>(512); // Export quality
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Theme details
  const getThemeColors = () => {
    switch (theme) {
      case 'luxury':
        return {
          dark: '#050507', // Deep slate black matrix
          light: '#FFFFFF', // High-contrast white background
          accent: '#E3A857', // Accent elements (gold border/cup)
          brandBg: '#09090D', // Center circle background
        };
      case 'warm':
        return {
          dark: '#3d2516', // Coffee brown matrix
          light: '#fdfbf7', // Vintage warm paper background
          accent: '#c0825c', // Soft mocha gold
          brandBg: '#2a1a10',
        };
      case 'classic':
      default:
        return {
          dark: '#000000',
          light: '#FFFFFF',
          accent: '#000000',
          brandBg: '#000000',
        };
    }
  };

  const getLogoEmoji = () => {
    switch (centerLogo) {
      case 'coffee': return '☕';
      case 'heart': return '❤️';
      case 'star': return '✨';
      case 'plain': return '';
    }
  };

  const generateQRCode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const colors = getThemeColors();
    const qrOption = {
      errorCorrectionLevel: 'H' as const, // Essential for allowing logo overlap (up to 30% restoration)
      width: qrSize,
      margin: 3,
      color: {
        dark: colors.dark,
        light: colors.light
      }
    };

    QRCode.toCanvas(canvas, url || 'https://contigoappmenu.netlify.app/', qrOption, (error) => {
      if (error) {
        console.error('Error rendering QR code with canvas:', error);
        return;
      }

      // ✦ GRAPHICS POST-PROCESSING: Render beautiful Contigo branded Logo overlay
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const size = canvas.width;
      const center = size / 2;
      const logoSize = Math.floor(size * 0.23); // Elegant visual scale fraction (23% of matrix)

      ctx.save();
      
      // 1. Clear circular background area on the center to avoid QR blocks leaking through
      ctx.beginPath();
      // Add small safety margin to avoid pixelated QR code dots peeking around logo borders
      ctx.arc(center, center, (logoSize / 2) + 6, 0, 2 * Math.PI);
      ctx.fillStyle = colors.light;
      ctx.fill();

      if (centerLogo !== 'plain') {
        // 2. Draw outer golden border circle
        ctx.beginPath();
        ctx.arc(center, center, logoSize / 2, 0, 2 * Math.PI);
        ctx.fillStyle = colors.brandBg;
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = Math.max(2, Math.floor(size * 0.008)); // proportional outline
        ctx.fill();
        ctx.stroke();

        // 3. Draw the premium emblem Emoji
        const emoji = getLogoEmoji();
        const emojiFontSize = Math.floor(logoSize * 0.42);
        ctx.font = `bold ${emojiFontSize}px "Inter", "Segoe UI Emoji", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Offset slightly upward to accommodate brand name text
        const textOffset = Math.floor(logoSize * 0.12);
        ctx.fillText(emoji, center, center - textOffset);

        // 4. Draw CONTIGO branded subtext
        const subtextFontSize = Math.floor(logoSize * 0.17);
        ctx.font = `black ${subtextFontSize}px "Space Grotesk", "Inter", sans-serif`;
        ctx.fillStyle = colors.accent;
        ctx.fillText('CONTIGO', center, center + (logoSize * 0.23));
      } else {
        // Minimal brand container mode
        ctx.beginPath();
        ctx.arc(center, center, logoSize / 2.2, 0, 2 * Math.PI);
        ctx.fillStyle = colors.accent;
        ctx.fill();

        ctx.font = `black ${Math.floor(logoSize * 0.19)}px "Space Grotesk", "Inter", sans-serif`;
        ctx.fillStyle = colors.light;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('CONTIGO', center, center);
      }

      ctx.restore();
    });
  };

  // Re-generate whenever URL, theme, logo or size configurations modify
  useEffect(() => {
    generateQRCode();
  }, [url, theme, centerLogo, qrSize]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Convert canvas matrix back to dynamic downloader source stream
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `contigo-menu-qr-code-${theme}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div id="contigo-qr-section" className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 p-6 rounded-3xl border border-gold-500/20 bg-gradient-to-br from-[#12121c] to-[#06060a] shadow-[0_12px_45px_rgba(0,0,0,0.7)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-44 h-44 bg-gold-500/5 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none group-hover:bg-gold-500/10 transition-all duration-700" />
        
        {/* Dynamic Canvas QR Visualizer Column */}
        <div className="flex flex-col items-center justify-center bg-black/45 p-4 rounded-2xl border border-gold-500/10 self-center md:self-stretch shadow-inner shrink-0 w-full md:w-56">
          <div className="bg-white p-2 rounded-2xl shadow-2xl relative max-w-[150px] w-full mx-auto flex items-center justify-center">
            <canvas 
              ref={canvasRef} 
              className="object-contain rounded-lg block"
              style={{ width: '130px', height: '130px', maxWidth: '100%', aspectRatio: '1/1' }}
            />
          </div>
          
          <div className="text-center mt-4 space-y-1">
            <span className="text-[10px] font-mono tracking-wider font-extrabold text-gold-400 flex items-center justify-center gap-1.5 uppercase">
              <Sparkles className="w-3 h-3 text-gold-400 animate-pulse" />
              <span>Contigo Logo Linked QR</span>
            </span>
            <span className="block text-[8.5px] text-gray-500 font-mono">
              30% Error correction [High]
            </span>
          </div>

          <button
            onClick={handleDownload}
            className="w-full mt-4 py-2.5 px-4 bg-gradient-to-r from-[#DCA14D] to-[#E3A857] hover:opacity-95 active:scale-98 text-black text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-gold-500/10"
          >
            <Download className="w-3.5 h-3.5 text-black" />
            <span>{activeLanguage === 'ar' ? 'تحميل كود QR الآن' : 'Download PNG Key'}</span>
          </button>
        </div>

        {/* Customization controls & parameters column */}
        <div className="flex-1 flex flex-col justify-between text-right space-y-5">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold text-white bg-gold-950/70 border border-gold-500/30 rounded-full uppercase">
                {activeLanguage === 'ar' ? 'مصمم الأكواد الذكي' : 'Branded Engine'}
              </span>
              <h4 className="text-base font-serif font-black text-white">
                {activeLanguage === 'ar' ? 'صانع كود المنيو الخاص بـ كونتيغو' : 'Contigo Custom QR Studio'}
              </h4>
            </div>

            {/* URL Input Box */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1 text-[10px] font-bold text-gray-450">
                <span className="font-mono text-[9px]">NETLIFY LINK PRESET</span>
                <label className="uppercase">
                  {activeLanguage === 'ar' ? 'الرابط الموجه للزبائن' : 'Target Scan Link'}
                </label>
              </div>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://contigoappmenu.netlify.app/"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-[#050507] border border-gold-500/15 rounded-xl text-xs text-gray-200 focus:border-gold-400 focus:shadow-inner outline-none transition-all text-left"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setUrl('https://contigoappmenu.netlify.app/')}
                  className="absolute right-3 top-2.5 p-1 bg-gold-500/10 hover:bg-gold-500/25 text-gold-400 rounded-lg text-[9px] font-mono tracking-widest font-bold transition-all cursor-pointer"
                >
                  RESET
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Theme custom selection */}
              <div className="space-y-1.5 text-right">
                <label className="block text-[10px] text-gray-400 font-bold uppercase">
                  {activeLanguage === 'ar' ? 'نمط الألوان والتصميم' : 'Color theme styling'}
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-black/35 p-1 rounded-xl border border-gold-500/10">
                  {[
                    { id: 'luxury', label: activeLanguage === 'ar' ? 'ذهبي' : 'Gold' },
                    { id: 'warm', label: activeLanguage === 'ar' ? 'كلاسيكي' : 'Mocha' },
                    { id: 'classic', label: activeLanguage === 'ar' ? 'أسود' : 'Slate' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id as any)}
                      className={`py-2 px-1 text-[10x] font-bold rounded-lg transition-all cursor-pointer ${
                        theme === t.id 
                          ? 'bg-gold-500/15 text-gold-400 border border-gold-400/30 font-black' 
                          : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logo customization choice */}
              <div className="space-y-1.5 text-right">
                <label className="block text-[10px] text-gray-400 font-bold uppercase">
                  {activeLanguage === 'ar' ? 'أيقونة الهوية بالمنتصف' : 'Core Emblem Logo'}
                </label>
                <div className="grid grid-cols-4 gap-1.5 bg-black/35 p-1 rounded-xl border border-gold-500/10">
                  {[
                    { id: 'coffee', label: '☕' },
                    { id: 'heart', label: '❤️' },
                    { id: 'star', label: '✨' },
                    { id: 'plain', label: 'TXT' }
                  ].map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setCenterLogo(l.id as any)}
                      className={`py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                        centerLogo === l.id 
                          ? 'bg-gold-500/15 text-gold-400 border border-gold-400/30' 
                          : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Resolution Selector for high printing quality */}
            <div className="space-y-1.5 text-right">
              <label className="block text-[10px] text-gray-400 font-bold uppercase">
                {activeLanguage === 'ar' ? 'دقة مصفوفة الطباعة والرفع' : 'Export matrix quality'}
              </label>
              <div className="flex gap-2 justify-end">
                {[
                  { value: 256, label: 'Standard (256px)' },
                  { value: 512, label: 'High (512px)' },
                  { value: 1024, label: 'Ultra HD (1024px)' }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setQrSize(item.value)}
                    className={`px-3 py-1.5 text-[9px] font-mono rounded-lg transition-all cursor-pointer ${
                      qrSize === item.value 
                        ? 'bg-gold-950/50 text-gold-400 border border-gold-500/30 font-black' 
                        : 'bg-black/30 text-gray-450 border border-transparent hover:text-gray-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex flex-wrap gap-2 justify-end">
            {/* Copy target url link */}
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                copied 
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400' 
                  : 'bg-[#0f0e13] border-gold-500/15 text-gold-500 hover:border-gold-500/35 hover:bg-gold-500/5'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (activeLanguage === 'ar' ? 'تم النسخ!' : 'Copied!') : (activeLanguage === 'ar' ? 'نسخ الرابط المستهدف' : 'Copy link')}</span>
            </button>

            {/* Table Badge quick mockup popup instruction */}
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-[#121217] border border-gold-500/20 text-gold-400 rounded-xl text-xs font-bold hover:border-gold-400 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{activeLanguage === 'ar' ? 'طباعة الكود المباشر' : 'Print Table Card'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
