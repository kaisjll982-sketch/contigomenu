import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Unlock,
  Settings,
  Coffee,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  XCircle,
  Save,
  LogOut,
  X,
  Eye,
  EyeOff,
  Wifi,
  Link,
  Info,
  Camera,
  Upload,
  Image as ImageIcon,
  Printer
} from 'lucide-react';
import { MenuItem, CafeSettings } from '../types';
import { PosterGenerator } from './PosterGenerator';

const STOCK_PRESETS = [
  {
    url: 'https://images.unsplash.com/photo-151097252790b-af4f42df8e56?q=80&w=600',
    nameAr: 'إسبريسو سينغل / دبل',
    nameEn: 'Espresso',
    category: 'hot'
  },
  {
    url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=600',
    nameAr: 'كابوتشينو كلاسيكي',
    nameEn: 'Cappuccino Latte',
    category: 'hot'
  },
  {
    url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600',
    nameAr: 'قهوة بالكريمة / كافيه كريم',
    nameEn: 'Café Crème',
    category: 'hot'
  },
  {
    url: 'https://images.unsplash.com/photo-1588725801262-bdf477112046?q=80&w=600',
    nameAr: 'قهوة تركي / عربي',
    nameEn: 'Arabian Style Coffee',
    category: 'hot'
  },
  {
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600',
    nameAr: 'شاي أخضر بالنعناع الفريش',
    nameEn: 'Mint Green Tea',
    category: 'hot'
  },
  {
    url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=600',
    nameAr: 'شوكولاتة دافئة غنية',
    nameEn: 'Rich Hot Choco',
    category: 'hot'
  },
  {
    url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600',
    nameAr: 'آيس لاتيه بارد منعش',
    nameEn: 'Iced Latte Cold',
    category: 'cold'
  },
  {
    url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=600',
    nameAr: 'فرابيه مثلج خافق مخملي',
    nameEn: 'Iced Frappé',
    category: 'cold'
  },
  {
    url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=600',
    nameAr: 'عصير برتقال طبيعي معصور',
    nameEn: 'Fresh Orange Juice',
    category: 'cold'
  },
  {
    url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600',
    nameAr: 'موهيتو ليمون ونعناع منعش',
    nameEn: 'Classic Mojito',
    category: 'cold'
  },
  {
    url: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=600',
    nameAr: 'ميلك شيك الشوكولاتة والآيس كريم',
    nameEn: 'Chocolate Milkshake',
    category: 'cold'
  },
  {
    url: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?q=80&w=600',
    nameAr: 'كراب شوكولاتة ونوتيلا ناعمة',
    nameEn: 'Nutella Crepe',
    category: 'dessert'
  },
  {
    url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600',
    nameAr: 'كعكة الشوكولاتة الفاخرة الداكنة',
    nameEn: 'Chocolate Sponge Cake',
    category: 'dessert'
  },
  {
    url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600',
    nameAr: 'كرواسون زبدة فرنسي هش',
    nameEn: 'French Croissant',
    category: 'dessert'
  },
  {
    url: 'https://images.unsplash.com/photo-1562376502-6f769499c886?q=80&w=600',
    nameAr: 'وافل الذهبي الدافئ بالتوت',
    nameEn: 'Gourmet Waffle',
    category: 'dessert'
  },
  {
    url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=600',
    nameAr: 'دونات ملونة لذيذة',
    nameEn: 'Glazed Donut',
    category: 'dessert'
  },
  {
    url: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?q=80&w=600',
    nameAr: 'شباتي المهدية التونسي الشهير',
    nameEn: 'Chapati Mahdia Sandwich',
    category: 'food'
  },
  {
    url: 'https://images.unsplash.com/photo-1598182126888-0329598ef470?q=80&w=600',
    nameAr: 'فطائر فريكاسي تونسية بالزيتون',
    nameEn: 'Tunisian Fricassé Bites',
    category: 'food'
  },
  {
    url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=600',
    nameAr: 'بانيني إيطالي مشوي ومقرمش',
    nameEn: 'Gourmet Panini',
    category: 'food'
  },
  {
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600',
    nameAr: 'بيتزا إيطالية مميزة بالجبن',
    nameEn: 'Classic Pizza',
    category: 'food'
  },
  {
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600',
    nameAr: 'مقرونة تونسية بالصلصة الحارة',
    nameEn: 'Spicy Tunisian Spaghetti',
    category: 'food'
  },
  {
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600',
    nameAr: 'كلوب ساندوتش / همبرغر مشوي',
    nameEn: 'Bistro Sandwich & Burger',
    category: 'food'
  },
  {
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600',
    nameAr: 'سلطة مشوية / سلطات صحية',
    nameEn: 'Tunisian Salad Platter',
    category: 'food'
  }
];

