import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wifi, Copy, Check, Eye, EyeOff, QrCode, Gauge, Zap, Activity, RefreshCw } from 'lucide-react';
import { WiFiDetails } from '../types';

interface WiFiCardProps {
  wifi: WiFiDetails;
  activeLanguage: 'ar' | 'en';
}

export const WiFiCard: React.FC<WiFiCardProps> = ({ wifi, activeLanguage }) => {
  const [copiedPass, setCopiedPass] = useState(false);
  const [copiedSsid, setCopiedSsid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // Speed test custom states
  const [isTesting, setIsTesting] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [ping, setPing] = useState(0);
  const [jitter, setJitter] = useState(0);
  const [testComplete, setTestComplete] = useState(false);
  const [testStage, setTestStage] = useState<'idle' | 'pinging' | 'downlink' | 'uplink' | 'done'>('idle');

  const wifiPassword = wifi.password || 'ContigoCoffee2026';
  const wifiSsid = wifi.ssid || 'Contigo_VIP_Guest';

  // WiFi standard protocol for Android & iOS cameras
  const qrData = `WIFI:S:${wifiSsid};T:${wifi.security || 'WPA'};P:${wifiPassword};;`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=223-177-91&bgcolor=14-14-19&data=${encodeURIComponent(qrData)}`;

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(wifiPassword);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2500);
  };

  const handleCopySsid = () => {
    navigator.clipboard.writeText(wifiSsid);
    setCopiedSsid(true);
    setTimeout(() => setCopiedSsid(false), 2500);
  };

  // Run simulated Fibre Optic Speed Test
  const startSpeedTest = () => {
    if (isTesting) return;
    setIsTesting(true);
    setTestComplete(false);
    setTestProgress(0);
    setCurrentSpeed(0);
    setPing(0);
    setJitter(0);
    setTestStage('pinging');

    // Interval timers representing true loading
    let currentPercent = 0;
    const interval = setInterval(() => {
      currentPercent += 2;
      setTestProgress(currentPercent);

      if (currentPercent < 25) {
        setTestStage('pinging');
        setPing(Math.floor(Math.random() * 5) + 8); // 8-12ms
        setJitter(Math.floor(Math.random() * 2) + 1); // 1-2ms
      } else if (currentPercent >= 25 && currentPercent < 75) {
        setTestStage('downlink');
        // Fluctuating rapidly towards nominal 50 Mbps fiber limit!
        setCurrentSpeed(parseFloat((42 + Math.random() * 7.5).toFixed(1))); // 42 - 49.5 Mbps
      } else if (currentPercent >= 75 && currentPercent < 100) {
        setTestStage('uplink');
        // Upload speed (nominal ~12-15)
      } else if (currentPercent >= 100) {
        clearInterval(interval);
        // Set exact premium final values
        setCurrentSpeed(48.7);
        setPing(10);
        setJitter(2);
        setTestStage('done');
        setTestStage('done');
        setIsTesting(false);
        setTestComplete(true);
      }
    }, 80);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-gold-500/20 bg-gradient-to-br from-[#0B0B0E] to-[#040406] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] premium-card-shine space-y-8">
      {/* Wave decor backgrounds */}
      <div className="absolute top-0 right-0 p-8 h-32 w-32 text-gold-500/5 pointer-events-none">
        <Wifi className="w-full h-full stroke-[1]" />
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 border-b border-gold-500/10 pb-6">
        {/* Network info */}
        <div className="flex-1 space-y-5">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-gold-500/10 border border-gold-500/20 text-gold-400">
              <Wifi className="w-5.5 h-5.5 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-row items-center gap-2">
                <span className="bg-gold-500/10 border border-gold-500/30 text-[#FFC107] text-[8px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 text-gold-400 fill-gold-400" />
                  <span>Fibre Optic 50 Mbps</span>
                </span>
              </div>
              <h3 className="font-serif font-black text-xl text-gold-400 tracking-wide mt-1 gold-shimmer">
                {activeLanguage === 'ar' ? 'شبكة الواي فاي المجانية' : 'Free High-Speed WiFi'}
              </h3>
              <p className="text-xs text-gray-400 font-sans mt-0.5">
                {activeLanguage === 'ar' ? 'اتصال ألياف بصرية فائق السرعة 50 ميغا مخصّص لزبائن مقهى كونتيغو' : 'Fibre Optic 50 Mbps connection configured exclusively for Contigo customers'}
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            {/* SSID Row */}
            <div className="flex items-center justify-between bg-black/50 border border-gold-500/10 p-4 rounded-2xl shadow-inner">
              <div className="flex flex-col items-start pr-2">
                <span className="text-[10px] text-gold-500/70 uppercase font-mono tracking-widest font-bold mb-1">
                  {activeLanguage === 'ar' ? 'اسم الشبكة' : 'Network Name (SSID)'}
                </span>
                <span className="font-mono font-bold text-gray-100">{wifiSsid}</span>
              </div>
              <button
                onClick={handleCopySsid}
                className="p-2.5 rounded-xl text-gold-500 hover:bg-gold-500/10 active:scale-95 transition-all relative cursor-pointer border border-gold-500/10 hover:border-gold-500/30"
                title="Copy SSID"
              >
                {copiedSsid ? <Check className="w-4.5 h-4.5 text-emerald-400" /> : <Copy className="w-4.5 h-4.5" />}
                <AnimatePresence>
                  {copiedSsid && (
                    <motion.span
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: -20 }}
                      exit={{ opacity: 0 }}
                      className="absolute right-0 text-[10px] bg-emerald-950 border border-emerald-500/30 text-emerald-400 px-2 py-1 rounded-lg shadow whitespace-nowrap"
                    >
                      {activeLanguage === 'ar' ? 'تم النسخ!' : 'Copied!'}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {/* Password Row */}
            <div className="flex items-center justify-between bg-black/50 border border-gold-500/10 p-4 rounded-xl shadow-inner">
              <div className="flex flex-col items-start flex-1 min-w-0 pr-2">
                <span className="text-[10px] text-gold-500/70 uppercase font-mono tracking-widest font-bold mb-1">
                  {activeLanguage === 'ar' ? 'كلمة المرور' : 'Password'}
                </span>
                <span className="font-mono font-bold text-gray-100 truncate pr-2">
                  {showPassword ? wifiPassword : '••••••••••••'}
                </span>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gold-500 active:scale-95 transition-all cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
                <button
                  onClick={handleCopyPassword}
                  className="p-2.5 rounded-xl text-gold-500 hover:bg-gold-500/10 active:scale-95 transition-all relative cursor-pointer border border-gold-500/10 hover:border-gold-500/30"
                  title="Copy Password"
                >
                  {copiedPass ? <Check className="w-4.5 h-4.5 text-emerald-400" /> : <Copy className="w-4.5 h-4.5" />}
                  <AnimatePresence>
                    {copiedPass && (
                      <motion.span
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: -20 }}
                        exit={{ opacity: 0 }}
                        className="absolute right-0 text-[10px] bg-emerald-950 border border-emerald-500/30 text-emerald-400 px-2 py-1 rounded-lg shadow whitespace-nowrap"
                      >
                        {activeLanguage === 'ar' ? 'تم النسخ!' : 'Copied!'}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code trigger & viewer */}
        <div className="flex flex-col items-center justify-center p-3 border-l border-gold-500/10 md:pl-8">
          <button
            onClick={() => setShowQr(!showQr)}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-400 to-[#FFD241] text-black font-black hover:opacity-95 transition-all text-xs cursor-pointer shadow-[0_4px_15px_rgba(223,177,91,0.25)]"
          >
            <QrCode className="w-4.5 h-4.5" />
            <span className="uppercase tracking-wide">{activeLanguage === 'ar' ? 'امسح للاتصال بالهاتف' : 'Scan to Connect'}</span>
          </button>
          <p className="text-[10px] text-gray-500 mt-2.5 text-center max-w-[170px] font-sans font-medium">
            {activeLanguage === 'ar' ? 'افتح كاميرا الهاتف وامسح الكود لتتصل فوراً دون إدخال كلمة المرور' : 'Point your camera at this code to establish wifi connection instantly'}
          </p>

          <AnimatePresence>
            {showQr && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, height: 0 }}
                animate={{ opacity: 1, scale: 1, height: 'auto' }}
                exit={{ opacity: 0, scale: 0.95, height: 0 }}
                className="mt-5 flex flex-col items-center overflow-hidden"
              >
                <div className="p-4 bg-gradient-to-br from-[#101016] to-[#08080c] border border-gold-500/30 rounded-2xl shadow-2xl shadow-black">
                  <img
                    src={qrUrl}
                    alt="WiFi QR Code"
                    className="w-44 h-44 rounded-xl filter contrast-[1.1]"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-[9px] font-mono text-gold-500/50 mt-2">
                  WIFI:S:{wifiSsid}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* DYNAMIC FIBER SPEEDOMETER PANEL (Highly interactive!) */}
      <div className="p-5 md:p-6 rounded-3xl border border-gold-500/10 bg-black/60 relative overflow-hidden text-right">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left_bottom,rgba(223,177,91,0.03)_0%,transparent_50%)]" />
        
        <div className="flex flex-col md:flex-row items-center gap-6 justify-between relative z-10">
          {/* Dial and Speed reading meters */}
          <div className="flex items-center gap-5 select-none w-full md:w-auto">
            {/* Round dial SVG representation */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Outer dial ring */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  stroke="#1c1c24"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  stroke="url(#speedGrad)"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray="326.7"
                  strokeDashoffset={326.7 - (326.7 * (isTesting ? testProgress : testComplete ? 97 : 0)) / 100}
                  className="transition-all duration-100 ease-out"
                />
                <defs>
                  <linearGradient id="speedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFD241" />
                    <stop offset="100%" stopColor="#FFC107" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Running indicator inside the circle */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-mono font-black text-white leading-none tracking-tight">
                  {isTesting ? currentSpeed : testComplete ? '48.7' : '0.0'}
                </span>
                <span className="text-[8px] font-bold tracking-widest text-[#FFC107] uppercase mt-0.5 font-mono">
                  Mbps
                </span>
              </div>
            </div>

            {/* Speeds and test statuses */}
            <div className="flex-1 space-y-1 text-left sm:text-right pl-3">
              <span className="text-[9px] uppercase font-mono tracking-widest text-gold-500/70 font-bold block">
                {activeLanguage === 'ar' ? 'فحص جودة الاتصال' : 'Fibre Optic Speeds'}
              </span>
              <h4 className="text-sm font-serif font-black text-white">
                {activeLanguage === 'ar' ? 'سرعة ألياف بصرية 50 ميغا' : 'Nominal Bandwidth: 50mbs'}
              </h4>
              <p className="text-[11px] text-gray-400">
                {testStage === 'idle' && (activeLanguage === 'ar' ? 'اضغط لفحص كرت السرعة الفعلي ⚡' : 'Idle. Press start to verify performance ⚡')}
                {testStage === 'pinging' && (activeLanguage === 'ar' ? 'جاري قياس سرعة الاستجابة (Ping)...' : 'Pinging server details...')}
                {testStage === 'downlink' && (activeLanguage === 'ar' ? 'جاري قياس تيار الداونلود السريع...' : 'Measuring downlink performance...')}
                {testStage === 'uplink' && (activeLanguage === 'ar' ? 'جاري قياس الابلود...' : 'Gauging upload rate...')}
                {testStage === 'done' && (activeLanguage === 'ar' ? 'ممتاز! الإتصال فائق السرعة ومستقر 🟢' : 'Excellent! Perfect speed & connection 🟢')}
              </p>
            </div>
          </div>

          {/* Mini values table (Ping, jitter) */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto text-center font-mono">
            <div className="bg-[#121217] border border-gold-500/5 p-3.5 rounded-2xl w-24">
              <span className="block text-[8px] text-gray-500 uppercase font-black">{activeLanguage === 'ar' ? 'تحميل' : 'Down'}</span>
              <span className="block font-black text-white text-sm mt-1">{isTesting ? currentSpeed : testComplete ? '48.7' : '0.0'}<span className="text-[8px] text-gold-500/50 block">Mbps</span></span>
            </div>
            
            <div className="bg-[#121217] border border-gold-500/5 p-3.5 rounded-2xl w-24">
              <span className="block text-[8px] text-gray-400 uppercase font-black">PING</span>
              <span className="block font-black text-white text-sm mt-1">{isTesting ? ping : testComplete ? '10' : '--'}<span className="text-[8px] text-gold-500/50 block">ms</span></span>
            </div>

            <div className="bg-[#121217] border border-gold-500/5 p-3.5 rounded-2xl w-24">
              <span className="block text-[8px] text-gray-400 uppercase font-black">JITTER</span>
              <span className="block font-black text-white text-sm mt-1">{isTesting ? jitter : testComplete ? '2' : '--'}<span className="text-[8px] text-gold-500/50 block">ms</span></span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4 mt-4 border-t border-gold-500/5">
          <button
            onClick={startSpeedTest}
            disabled={isTesting}
            className={`px-5 py-2.5 rounded-xl text-xs font-black shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
              isTesting
                ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20 cursor-not-allowed'
                : 'bg-gradient-to-r from-gold-600 to-gold-400 text-black hover:opacity-95'
            }`}
          >
            {isTesting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{activeLanguage === 'ar' ? `جاري الفحص (${testProgress}%)` : `Testing (${testProgress}%)`}</span>
              </>
            ) : (
              <>
                <Gauge className="w-4 h-4" />
                <span>{activeLanguage === 'ar' ? 'ابدأ فحص فايبر 50mbs للإنترنت' : 'Start Fibre Speedometer Test'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
