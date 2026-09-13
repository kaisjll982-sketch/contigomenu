import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC<{ activeLanguage: 'ar' | 'en' }> = ({ activeLanguage }) => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600/90 text-zinc-950 px-3 py-1.5 text-xs font-bold shadow-lg backdrop-blur-md border border-amber-400/40 animate-pulse">
      <WifiOff className="w-4 h-4 text-zinc-950" />
      <span>
        {activeLanguage === 'ar'
          ? 'وضع عدم الاتصال — تعمل النسخة المحفوظة بنجاح'
          : 'Offline Mode — Cached data is active'}
      </span>
    </div>
  );
};