interface AdminPanelProps {
  settings: CafeSettings;
  menuItems: MenuItem[];
  onUpdateSettings: (s: CafeSettings) => void;
  onUpdateMenu: (m: MenuItem[]) => void;
  activeLanguage: 'ar' | 'en';
  moments?: any[];
  onUpdateMoments?: (mom: any[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  settings,
  menuItems,
  onUpdateSettings,
  onUpdateMenu,
  activeLanguage,
  moments = [],
  onUpdateMoments,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Sub tabs inside the admin panel
  const [activeAdminTab, setActiveAdminTab] = useState<'menu' | 'settings' | 'moments' | 'poster'>('menu');

  // New item formulation
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form Fields
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descAr, setDescAr] = useState('');
  const [price, setPrice] = useState('0');
  const [category, setCategory] = useState<'hot' | 'cold' | 'dessert' | 'food'>('hot');
  const [isAvailable, setIsAvailable] = useState(true);
  const [iconType, setIconType] = useState<MenuItem['iconType']>('coffee');
  const [imageUrl, setImageUrl] = useState('');

  // Cafe Settings inputs
  const [settNameAr, setSettNameAr] = useState(settings.nameAr);
  const [settNameEn, setSettNameEn] = useState(settings.nameEn);
  const [settTagAr, setSettTagAr] = useState(settings.taglineAr);
  const [settTagEn, setSettTagEn] = useState(settings.taglineEn);
  const [settSsid, setSettSsid] = useState(settings.wifi.ssid);
  const [settWifiPass, setSettWifiPass] = useState(settings.wifi.password || '');
  const [settInsta, setSettInsta] = useState(settings.instagram);
  const [settFb, setSettFb] = useState(settings.facebook);
  const [settLoc, setSettLoc] = useState(settings.locationUrl);
  const [settPhone, setSettPhone] = useState(settings.phone);
  const [settAnnounceAr, setSettAnnounceAr] = useState(settings.announcementAr);
  const [settAnnounceEn, setSettAnnounceEn] = useState(settings.announcementEn);
  const [settAdminPass, setSettAdminPass] = useState(settings.adminPassphrase || 'admin');
  const [settCustomLogoUrl, setSettCustomLogoUrl] = useState(settings.customLogoUrl || '');

  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Moments addition states
  const [isAddingMoment, setIsAddingMoment] = useState(false);
  const [momentCaptionAr, setMomentCaptionAr] = useState('');
  const [momentCaptionEn, setMomentCaptionEn] = useState('');
  const [momentImageSrc, setMomentImageSrc] = useState('');

  // Helper file uploader reader
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          callback(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Authentication trigger
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPass = settings.adminPassphrase || 'admin';
    if (passphrase === correctPass) {
      setIsAuthenticated(true);
      setLoginError('');
      setPassphrase('');
    } else {
      setLoginError(activeLanguage === 'ar' ? 'كلمة المرور خاطئة!' : 'Incorrect credentials!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Open modal for Adding
  const startAdd = () => {
    setNameEn('');
    setNameAr('');
    setDescEn('');
    setDescAr('');
    setPrice('4.5');
    setCategory('hot');
    setIsAvailable(true);
    setIconType('coffee');
    setImageUrl('');
    setEditingItem(null);
    setIsAddingItem(true);
  };

  // Open modal for Editing
  const startEdit = (item: MenuItem) => {
    setEditingItem(item);
    setNameEn(item.nameEn);
    setNameAr(item.nameAr);
    setDescEn(item.descriptionEn);
    setDescAr(item.descriptionAr);
    setPrice(item.price.toString());
    setCategory(item.category);
    setIsAvailable(item.isAvailable);
    setIconType(item.iconType);
    setImageUrl(item.imageUrl || '');
    setIsAddingItem(false);
  };

  // Save changes to item (Add or Edit)
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(price) || 0;

    if (editingItem) {
      // Editing
      const updatedList = menuItems.map(item => {
        if (item.id === editingItem.id) {
          return {
            ...item,
            nameEn,
            nameAr,
            descriptionEn: descEn,
            descriptionAr: descAr,
            price: parsedPrice,
            category,
            isAvailable,
            iconType,
            imageUrl: imageUrl.trim() || undefined
          };
        }
        return item;
      });
      onUpdateMenu(updatedList);
      setEditingItem(null);
    } else {
      // Adding new
      const newItem: MenuItem = {
        id: `custom-id-${Date.now()}`,
        nameEn,
        nameAr,
        descriptionEn: descEn,
        descriptionAr: descAr,
        price: parsedPrice,
        category,
        isAvailable,
        iconType,
        imageUrl: imageUrl.trim() || undefined
      };
      onUpdateMenu([...menuItems, newItem]);
      setIsAddingItem(false);
    }
  };

  // Toggle item availability state quickly
  const toggleAvailability = (itemId: string) => {
    const updatedList = menuItems.map(item => {
      if (item.id === itemId) {
        return { ...item, isAvailable: !item.isAvailable };
      }
      return item;
    });
    onUpdateMenu(updatedList);
  };

  // Delete an item
  const handleDeleteItem = (itemId: string) => {
    const confirmText = activeLanguage === 'ar' 
      ? 'هل أنت متأكد من حذف هذا الصنف من القائمة؟' 
      : 'Are you sure you want to delete this menu item?';
    if (window.confirm(confirmText)) {
      const updatedList = menuItems.filter(item => item.id !== itemId);
      onUpdateMenu(updatedList);
    }
  };

  // Save Cafe Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const newSettings: CafeSettings = {
      nameAr: settNameAr,
      nameEn: settNameEn,
      taglineAr: settTagAr,
      taglineEn: settTagEn,
      wifi: {
        ssid: settSsid,
        password: settWifiPass,
        security: 'WPA'
      },
      instagram: settInsta,
      facebook: settFb,
      locationUrl: settLoc,
      phone: settPhone,
      announcementAr: settAnnounceAr,
      announcementEn: settAnnounceEn,
      adminPassphrase: settAdminPass,
      customLogoUrl: settCustomLogoUrl
    };
    onUpdateSettings(newSettings);
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
  };

  return (
    <div className="mt-12 bg-[#0E0E14] border border-gold-600/20 rounded-2xl p-6 relative overflow-hidden">
      {/* Visual Ambient Gold Highlight */}
      <div className="absolute top-0 left-0 w-32 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

      {/* Lock login Screen */}
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-10"
          >
            <div className="p-4 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-500 mb-4">
              <Lock className="w-8 h-8" />
            </div>

            <h3 className="font-serif font-bold text-xl text-gold-400 mb-1 text-center">
              {activeLanguage === 'ar' ? 'بوابة الإدارة الإلكترونية' : 'Contigo Admin Gate'}
            </h3>
            <p className="text-xs text-gray-500 text-center mb-6 max-w-sm">
              {activeLanguage === 'ar'
                ? 'خصائص التحكم لتحديث قائمة المأكولات، الواي فاي، والروابط'
                : 'Modify and update menu choices, wifi, and active links.'}
            </p>

            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder={activeLanguage === 'ar' ? 'كلمة مرور المشرف' : 'Admin Passphrase'}
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-gold-600/30 text-gray-200 placeholder-gray-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/20 outline-none text-center font-mono tracking-widest text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold-500"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {loginError && (
                <div className="text-xs text-red-400 text-center bg-red-950/20 border border-red-500/10 py-1.5 rounded-lg">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-600 to-gold-400 text-black font-semibold hover:brightness-110 active:scale-95 transition-all text-xs cursor-pointer shadow-[0_4px_12px_rgba(223,177,91,0.15)]"
              >
                {activeLanguage === 'ar' ? 'تسجيل الدخول' : 'Access Control Screen'}
              </button>

              <p className="text-[10px] text-gray-600 text-center uppercase font-mono tracking-wider">
                {activeLanguage === 'ar' ? 'تلميح: الرمز الافتراضي هو admin' : 'Hint: Default passcode is admin'}
              </p>
            </form>
          </motion.div>
        ) : (
          /* Logged In Dashboard Wrapper */
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Admin Header Info */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-black/40 border border-gold-600/10 p-4 rounded-xl gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
                  <Unlock className="w-5 h-5" />
                </div>
                <div className="text-center sm:text-left">
                  <span className="text-[10px] uppercase font-mono text-gray-500 tracking-wider">
                    {activeLanguage === 'ar' ? 'جلسة نشطة' : 'Authenticated Session'}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-gold-400">
                    {activeLanguage === 'ar' ? 'لوحة تحكم كافي كونتيغو' : 'Contigo Live Customizer Panel'}
                  </h4>
                </div>
              </div>

              {/* Sub-Tabs Switches */}
              <div className="flex bg-gold-950/30 border border-gold-600/10 p-1 rounded-lg">
                <button
                  onClick={() => setActiveAdminTab('menu')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                    activeAdminTab === 'menu'
                      ? 'bg-gold-500 text-black'
                      : 'text-gold-200 hover:text-white'
                  }`}
                >
                  {activeLanguage === 'ar' ? 'إدارة القائمة' : 'Manage Menu'}
                </button>
                <button
                  onClick={() => setActiveAdminTab('settings')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                    activeAdminTab === 'settings'
                      ? 'bg-gold-500 text-black'
                      : 'text-gold-200 hover:text-white'
                  }`}
                >
                  {activeLanguage === 'ar' ? 'إعدادات المقهى' : 'Cafe Settings'}
                </button>
                <button
                  onClick={() => setActiveAdminTab('moments')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                    activeAdminTab === 'moments'
                      ? 'bg-gold-500 text-black'
                      : 'text-gold-200 hover:text-white'
                  }`}
                >
                  {activeLanguage === 'ar' ? 'إدارة المعرض' : 'Manage Photo Gallery'}
                </button>
                <button
                  onClick={() => setActiveAdminTab('poster')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                    activeAdminTab === 'poster'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-black font-extrabold shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                      : 'text-amber-300 hover:text-white'
                  }`}
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{activeLanguage === 'ar' ? 'أفيش QR للطباعة' : 'Printable QR Poster'}</span>
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-950/20 border border-red-500/20 text-red-400 hover:bg-red-950/40 text-xs transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{activeLanguage === 'ar' ? 'خروج' : 'Exit'}</span>
              </button>
            </div>

