import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { motion } from 'motion/react';
import { 
  Download, 
  Printer, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  Palette, 
  Smartphone, 
  Coffee, 
  Wifi, 
  Globe,
  Sliders,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { CafeSettings } from '../types';

interface PosterGeneratorProps {
  settings: CafeSettings;
  activeLanguage: 'ar' | 'en';
}

export const PosterGenerator: React.FC<PosterGeneratorProps> = ({ settings, activeLanguage }) => {
  const isAr = activeLanguage === 'ar';

  // Target application URL (defaults to current window origin or fallback)
  const defaultUrl = typeof window !== 'undefined' && window.location.origin 
    ? window.location.origin 
    : 'https://contigoappmenu.netlify.app/';

  const [qrUrl, setQrUrl] = useState(defaultUrl);
  const [posterStyle, setPosterStyle] = useState<'luxury_black' | 'warm_wood' | 'minimal_white' | 'emerald_gold'>('luxury_black');
  const [posterFormat, setPosterFormat] = useState<'table_tent' | 'a4_poster' | 'square_social'>('a4_poster');
  const [customHeadingAr, setCustomHeadingAr] = useState('مرحباً بكم في كونتيغو');
  const [customHeadingEn, setCustomHeadingEn] = useState('Welcome to Contigo');
  const [customSubAr, setCustomSubAr] = useState('امسح الرمز لاكتشاف المنيو وطلب قهوتك المفضلة');
  const [customSubEn, setCustomSubEn] = useState('Scan to explore the menu & order your coffee');
  const [includeWifi, setIncludeWifi] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Synchronize when settings or language updates
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.origin) {
      setQrUrl(window.location.origin);
    }
  }, []);

  // Helper to load image
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        // Retry without cors for local relative paths
        const imgFallback = new Image();
        imgFallback.onload = () => resolve(imgFallback);
        imgFallback.onerror = (e) => reject(e);
        imgFallback.src = src;
      };
      img.src = src;
    });
  };

  // Helper: Rounded rectangle drawer
  const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  // Main Canvas Render
  const renderPoster = async () => {
    setIsGenerating(true);

    try {
      // Dimensions based on format
      let W = 1200;
      let H = 1700; // Standard A4 Aspect Ratio (~1:1.414)
      if (posterFormat === 'table_tent') {
        W = 1000;
        H = 1400; // Table card
      } else if (posterFormat === 'square_social') {
        W = 1200;
        H = 1200; // 1:1 Social / Print card
      }

      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Theme Color Palette
      let bgGradientColors = ['#08080C', '#12121A', '#050507'];
      let borderColor = '#D4AF37'; // Gold
      let textPrimary = '#F5F5F7';
      let textAccent = '#FBBF24'; // Warm Gold
      let textSecondary = '#9CA3AF';
      let qrCardBg = '#FFFFFF';
      let qrDarkColor = '#09090D';

      if (posterStyle === 'warm_wood') {
        bgGradientColors = ['#1C100B', '#2A180F', '#120A06'];
        borderColor = '#E5A86D';
        textPrimary = '#FFF8F0';
        textAccent = '#F59E0B';
        textSecondary = '#D1B8A5';
        qrCardBg = '#FFFDF9';
        qrDarkColor = '#2D1609';
      } else if (posterStyle === 'minimal_white') {
        bgGradientColors = ['#FAFAFA', '#F3F4F6', '#E5E7EB'];
        borderColor = '#B45309';
        textPrimary = '#111827';
        textAccent = '#D97706';
        textSecondary = '#4B5563';
        qrCardBg = '#FFFFFF';
        qrDarkColor = '#000000';
      } else if (posterStyle === 'emerald_gold') {
        bgGradientColors = ['#061E14', '#0A2D1F', '#04140D'];
        borderColor = '#FCD34D';
        textPrimary = '#F0FDF4';
        textAccent = '#FBBF24';
        textSecondary = '#A7F3D0';
        qrCardBg = '#FFFFFF';
        qrDarkColor = '#062015';
      }

      // 2. Draw Poster Background
      const bgGrad = ctx.createLinearGradient(0, 0, W, H);
      bgGrad.addColorStop(0, bgGradientColors[0]);
      bgGrad.addColorStop(0.5, bgGradientColors[1]);
      bgGrad.addColorStop(1, bgGradientColors[2]);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Subtle atmospheric lighting / radial blur
      const radial = ctx.createRadialGradient(W / 2, H * 0.25, 50, W / 2, H * 0.25, W * 0.7);
      radial.addColorStop(0, 'rgba(245, 158, 11, 0.14)');
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, W, H);

      // 3. Double Luxury Border Frame
      const margin = 40;
      // Outer border
      roundRect(ctx, margin, margin, W - margin * 2, H - margin * 2, 28);
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 4;
      ctx.stroke();

      // Inner thin hairline frame
      const innerMargin = margin + 14;
      roundRect(ctx, innerMargin, innerMargin, W - innerMargin * 2, H - innerMargin * 2, 20);
      ctx.strokeStyle = `${borderColor}40`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Decorative corner accents
      const cornerSize = 24;
      const drawCorner = (cx: number, cy: number, flipX: number, flipY: number) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(flipX, flipY);
        ctx.beginPath();
        ctx.moveTo(0, cornerSize);
        ctx.lineTo(0, 0);
        ctx.lineTo(cornerSize, 0);
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
      };
      drawCorner(innerMargin + 8, innerMargin + 8, 1, 1);
      drawCorner(W - innerMargin - 8, innerMargin + 8, -1, 1);
      drawCorner(innerMargin + 8, H - innerMargin - 8, 1, -1);
      drawCorner(W - innerMargin - 8, H - innerMargin - 8, -1, -1);

      // 4. Draw Logo Header in Center Top
      const logoY = innerMargin + (posterFormat === 'square_social' ? 50 : 70);
      const logoRadius = posterFormat === 'square_social' ? 90 : 110;

      // Glow behind logo
      ctx.save();
      ctx.beginPath();
      ctx.arc(W / 2, logoY + logoRadius, logoRadius + 15, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
      ctx.fill();
      ctx.restore();

      // Logo Image
      let logoDrawn = false;
      const logoSrc = settings.customLogoUrl || '/contigo-logo.png';
      try {
        const logoImg = await loadImage(logoSrc);
        ctx.save();
        ctx.beginPath();
        ctx.arc(W / 2, logoY + logoRadius, logoRadius, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(logoImg, W / 2 - logoRadius, logoY, logoRadius * 2, logoRadius * 2);
        ctx.restore();

        // Golden circular border around logo
        ctx.beginPath();
        ctx.arc(W / 2, logoY + logoRadius, logoRadius, 0, Math.PI * 2);
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 5;
        ctx.stroke();
        logoDrawn = true;
      } catch (err) {
        console.warn('Could not load logo image for poster:', err);
      }

      if (!logoDrawn) {
        // Fallback elegant logo crest
        ctx.save();
        ctx.beginPath();
        ctx.arc(W / 2, logoY + logoRadius, logoRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 5;
        ctx.stroke();

        ctx.font = 'bold 70px "Segoe UI Emoji", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('☕', W / 2, logoY + logoRadius - 20);

        ctx.font = '900 28px "Space Grotesk", sans-serif';
        ctx.fillStyle = borderColor;
        ctx.fillText('CONTIGO', W / 2, logoY + logoRadius + 45);
        ctx.restore();
      }

      // 5. Typography Headings
      let currentY = logoY + logoRadius * 2 + 55;

      // Cafe Title
      ctx.textAlign = 'center';
      ctx.fillStyle = textPrimary;
      ctx.font = 'bold 44px "Cairo", "Segoe UI", sans-serif';
      ctx.fillText(settings.nameAr || 'كونتيغو كافي ومطعم', W / 2, currentY);

      currentY += 46;
      ctx.fillStyle = textAccent;
      ctx.font = '900 24px "Space Grotesk", sans-serif';
      ctx.letterSpacing = '5px';
      ctx.fillText(settings.nameEn ? settings.nameEn.toUpperCase() : 'CONTIGO COFFEE & RESTAURANT', W / 2, currentY);
      ctx.letterSpacing = '0px';

      // Decorative divider with star
      currentY += 35;
      ctx.strokeStyle = `${borderColor}60`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 160, currentY);
      ctx.lineTo(W / 2 - 30, currentY);
      ctx.moveTo(W / 2 + 30, currentY);
      ctx.lineTo(W / 2 + 160, currentY);
      ctx.stroke();

      ctx.fillStyle = textAccent;
      ctx.font = 'bold 20px sans-serif';
      ctx.textBaseline = 'middle';
      ctx.fillText('✦ ☕ ✦', W / 2, currentY);

      // Subtitle / Prompt
      currentY += 42;
      ctx.fillStyle = textSecondary;
      ctx.font = '500 22px "Cairo", sans-serif';
      ctx.fillText(customSubAr, W / 2, currentY);

      // 6. Generate High-Res QR Code onto Temp Canvas
      const qrCanvas = document.createElement('canvas');
      const qrBoxSize = posterFormat === 'square_social' ? 360 : 440;
      await QRCode.toCanvas(qrCanvas, qrUrl || 'https://contigoappmenu.netlify.app/', {
        errorCorrectionLevel: 'H',
        width: qrBoxSize,
        margin: 2,
        color: {
          dark: qrDarkColor,
          light: qrCardBg
        }
      });

      // Overlay the Contigo heart coffee bean emblem in the center of QR
      const qCtx = qrCanvas.getContext('2d');
      if (qCtx) {
        const qCenter = qrBoxSize / 2;
        const qLogoSize = Math.floor(qrBoxSize * 0.24);

        // White cutout circle
        qCtx.beginPath();
        qCtx.arc(qCenter, qCenter, qLogoSize / 2 + 6, 0, Math.PI * 2);
        qCtx.fillStyle = qrCardBg;
        qCtx.fill();

        // Dark background badge
        qCtx.beginPath();
        qCtx.arc(qCenter, qCenter, qLogoSize / 2, 0, Math.PI * 2);
        qCtx.fillStyle = '#000000';
        qCtx.fill();
        qCtx.strokeStyle = borderColor;
        qCtx.lineWidth = 3;
        qCtx.stroke();

        // Heart/Coffee Bean or Contigo text
        qCtx.fillStyle = '#FFFFFF';
        qCtx.font = 'bold 24px "Space Grotesk", sans-serif';
        qCtx.textAlign = 'center';
        qCtx.textBaseline = 'middle';
        qCtx.fillText('☕', qCenter, qCenter - 8);

        qCtx.fillStyle = '#F59E0B';
        qCtx.font = '900 11px "Space Grotesk", sans-serif';
        qCtx.fillText('CONTIGO', qCenter, qCenter + 16);
      }

      // 7. Draw QR Container Card on Poster
      currentY += 25;
      const cardPad = 24;
      const cardW = qrBoxSize + cardPad * 2;
      const cardH = qrBoxSize + cardPad * 2;
      const cardX = (W - cardW) / 2;
      const cardY = currentY;

      // Soft Shadow under QR Card
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 35;
      ctx.shadowOffsetY = 15;
      roundRect(ctx, cardX, cardY, cardW, cardH, 24);
      ctx.fillStyle = qrCardBg;
      ctx.fill();
      ctx.restore();

      // Border around QR Card
      roundRect(ctx, cardX, cardY, cardW, cardH, 24);
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Draw QR Canvas inside card
      ctx.drawImage(qrCanvas, cardX + cardPad, cardY + cardPad, qrBoxSize, qrBoxSize);

      // Scan instruction badge below QR
      currentY = cardY + cardH + 40;
      const badgeW = 340;
      const badgeH = 48;
      roundRect(ctx, (W - badgeW) / 2, currentY, badgeW, badgeH, 24);
      ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
      ctx.fill();
      ctx.strokeStyle = `${borderColor}70`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = textAccent;
      ctx.font = 'bold 18px "Cairo", sans-serif';
      ctx.textBaseline = 'middle';
      ctx.fillText('📷 وجّه كاميرا هاتفك للمسح مباشرة', W / 2, currentY + badgeH / 2);

      // 8. Footer Section (WiFi + Social) if space permits
      if (includeWifi && posterFormat !== 'square_social') {
        const footerY = H - innerMargin - 110;
        const footerW = W - innerMargin * 2 - 80;
        const footerX = (W - footerW) / 2;

        roundRect(ctx, footerX, footerY, footerW, 90, 18);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.fill();
        ctx.strokeStyle = `${borderColor}30`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // WiFi info left & right
        ctx.textAlign = 'right';
        ctx.fillStyle = textPrimary;
        ctx.font = 'bold 20px "Cairo", sans-serif';
        ctx.fillText(`شبكة الواي فاي: ${settings.wifi?.ssid || 'Contigo_VIP'}`, footerX + footerW - 30, footerY + 35);

        ctx.fillStyle = textSecondary;
        ctx.font = '16px "Cairo", monospace';
        ctx.fillText(`كلمة السر: ${settings.wifi?.password || 'ContigoCoffee2026'}`, footerX + footerW - 30, footerY + 65);

        ctx.textAlign = 'left';
        ctx.fillStyle = textAccent;
        ctx.font = 'bold 18px "Space Grotesk", sans-serif';
        ctx.fillText('📶 FREE HIGH SPEED WIFI', footerX + 30, footerY + 35);

        ctx.fillStyle = textSecondary;
        ctx.font = '14px sans-serif';
        ctx.fillText('Powered by Contigo Cafe', footerX + 30, footerY + 65);
      }

      // Convert to image preview
      const outDataUrl = canvas.toDataURL('image/png', 0.95);
      setPreviewDataUrl(outDataUrl);
      if (canvasRef.current) {
        const previewCanvas = canvasRef.current;
        previewCanvas.width = W;
        previewCanvas.height = H;
        const pCtx = previewCanvas.getContext('2d');
        if (pCtx) {
          pCtx.drawImage(canvas, 0, 0);
        }
      }
    } catch (e) {
      console.error('Failed to generate poster:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Re-generate on parameter change
  useEffect(() => {
    renderPoster();
  }, [qrUrl, posterStyle, posterFormat, customSubAr, includeWifi, settings]);

  const handleDownload = () => {
    if (!previewDataUrl) return;
    const link = document.createElement('a');
    link.download = `Contigo-Cafe-Poster-${posterStyle}-${posterFormat}.png`;
    link.href = previewDataUrl;
    link.click();
  };

  const handlePrint = () => {
    if (!previewDataUrl) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Contigo Coffee Poster Print</title>
          <style>
            @page { size: auto; margin: 0; }
            body { margin: 0; display: flex; justify-content: center; align-items: center; background: #000; height: 100vh; }
            img { max-width: 100%; max-height: 100vh; object-fit: contain; }
          </style>
        </head>
        <body>
          <img src="${previewDataUrl}" onload="window.print();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/15 to-transparent p-5 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-amber-500 text-black rounded-xl font-bold shadow-lg shadow-amber-500/20">
            <Printer className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-300 font-serif">
              {isAr ? 'مصمم أفيشات وملصقات الطاولات مع QR Code' : 'Contigo Printable Poster & QR Studio'}
            </h3>
            <p className="text-xs text-gray-400">
              {isAr 
                ? 'قم بإنشاء أفيش أنيق وعالي الدقة (A4 / بطاقة طاولة) مزود بشعار كافي كونتيغو والباركود للطباعة فوراً'
                : 'Create ultra-luxurious, printable A4 posters and table tents with Contigo logo & QR code.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleDownload}
            disabled={!previewDataUrl || isGenerating}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-extrabold text-sm shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>{isAr ? 'تنزيل الأفيش بجودة عالية (PNG)' : 'Download High-Res Poster'}</span>
          </button>
          <button
            onClick={handlePrint}
            disabled={!previewDataUrl || isGenerating}
            className="px-4 py-2.5 rounded-xl bg-black/60 border border-amber-500/40 text-amber-300 hover:bg-amber-500/10 font-bold text-sm transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            title={isAr ? 'طباعة مباشرة' : 'Direct Print'}
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">{isAr ? 'طباعة' : 'Print'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1. Theme Choice */}
          <div className="bg-black/40 border border-amber-500/20 rounded-2xl p-4 space-y-3">
            <label className="text-xs font-bold text-amber-400 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span>{isAr ? 'اختر نمط ولون الأفيش' : 'Poster Theme & Color'}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPosterStyle('luxury_black')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-start gap-1 transition-all cursor-pointer ${
                  posterStyle === 'luxury_black'
                    ? 'border-amber-400 bg-amber-500/20 text-amber-200 ring-1 ring-amber-400'
                    : 'border-gray-800 bg-black/50 text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#0d0d12] border border-amber-500" />
                  <span>{isAr ? 'أسود وذهب ملكي' : 'Luxury Black & Gold'}</span>
                </div>
                <span className="text-[10px] text-gray-500 font-normal">الأكثر فخامة ومطابقة للهوية</span>
              </button>

              <button
                type="button"
                onClick={() => setPosterStyle('warm_wood')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-start gap-1 transition-all cursor-pointer ${
                  posterStyle === 'warm_wood'
                    ? 'border-amber-400 bg-amber-500/20 text-amber-200 ring-1 ring-amber-400'
                    : 'border-gray-800 bg-black/50 text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#26140d] border border-amber-500" />
                  <span>{isAr ? 'بني قهوة دافئ' : 'Warm Mocha Coffee'}</span>
                </div>
                <span className="text-[10px] text-gray-500 font-normal">طابع مقاهي كلاسيكي هادئ</span>
              </button>

              <button
                type="button"
                onClick={() => setPosterStyle('emerald_gold')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-start gap-1 transition-all cursor-pointer ${
                  posterStyle === 'emerald_gold'
                    ? 'border-amber-400 bg-amber-500/20 text-amber-200 ring-1 ring-amber-400'
                    : 'border-gray-800 bg-black/50 text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#08281a] border border-amber-400" />
                  <span>{isAr ? 'زمردي أخضر وذهب' : 'Emerald & Gold'}</span>
                </div>
                <span className="text-[10px] text-gray-500 font-normal">حيوي ومنعش للطاولات</span>
              </button>

              <button
                type="button"
                onClick={() => setPosterStyle('minimal_white')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-start gap-1 transition-all cursor-pointer ${
                  posterStyle === 'minimal_white'
                    ? 'border-amber-400 bg-amber-500/20 text-amber-200 ring-1 ring-amber-400'
                    : 'border-gray-800 bg-black/50 text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-white border border-gray-400" />
                  <span>{isAr ? 'أبيض اقتصادي للطباعة' : 'Ink-Saving White'}</span>
                </div>
                <span className="text-[10px] text-gray-500 font-normal">يوفر حبر الطابعة العادية</span>
              </button>
            </div>
          </div>

          {/* 2. Format & Size */}
          <div className="bg-black/40 border border-amber-500/20 rounded-2xl p-4 space-y-3">
            <label className="text-xs font-bold text-amber-400 flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              <span>{isAr ? 'مقاس وشكل الملصق' : 'Poster Dimensions'}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPosterFormat('a4_poster')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  posterFormat === 'a4_poster'
                    ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold'
                    : 'border-gray-800 bg-black/50 text-gray-400 hover:text-white text-xs'
                }`}
              >
                <div className="text-xs font-bold">{isAr ? 'أفيش جداري A4' : 'A4 Wall Poster'}</div>
                <div className="text-[9px] text-gray-500">21 × 29.7 سم</div>
              </button>

              <button
                type="button"
                onClick={() => setPosterFormat('table_tent')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  posterFormat === 'table_tent'
                    ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold'
                    : 'border-gray-800 bg-black/50 text-gray-400 hover:text-white text-xs'
                }`}
              >
                <div className="text-xs font-bold">{isAr ? 'بطاقة طاولة' : 'Table Stand'}</div>
                <div className="text-[9px] text-gray-500">حجم متوسط للطاولات</div>
              </button>

              <button
                type="button"
                onClick={() => setPosterFormat('square_social')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  posterFormat === 'square_social'
                    ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold'
                    : 'border-gray-800 bg-black/50 text-gray-400 hover:text-white text-xs'
                }`}
              >
                <div className="text-xs font-bold">{isAr ? 'مربع ستوري/إنستا' : 'Square 1:1'}</div>
                <div className="text-[9px] text-gray-500">للمنشورات والمشاركة</div>
              </button>
            </div>
          </div>

          {/* 3. Link URL & Custom Text */}
          <div className="bg-black/40 border border-amber-500/20 rounded-2xl p-4 space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-400 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>{isAr ? 'الرابط الموجه عند مسح الكود' : 'Scanned URL'}</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={qrUrl}
                  onChange={(e) => setQrUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-gray-700 text-xs text-amber-200 focus:border-amber-400 outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      setQrUrl(window.location.origin);
                    }
                  }}
                  className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs hover:bg-amber-500/20"
                  title={isAr ? 'استعادة رابط التطبيق الحالي' : 'Use Current App Link'}
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-400">
                {isAr ? 'النص الإرشادي للزبائن' : 'Guide Text'}
              </label>
              <input
                type="text"
                value={customSubAr}
                onChange={(e) => setCustomSubAr(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-gray-700 text-xs text-white focus:border-amber-400 outline-none"
              />
            </div>

            <div className="pt-2 border-t border-gray-800 flex items-center justify-between">
              <label className="text-xs text-gray-300 flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeWifi}
                  onChange={(e) => setIncludeWifi(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 accent-amber-500"
                />
                <span>{isAr ? 'إدراج بيانات شبكة الواي فاي أسفل الأفيش' : 'Include Free WiFi Info at footer'}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Live Poster Preview Column */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'معاينة الأفيش المباشرة (جاهز للحفظ أو الطباعة)' : 'Live High-Resolution Poster Preview'}</span>
            </span>
            <span className="text-[10px] text-gray-500 font-mono">300 DPI Export Ready</span>
          </div>

          <div className="w-full bg-[#0a0a0e] p-4 md:p-6 rounded-3xl border border-amber-500/30 flex items-center justify-center shadow-2xl relative min-h-[480px]">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-3 text-amber-400">
                <RefreshCw className="w-8 h-8 animate-spin" />
                <span className="text-xs font-bold">{isAr ? 'جاري رسم وتوليد الأفيش الفخم...' : 'Rendering high-res poster...'}</span>
              </div>
            ) : previewDataUrl ? (
              <div className="relative group max-w-md w-full shadow-[0_15px_50px_rgba(0,0,0,0.9)] rounded-2xl overflow-hidden border border-amber-500/40">
                <img
                  src={previewDataUrl}
                  alt="Contigo Poster"
                  className="w-full h-auto block select-none"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4 backdrop-blur-xs">
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isAr ? 'تنزيل الصورة' : 'Download PNG'}</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl border border-white/40 flex items-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{isAr ? 'طباعة فورية' : 'Print'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-xs">
                {isAr ? 'اضغط لتوليد المعاينة' : 'Click to render preview'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
