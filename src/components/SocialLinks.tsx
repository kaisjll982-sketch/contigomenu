import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Instagram, Facebook, MapPin, Phone, MessageSquareShare, QrCode, Copy, Check, ExternalLink } from 'lucide-react';
import { CafeSettings } from '../types';
import { ContigoQRCode } from './ContigoQRCode';

interface SocialLinksProps {
  settings: CafeSettings;
  activeLanguage: 'ar' | 'en';
}

export const SocialLinks: React.FC<SocialLinksProps> = ({ settings, activeLanguage }) => {
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? (window.location.origin + window.location.pathname) : 'https://ais-pre-u46t2cb6fbm3pci6mpxmkd-751421965509.europe-west2.run.app';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const cards = [
    {
      id: 'instagram',
      name: activeLanguage === 'ar' ? 'إنستغرام كونتيغو' : 'Instagram Feed',
      subtitle: '@contigo.restaurant',
      icon: <Instagram className="w-5.5 h-5.5 text-[#E1306C]" />,
      url: settings.instagram || 'https://instagram.com/contigo',
      color: 'hover:border-[#E1306C]/40 hover:bg-[#E1306C]/5',
    },
    {
      id: 'facebook',
      name: activeLanguage === 'ar' ? 'صفحة الفيسبوك' : 'Facebook Page',
      subtitle: '/contigo.restaurant',
      icon: <Facebook className="w-5.5 h-5.5 text-[#1877F2]" />,
      url: settings.facebook || 'https://facebook.com/contigo',
      color: 'hover:border-[#1877F2]/40 hover:bg-[#1877F2]/5',
    },
    {
      id: 'location',
      name: activeLanguage === 'ar' ? 'موقعنا على الخريطة' : 'Google Maps Location',
      subtitle: activeLanguage === 'ar' ? 'أمام المعهد العالي للتكنولوجيا بسيدي بوزيد ISET' : 'In front of ISET Sidi Bouzid',
      icon: <MapPin className="w-5.5 h-5.5 text-emerald-400" />,
      url: settings.locationUrl && !settings.locationUrl.includes('Contigo+Restaurant') ? settings.locationUrl : 'https://www.google.com/maps/search/?api=1&query=Contigo+Coffee+ISET+Sidi+Bouzid',
      color: 'hover:border-emerald-500/40 hover:bg-emerald-500/5',
    },
    {
      id: 'phone',
      name: activeLanguage === 'ar' ? 'اتصل بنا مباشرة' : 'Direct Assistance',
      subtitle: settings.phone,
      icon: <Phone className="w-5.5 h-5.5 text-gold-500 animate-bounce" />,
      url: `tel:${settings.phone}`,
      color: 'hover:border-gold-500/40 hover:bg-gold-500/5',
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2.5 mb-2 px-1">
        <MessageSquareShare className="w-5 h-5 text-gold-400" />
        <h3 className="font-serif font-black text-xl text-gold-400 tracking-wide gold-shimmer animate-pulse">
          {activeLanguage === 'ar' ? 'تواصل معنا واكتشف جديدنا' : 'Connect & Support Us'}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => (
          <motion.a
            key={card.id}
            href={card.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-4.5 p-5 rounded-2xl border border-gold-500/10 bg-gradient-to-br from-[#14141d] to-[#08080c] shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300 premium-card-shine ${card.color} group cursor-pointer hover:shadow-[0_12px_25px_rgba(223,177,91,0.08)]`}
          >
            {/* Round Icon */}
            <div className="p-3.5 bg-black/55 rounded-2xl group-hover:bg-black/30 group-hover:scale-110 transition-all duration-500 border border-gold-500/10 group-hover:border-gold-500/25 shadow-inner">
              {card.icon}
            </div>

            <div className="flex-1 min-w-0">
              <span className="block text-sm font-extrabold text-[#f3f4f6] group-hover:text-gold-400 transition-colors truncate">
                {card.name}
              </span>
              <span className="block text-xs font-mono text-gray-500 mt-1 truncate">
                {card.subtitle}
              </span>
            </div>

            <div className="bg-black/40 px-3 py-1.5 rounded-xl border border-gold-500/10 text-gold-500 group-hover:text-gold-300 group-hover:border-gold-500/30 shrink-0 transition-all font-mono text-[10px] font-bold">
              {activeLanguage === 'ar' ? 'زيارة' : 'VISIT'} ➔
            </div>
          </motion.a>
        ))}
      </div>

      {/* Premium Dynamic QR Code Card & Direct Assistance Studio */}
      <ContigoQRCode activeLanguage={activeLanguage} />
    </div>
  );
};