            {/* TAB CONTENT: 1. MENU MANAGEMENT */}
            {activeAdminTab === 'menu' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-gold-500" />
                    <h4 className="font-sans font-semibold text-gray-200">
                      {activeLanguage === 'ar' ? 'قائمة الأصناف الحالية' : 'Current Menu items'}
                    </h4>
                    <span className="text-[10px] bg-gold-900/40 border border-gold-600/20 text-gold-400 px-2 py-0.5 rounded-full font-mono">
                      {menuItems.length}
                    </span>
                  </div>

                  <button
                    onClick={startAdd}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gold-500 text-black font-semibold hover:bg-gold-400 transition-all text-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{activeLanguage === 'ar' ? 'إضافة صنف جديد' : 'Add Item'}</span>
                  </button>
                </div>

                {/* Grid list of admin items */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-gold-600/10 bg-[#121218]/50 flex flex-col justify-between"
                    >
                      <div>
                        {/* Title block */}
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <div>
                            <span className="text-[9px] uppercase font-mono tracking-wider text-gold-500/70">
                              {item.category === 'hot' 
                                ? (activeLanguage === 'ar' ? 'مشروب ساخن' : 'Hot Drink')
                                : item.category === 'cold'
                                ? (activeLanguage === 'ar' ? 'مشروب بارد' : 'Cold Drink')
                                : (activeLanguage === 'ar' ? 'حلويات' : 'Dessert')}
                            </span>
                            <h5 className="font-bold text-gray-200 text-sm">{item.nameAr}</h5>
                            <h6 className="text-xs text-gray-500 font-mono italic">{item.nameEn}</h6>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-mono font-bold text-gold-400 block">
                              {item.price.toFixed(1)} DT
                            </span>
                            {/* Toggle Switch */}
                            <button
                              onClick={() => toggleAvailability(item.id)}
                              className={`mt-1.5 px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-colors max-w-fit inline-flex items-center gap-1 ${
                                item.isAvailable
                                  ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-red-950/50 text-red-400 border border-red-500/20'
                              }`}
                            >
                              {item.isAvailable ? (
                                <>
                                  <CheckCircle className="w-3 h-3" />
                                  <span>{activeLanguage === 'ar' ? 'متوفر' : 'In Stock'}</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3" />
                                  <span>{activeLanguage === 'ar' ? 'نفذ' : 'Out'}</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                          {activeLanguage === 'ar' ? item.descriptionAr : item.descriptionEn}
                        </p>
                      </div>

                      <div className="flex gap-2 border-t border-gold-600/5 pt-3 mt-3">
                        <button
                          onClick={() => startEdit(item)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-gold-500/30 text-gold-500 hover:bg-gold-500/5 text-xs transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{activeLanguage === 'ar' ? 'تعديل' : 'Modify'}</span>
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: 2. CAFE SETTINGS */}
            {activeAdminTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category block: Basics */}
                  <div className="space-y-3 bg-[#111117] p-5 rounded-xl border border-gold-600/10">
                    <h5 className="font-serif font-bold text-sm text-gold-400 border-b border-gold-600/20 pb-2 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      <span>{activeLanguage === 'ar' ? 'المعلومات الأساسية' : 'General Slogan Details'}</span>
                    </h5>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1">{activeLanguage === 'ar' ? 'إسم المقهى (عربي)' : 'Cafe Name (Arabic)'}</label>
                      <input
                        type="text"
                        value={settNameAr}
                        onChange={(e) => setSettNameAr(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-black border border-gold-600/20 rounded-lg text-gray-200 focus:border-gold-500 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">{activeLanguage === 'ar' ? 'إسم المقهى (إنكليزي)' : 'Cafe Name (English)'}</label>
                      <input
                        type="text"
                        value={settNameEn}
                        onChange={(e) => setSettNameEn(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-black border border-gold-600/20 rounded-lg text-gray-200 focus:border-gold-500 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">{activeLanguage === 'ar' ? 'شعار المقهى (عربي)' : 'Tagline (Arabic)'}</label>
                      <input
                        type="text"
                        value={settTagAr}
                        onChange={(e) => setSettTagAr(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-black border border-gold-600/20 rounded-lg text-gray-200 focus:border-gold-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">{activeLanguage === 'ar' ? 'شعار المقهى (إنكليزي)' : 'Tagline (English)'}</label>
                      <input
                        type="text"
                        value={settTagEn}
                        onChange={(e) => setSettTagEn(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-black border border-gold-600/20 rounded-lg text-gray-200 focus:border-gold-500 outline-none"
                      />
                    </div>

                    {/* Logo Image Uploader from mobile/gallery */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">{activeLanguage === 'ar' ? 'شعار المقهى المخصص (صورة من معرض الهاتف)' : 'Custom Cafe Logo (Upload from gallery)'}</label>
                      <div className="flex items-center gap-3 bg-black/40 border border-gold-600/10 p-2.5 rounded-lg">
                        {settCustomLogoUrl ? (
                          <div className="relative w-12 h-12 rounded-full border border-gold-400 overflow-hidden shrink-0">
                            <img src={settCustomLogoUrl} alt="Logo preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setSettCustomLogoUrl('')}
                              className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px] text-red-400 font-bold opacity-0 hover:opacity-100 transition-opacity"
                            >
                              {activeLanguage === 'ar' ? 'حذف' : 'Del'}
                            </button>
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full border border-dashed border-gold-600/30 flex items-center justify-center text-xs text-gold-500/50 shrink-0 font-mono">
                            Logo
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-gold-400/10 border border-gold-400/30 text-gold-400 text-xs font-semibold cursor-pointer hover:bg-gold-400/20 active:scale-95 transition-all">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{activeLanguage === 'ar' ? 'اختر صورة من هاتفك' : 'Choose from phone'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, setSettCustomLogoUrl)}
                            />
                          </label>
                          <p className="text-[9px] text-gray-500 mt-1 truncate">
                            {settCustomLogoUrl ? (activeLanguage === 'ar' ? '✓ تم رفع الشعار' : '✓ Custom logo loaded') : (activeLanguage === 'ar' ? 'يحفظ كبيانات محلية' : 'Saves securely to LocalStorage')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category block: WiFi Details */}
                  <div className="space-y-3 bg-[#111117] p-5 rounded-xl border border-gold-600/10">
                    <h5 className="font-serif font-bold text-sm text-gold-400 border-b border-gold-600/20 pb-2 flex items-center gap-2">
                      <Wifi className="w-4 h-4" />
                      <span>{activeLanguage === 'ar' ? 'إعدادات الواي فاي للمشتركين' : 'WiFi configuration'}</span>
                    </h5>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1">{activeLanguage === 'ar' ? 'إسم شبكة الواي فاي (SSID)' : 'Network Name (SSID)'}</label>
                      <input
                        type="text"
                        value={settSsid}
                        onChange={(e) => setSettSsid(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-black border border-gold-600/20 rounded-lg text-gray-200 focus:border-gold-500 outline-none font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">{activeLanguage === 'ar' ? 'رمز حماية الواي فاي' : 'WiFi Security Password'}</label>
                      <input
                        type="text"
                        value={settWifiPass}
                        onChange={(e) => setSettWifiPass(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-black border border-gold-600/20 rounded-lg text-gray-200 focus:border-gold-500 outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">{activeLanguage === 'ar' ? 'رقم هاتف المساعد أو التوصيل' : 'Phone Number'}</label>
                      <input
                        type="text"
                        value={settPhone}
                        onChange={(e) => setSettPhone(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-black border border-gold-600/20 rounded-lg text-gray-200 focus:border-gold-500 outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Category block: Contact & Links */}
                  <div className="space-y-3 bg-[#111117] p-5 rounded-xl border border-gold-600/10 md:col-span-2">
                    <h5 className="font-serif font-bold text-sm text-gold-400 border-b border-gold-600/20 pb-2 flex items-center gap-2">
                      <Link className="w-4 h-4" />
                      <span>{activeLanguage === 'ar' ? 'الروابط الإضافية والإعلانات' : 'Customer announcements & social linking'}</span>
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Instagram Link</label>
                        <input
                          type="url"
                          value={settInsta}
                          onChange={(e) => setSettInsta(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-black border border-gold-600/20 rounded-lg text-gray-200 focus:border-gold-500 outline-none text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Facebook Link</label>
                        <input
                          type="url"
                          value={settFb}
                          onChange={(e) => setSettFb(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-black border border-gold-600/20 rounded-lg text-gray-200 focus:border-gold-500 outline-none text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Map Geo-Location Link</label>
                        <input
                          type="url"
                          value={settLoc}
                          onChange={(e) => setSettLoc(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-black border border-gold-600/20 rounded-lg text-gray-200 focus:border-gold-500 outline-none text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">{activeLanguage === 'ar' ? 'الإعلان الفوقي أو الترحيب (عربي)' : 'Scrolling announcement (Arabic)'}</label>
                        <textarea
                          rows={2}
                          value={settAnnounceAr}
                          onChange={(e) => setSettAnnounceAr(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-black border border-gold-600/20 rounded-lg text-gray-200 focus:border-gold-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">{activeLanguage === 'ar' ? 'الإعلان الفوقي أو الترحيب (إنكليزي)' : 'Scrolling announcement (English)'}</label>
                        <textarea
                          rows={2}
                          value={settAnnounceEn}
                          onChange={(e) => setSettAnnounceEn(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-black border border-gold-600/20 rounded-lg text-gray-200 focus:border-gold-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="border-t border-gold-600/15 pt-4 mt-3">
                      <label className="block text-xs text-amber-400 mb-1 font-semibold">{activeLanguage === 'ar' ? 'تعديل كلمة سر لوحة التحكم' : 'Change Admin Dashboard Passphrase'}</label>
                      <input
                        type="text"
                        value={settAdminPass}
                        onChange={(e) => setSettAdminPass(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-black border border-gold-500/30 rounded-lg text-gold-400 focus:border-gold-500 outline-none font-mono max-w-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Confirm Settings Button */}
                <div className="flex justify-end items-center gap-4">
                  {settingsSuccess && (
                    <span className="text-emerald-400 text-xs font-semibold animate-pulse">
                      {activeLanguage === 'ar' ? '✓ تم حفظ جميع المتغيرات بنجاح!' : '✓ Cafe settings saved securely!'}
                    </span>
                  )}
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gold-600 text-black font-semibold hover:bg-gold-500 transition-all text-sm cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{activeLanguage === 'ar' ? 'حفظ المتغيرات' : 'Save Configurations'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB CONTENT: 3. GALLERY MOMENTS MANAGEMENT */}
            {activeAdminTab === 'moments' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-1">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-gold-500" />
                    <h4 className="font-sans font-semibold text-gray-200">
                      {activeLanguage === 'ar' ? 'إدارة صور المعرض ولحظات المقهى' : 'Manage Gallery Moments'}
                    </h4>
                    <span className="text-[10px] bg-gold-900/40 border border-gold-600/20 text-gold-400 px-2 py-0.5 rounded-full font-mono">
                      {moments.length}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setMomentCaptionAr('');
                      setMomentCaptionEn('');
                      setMomentImageSrc('');
                      setIsAddingMoment(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-500 text-black font-semibold hover:bg-gold-400 transition-all text-xs cursor-pointer shadow-[0_4px_12px_rgba(223,177,91,0.2)]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{activeLanguage === 'ar' ? 'إضافة صورة لحظية جديدة' : 'Add New Moment'}</span>
                  </button>
                </div>

                {/* Grid list of gallery items */}
                {moments.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 bg-black/20 border border-gold-500/5 rounded-xl">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gold-500/30" />
                    <p className="text-xs">{activeLanguage === 'ar' ? 'لا يوجد صور بالمعرض حالياً' : 'No moments added yet'}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {moments.map((m, idx) => (
                      <div
                        key={m.id || idx}
                        className="p-3 rounded-xl border border-gold-600/10 bg-[#121218]/50 flex flex-col justify-between overflow-hidden relative"
                      >
                        <div className="aspect-video w-full rounded-lg overflow-hidden bg-black/40 border border-gold-600/10 mb-2 relative">
                          <img src={m.src} alt={m.captionAr} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="space-y-1">
                          <p className="font-bold text-gray-200 text-xs text-right truncate">{m.captionAr}</p>
                          <p className="text-[10px] text-gray-500 font-mono text-left truncate italic">{m.captionEn}</p>
                        </div>

                        <div className="flex gap-2 border-t border-gold-600/5 pt-2 mt-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (onUpdateMoments) {
                                const confirmText = activeLanguage === 'ar' 
                                  ? 'هل أنت متأكد من حذف هذه اللفظة/الصورة من المعرض؟' 
                                  : 'Are you sure you want to delete this moment?';
                                if (window.confirm(confirmText)) {
                                  onUpdateMoments(moments.filter((item, i) => (item.id ? item.id !== m.id : i !== idx)));
                                }
                              }
                            }}
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/15 text-xs transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{activeLanguage === 'ar' ? 'حذف اللحظة' : 'Delete Moment'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* MODAL FOR ADDING MOMENT */}
                <AnimatePresence>
                  {isAddingMoment && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-[#121218] border border-gold-500/40 rounded-2xl w-full max-w-sm shadow-2xl p-6"
                      >
                        <div className="flex justify-between items-center border-b border-gold-600/20 pb-4 mb-4">
                          <h4 className="font-serif font-bold text-base text-gold-400">
                            {activeLanguage === 'ar' ? 'إضافة لحظة/صورة زائر جديدة' : 'Add Cozy Cafe Moment'}
                          </h4>
                          <button
                            type="button"
                            onClick={() => setIsAddingMoment(false)}
                            className="p-1 rounded-full text-gray-400 hover:text-white"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!momentImageSrc) {
                              alert(activeLanguage === 'ar' ? 'الرجاء اختيار صورة أولاً!' : 'Please pick an image file first!');
                              return;
                            }
                            if (onUpdateMoments) {
                              const newMom = {
                                id: `mom-id-${Date.now()}`,
                                src: momentImageSrc,
                                captionAr: momentCaptionAr || 'لحظات كونتيغو الجميلة ✨',
                                captionEn: momentCaptionEn || 'Beautiful Contigo Moments ✨'
                              };
                              onUpdateMoments([...moments, newMom]);
                              setIsAddingMoment(false);
                            }
                          }}
                          className="space-y-4"
                        >
                          {/* Image selector */}
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">
                              {activeLanguage === 'ar' ? 'صورة اللحظة (من هاتف الغالري)' : 'Moment Image File'} *
                            </label>
                            
                            <div className="flex flex-col items-center justify-center p-4 border border-dashed border-gold-600/30 rounded-xl bg-black/30 text-center relative hover:bg-black/50 transition-colors">
                              {momentImageSrc ? (
                                <div className="space-y-2 w-full">
                                  <img src={momentImageSrc} alt="Preview" className="max-h-32 rounded-lg mx-auto object-cover border border-gold-500" />
                                  <button
                                    type="button"
                                    onClick={() => setMomentImageSrc('')}
                                    className="text-xs text-red-400 hover:text-red-300 font-semibold"
                                  >
                                    {activeLanguage === 'ar' ? 'إزالة الصورة وهات غيرها' : 'Remove Image'}
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <ImageIcon className="w-8 h-8 text-gold-500/50 mb-2" />
                                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-gold-400/10 border border-gold-400/30 text-gold-400 text-xs font-semibold cursor-pointer hover:bg-gold-400/20 active:scale-95 transition-all">
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>{activeLanguage === 'ar' ? 'اختر صورة من الغالري' : 'Select gallery photo'}</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => handleFileChange(e, setMomentImageSrc)}
                                    />
                                  </label>
                                  <p className="text-[9px] text-gray-500 mt-2">
                                    {activeLanguage === 'ar' ? 'ستتحمل الصورة وتحفظ محلياً' : 'Image reads instantly and stores securely inside your browser'}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Captions */}
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">{activeLanguage === 'ar' ? 'التعليق بالعربية (يظهر لزوارك)' : 'Caption (Arabic)'}</label>
                            <input
                              type="text"
                              value={momentCaptionAr}
                              onChange={(e) => setMomentCaptionAr(e.target.value)}
                              className="w-full px-3 py-2 text-sm bg-black border border-gold-600/20 rounded-lg text-gray-200 focus:border-gold-500 outline-none text-right"
                              placeholder="أجواء مروقة في فناء المقهى 🍃"
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-gray-400 mb-1">{activeLanguage === 'ar' ? 'التعليق بالإنجليزية' : 'Caption (English)'}</label>
                            <input
                              type="text"
                              value={momentCaptionEn}
                              onChange={(e) => setMomentCaptionEn(e.target.value)}
                              className="w-full px-3 py-2 text-sm bg-black border border-gold-600/20 rounded-lg text-gray-200 focus:border-gold-500 outline-none"
                              placeholder="Cozy evenings in Contigo garden 🍃"
                            />
                          </div>

                          <div className="flex justify-end gap-3 border-t border-gold-600/15 pt-4">
                            <button
                              type="button"
                              onClick={() => setIsAddingMoment(false)}
                              className="px-4 py-2 text-gray-400 hover:text-white text-xs font-semibold"
                            >
                              {activeLanguage === 'ar' ? 'إلغاء' : 'Cancel'}
                            </button>
                            <button
                              type="submit"
                              className="px-6 py-2 rounded-xl bg-gold-400 text-black font-bold hover:bg-gold-300 transition-all text-xs cursor-pointer"
                            >
                              {activeLanguage === 'ar' ? 'حفظ اللحظة' : 'Publish Moment'}
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* TAB CONTENT: 4. PRINTABLE QR POSTER STUDIO */}
            {activeAdminTab === 'poster' && (
              <PosterGenerator
                settings={settings}
                activeLanguage={activeLanguage}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. MODAL / DIALOG: ADD/EDIT MENU ITEM FORM */}
      <AnimatePresence>
        {(isAddingItem || editingItem !== null) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#121218] border border-gold-500/40 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6"
            >
              <div className="flex justify-between items-center border-b border-gold-600/20 pb-4 mb-4">
                <h4 className="font-serif font-bold text-lg text-gold-400">
                  {editingItem 
                    ? (activeLanguage === 'ar' ? 'تعديل الصنف الحالي' : 'Modify Menu Item') 
                    : (activeLanguage === 'ar' ? 'إضافة صنف حلوى أو شراب جديد' : 'Introduce New Item')}
                </h4>
                <button
                  onClick={() => {
                    setIsAddingItem(false);
                    setEditingItem(null);
                  }}
                  className="p-1 rounded-full text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Arabic */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">{activeLanguage === 'ar' ? 'اسم الصنف باللغة العربية' : 'Item Name (Arabic)'} *</label>
                    <input
                      type="text"
                      value={nameAr}
                      onChange={(e) => setNameAr(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-black border border-gold-600/20 rounded-lg text-gray-200 focus:border-gold-500 outline-none text-right"
                      required
                      placeholder="شاهي بالبندق مثلاً"
                    />
                  </div>
                  {/* Name English */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">{activeLanguage === 'ar' ? 'اسم الصنف باللغة الإنجليزية' : 'Item Name (English)'} *</label>
                    <input
                      type="text"
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-black border border-gold-600/20 rounded-lg text-gray-200 focus:border-gold-500 outline-none"
                      required
                      placeholder="Hazelnut Tea"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">{activeLanguage === 'ar' ? 'التصنيف الرئيسي' : 'Category'} *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 text-sm bg-black border border-gold-600/20 rounded-lg text-gray-200 focus:border-gold-500 outline-none"
                    >
                      <option value="hot">{activeLanguage === 'ar' ? '☕ مشروبات ساخنة' : 'Hot Drinks'}</option>
                      <option value="cold">{activeLanguage === 'ar' ? '🍹 مشروبات باردة' : 'Cold Drinks'}</option>
                      <option value="dessert">{activeLanguage === 'ar' ? '🍰 كعك وحلويات' : 'Desserts & Pastries'}</option>
                      <option value="food">{activeLanguage === 'ar' ? '🍔 مأكولات وسندوتشات' : 'Savory Food & Sandwiches'}</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">{activeLanguage === 'ar' ? 'السعر (بالدينار التونسي DT)' : 'Price (in DT)'} *</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-black border border-gold-600/20 rounded-lg text-gray-200 focus:border-gold-500 outline-none font-mono"
                      required
                    />
                  </div>
                </div>

                {/* Description Arabic */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1">{activeLanguage === 'ar' ? 'الوصف بالفرنسية أو العربية' : 'Description (Arabic)'}</label>
                  <textarea
                    rows={2}
                    value={descAr}
                    onChange={(e) => setDescAr(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-black border border-gold-600/20 rounded-lg text-gray-200 focus:border-gold-500 outline-none text-right"
                    placeholder="مغلي بنعناع طازج يفتح الصدر وبندق محمر مقرمش"
                  />
                </div>

                {/* Description English */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1">{activeLanguage === 'ar' ? 'الوصف التفصيلي بالإنجليزية' : 'Description (English)'}</label>
                  <textarea
                    rows={2}
                    value={descEn}
                    onChange={(e) => setDescEn(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-black border border-gold-600/20 rounded-lg text-gray-200 focus:border-gold-500 outline-none"
                    placeholder="Fresh brewed black tea infused with real toasted hazelnuts."
                  />
                </div>

                {/* Image URL & File Uploader Input */}
                <div className="space-y-2">
                  <label className="block text-xs text-gray-400">
                    {activeLanguage === 'ar' ? 'صورة الصنف (اختر ملف من هاتف الغالري أو ضع رابط إنترنت)' : 'Product Image (Choose file from telephone or enter URL)'}
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center bg-black/40 border border-gold-600/15 p-3 rounded-xl">
                    <div className="sm:col-span-2 flex flex-col items-center justify-center">
                      {imageUrl ? (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gold-500">
                          <img src={imageUrl} alt="Product preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setImageUrl('')}
                            className="absolute inset-0 bg-black/75 flex items-center justify-center text-xs text-red-400 font-bold opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            {activeLanguage === 'ar' ? 'إزالة الصورة' : 'Remove image'}
                          </button>
                        </div>
                      ) : (
                        <div className="w-full aspect-video rounded-lg border-2 border-dashed border-gold-600/20 flex flex-col items-center justify-center text-[10px] text-gray-500 font-mono">
                          <ImageIcon className="w-5 h-5 text-gold-500/30 mb-1" />
                          <span>No Image Chosen</span>
                        </div>
                      )}
                    </div>

                    <div className="sm:col-span-3 space-y-2">
                      <label className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-gold-400/10 border border-gold-400/30 text-gold-400 text-xs font-bold cursor-pointer hover:bg-gold-400/20 active:scale-95 transition-all text-center w-full">
                        <Upload className="w-4 h-4" />
                        <span>{activeLanguage === 'ar' ? 'اختر صورة من الاستوديو' : 'Choose from Gallery'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, setImageUrl)}
                        />
                      </label>
                      
                      <div className="relative">
                        <input
                          type="url"
                          value={imageUrl.startsWith('data:') ? '' : imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-black border border-gold-600/20 rounded text-gray-200 focus:border-gold-500 outline-none font-mono"
                          placeholder={activeLanguage === 'ar' ? 'أو اكتب رابط خارجي (Unsplash)' : 'Or paste a web link...'}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Free High-Quality Stock Presets Gallery */}
                <div className="space-y-2 bg-black/30 border border-gold-600/10 p-3.5 rounded-xl">
                  <div className="flex justify-between items-center pb-2 border-b border-gold-600/10">
                    <span className="text-[11px] font-bold text-gold-400 flex items-center gap-1">
                      <span>✨</span>
                      <span>
                        {activeLanguage === 'ar' 
                          ? 'اختر من مكتبة الصور الجاهزة لكونتيغو' 
                          : 'Quick Select from Contigo Stock Lib'}
                      </span>
                    </span>
                    <span className="text-[9px] text-gray-500 uppercase font-mono">
                      {category === 'hot' ? (activeLanguage === 'ar' ? 'ساخن' : 'Hot') :
                       category === 'cold' ? (activeLanguage === 'ar' ? 'بارد' : 'Cold') :
                       category === 'dessert' ? (activeLanguage === 'ar' ? 'حلويات' : 'Desserts') :
                       (activeLanguage === 'ar' ? 'مأكولات' : 'Savory')}
                    </span>
                  </div>

                  <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gold-500/20 scrollbar-track-transparent">
                    {STOCK_PRESETS.filter(p => p.category === category).map((p, idx) => {
                      const isSelected = imageUrl === p.url;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setImageUrl(p.url)}
                          className={`relative flex flex-col items-center shrink-0 w-[110px] p-1.5 rounded-lg border transition-all text-center group ${
                            isSelected 
                              ? 'border-gold-500 bg-gold-950/20' 
                              : 'border-gold-600/10 bg-[#16161c]/40 hover:border-gold-500/30'
                          }`}
                        >
                          <div className="w-full aspect-square rounded overflow-hidden mb-1.5 relative">
                            <img src={p.url} alt={p.nameAr} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                            {isSelected && (
                              <div className="absolute inset-0 bg-gold-500/10 flex items-center justify-center text-gold-400 font-bold text-xs">
                                ✓
                              </div>
                            )}
                          </div>
                          <span className="text-[9px] text-gray-300 font-medium truncate w-full">
                            {activeLanguage === 'ar' ? p.nameAr : p.nameEn}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[9px] text-gray-500 text-center font-serif italic mt-1">
                    {activeLanguage === 'ar' 
                      ? '💡 اختر أي صورة أعلاه وسيتم تعيينها لهذا المنتج فورياً. يمكنك تصفح صور فئات أخرى بتغيير "التصنيف الرئيسي" في الأعلى.'
                      : '💡 Click any preset image to apply. You can browse other presets by changing the "Category" dropdown above.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Icon Selector */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">{activeLanguage === 'ar' ? 'أيقونة تمثيلية' : 'Visual Symbol Represent'}</label>
                    <select
                      value={iconType}
                      onChange={(e) => setIconType(e.target.value as any)}
                      className="w-full px-3 py-2 text-sm bg-black border border-gold-600/20 rounded-lg text-gray-200 focus:border-gold-500 outline-none"
                    >
                      <option value="coffee">☕ {activeLanguage === 'ar' ? 'قهوة بحليب / كوب ملون' : 'Coffee cup'}</option>
                      <option value="espresso">🥛 {activeLanguage === 'ar' ? 'إسبريسو مركز' : 'Espresso short'}</option>
                      <option value="tea">🍵 {activeLanguage === 'ar' ? 'شاي أخضر / ساخن' : 'Healthy tea'}</option>
                      <option value="mocha">🍫 {activeLanguage === 'ar' ? 'شوكولاتة دافئة' : 'Chocolate / Mocha'}</option>
                      <option value="juice">🍊 {activeLanguage === 'ar' ? 'عصير مروق' : 'Fresh Juice'}</option>
                      <option value="soda">🍹 {activeLanguage === 'ar' ? 'مشروب غازي / موهيتو' : 'Mojito / Soda'}</option>
                      <option value="icecream">🍦 {activeLanguage === 'ar' ? 'مثلجات / آيس كريم' : 'Iced Latte'}</option>
                      <option value="cake">🍰 {activeLanguage === 'ar' ? 'كعكة هشة' : 'Cake Slice'}</option>
                      <option value="cookie">🥐 {activeLanguage === 'ar' ? 'بسكويت / كرواسون' : 'Croissant / Cookie'}</option>
                    </select>
                  </div>

                  {/* Stock Availability */}
                  <div className="flex items-center space-x-2 h-full pt-6">
                    <input
                      id="avail_toggle"
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      className="w-4 h-4 text-gold-500 bg-black border-gold-600/30 rounded focus:ring-gold-500 focus:ring-2"
                    />
                    <label htmlFor="avail_toggle" className="text-sm text-gray-300 font-semibold pl-2 cursor-pointer">
                      {activeLanguage === 'ar' ? 'الصنف جاهز ومتوفر الآن بالكامل' : 'In stock / Active now'}
                    </label>
                  </div>
                </div>

                {/* Submitting items button */}
                <div className="flex justify-end gap-3 border-t border-gold-600/15 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingItem(false);
                      setEditingItem(null);
                    }}
                    className="px-4 py-2 text-gray-400 hover:text-white text-xs font-semibold"
                  >
                    {activeLanguage === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gold-500 text-black font-bold hover:bg-gold-400 transition-all text-xs cursor-pointer"
                  >
                    {activeLanguage === 'ar' ? 'حفظ الصنف' : 'Save Item'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
