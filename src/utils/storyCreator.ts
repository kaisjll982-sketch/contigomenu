import { MenuItem, CafeSettings } from '../types';

export const generateAndShareStory = async (
  settings: CafeSettings,
  menuItems: MenuItem[],
  activeLanguage: 'ar' | 'en',
  onProgress: (msg: string) => void,
  onSuccess: (msg: string) => void,
  onError: (msg: string) => void
) => {
  onProgress(activeLanguage === 'ar' ? 'جاري تحضير الستوري...' : 'Creating your custom story card...');

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    onError(activeLanguage === 'ar' ? 'فشل تحضير الرسم' : 'Canvas initialization failed');
    return;
  }

  const W = 1080;
  const H = 1920;

  // Helper: load standard image URLs or Base64 images with robust fallback
  const loadImg = (src: string | undefined): Promise<HTMLImageElement | null> => {
    return new Promise((resolve) => {
      if (!src) { resolve(null); return; }
      const img = new Image();
      if (!src.startsWith('data:')) {
        img.crossOrigin = 'anonymous';
      }
      img.onload = () => resolve(img);
      img.onerror = () => {
        // Retry without CORS setting for safer local browser caching
        if (!src.startsWith('data:')) {
          const img2 = new Image();
          img2.onload = () => resolve(img2);
          img2.onerror = () => resolve(null);
          img2.src = src;
        } else {
          resolve(null);
        }
      };
      img.src = src;
    });
  };

  const drawRoundRectPath = (x: number, y: number, w: number, h: number, r: number) => {
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

  const fillRoundRect = (x: number, y: number, w: number, h: number, r: number, color: string) => {
    ctx.save();
    drawRoundRectPath(x, y, w, h, r);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  };

  const strokeRoundRect = (x: number, y: number, w: number, h: number, r: number, color: string, width: number) => {
    ctx.save();
    drawRoundRectPath(x, y, w, h, r);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.restore();
  };

  const drawImgRounded = (img: HTMLImageElement, x: number, y: number, w: number, h: number, r: number) => {
    ctx.save();
    drawRoundRectPath(x, y, w, h, r);
    ctx.clip();
    const s = Math.max(w / img.width, h / img.height);
    const sw = img.width * s;
    const sh = img.height * s;
    ctx.drawImage(img, x + (w - sw) / 2, y + (h - sh) / 2, sw, sh);
    ctx.restore();
  };

  try {
    // 1. BASE BACKGROUND (Rich elegant obsidian)
    ctx.fillStyle = '#08080c';
    ctx.fillRect(0, 0, W, H);

    // Subtle golden fluid aura at coordinates
    const topGlow = ctx.createRadialGradient(W / 2, 280, 0, W / 2, 280, 700);
    topGlow.addColorStop(0, 'rgba(255, 210, 65, 0.12)');
    topGlow.addColorStop(1, 'rgba(8, 8, 12, 0)');
    ctx.fillStyle = topGlow;
    ctx.fillRect(0, 0, W, H);

    // 2. ORNATE PREMIUM BORDERS
    strokeRoundRect(30, 30, W - 60, H - 60, 36, 'rgba(255,210,65,0.22)', 2);
    strokeRoundRect(45, 45, W - 90, H - 90, 28, 'rgba(255,210,65,0.08)', 1);

    // Filigree corners
    const drawCorner = (cx: number, cy: number, rot: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.strokeStyle = '#FFD241';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -30);
      ctx.lineTo(0, 0);
      ctx.lineTo(30, 0);
      ctx.stroke();
      ctx.restore();
    };
    drawCorner(70, 70, 0);
    drawCorner(W - 70, 70, Math.PI / 2);
    drawCorner(W - 70, H - 70, Math.PI);
    drawCorner(70, H - 70, -Math.PI / 2);

    // 3. HEADER CREST BRAND
    const logoY = 140;
    
    // Fallback golden circle vector for logo
    ctx.beginPath();
    ctx.arc(W / 2, logoY + 80, 90, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255,210,65,0.07)';
    ctx.fill();
    ctx.strokeStyle = '#FFD241';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.fillStyle = '#FFD241';
    ctx.font = 'bold 85px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('☕', W / 2, logoY + 80);

    // Brand Label
    ctx.fillStyle = '#FFD241';
    ctx.textBaseline = 'alphabetic';
    ctx.font = 'black 62px "Cairo", sans-serif';
    const brandName = activeLanguage === 'ar' ? settings.nameAr : settings.nameEn;
    ctx.fillText(brandName || 'CONTIGO', W / 2, logoY + 230);

    // Slogan Banner text
    ctx.fillStyle = '#f4e9d3';
    ctx.font = 'bold 30px "Cairo", sans-serif';
    const activeTagline = activeLanguage === 'ar' ? settings.taglineAr : settings.taglineEn;
    ctx.fillText(activeTagline || 'قهوتك في المدينة', W / 2, logoY + 285);

    // Gold elegant divider line
    ctx.strokeStyle = 'rgba(255,210,65,0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(280, logoY + 315);
    ctx.lineTo(W - 280, logoY + 315);
    ctx.stroke();

    // 4. DISPLAY GOURMET PRODUCTS (Grid of 4 items)
    const gridY = logoY + 360;
    const featuredItems = menuItems.filter(p => p.isAvailable).slice(0, 4);
    
    ctx.fillStyle = '#FFC107';
    ctx.font = 'bold 28px "Cairo", sans-serif';
    ctx.fillText(
      activeLanguage === 'ar' ? '✦ التشكيلة المفضلة اليوم ✦' : '✦ Featured Daily Specials ✦',
      W / 2,
      gridY
    );

    const cardW = 450;
    const cardH = 370;
    const gapX = 40;
    const gapY = 32;
    const startX = (W - (2 * cardW + gapX)) / 2;

    for (let i = 0; i < 4; i++) {
      // If we don't have enough products, we duplicate or use fallbacks safely
      const p = featuredItems[i] || menuItems[i % menuItems.length];
      if (!p) continue;

      const col = i % 2;
      const row = Math.floor(i / 2);
      const cx = startX + col * (cardW + gapX);
      const cy = gridY + 30 + row * (cardH + gapY);

      // Card Backing
      fillRoundRect(cx, cy, cardW, cardH, 20, '#111116');
      strokeRoundRect(cx, cy, cardW, cardH, 20, 'rgba(255,210,65,0.15)', 1.5);

      // Load specific product photo
      const img = await loadImg(p.imageUrl);
      if (img) {
        drawImgRounded(img, cx + 15, cy + 15, cardW - 30, 205, 14);
      } else {
        fillRoundRect(cx + 15, cy + 15, cardW - 30, 205, 14, 'rgba(255,210,65,0.06)');
        ctx.fillStyle = 'rgba(255,210,65,0.25)';
        ctx.font = 'bold 55px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('☕', cx + cardW / 2, cy + 130);
      }

      // Rounded frame inset
      strokeRoundRect(cx + 25, cy + 25, cardW - 50, 185, 10, 'rgba(255,255,255,0.04)', 1);

      // Label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'extrabold 28px "Cairo", sans-serif';
      ctx.textAlign = 'center';
      const pName = activeLanguage === 'ar' ? p.nameAr : p.nameEn;
      ctx.fillText(pName, cx + cardW / 2, cy + 260);

      // Prices
      const badgeW = 135;
      const badgeH = 42;
      fillRoundRect(cx + cardW / 2 - badgeW / 2, cy + 280, badgeW, badgeH, 12, 'rgba(255,210,65,0.12)');
      strokeRoundRect(cx + cardW / 2 - badgeW / 2, cy + 280, badgeW, badgeH, 12, 'rgba(255,210,65,0.3)', 1);
      
      ctx.fillStyle = '#FFD241';
      ctx.font = 'bold 24px "Cairo", sans-serif';
      ctx.fillText(`${p.price.toFixed(1)} DT`, cx + cardW / 2, cy + 310);

      // Category Subtext
      ctx.fillStyle = 'rgba(244,233,211,0.4)';
      ctx.font = 'bold 16px "Cairo", sans-serif';
      const catText = p.category === 'hot' ? '🔥 HOT' : p.category === 'cold' ? '🧊 COLD' : '🍰 dessert';
      ctx.fillText(catText, cx + cardW / 2, cy + 348);
    }

    // 5. INFORMATIVE PORTALS FOOTER (BOTTOM ADVERTISEMENT CO-OP)
    const footerY = gridY + 30 + 2 * (cardH + gapY) + 40;
    
    // Info Container
    fillRoundRect(80, footerY, W - 160, 310, 24, '#101014');
    strokeRoundRect(80, footerY, W - 160, 310, 24, 'rgba(255,210,65,0.15)', 1.5);

    let currY = footerY + 50;

    // Wifi SSID Row
    ctx.fillStyle = '#FFD241';
    ctx.font = 'bold 28px "Cairo", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`📶 WiFi: ${settings.wifi.ssid}`, W - 130, currY);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('WiFi GUEST', 130, currY);
    
    currY += 55;

    // Wifi Password
    ctx.fillStyle = '#f4e9d3';
    ctx.font = 'bold 24px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🔑 PASS: ${settings.wifi.password || 'ContigoFamily'}`, W / 2, currY);

    currY += 50;
    
    // Thin divider line
    ctx.strokeStyle = 'rgba(255,210,65,0.15)';
    ctx.beginPath();
    ctx.moveTo(140, currY);
    ctx.lineTo(W - 140, currY);
    ctx.stroke();

    currY += 45;

    // Delivery Phone Row
    ctx.fillStyle = '#FFD241';
    ctx.font = 'bold 28px "Cairo", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`🛵 CALL: ${settings.phone}`, W - 130, currY);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = 'bold 22px "Cairo", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(activeLanguage === 'ar' ? 'التوجيه السريع' : 'DELIVERY', 130, currY);

    currY += 50;

    // Location
    ctx.fillStyle = '#f4e9d3';
    ctx.font = 'bold 24px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      activeLanguage === 'ar' ? '📍 زورونا: شارع الحبيب بورقيبة' : '📍 VISIT: Avenue Habib Bourguiba',
      W / 2,
      currY
    );

    // 6. BRAND CREDITS
    ctx.fillStyle = 'rgba(255,210,65,0.45)';
    ctx.font = '18px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      activeLanguage === 'ar' ? 'صُنع بحب في تونس مع كافي كونتيغو' : 'Crafted with Love in Tunisia @ Contigo',
      W / 2,
      H - 120
    );

    canvas.toBlob((blob) => {
      if (!blob) {
        onError(activeLanguage === 'ar' ? 'فشل تحويل الصورة' : 'Blob conversion failed');
        return;
      }

      const triggerDownload = () => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'contigo_coffee_story.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        onSuccess(
          activeLanguage === 'ar'
            ? 'تم تحميل بطاقة الستوري بنجاح! شاركها الآن.'
            : 'Story card generated and downloaded instantly!'
        );
      };

      const file = new File([blob], 'contigo_story.png', { type: 'image/png' });
      const navigatorWithShare = navigator as any;

      if (navigatorWithShare.canShare && navigatorWithShare.canShare({ files: [file] })) {
        navigatorWithShare
          .share({
            files: [file],
            title: activeLanguage === 'ar' ? 'ستوري مقهى كونتيغو للقهوة' : 'Contigo Coffee Daily Menu Card',
            text: activeLanguage === 'ar' ? 'تفضلوا بزيارة كونتيغو والتمتع بأرقى الجلسات وأشهى أنواع القهوة.' : 'Join us at Contigo Coffee for the absolute best Tunis premium experience!'
          })
          .then(() => {
            onSuccess(activeLanguage === 'ar' ? 'تمت المشاركة بنجاح!' : 'Shared with success!');
          })
          .catch(() => {
            // Cancelled or issues, fallback safely
            triggerDownload();
          });
      } else {
        triggerDownload();
      }
    }, 'image/png');

  } catch (err) {
    console.error(err);
    onError(activeLanguage === 'ar' ? 'حدث خطأ في الرسم' : 'Rendering canvas exception occurred');
  }
};
