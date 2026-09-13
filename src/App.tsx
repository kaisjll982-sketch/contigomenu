import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Coffee,
  Wifi,
  MessageSquareShare,
  Settings,
  Heart,
  Sparkles,
  Info,
  Clock,
  ChevronRight,
  Check,
  Languages,
  Search,
  Phone,
  MapPin,
  Clipboard,
  Camera,
  Share2,
  AlertCircle,
  HelpCircle,
  Star,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Send,
  User,
  Image as ImageIcon
} from 'lucide-react';

import { MenuItem, CafeSettings, Review } from './types';
import { DEFAULT_MENU_ITEMS, DEFAULT_CAFE_SETTINGS } from './data';
import { Header } from './components/Header';
import { WiFiCard } from './components/WiFiCard';
import { SocialLinks } from './components/SocialLinks';
import { AdminPanel } from './components/AdminPanel';
import { AIWaiter } from './components/AIWaiter';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { generateAndShareStory } from './utils/storyCreator';
import { collection, doc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

// Initial default gallery moments
const DEFAULT_MOMENTS = [
  { id: 'm-1', src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80", captionAr: "قهوتنا المميزة ☕", captionEn: "Our Signature Coffee ☕" },
  { id: 'm-2', src: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80", captionAr: "صباح جميل في كونتيغو ☀️", captionEn: "Beautiful Morning at Contigo ☀️" },
  { id: 'm-3', src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80", captionAr: "لحظات لا تُنسى 💫", captionEn: "Memorable Moments 💫" },
  { id: 'm-4', src: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&q=80", captionAr: "أجواء دافئة وهادئة 🕯️", captionEn: "Cozy & Quiet Vibe 🕯️" },
  { id: 'm-5', src: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80", captionAr: "فن اللاتيه آرت 🎨", captionEn: "Lathe Latte Art 🎨" },
  { id: 'm-6', src: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&q=80", captionAr: "استمتع بأسعد أوقاتك 📚", captionEn: "Enjoying the best reads 📚" }
];

// Initial default food suggestions (e.g., recommended appetizers)
const DEFAULT_FOOD_SUGGESTIONS = [
  { nameAr: "كرواسان باللوز", nameEn: "Almond Croissant", image: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=300&q=80" },
  { nameAr: "تشيز كيك توت", nameEn: "Blueberry Cheesecake", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&q=80" },
  { nameAr: "ساندويتش بيستو", nameEn: "Pesto Caprese Toast", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&q=80" },
  { nameAr: "كوكيز شوكولاتة", nameEn: "Choco Cookies", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&q=80" },
  { nameAr: "بان كيك عسل", nameEn: "Honey Pancakes", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&q=80" }
];

export default function App() {
  const [activeLanguage, setActiveLanguage] = useState<'ar' | 'en'>('ar');
  const [showSplash, setShowSplash] = useState(true);
  const [splashProgress, setSplashProgress] = useState(0);

  // Load configuration from localStorage
  const [settings, setSettings] = useState<CafeSettings>(() => {
    const saved = localStorage.getItem('contigo_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_CAFE_SETTINGS;
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('contigo_menu');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_MENU_ITEMS;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('contigo_favorites');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  // Dynamic user-customized moments
  const [moments, setMoments] = useState<any[]>(() => {
    const saved = localStorage.getItem('contigo_moments');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_MOMENTS;
  });

  // Active Main Tab: 'home' | 'menu' | 'moments' | 'delivery' | 'wifi' | 'social' | 'admin'
  const [activeMainTab, setActiveMainTab] = useState<'home' | 'menu' | 'moments' | 'delivery' | 'wifi' | 'social' | 'admin'>('home');

  // Menu Category Filter: 'all' | 'hot' | 'cold' | 'dessert' | 'food' | 'fav'
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'hot' | 'cold' | 'dessert' | 'food' | 'fav'>('all');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInspectItem, setSelectedInspectItem] = useState<MenuItem | null>(null);
  const [customSugar, setCustomSugar] = useState<'none' | 'medium' | 'extra'>('medium');
  const [customMilk, setCustomMilk] = useState<'normal' | 'almond' | 'oat'>('normal');
  const [customExtra, setCustomExtra] = useState<boolean>(false);
  const [isTrackingDelivery, setIsTrackingDelivery] = useState(false);
  const [deliveryStep, setDeliveryStep] = useState(0);
  const [deliveryName, setDeliveryName] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [selectedInspectFood, setSelectedInspectFood] = useState<any | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Story generation states
  const [storyProgress, setStoryProgress] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // ✦ NEW UPDATED STATES: Customer Basket & Live reviews system
  const [basket, setBasket] = useState<{ id: string; quantity: number }[]>(() => {
    const saved = localStorage.getItem('contigo_basket');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });
  const [isBasketOpen, setIsBasketOpen] = useState(false);

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('contigo_reviews');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      { id: 'r-1', author: 'أحمد السويسي', rating: 5, comment: 'أجمل إسبريسو في تونس العاصمة بجد! الجلوس فيه ممتع والخدمة راقية جداً والإنترنت سريع ممتاز للشغل والدراسة. أنصح بتجربة الكابتشينو وكعكة الشوكولاتة ☕✨', date: '2026-06-03' },
      { id: 'r-2', author: 'Sarra Meriah', rating: 5, comment: 'The Nutella Crepe is heavenly and fresh, and the staff are incredibly welcoming! A gorgeous cozy aesthetic. We will be back for sure!', date: '2026-06-01' },
      { id: 'r-3', author: 'مريم الجلاصي', rating: 5, comment: 'مكان رائع ومريح، قهوة عربي بالزهر مع شاي بالنعناع الأصيل طعم حكاية. لوحة تحكم الواي فاي سهلة جداً والأسعار معقولة.', date: '2026-05-28' }
    ];
  });

  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  // Splash Screen loading bar timer simulation
  useEffect(() => {
    const duration = 2000; // 2s duration
    const intervalTime = 50;
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setSplashProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setShowSplash(false), 250);
          return 100;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Real-time synchronization with Cloud Database (Firebase Firestore)
  useEffect(() => {
    // 1. Settings listener
    const unsubscribeSettings = onSnapshot(doc(db, 'settings', 'current'), async (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as CafeSettings);
      } else {
        try {
          await setDoc(doc(db, 'settings', 'current'), DEFAULT_CAFE_SETTINGS);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, 'settings/current');
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings/current');
    });

    // 2. Menu Items listener
    const unsubscribeMenu = onSnapshot(collection(db, 'menu'), async (snapshot) => {
      if (!snapshot.empty) {
        const itemsList: MenuItem[] = [];
        snapshot.forEach((doc) => {
          itemsList.push(doc.data() as MenuItem);
        });
        setMenuItems(itemsList);
      } else {
        try {
          for (const item of DEFAULT_MENU_ITEMS) {
            await setDoc(doc(db, 'menu', item.id), item);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, 'menu');
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'menu');
    });

    // 3. Gallery Moments listener
    const unsubscribeMoments = onSnapshot(collection(db, 'moments'), async (snapshot) => {
      if (!snapshot.empty) {
        const momentsList: any[] = [];
        snapshot.forEach((doc) => {
          momentsList.push(doc.data());
        });
        setMoments(momentsList);
      } else {
        try {
          for (const mom of DEFAULT_MOMENTS) {
            await setDoc(doc(db, 'moments', mom.id), mom);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, 'moments');
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'moments');
    });

    // 4. Guest Reviews listener
    const unsubscribeReviews = onSnapshot(collection(db, 'reviews'), async (snapshot) => {
      if (!snapshot.empty) {
        const reviewsList: Review[] = [];
        snapshot.forEach((doc) => {
          reviewsList.push(doc.data() as Review);
        });
        reviewsList.sort((a, b) => b.id.localeCompare(a.id) || b.date.localeCompare(a.date));
        setReviews(reviewsList);
      } else {
        const initialReviews = [
          { id: 'r-1', author: 'أحمد السويسي', rating: 5, comment: 'أجمل إسبريسو في تونس العاصمة بجد! الجلوس فيه ممتع والخدمة راقية جداً والإنترنت سريع ممتاز للشغل والدراسة. أنصح بتجربة الكابتشينو وكعكة الشوكولاتة ☕✨', date: '2026-06-03' },
          { id: 'r-2', author: 'Sarra Meriah', rating: 5, comment: 'The Nutella Crepe is heavenly and fresh, and the staff are incredibly welcoming! A gorgeous cozy aesthetic. We will be back for sure!', date: '2026-06-01' },
          { id: 'r-3', author: 'مريم الجلاصي', rating: 5, comment: 'مكان رائع ومريح، قهوة عربي بالزهر مع شاي بالنعناع الأصيل طعم حكاية. لوحة تحكم الواي فاي سهلة جداً والأسعار معقولة.', date: '2026-05-28' }
        ];
        try {
          for (const rev of initialReviews) {
            await setDoc(doc(db, 'reviews', rev.id), rev);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, 'reviews');
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'reviews');
    });

    return () => {
      unsubscribeSettings();
      unsubscribeMenu();
      unsubscribeMoments();
      unsubscribeReviews();
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('contigo_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('contigo_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('contigo_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('contigo_basket', JSON.stringify(basket));
  }, [basket]);

  useEffect(() => {
    localStorage.setItem('contigo_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('contigo_moments', JSON.stringify(moments));
  }, [moments]);

  // Simulated live courier tracking intervals
  useEffect(() => {
    if (!isTrackingDelivery) return;
    setDeliveryStep(0);

    const t1 = setTimeout(() => {
      setDeliveryStep(1); // Preparing in the kitchen
    }, 6000);

    const t2 = setTimeout(() => {
      setDeliveryStep(2); // In transit with courier
    }, 16000);

    const t3 = setTimeout(() => {
      setDeliveryStep(3); // Successfully delivered
    }, 30005);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isTrackingDelivery]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
      triggerToast(activeLanguage === 'ar' ? 'تمت الإزالة من المفضلة 💔' : 'Removed from favorites 💔', 'info');
    } else {
      setFavorites([...favorites, id]);
      triggerToast(activeLanguage === 'ar' ? 'تمت الإضافة إلى المفضلة! ❤️' : 'Added to favorites! ❤️', 'success');
    }
  };

  const triggerToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ✦ NEW UPDATED ACTIONS: Basket & Guestbook Review Helpers
  const addToBasket = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBasket((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { id, quantity: 1 }];
    });
    const foundItem = menuItems.find((p) => p.id === id);
    const itemName = foundItem ? (activeLanguage === 'ar' ? foundItem.nameAr : foundItem.nameEn) : 'Item';
    triggerToast(activeLanguage === 'ar' ? `تم إضافة ${itemName} إلى صينية الطلب! 🧁` : `Added ${itemName} to your tray! 🧁`, 'success');
  };

  const removeFromBasket = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBasket((prev) => prev.filter((item) => item.id !== id));
    triggerToast(activeLanguage === 'ar' ? 'تمت إزالة الصنف مـن الطلب.' : 'Removed item from tray.', 'info');
  };

  const updateQuantity = (id: string, delta: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBasket((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is { id: string; quantity: number } => item !== null);
    });
  };

  const clearBasket = () => {
    setBasket([]);
    triggerToast(activeLanguage === 'ar' ? 'تم تفريغ الصينية بنجاح.' : 'Tray cleared successfully.', 'info');
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      triggerToast(activeLanguage === 'ar' ? 'يرجى كتابة الاسم والتعليق' : 'Please provide both author name and comment', 'error');
      return;
    }
    const newRev: Review = {
      id: `review-${Date.now()}`,
      author: newReviewAuthor.trim(),
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      date: new Date().toISOString().split('T')[0]
    };
    try {
      await setDoc(doc(db, 'reviews', newRev.id), newRev);
      setNewReviewAuthor('');
      setNewReviewComment('');
      setNewReviewRating(5);
      triggerToast(activeLanguage === 'ar' ? 'شكراً لتعليقك الجميل! تم النشر ✨' : 'Thank you for your review! Published ✨', 'success');
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.WRITE, 'reviews/' + newRev.id);
      } catch (e) {
        console.error("Error submitting review:", e);
      }
      setReviews([newRev, ...reviews]);
      setNewReviewAuthor('');
      setNewReviewComment('');
      setNewReviewRating(5);
      triggerToast(activeLanguage === 'ar' ? 'حدث خطأ في الاتصال، تم الحفظ محلياً' : 'Connection error, saved locally', 'info');
    }
  };

  const triggerStoryCreation = async () => {
    try {
      await generateAndShareStory(
        settings,
        menuItems,
        activeLanguage,
        (msg) => setStoryProgress(msg),
        (msg) => {
          setStoryProgress(null);
          triggerToast(msg, 'success');
        },
        (err) => {
          setStoryProgress(null);
          triggerToast(err, 'error');
        }
      );
    } catch (e) {
      setStoryProgress(null);
      triggerToast(activeLanguage === 'ar' ? 'فشلت معالجة الكرت' : 'Failed to compile story canvas image', 'error');
    }
  };

  // Helper copy phone or wifi credential to clipboard
  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    triggerToast(
      activeLanguage === 'ar' ? `تم نسخ ${label} بنجاح! 📋` : `Copied ${label} to clipboard! 📋`,
      'success'
    );
  };

  // Icon symbol rendering helper
  const renderItemIcon = (type: MenuItem['iconType']) => {
    switch (type) {
      case 'tea': return <span className="text-xl">🍵</span>;
      case 'espresso': return <span className="text-xl">🥛</span>;
      case 'mocha': return <span className="text-xl">🍫</span>;
      case 'juice': return <span className="text-xl">🍊</span>;
      case 'soda': return <span className="text-xl">🍹</span>;
      case 'icecream': return <span className="text-xl">🍦</span>;
      case 'cake': return <span className="text-xl">🍰</span>;
      case 'cookie': return <span className="text-xl">🥐</span>;
      case 'sparkles': return <span className="text-xl">✨</span>;
      case 'sandwich': return <span className="text-xl">🥪</span>;
      case 'burger': return <span className="text-xl">🍔</span>;
      case 'pasta': return <span className="text-xl">🍝</span>;
      default: return <span className="text-xl">☕</span>;
    }
  };

  // Filtering menu products
  const filteredItems = menuItems.filter(item => {
    const belongsToFav = selectedCategory === 'fav' ? favorites.includes(item.id) : true;
    const belongsToCat = selectedCategory === 'all' || selectedCategory === 'fav' || item.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();

    if (!query) return belongsToFav && belongsToCat;

    const matchesEn = item.nameEn.toLowerCase().includes(query) || item.descriptionEn.toLowerCase().includes(query);
    const matchesAr = item.nameAr.includes(query) || item.descriptionAr.includes(query);

    return belongsToFav && belongsToCat && (matchesEn || matchesAr);
  });

  return (
    <>
      {/* 1. STARTUP IMMERSIVE SPLASH SCREEN */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            id="startup-splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="fixed inset-0 z-[99999] bg-[#07070a] flex flex-col items-center justify-center p-6 overflow-hidden"
          >
            {/* Pulsing Concentric Aura Ring Design */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[310px] h-[310px] rounded-full border border-gold-500/10 animate-ping absolute" />
              <div className="w-[420px] h-[420px] rounded-full border border-gold-500/20 animate-pulse absolute duration-1000" />
              <div className="w-[580px] h-[580px] rounded-full border border-gold-500/5 absolute" />
            </div>

            {/* Rising particle stars */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-bounce bg-gold-400 rounded-full"
                  style={{
                    width: `${Math.random() * 4 + 2}px`,
                    height: `${Math.random() * 4 + 2}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${Math.random() * 3 + 2}s`,
                  }}
                />
              ))}
            </div>

            {/* Brand Herald Crest Logo mockup */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8, type: 'spring' }}
              className="relative w-44 h-44 mb-8 flex items-center justify-center select-none bg-gradient-to-br from-[#0a0a0d] to-[#121217] rounded-full border-2 border-gold-500 shadow-[0_0_50px_rgba(255,193,7,0.4)]"
            >
              <div className="text-center">
                <span className="text-4xl animate-pulse block mb-1">☕</span>
                <span className="text-gold-400 font-serif font-black text-2xl tracking-wider block">CONTIGO</span>
                <span className="text-[7px] text-gold-500/80 font-mono tracking-[4px] uppercase block">RESTAURANT</span>
              </div>
            </motion.div>

            {/* Typography */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-center max-w-sm mb-12 space-y-2.5"
            >
              <h2 className="text-2xl font-serif font-black text-gold-400 tracking-wide max-w-xs mx-auto gold-shimmer">
                {activeLanguage === 'ar' ? 'يومك أجمل مع كونتيغو' : 'Your day is better with Contigo'}
              </h2>
              <p className="text-xs text-gray-400 font-sans tracking-widest font-medium">
                {activeLanguage === 'ar' ? 'قهوتك في المدينة ☕' : 'Your ultimate coffee cup in town ☕'}
              </p>
            </motion.div>

            {/* Sleek Golden Progress loader bar */}
            <div className="w-48 h-[3px] bg-white/5 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-500 rounded-full"
                style={{ width: `${splashProgress}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. CORE MASTER APPLICATION CONTAINER */}
      <div 
        id="contigo-app-root" 
        dir={activeLanguage === 'ar' ? "rtl" : "ltr"}
        className="min-h-screen bg-[#050507] text-gray-200 select-none pb-24 flex flex-col justify-between"
      >
        <div>
          {/* Header element */}
          <Header
            settings={settings}
            activeLanguage={activeLanguage}
            setActiveLanguage={setActiveLanguage}
          />

          {/* Sticky Scrollable Capsule Navigation tabs */}
          <div className="sticky top-0 z-40 bg-[#08080c]/90 backdrop-blur-xl border-b border-gold-500/15 py-3.5 shadow-2xl">
            <div className="max-w-4xl mx-auto px-4 flex justify-start gap-2.5 overflow-x-auto scrollbar-none">
              {[
                { id: 'home', labelAr: 'الرئيسية', labelEn: 'Home Portal', icon: '✨' },
                { id: 'menu', labelAr: 'القائمة', labelEn: 'Gourmet Menu', icon: <Coffee className="w-4 h-4" /> },
                { id: 'moments', labelAr: 'لحظاتنا', labelEn: 'Our Moments', icon: <Camera className="w-4 h-4" /> },
                { id: 'delivery', labelAr: 'الدليفري', labelEn: 'Fast Delivery', icon: '🛵' },
                { id: 'wifi', labelAr: 'الواي فاي', labelEn: 'WIFI Host', icon: <Wifi className="w-4 h-4" /> },
                { id: 'social', labelAr: 'تابعنا', labelEn: 'Social Media', icon: <MessageSquareShare className="w-4 h-4" /> },
                { id: 'admin', labelAr: 'لوحة المشرف', labelEn: 'Admin Panel', icon: <Settings className="w-4 h-4 font-bold" /> }
              ].map((tab) => {
                const isActive = activeMainTab === tab.id;
                return (
                  <button
                    id={`navigation-tab-${tab.id}`}
                    key={tab.id}
                    onClick={() => {
                      setActiveMainTab(tab.id as any);
                      window.scrollTo({ top: 310, behavior: 'smooth' });
                    }}
                    className={`flex items-center gap-2 px-4.5 py-3 rounded-2xl text-xs font-bold transition-all duration-300 shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-gold-600 via-gold-400 to-gold-500 text-black shadow-[0_5px_22px_rgba(255,193,7,0.35)] scale-[1.03] border border-gold-400/20'
                        : 'text-gray-400 hover:text-gold-300 hover:bg-gold-500/5 border border-gold-600/5'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span className="tracking-wide">{activeLanguage === 'ar' ? tab.labelAr : tab.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core main workspace layout */}
          <main className="max-w-4xl mx-auto px-4 py-8">
            <AnimatePresence mode="wait">

              {/* A. HOME CENTRAL PANEL VIEW */}
              {activeMainTab === 'home' && (
                <motion.div
                  key="home-viewport"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8"
                >
                  {/* Brand presentation hero banner card */}
                  <div className="relative overflow-hidden rounded-3xl border border-gold-500/20 bg-gradient-to-b from-[#14141c] to-[#08080c] p-6 md:p-8 text-center shadow-[0_15px_40px_rgba(0,0,0,0.65)] premium-card-shine">
                    {/* Slow orbiting background design */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-gold-500/5 blur-[80px] pointer-events-none" />

                    <div className="relative z-10 space-y-4">
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                        className="inline-flex p-3 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-3xl mb-1 shadow-inner cursor-pointer"
                        onClick={triggerStoryCreation}
                        title={activeLanguage === 'ar' ? 'اضغط للمشاركة' : 'Press to share story'}
                      >
                        ☕
                      </motion.div>
                      <h2 className="text-2xl md:text-3xl font-serif font-black text-white tracking-wide uppercase">
                        {activeLanguage === 'ar' ? 'مرحباً بكم في كونتيغو' : 'Welcome to Contigo'}
                      </h2>
                      <p className="text-xs md:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
                        {activeLanguage === 'ar'
                          ? 'كونتيغو كوفي هو وجهتك المفضلة كعشاق للاستمتاع بأجود أنواع القهوة المختصة والتحلية الراقية في دزاين مريح وأنيق. تميز بيومك معنا.'
                          : 'Your premium cozy lounge in town where exquisite local beans meet delicious hot pastries. Experience our authentic atmosphere.'}
                      </p>

                      <div className="pt-2">
                        <span className="inline-flex gap-2 items-center px-4.5 py-2.5 rounded-full bg-black/60 border border-gold-500/25 text-xs text-gold-400 font-mono">
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          <span>{activeLanguage === 'ar' ? `مفتوح اليوم: ${settings.phone}` : `Assistance Line: ${settings.phone}`}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 1-Click PWA Installation Card */}
                  <div className="my-2">
                    <PWAInstallButton
                      activeLanguage={activeLanguage}
                      variant="button"
                      onInstalledToast={(msg) => triggerToast(msg, 'success')}
                    />
                  </div>

                  {/* HIGH-RES HORIZONTAL FOOD SEPARATIONS SLIDER */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <h3 className="font-serif font-black text-lg text-gold-400 tracking-wide flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-gold-500 animate-pulse" />
                        <span>{activeLanguage === 'ar' ? 'اقتراحات المأكولات المميزة' : 'Gourmet Dessert & Food Suggestions'}</span>
                      </h3>
                      <button
                        onClick={() => { setSelectedCategory('dessert'); setActiveMainTab('menu'); }}
                        className="text-xs text-gray-400 hover:text-gold-400 transition-colors flex items-center gap-1 font-bold"
                      >
                        <span>{activeLanguage === 'ar' ? 'عرض الكل' : 'Discovery list'}</span>
                        <ChevronRight className={`w-3.5 h-3.5 ${activeLanguage === 'ar' ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x touch-pan-x">
                      {DEFAULT_FOOD_SUGGESTIONS.map((food, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.03 }}
                          onClick={() => setSelectedInspectFood(food)}
                          className="min-w-[150px] md:min-w-[180px] bg-gradient-to-b from-[#14141d] to-[#0a0a0e] rounded-2xl border border-gold-500/10 hover:border-gold-500/35 overflow-hidden shadow-lg select-none snap-start group cursor-pointer"
                        >
                          <div className="relative w-full h-32 bg-black/55 overflow-hidden">
                            <img
                              src={food.image}
                              alt={activeLanguage === 'ar' ? food.nameAr : food.nameEn}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                          </div>
                          <div className="p-3 text-center">
                            <span className="block text-xs md:text-sm font-black text-gray-100 group-hover:text-gold-400 transition-colors truncate">
                              {activeLanguage === 'ar' ? food.nameAr : food.nameEn}
                            </span>
                            <span className="text-[9px] uppercase font-mono text-gold-500/60 font-bold block mt-1">
                              {activeLanguage === 'ar' ? 'عرض تفصيل النكهة' : 'Details'} ✦
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* BENTO-STYLE CUSTOM INTERACTIVE QUICK ACTIONS LAYOUT */}
                  <div className="space-y-4">
                    <h3 className="font-serif font-black text-lg text-gold-400 tracking-wide px-1">
                      {activeLanguage === 'ar' ? 'بوابة الخدمات المباشرة' : 'Direct Assistance Portals'}
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      {/* 1. WIFI Access portal */}
                      <button
                        onClick={() => setActiveMainTab('wifi')}
                        className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#121218]/90 to-[#08080c] border border-gold-500/15 hover:border-gold-500/40 rounded-3xl transition-all shadow-md cursor-pointer hover:shadow-[0_10px_25px_rgba(223,177,91,0.06)] group"
                      >
                        <div className="p-3 bg-gold-500/10 border border-gold-500/25 text-gold-400 rounded-2xl group-hover:scale-110 transition-transform duration-300 mb-3">
                          <Wifi className="w-6 h-6 animate-pulse" />
                        </div>
                        <span className="block text-sm font-black text-white">{activeLanguage === 'ar' ? 'واي فاي مجاني' : 'Free Internet'}</span>
                        <span className="block text-[10px] text-gray-500 font-mono mt-1 font-semibold">{settings.wifi.ssid}</span>
                      </button>

                      {/* 2. Interactive Menu Portal */}
                      <button
                        onClick={() => setActiveMainTab('menu')}
                        className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#121218]/90 to-[#08080c] border border-gold-500/15 hover:border-gold-500/40 rounded-3xl transition-all shadow-md cursor-pointer hover:shadow-[0_10px_25px_rgba(223,177,91,0.06)] group"
                      >
                        <div className="p-3 bg-gold-500/10 border border-gold-500/25 text-gold-400 rounded-2xl group-hover:scale-110 transition-transform duration-300 mb-3">
                          <Coffee className="w-6 h-6" />
                        </div>
                        <span className="block text-sm font-black text-white">{activeLanguage === 'ar' ? 'قائمة المنتجات الكاملة' : 'Gourmet Selection'}</span>
                        <span className="block text-[10px] text-gray-500 mt-1 font-semibold">{activeLanguage === 'ar' ? `+${menuItems.length} صنف` : `+${menuItems.length} items`}</span>
                      </button>

                      {/* 3. Instastory Marketing Canvas Creator */}
                      <button
                        onClick={triggerStoryCreation}
                        className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#12121a]/95 to-[#08080c] border border-gold-500/30 hover:border-gold-500/60 rounded-3xl transition-all shadow-lg cursor-pointer hover:shadow-[0_10px_30px_rgba(223,177,91,0.12)] col-span-2 relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(223,177,91,0.04)_0%,transparent_60%)]" />
                        
                        <div className="relative z-10 flex flex-col items-center">
                          <div className="p-3 bg-gold-400 text-black rounded-2xl group-hover:scale-110 transition-transform duration-300 mb-3.5 shadow-xl">
                            <Share2 className="w-6 h-6" />
                          </div>
                          <span className="block text-sm font-black text-gold-400 tracking-wider uppercase font-serif">
                            {activeLanguage === 'ar' ? 'تحميل ستوري للمشاركة 📸' : 'Export Elegant Instagram Story 📸'}
                          </span>
                          <p className="text-[10px] text-gray-400 text-center max-w-sm mt-1.5 font-medium leading-relaxed">
                            {activeLanguage === 'ar'
                              ? 'صمم كرت ستوري رقيق يحتوي على القائمة، الرقم، والوي فاي لنشره وتوصية أصحابك بزيارتنا!'
                              : 'Compiles a premium customized flyer with our daily blends and connection details to share easily on Instagram.'}
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* ✦ LUXURIOUS GUESTBOOK GUEST REVIEWS */}
                  <div className="space-y-6 pt-4">
                    <div className="flex justify-between items-center px-1">
                      <h3 className="font-serif font-black text-lg text-gold-400 tracking-wide flex items-center gap-2">
                        <Star className="w-5 h-5 text-gold-500 fill-gold-500 animate-pulse" />
                        <span>{activeLanguage === 'ar' ? 'سجل زوار كونتيغو' : 'Contigo Guestbook Feed'}</span>
                      </h3>
                      <span className="text-[10px] font-mono font-bold text-gray-550">
                        {reviews.length} {activeLanguage === 'ar' ? 'تعليقات حقيقية' : 'Testimonials'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {reviews.slice(0, 3).map((rev) => (
                        <div key={rev.id} className="p-5 rounded-2xl bg-[#0D0C10] border border-gold-500/15 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-gold-500/35 transition-all">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-gold-500/5 rounded-full blur-xl pointer-events-none" />
                          <div className="space-y-3 pb-1">
                            {/* Stars rating with gold highlights */}
                            <div className="flex items-center gap-0.5 text-gold-500">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-gold-500 text-gold-500' : 'text-gray-700'}`} />
                              ))}
                            </div>
                            <p className="text-[11.5px] text-gray-300 leading-relaxed text-right pr-0 font-sans italic font-normal">
                              "{rev.comment}"
                            </p>
                          </div>
                          <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-4 text-[10px] text-gray-500">
                            <span className="font-mono">{rev.date}</span>
                            <span className="font-sans font-bold text-gold-400 flex items-center gap-1">
                              <User className="w-3 h-3 text-gold-500" />
                              {rev.author}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Submit Review Card */}
                    <div className="rounded-3xl border border-gold-500/20 bg-[#0D0C10] p-6 shadow-xl space-y-4">
                      <div className="space-y-1 text-right">
                        <span className="text-[9px] text-gold-400 font-mono tracking-widest block uppercase font-bold">شاركنا تجربتك اللطيفة</span>
                        <h4 className="text-base font-serif font-black text-white">{activeLanguage === 'ar' ? 'انشر تعليقك الخاص كزائر ✦' : 'Publish Your Custom Review ✦'}</h4>
                      </div>

                      <form onSubmit={handleAddReview} className="space-y-4 text-right">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-[10px] text-gray-400 font-bold uppercase">{activeLanguage === 'ar' ? 'إسم الزائر' : 'Guest Name'}</label>
                            <input
                              type="text"
                              required
                              placeholder={activeLanguage === 'ar' ? 'مثال: أسعد القرطاجي' : 'e.g. Sarra from Tunis'}
                              value={newReviewAuthor}
                              onChange={(e) => setNewReviewAuthor(e.target.value)}
                              className="w-full px-4 py-3 bg-[#050507] border border-gold-500/15 rounded-xl text-xs text-gray-200 focus:border-gold-400 focus:shadow-inner outline-none transition-all"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-[10px] text-gray-400 font-bold uppercase">{activeLanguage === 'ar' ? 'التقييم بالنجوم' : 'Star Rating'}</label>
                            <div className="flex gap-2 justify-end py-1">
                              {[1, 2, 3, 4, 5].map((starVal) => {
                                const isFilled = starVal <= newReviewRating;
                                return (
                                  <button
                                    key={starVal}
                                    type="button"
                                    onClick={() => setNewReviewRating(starVal)}
                                    className="p-1 text-gold-400 hover:scale-110 transition-transform active:scale-95 cursor-pointer"
                                  >
                                    <Star className={`w-5 h-5 ${isFilled ? 'fill-[#E3A857] text-[#E3A857]' : 'text-gray-650'}`} />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10px] text-gray-400 font-bold uppercase">{activeLanguage === 'ar' ? 'تعليقك الجميل' : 'Your Review'}</label>
                          <textarea
                            rows={3}
                            required
                            placeholder={activeLanguage === 'ar' ? 'اكتب انطباعك عن الجلسة، المشروبات، أو الواي فاي هنا...' : 'Write your kind feedback about the space, espresso quality or internet...'}
                            value={newReviewComment}
                            onChange={(e) => setNewReviewComment(e.target.value)}
                            className="w-full px-4 py-3 bg-[#050507] border border-gold-500/15 rounded-xl text-xs text-gray-200 focus:border-gold-400 focus:shadow-inner outline-none transition-all resize-none text-right"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#DCA14D] to-[#E3A857] text-black text-xs font-black hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-gold-950/20"
                        >
                          <Send className="w-4 h-4" />
                          <span>{activeLanguage === 'ar' ? 'انشر تعليقي الآن' : 'Publish Review'}</span>
                        </button>
                      </form>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* B. MENU SELECTIONS TAB */}
              {activeMainTab === 'menu' && (
                <motion.div
                  key="menu-viewport"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  {/* Category Filter and visual panel details */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-br from-[#111118]/80 to-[#0a0a0d]/95 border border-gold-500/15 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
                    <div>
                      <span className="text-[10px] text-gold-400 font-mono tracking-widest block uppercase font-bold mb-1 mr-1">
                        {activeLanguage === 'ar' ? 'انتقي كوبك المفضل وسحر المشروبات' : 'Selected Blends & Delicate Baking'}
                      </span>
                      <h2 className="text-xl md:text-2xl font-serif font-black text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-gold-500 animate-pulse animate-duration-1000" />
                        <span className="gold-shimmer font-bold">{activeLanguage === 'ar' ? 'سحر المذاق المميز' : 'Interactive Coffee Selection'}</span>
                      </h2>
                    </div>

                    <div className="flex flex-wrap gap-1 bg-black/60 p-1.5 rounded-2xl border border-gold-500/10 self-stretch md:self-auto overflow-x-auto">
                      {[
                        { id: 'all', labelAr: 'الكل', labelEn: 'All' },
                        { id: 'hot', labelAr: '🔥 ساخن', labelEn: 'Hot Only' },
                        { id: 'cold', labelAr: '🧊 بارد', labelEn: 'Cold Only' },
                        { id: 'dessert', labelAr: '🍰 تحلية', labelEn: 'Pastries' },
                        { id: 'food', labelAr: '🥪 مأكولات', labelEn: 'Salty Bites' },
                        { id: 'fav', labelAr: '❤️ المفضلة', labelEn: 'Liked' }
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id as any)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                            selectedCategory === cat.id
                              ? 'bg-gold-500/15 text-gold-400 border border-gold-500/40 shadow-xl shadow-black/40 scale-102 font-black'
                              : 'text-gray-400 hover:text-gold-300 hover:bg-gold-500/5'
                          }`}
                        >
                          {activeLanguage === 'ar' ? cat.labelAr : cat.labelEn}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product Search Bar */}
                  <div className="relative">
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gold-500/60 z-10">
                      <Search className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      placeholder={
                        activeLanguage === 'ar'
                          ? 'إبحث عن قهوة تركية، آيس كوفي، كعكة، نوتيلا...'
                          : 'Search our items (e.g. espresso, croissants, cheesecake)...'
                      }
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-12 py-4 bg-[#0a0a0f] border border-gold-500/15 rounded-2xl text-sm text-gray-200 placeholder-gray-500 focus:border-gold-500/50 focus:shadow-[0_0_15px_rgba(223,177,91,0.12)] outline-none transition-all text-right duration-300 font-medium"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute inset-y-0 left-4 px-2 flex items-center text-xs text-gold-500 hover:text-gold-400 font-bold cursor-pointer"
                      >
                        {activeLanguage === 'ar' ? 'إعادة' : 'Clear'}
                      </button>
                    )}
                  </div>

                  {/* Statistics index count */}
                  <div className="flex justify-between items-center text-xs text-gray-500 px-1 font-mono font-semibold">
                    <span>
                      {activeLanguage === 'ar'
                        ? `تم تصفية ${filteredItems.length} صنف متاح حالياً`
                        : `Showing ${filteredItems.length} active selections`}
                    </span>
                    <span className="text-gold-500/50">
                      {activeLanguage === 'ar' ? 'الأسعار تشمل الضرائب المحلية' : 'All unit values on Dinars'}
                    </span>
                  </div>

                  {/* Grid product loop */}
                  {filteredItems.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-gold-500/15 rounded-3xl bg-[#0F0F14]/40 px-6">
                      <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
                        {activeLanguage === 'ar'
                          ? 'عذراً، لم نعثر على أي صنف يطابق معايير اختيارك. تفقد من تفريغ البحث أو التصنيف.'
                          : 'No item matching your specification was located. Clear filters and try again.'}
                      </p>
                      <button
                        onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                        className="mt-4 text-xs font-bold text-gold-400 hover:text-gold-300 transition-colors underline"
                      >
                        {activeLanguage === 'ar' ? 'استعادة الخيارات والبدء مجدداً' : 'Reset & Re-explore'}
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredItems.map((item) => {
                        const isFav = favorites.includes(item.id);
                        return (
                          <motion.div
                            id={`item-card-${item.id}`}
                            layout
                            key={item.id}
                            whileHover={{ y: -6, scale: 1.02 }}
                            onClick={() => setSelectedInspectItem(item)}
                            className={`group relative overflow-hidden rounded-3xl border transition-all duration-300 p-4.5 flex flex-col justify-between cursor-pointer bg-gradient-to-b from-[#14141d] to-[#08080c] premium-card-shine shadow-[0_4px_25px_rgba(0,0,0,0.55)] ${
                              item.isAvailable
                                ? 'border-gold-500/10 hover:border-gold-500/35 hover:shadow-[0_12px_32px_rgba(223,177,91,0.12)]'
                                : 'border-white/5 opacity-60'
                            }`}
                          >
                            <div>
                              {/* Product Picture Cover */}
                              <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 bg-black/75 border border-gold-500/10 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                                {item.imageUrl ? (
                                  <img
                                    src={item.imageUrl}
                                    alt={activeLanguage === 'ar' ? item.nameAr : item.nameEn}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-700 ease-out"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gold-500/20 bg-gradient-to-br from-[#121218]/50 to-[#08080c]">
                                    <Sparkles className="w-8 h-8 animate-pulse text-gold-500/25" />
                                  </div>
                                )}

                                {/* Inner frame inset */}
                                <div className="absolute inset-2 ml-0 border border-gold-500/10 pointer-events-none rounded-xl" />

                                {/* Icon category label overlay */}
                                <div className="absolute top-2.5 left-2.5 p-2 rounded-xl bg-[#08080c]/80 backdrop-blur-md border border-gold-500/20 text-gold-400 shadow-lg">
                                  {renderItemIcon(item.iconType)}
                                </div>

                                {/* Top-Right Price Tag badge */}
                                <div className="absolute top-2.5 right-2.5">
                                  <span className="text-xs font-black font-mono text-gold-400 bg-[#08080c]/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-gold-500/35 shadow-lg block">
                                    {item.price.toFixed(1)} <span className="text-[9px] font-sans text-gray-400">DT</span>
                                  </span>
                                </div>

                                {/* Out of stock blur */}
                                {!item.isAvailable && (
                                  <div className="absolute inset-0 bg-black/85 backdrop-blur-[2px] flex items-center justify-center p-2 text-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest bg-red-950/95 text-red-400 border border-red-500/40 rounded-xl px-4 py-2 shadow-2xl">
                                      {activeLanguage === 'ar' ? 'غير متوفر اليوم' : 'Sold Out'}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Title headers */}
                              <div className="space-y-1.5 pr-1 mt-2 text-right">
                                <h3 className="font-sans font-extrabold text-[#f3f4f6] text-base group-hover:text-gold-400 transition-colors leading-snug tracking-tight">
                                  {item.nameAr}
                                </h3>
                                <h4 className="font-mono text-[9px] text-gold-400/80 uppercase tracking-widest block font-bold">
                                  {item.nameEn}
                                </h4>
                              </div>

                              {/* short descriptions */}
                              <p className="text-[11px] text-gray-400 line-clamp-2 mt-2 leading-relaxed text-right pr-1">
                                {activeLanguage === 'ar' ? item.descriptionAr : item.descriptionEn}
                              </p>
                            </div>

                            {/* Footer interactions block */}
                            <div className="flex justify-between items-center border-t border-gold-500/10 pt-3 mt-4 gap-2">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={(e) => toggleFavorite(item.id, e)}
                                  className="p-2 ml-0 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-500/5 active:scale-90 transition-all cursor-pointer border border-transparent hover:border-red-500/10"
                                  title="Favorite"
                                >
                                  <Heart className={`w-4.5 h-4.5 transition-all ${isFav ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-500'}`} />
                                </button>
                                
                                {item.isAvailable && (
                                  <button
                                    onClick={(e) => addToBasket(item.id, e)}
                                    className="p-2 rounded-xl text-gold-400 bg-gold-400/5 hover:bg-gold-400/15 active:scale-90 transition-all cursor-pointer border border-gold-400/20 flex items-center justify-center gap-1"
                                    title={activeLanguage === 'ar' ? 'أضف لصينية الطلب' : 'Add to Tray'}
                                  >
                                    <Plus className="w-3.5 h-3.5 text-gold-400" />
                                    <span className="text-[9px] font-extrabold">{activeLanguage === 'ar' ? 'اطلب' : 'Tray'}</span>
                                  </button>
                                )}
                              </div>

                              <button
                                className="text-[10px] font-black tracking-wide text-gold-400 group-hover:text-gold-300 flex items-center gap-0.5"
                              >
                                <span>{activeLanguage === 'ar' ? 'تفاصيل المكونات' : 'Inspect description'}</span>
                                <ChevronRight className={`w-3.5 h-3.5 text-gold-500 shrink-0 ${activeLanguage === 'ar' ? 'rotate-180' : ''}`} />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* C. MOMENTS GALLERY TAB */}
              {activeMainTab === 'moments' && (
                <motion.div
                  key="moments-viewport"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-6"
                >
                  <div className="text-center max-w-md mx-auto space-y-2 mb-4">
                    <h2 className="font-serif font-black text-2xl text-gold-400 tracking-wide gold-shimmer">
                      {activeLanguage === 'ar' ? 'لحظاتنا في كونتيغو' : 'Cafe Moments & Memories'}
                    </h2>
                    <p className="text-xs text-gray-400 leading-relaxed font-sans">
                      {activeLanguage === 'ar'
                        ? 'لقطات حية وأمبيانت تم التقاطها بكل حب في فناء كونتيغو لتوثيق أوقاتنا وضحكاتكم الجميلة.'
                        : 'Authentic frames of quiet afternoons and morning brews shot lovingly by our crew and dear cafe guests.'}
                    </p>
                  </div>

                  {/* Bento Gallery Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Guest Instant Memory Upload Card */}
                    <div className="relative rounded-2xl border border-dashed border-gold-400/35 bg-[#0D0D10]/95 hover:border-gold-400/70 p-5 flex flex-col justify-between shadow-xl text-right overflow-hidden group">
                      <div className="space-y-2">
                        <span className="text-[9.5px] text-gold-400 font-mono tracking-widest block uppercase font-bold">زوارنا الرائعون</span>
                        <h4 className="text-sm font-serif font-black text-white">{activeLanguage === 'ar' ? 'أنشر صـورتك فـي ألبومنا 📸' : 'Publish Your Photo Here 📸'}</h4>
                        <p className="text-[10.5px] text-gray-400 leading-normal font-medium">
                          {activeLanguage === 'ar' 
                            ? 'التقطت صورة تذكارية في فناء مقهى كونتيغو؟ ارفعها الآن مـن معرض الصور وسننشرها فوراً على لوحة اللحظات!' 
                            : 'Shot a warm moment at Contigo? Upload it now from your local mobile gallery to add it directly to our memory board!'}
                        </p>
                      </div>

                      <div className="pt-3 space-y-2.5">
                        <input
                          type="text"
                          placeholder={activeLanguage === 'ar' ? 'اكتب تعليقاً على الصورة...' : 'Add a caption...'}
                          id="guest-moment-caption"
                          className="w-full px-3 py-2 bg-[#050507] border border-gold-500/15 rounded-xl text-[10.5px] text-gray-200 focus:border-gold-400 outline-none text-right placeholder-gray-650 transition-all font-sans"
                        />
                        <label className="w-full py-2.5 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/20 text-gold-400 text-[10.5px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]">
                          <Camera className="w-4 h-4" />
                          <span>{activeLanguage === 'ar' ? 'اختر صورة مـن هاتفك' : 'Select From Gallery'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              const captionInput = document.getElementById('guest-moment-caption') as HTMLInputElement;
                              const caption = captionInput ? captionInput.value.trim() : '';
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') {
                                    const newMomTextAr = caption || (activeLanguage === 'ar' ? 'مشاركة من زوارنا 📸☕️' : 'Shared by our beautiful guests 📸☕️');
                                    const newMomTextEn = caption || 'Memories shared by lovely guests';
                                    setMoments([
                                      {
                                        id: `m-guest-${Date.now()}`,
                                        src: reader.result,
                                        captionAr: newMomTextAr,
                                        captionEn: newMomTextEn
                                      },
                                      ...moments
                                    ]);
                                    if (captionInput) captionInput.value = '';
                                    triggerToast(activeLanguage === 'ar' ? 'تمت إضافة لحظتك المميزة بنجاح! 🎉' : 'Your cozy moment has been added! 🎉', 'success');
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {moments.map((m, index) => (
                      <motion.div
                        key={m.id || index}
                        whileHover={{ y: -5, scale: 1.02 }}
                        onClick={() => setLightboxIndex(index)}
                        className="relative rounded-2xl border border-gold-500/10 overflow-hidden shadow-lg select-none group cursor-pointer aspect-square bg-[#0c0a09]"
                      >
                        <img
                          src={m.src}
                          alt={activeLanguage === 'ar' ? m.captionAr : m.captionEn}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                          referrerPolicy="no-referrer"
                        />
                        {/* Elegant Dark Vignette overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                        {/* Caption floating card */}
                        <div className="absolute bottom-0 inset-x-0 p-4.5 text-right space-y-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <span className="block text-xs font-extrabold text-gold-400 font-sans tracking-wide">
                            {activeLanguage === 'ar' ? m.captionAr : m.captionEn}
                          </span>
                          <span className="block text-[9px] font-mono text-gray-500 font-bold uppercase tracking-widest">
                            {activeLanguage === 'ar' ? 'انقر لتكبير الصورة 👁️' : 'Click to zoom 👁️'}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* D. FAST DELIVERY SERVICES TAB */}
              {activeMainTab === 'delivery' && (
                <motion.div
                  key="delivery-viewport"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6 text-right"
                >
                  {/* LIVE PROGRESS DELIVERY TRACKER VIEW */}
                  {isTrackingDelivery ? (
                    <div className="rounded-3xl border border-gold-500/20 bg-gradient-to-br from-[#121217] to-[#08080c] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)] space-y-8 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_right_top,rgba(223,177,91,0.03)_0%,transparent_50%)]" />

                      {/* Header block */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gold-500/10 pb-5 relative z-10 text-right">
                        <div className="space-y-1">
                          <span className="bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono px-2.5 py-1 rounded-full font-bold uppercase tracking-wider animate-pulse inline-flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                            <span>{activeLanguage === 'ar' ? 'طلبك قيد المتابعة الحية' : 'Live Tracking Active'}</span>
                          </span>
                          <h3 className="font-serif font-black text-xl text-white gold-shimmer">
                            {activeLanguage === 'ar' ? 'رحلة طلبك من كافي كونتيغو' : 'Your Contigo Order Journey'}
                          </h3>
                        </div>
                        <div className="text-center sm:text-left">
                          <span className="text-xs text-gray-400 font-sans block">{activeLanguage === 'ar' ? 'الوقت التقديري المتبقي' : 'Estimated Time'}</span>
                          <span className="text-xl font-mono font-black text-gold-400 mt-1 block">
                            {deliveryStep === 0 ? '25-30' : deliveryStep === 1 ? '15-20' : deliveryStep === 2 ? '5-10' : '0'}{' '}
                            <span className="text-xs font-sans text-gray-500">{activeLanguage === 'ar' ? 'دق' : 'min'}</span>
                          </span>
                        </div>
                      </div>

                      {/* SIMULATED MAP SCROLL ROAD */}
                      <div className="relative h-24 bg-black/60 rounded-2xl border border-gold-500/10 overflow-hidden flex items-center shadow-inner">
                        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(var(--color-gold-500)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                        
                        {/* Courier sliding scooter path */}
                        <div className="w-full px-8 relative flex items-center justify-between">
                          {/* Dotted path */}
                          <div className="absolute h-0.5 left-12 right-12 border-t-2 border-dashed border-gold-500/20 top-1/2 -translate-y-1/2 z-0" />
                          <div
                            className="absolute h-0.5 bg-gold-400/60 top-1/2 -translate-y-1/2 left-12 transition-all duration-1000 ease-out z-0"
                            style={{
                              width: deliveryStep === 0 ? '10%' : deliveryStep === 1 ? '40%' : deliveryStep === 2 ? '75%' : '90%'
                            }}
                          />

                          {/* Location indicators */}
                          <div className="z-10 bg-[#121217] border border-gold-500/15 p-2 rounded-xl text-base flex items-center justify-center shadow">
                            🏪
                          </div>

                          {/* Dynamic client home marker */}
                          <div className="z-10 bg-[#121217] border border-gold-500/15 p-2 rounded-xl text-base flex items-center justify-center shadow">
                            🏠
                          </div>

                          {/* Sliding scooter */}
                          <div
                            className="absolute -top-3 left-12 h-10 w-10 flex items-center justify-center transition-all duration-1000 ease-out text-2xl z-20 pointer-events-none"
                            style={{
                              left: deliveryStep === 0 ? 'calc(10% + 12px)' : deliveryStep === 1 ? 'calc(40% + 12px)' : deliveryStep === 2 ? 'calc(75% + 12px)' : 'calc(90% - 12px)'
                            }}
                          >
                            {deliveryStep === 3 ? '🎉' : '🛵'}
                          </div>
                        </div>
                      </div>

                      {/* TRACKING TIMELINE STEPS */}
                      <div className="relative font-sans space-y-6 pt-2">
                        {[
                          { step: 0, ar: 'تثبيت الطلب ومراجعته ورقه', en: 'Order Placed & Confirmed' },
                          { step: 1, ar: 'جاري التحضير طازجاً في الكوجينة بكل حب', en: 'Gourmet Preparing in the Kitchen' },
                          { step: 2, ar: 'خرج السائق لتوصيله إليك في كلوش حراري', en: 'In Transit with Thermal Lock Secure' },
                          { step: 3, ar: 'تم التسليم بالهناء والشفاء! صحة وبالشفا ليك 🟢', en: 'Delivered Successfully! Enjoy 🟢' }
                        ].map((node) => {
                          const isActive = deliveryStep >= node.step;
                          const isCurrent = deliveryStep === node.step;
                          return (
                            <div key={node.step} className="flex justify-end items-start gap-4 text-right">
                              <div className="pt-0.5">
                                <span className={`block font-bold text-xs ${isActive ? 'text-white' : 'text-gray-500'}`}>
                                  {activeLanguage === 'ar' ? node.ar : node.en}
                                </span>
                                <span className="block text-[10px] text-gray-500 font-medium">
                                  {node.step === 0 && (activeLanguage === 'ar' ? 'نشكرك على اختيار كونتيغو كافيه' : 'Thank you for choosing Contigo Coffee')}
                                  {node.step === 1 && (activeLanguage === 'ar' ? 'فريق الباريستا ومحترفي الطبخ ينظمون صينتيك' : 'Barista & culinary master prepares items')}
                                  {node.step === 2 && (activeLanguage === 'ar' ? 'سائق المحل ممتطي الدراجة في الطريق لعنوانك' : 'Our courier is riding to your specific address')}
                                  {node.step === 3 && (activeLanguage === 'ar' ? 'صحتين وعافية على قلبك يا غالي' : 'Bon appétit to our dearest customer')}
                                </span>
                              </div>
                              <div className="relative flex flex-col items-center select-none pt-1">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                                  isCurrent
                                    ? 'bg-gold-500 border-gold-400 ring-4 ring-gold-500/20 scale-110'
                                    : isActive
                                    ? 'bg-emerald-500 border-emerald-400'
                                    : 'bg-black/80 border-gray-700'
                                }`}>
                                  {isActive && node.step < deliveryStep ? (
                                    <span className="text-[8px] text-white">✓</span>
                                  ) : (
                                    <span className="w-1.5 h-1.5 rounded-full bg-black/40" />
                                  )}
                                </div>
                                {node.step < 3 && (
                                  <div className={`w-0.5 h-12 my-1 transition-all ${deliveryStep > node.step ? 'bg-emerald-500' : 'bg-gray-800'}`} />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Recipient summary facts segment */}
                      <div className="p-4 bg-black/40 border border-gold-500/10 rounded-2xl space-y-2 text-right">
                        <span className="text-[10px] text-gold-400 block font-black border-b border-gold-500/5 pb-1 uppercase">{activeLanguage === 'ar' ? '📍 تفاصيل التوصيل وعنوان المستلم' : '📍 Receipt and Coordinate records'}</span>
                        <div className="text-xs space-y-1 font-medium text-gray-300">
                          <p>👤 <span className="text-white font-bold">{deliveryName || (activeLanguage === 'ar' ? 'زبون كونتيغو' : 'Contigo Guest')}</span></p>
                          <p>📞 <span>{deliveryPhone || '-- --- ---'}</span></p>
                          <p>🗺️ <span>{deliveryAddress || (activeLanguage === 'ar' ? 'كامل مدينة تونس وضواحيها' : 'Tunsia Direct Delivery')}</span></p>
                          {deliveryNotes && <p>📝 <span className="italic text-gray-400">"{deliveryNotes}"</span></p>}
                        </div>
                      </div>

                      {/* Action buttons inside the tracker */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4">
                        <a
                          href="tel:+21655392088"
                          className="py-3.5 rounded-2xl border border-gold-500/15 bg-[#171720] hover:bg-gold-500/10 text-gold-400 text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Phone className="w-4 h-4" />
                          <span>{activeLanguage === 'ar' ? 'اتصل بسائق الدليفري' : 'Call Courier'}</span>
                        </a>

                        <button
                          onClick={() => {
                            setIsTrackingDelivery(false);
                            setBasket([]);
                            setDeliveryName('');
                            setDeliveryPhone('');
                            setDeliveryAddress('');
                            setDeliveryNotes('');
                            triggerToast(activeLanguage === 'ar' ? 'تم إعادة تصفير السلة وجاهز لطلب جديد! 🛵✨' : 'Tray reset. Ready for your next order! 🛵✨', 'success');
                          }}
                          className={`py-3.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg ${
                            deliveryStep === 3
                              ? 'bg-gradient-to-r from-emerald-600 to-emerald-450 hover:bg-emerald-500 text-white'
                              : 'bg-gradient-to-r from-gold-600 to-gold-400 text-black hover:opacity-95'
                          }`}
                        >
                          <span>{activeLanguage === 'ar' ? 'بدء طلب جديد وتصفير السلة' : 'Start Fresh Order'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* DYNAMIC ORDER BASKET & FORM CHECKOUT VIEW */
                    <div className="space-y-6">
                      <div className="text-center max-w-sm mx-auto space-y-3 py-4">
                        <span className="text-5xl animate-bounce block mb-1">🛵</span>
                        <h2 className="font-serif font-black text-2xl text-gold-400 tracking-wide gold-shimmer block">
                          {activeLanguage === 'ar' ? 'خدمة توصيل الطلبات للمنازل' : 'Gourmet Direct Delivery'}
                        </h2>
                        <p className="text-xs text-gray-400 font-sans leading-relaxed">
                          {activeLanguage === 'ar'
                            ? 'تمتع بقهوتك الساخنة وطعامك طازجاً أينما كنت! املأ تفاصيل صينيتك لتستمتع بالتتبع الفوري 🛵'
                            : 'Hot blends and delicate savory recipes delivered directly to your doorstep in real-time tracking fidelity 🛵'}
                        </p>
                      </div>

                      {/* Basket tray contents review */}
                      <div className="overflow-hidden border border-gold-500/15 bg-gradient-to-br from-[#121217] to-[#0a0a0e] rounded-3xl p-5 shadow-2xl relative">
                        <h3 className="font-serif font-black text-sm text-gold-400 tracking-wide border-b border-gold-500/10 pb-2.5 flex items-center justify-between">
                          <span className="text-xs font-mono font-black text-gray-400 select-none">
                            {basket.reduce((a, b) => a + b.quantity, 0)} {activeLanguage === 'ar' ? 'أصناف مختارة' : 'Selected items'}
                          </span>
                          <span className="flex items-center gap-1.5 select-none">
                            <ShoppingBag className="w-4 h-4 text-gold-400" />
                            <span>{activeLanguage === 'ar' ? 'تفاصيل صينيتك الحالية' : 'Review Your Order Tray'}</span>
                          </span>
                        </h3>

                        {basket.length === 0 ? (
                          <div className="text-center py-10 space-y-5 select-none font-sans">
                            <p className="text-xs text-gray-400">
                              {activeLanguage === 'ar'
                                ? 'صينية طلباتك فارغة حالياً للتوصيل! زر المنيو اللذيذ وأضف بعض المأكولات والمشروبات.'
                                : 'Your order tray is empty! Visit the Menu to add rich coffee and Tunisian food selections.'}
                            </p>
                            <button
                              onClick={() => {
                                setSelectedCategory('all');
                                setActiveMainTab('menu');
                              }}
                              className="px-5 py-2.5 rounded-xl bg-gold-500 text-black font-black text-xs hover:opacity-95 cursor-pointer shadow-lg active:scale-95 transition-all text-center inline-block"
                            >
                              {activeLanguage === 'ar' ? 'تصفح منيو الأطباق والمشروبات 🥪☕' : 'Browse Drinks & Food Menu 🥪☕'}
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4 pt-4">
                            {/* Listed tray products */}
                            <div className="divide-y divide-gold-500/5 max-h-[160px] overflow-y-auto pr-1">
                              {basket.map((basketItem) => {
                                const item = menuItems.find(p => p.id === basketItem.id);
                                if (!item) return null;
                                return (
                                  <div key={basketItem.id} className="flex justify-between items-center py-2 text-right">
                                    <span className="font-mono text-xs text-gold-400">{ (item.price * basketItem.quantity).toFixed(1) } DT</span>
                                    <div>
                                      <span className="block text-xs font-extrabold text-white">
                                        {activeLanguage === 'ar' ? item.nameAr : item.nameEn}
                                      </span>
                                      <span className="block text-[10px] text-gray-500">
                                        {basketItem.quantity} × {item.price.toFixed(1)} DT
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Sum calculation */}
                            <div className="border-t border-gold-500/10 pt-3 space-y-1.5 text-xs text-gray-400 font-bold">
                              <div className="flex justify-between items-center">
                                <span className="font-mono text-white">
                                  {basket.reduce((acc, b) => {
                                    const it = menuItems.find(p => p.id === b.id);
                                    return acc + (it ? it.price * b.quantity : 0);
                                  }, 0).toFixed(1)} DT
                                </span>
                                <span>{activeLanguage === 'ar' ? 'مجموع المأكولات والمشروبات' : 'Tray subtotal'}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-mono text-white">3.0 DT</span>
                                <span>{activeLanguage === 'ar' ? 'رسوم الدليفري والتوصيل الموحدة' : 'Flat rate shipping'}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm font-serif font-black text-white border-t border-dashed border-gold-500/10 pt-2">
                                <span className="font-mono text-gold-400 text-base">
                                  {(
                                    basket.reduce((acc, b) => {
                                      const it = menuItems.find(p => p.id === b.id);
                                      return acc + (it ? it.price * b.quantity : 0);
                                    }, 0) + 3.0
                                  ).toFixed(1)}{' '}
                                  DT
                                </span>
                                <span>{activeLanguage === 'ar' ? 'إجمالي الدفع عند الاستلام' : 'Total Cash on Delivery'}</span>
                              </div>
                            </div>

                            {/* ADDRESS ORDER CHECKOUT FORM */}
                            <div className="border-t border-gold-500/10 pt-4 space-y-3.5">
                              <span className="text-[10px] text-gold-400 font-extrabold block uppercase tracking-wider">
                                {activeLanguage === 'ar' ? '📋 بيانات التوصيل لبدء التتبع السريع' : '📋 Shipping & Coordinate Forms'}
                              </span>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-right font-sans">
                                <div className="space-y-1">
                                  <label className="text-[10px] text-gray-500 font-black block">{activeLanguage === 'ar' ? 'اسم المستلم بالكامل' : 'Full Name'}</label>
                                  <input
                                    type="text"
                                    value={deliveryName}
                                    onChange={(e) => setDeliveryName(e.target.value)}
                                    placeholder={activeLanguage === 'ar' ? 'مثال: محمد التونسي' : 'e.g. Adam Green'}
                                    className="w-full bg-black/60 border border-gold-500/10 text-white rounded-xl px-3.5 py-2 text-xs outline-none focus:border-gold-400"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] text-gray-500 font-black block">{activeLanguage === 'ar' ? 'رقم هاتف الاتصال' : 'Recipient Phone Target'}</label>
                                  <input
                                    type="tel"
                                    value={deliveryPhone}
                                    onChange={(e) => setDeliveryPhone(e.target.value)}
                                    placeholder={activeLanguage === 'ar' ? 'يجب إدخال الهاتف' : 'Contact number required'}
                                    className="w-full bg-black/60 border border-gold-500/10 text-white rounded-xl px-3.5 py-2 text-xs outline-none focus:border-gold-400 font-mono"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1 text-right">
                                <label className="text-[10px] text-gray-500 font-black block">{activeLanguage === 'ar' ? 'عنوان التوصيل الدقيق' : 'Gourmet Delivery Address'}</label>
                                <input
                                  type="text"
                                  value={deliveryAddress}
                                  onChange={(e) => setDeliveryAddress(e.target.value)}
                                  placeholder={activeLanguage === 'ar' ? 'مثال: المرسى، نهج سيدي بوسعيد، عمارة الأمل، شقة 4' : 'e.g. Marsa, Sidi Bou Said street, Block 3, Apt 12'}
                                  className="w-full bg-black/60 border border-gold-500/10 text-white rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-gold-400 font-sans"
                                />
                              </div>

                              <div className="space-y-1 text-right">
                                <label className="text-[10px] text-gray-500 font-black block">{activeLanguage === 'ar' ? 'ملاحظات خاصة للبنزينة أو المطبخ' : 'Barista & Courier Instructions'}</label>
                                <input
                                  type="text"
                                  value={deliveryNotes}
                                  onChange={(e) => setDeliveryNotes(e.target.value)}
                                  placeholder={activeLanguage === 'ar' ? 'مثال: الباب الخلفي، رن الجرس مرتين، أو الهريسة إكسترا بنسبة حارة' : 'e.g. Ring bell twice, make the Harissa extra spicy'}
                                  className="w-full bg-black/60 border border-gold-500/10 text-white rounded-xl px-3.5 py-2 text-xs outline-none focus:border-gold-400 font-sans"
                                />
                              </div>

                              <button
                                onClick={() => {
                                  if (!deliveryPhone.trim() || !deliveryAddress.trim() || !deliveryName.trim()) {
                                    triggerToast(activeLanguage === 'ar' ? 'يرجى إكمال تعبئة حقول الهاتف والاسم والعنوان لتأكيد دقة التوصيل! ⚠️' : 'Name, phone, and delivery address coordinates are required! ⚠️', 'error');
                                    return;
                                  }
                                  // Open real WhatsApp text trigger with order specs
                                  const totalCost = (
                                    basket.reduce((acc, b) => {
                                      const it = menuItems.find(p => p.id === b.id);
                                      return acc + (it ? it.price * b.quantity : 0);
                                    }, 0) + 3.0
                                  ).toFixed(1);
                                  const listStr = basket.map(b => {
                                    const it = menuItems.find(p => p.id === b.id);
                                    return it ? `${b.quantity}x ${it.nameAr}` : '';
                                  }).filter(Boolean).join(', ');
                                  
                                  const messageUrl = `https://wa.me/21655392088?text=${encodeURIComponent(
                                    `سلام عليكم، نحب نعمل طلب دليفري من كافي كونتيغو:\n👤 الاسم: ${deliveryName}\n📞 الهاتف: ${deliveryPhone}\n🗺️ العنوان: ${deliveryAddress}\n📝 ملاحظات: ${deliveryNotes || 'لا توجد'}\n🛍️ الطلب: ${listStr}\n💰 الإجمالي: ${totalCost} DT`
                                  )}`;
                                  
                                  // Open in new tab or trigger simulation
                                  window.open(messageUrl, '_blank');
                                  
                                  // Trigger the timeline live simulator!
                                  setIsTrackingDelivery(true);
                                  triggerToast(activeLanguage === 'ar' ? 'تم تسجيل طلبك وإرساله بنجاح! جاري تشغيل المتتبع المباشر 🛵✨' : 'Order synchronized with WhatsApp! Live tracker booted! 🛵✨', 'success');
                                }}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold-600 via-gold-400 to-gold-500 text-black font-black hover:opacity-95 text-xs active:scale-98 transition-all shadow-xl text-center cursor-pointer select-none"
                              >
                                {activeLanguage === 'ar' ? '🚀 تأكيد الطلب السريع وبدء التتبع التفاعلي' : '🚀 Confirm Order & Live-Track Me!'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* direct dialing alternative hotlines */}
                      <div className="space-y-3.5 text-right">
                        <span className="text-[10px] text-gold-500/70 font-mono tracking-widest font-bold uppercase mr-1">
                          {activeLanguage === 'ar' ? 'أو اطلب بالهاتف مباشرة' : 'Or Dial Support Hotlines Directly'}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {["55 392 088", "21 881 503"].map((phone, idx) => (
                            <div
                              key={idx}
                              className="flex flex-col sm:flex-row items-center justify-between p-4.5 rounded-3xl border border-gold-500/15 bg-gradient-to-b from-[#14141d] to-[#08080c] shadow-lg premium-card-shine gap-4"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-gold-400/10 border border-gold-400/20 text-gold-400 rounded-xl">
                                  <Phone className="w-4 h-4" />
                                </div>
                                <div className="text-right">
                                  <span className="block text-[8px] font-black uppercase tracking-widest text-gold-500/70">
                                    {activeLanguage === 'ar' ? `خط الدليفري المباشر ${idx + 1}` : `Helpline direct line ${idx + 1}`}
                                  </span>
                                  <span className="block font-sans font-black text-base text-white tracking-wider mt-0.5">{phone}</span>
                                </div>
                              </div>

                              <a
                                href={`tel:${phone.replace(/\s/g, '')}`}
                                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 text-xs font-black flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer border border-gold-500/15"
                              >
                                <Phone className="w-3 h-3" />
                                <span>{activeLanguage === 'ar' ? 'اتصل الآن' : 'Call Direct'}</span>
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery conditions cards facts */}
                      <div className="rounded-3xl border border-gold-500/10 bg-[#0e0e14]/70 p-6 space-y-4">
                        <h3 className="font-serif font-bold text-gold-400 tracking-wide flex items-center justify-end gap-2 border-b border-gold-500/10 pb-2.5">
                          <span>{activeLanguage === 'ar' ? 'معلومات وشروط الخدمة للتسليم' : 'Delivery Guidelines & Rates'}</span>
                          <Clock className="w-4.5 h-4.5" />
                        </h3>

                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed text-right">
                          {[
                            { ar: "التوصيل متوفر في كامل المدينة وضواحيها", en: "Available inside city and nearby coordinates" },
                            { ar: "وقت التوصيل التقديري: 20-40 دقيقة فقط", en: "Fulfill estimates: 20-40 minutes top" },
                            { ar: "الحد الأدنى لقيمة الطلب: 10 د.ت (DT)", en: "Minimum required basket value: 10 DT" },
                            { ar: "رسوم توصيل موحدة: 3 د.ت فقط لا غير", en: "Uniform flat rate shipping: 3 DT" },
                            { ar: "الدفع نقداً بالكامل عند تسلم المنتجات", en: "Payment type: Cash on Delivery fully" },
                            { ar: "قهوتنا مغلفة بإحكام حراري للحفاظ على السخونة والحرارة", en: "Thermals locked cups preserve coffee flavors" }
                          ].map((guideline, i) => (
                            <li key={i} className="flex justify-end items-start gap-2.5 text-right p-1 rounded-lg">
                              <span className="text-gray-300 font-sans font-medium">
                                {activeLanguage === 'ar' ? guideline.ar : guideline.en}
                              </span>
                              <Check className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* E. WIFI DETAILS CARD */}
              {activeMainTab === 'wifi' && (
                <motion.div
                  key="wifi-viewport"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <WiFiCard wifi={settings.wifi} activeLanguage={activeLanguage} />
                </motion.div>
              )}

              {/* F. SOCIAL CHANNELS LINKS */}
              {activeMainTab === 'social' && (
                <motion.div
                  key="social-viewport"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <SocialLinks settings={settings} activeLanguage={activeLanguage} />
                </motion.div>
              )}

              {/* G. ADMIN CREDENTIAL DASHBOARD */}
              {activeMainTab === 'admin' && (
                <motion.div
                  key="admin-viewport"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <AdminPanel
                    settings={settings}
                    menuItems={menuItems}
                    onUpdateSettings={async (newSettings) => {
                      setSettings(newSettings);
                      try {
                        await setDoc(doc(db, 'settings', 'current'), newSettings);
                      } catch (err) {
                        try {
                          handleFirestoreError(err, OperationType.WRITE, 'settings/current');
                        } catch (e) {
                          console.error("Error saving settings on Firestore:", e);
                        }
                      }
                    }}
                    onUpdateMenu={async (newMenu) => {
                      setMenuItems(newMenu);
                      try {
                        for (const item of newMenu) {
                          await setDoc(doc(db, 'menu', item.id), item);
                        }
                        const deletedItems = menuItems.filter(item => !newMenu.some(n => n.id === item.id));
                        for (const item of deletedItems) {
                          await deleteDoc(doc(db, 'menu', item.id));
                        }
                      } catch (err) {
                        try {
                          handleFirestoreError(err, OperationType.WRITE, 'menu');
                        } catch (e) {
                          console.error("Error saving menu on Firestore:", e);
                        }
                      }
                    }}
                    activeLanguage={activeLanguage}
                    moments={moments}
                    onUpdateMoments={async (newMoments) => {
                      setMoments(newMoments);
                      try {
                        for (const m of newMoments) {
                          await setDoc(doc(db, 'moments', m.id), m);
                        }
                        const deletedMoments = moments.filter(m => !newMoments.some(nm => nm.id === m.id));
                        for (const m of deletedMoments) {
                          await deleteDoc(doc(db, 'moments', m.id));
                        }
                      } catch (err) {
                        try {
                          handleFirestoreError(err, OperationType.WRITE, 'moments');
                        } catch (e) {
                          console.error("Error saving moments on Firestore:", e);
                        }
                      }
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>

        {/* 3. CORE PREMIUM LIGHTBOX MEMORY IMAGE PREVIEW */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-4 right-4 p-3 rounded-full bg-black/60 border border-gold-500/20 text-gold-400 hover:bg-gold-500 hover:text-black hover:border-transparent transition-all z-[100002] cursor-pointer"
                title="Close"
              >
                <span className="text-xl font-black">×</span>
              </button>

              <div className="relative max-w-4xl w-full flex flex-col items-center justify-center">
                {/* Floating Left indicator to switch moments */}
                <button
                  onClick={() => setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + moments.length) % moments.length))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl border border-gold-500/20 bg-black/50 text-gold-400 font-bold hover:bg-gold-500/10 active:scale-95 transition-all z-[100001]"
                >
                  ❮
                </button>

                <motion.img
                  key={lightboxIndex}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={moments[lightboxIndex]?.src}
                  alt="Cafe memory zoom"
                  className="max-h-[80vh] max-w-full rounded-2xl object-contain border-2 border-gold-500 shadow-2xl"
                  referrerPolicy="no-referrer"
                />

                {/* Caption tag */}
                <div className="mt-4 text-center space-y-1.5 p-3 rounded-xl bg-[#0e0e14]/80 border border-gold-500/15 max-w-sm">
                  <span className="text-sm font-sans font-black text-gold-400">
                    {activeLanguage === 'ar' ? moments[lightboxIndex]?.captionAr : moments[lightboxIndex]?.captionEn}
                  </span>
                </div>

                {/* Floating Right indicator to switch moments */}
                <button
                  onClick={() => setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % moments.length))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl border border-gold-500/20 bg-black/50 text-gold-400 font-bold hover:bg-gold-500/10 active:scale-95 transition-all z-[100001]"
                >
                  ❯
                </button>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* 4. CHANNELS DETAILED INSPECT FOOD DIALOG */}
        <AnimatePresence>
          {selectedInspectFood && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-gradient-to-br from-[#121218] to-[#08080c] border border-gold-500/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative"
              >
                <div className="relative h-52 overflow-hidden bg-black/80">
                  <img
                    src={selectedInspectFood.image}
                    alt={selectedInspectFood.nameEn}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08080b] via-black/45 to-transparent" />
                  
                  <button
                    onClick={() => setSelectedInspectFood(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/60 border border-gold-500/25 text-gold-400 hover:bg-gold-500 hover:text-black transition-all cursor-pointer"
                  >
                    <span className="text-sm font-bold block px-1">×</span>
                  </button>

                  <div className="absolute bottom-4 inset-x-4 text-right">
                    <span className="text-[9px] uppercase font-mono text-gold-500 font-bold tracking-widest">{activeLanguage === 'ar' ? 'اقتراح تحلية كلاسيك' : 'PASTRY SELECTION'}</span>
                    <h4 className="text-2xl font-serif text-white font-extrabold">{selectedInspectFood.nameAr}</h4>
                    <span className="text-xs text-gold-300 font-mono italic">{selectedInspectFood.nameEn}</span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="bg-[#0b0b0f] border border-gold-500/10 p-4.5 rounded-2xl text-right">
                    <span className="text-[9px] font-mono text-gold-500/60 font-black block mb-1">المذاق ومقترحات الدمج</span>
                    <p className="text-xs text-gray-300 leading-relaxed font-sans font-medium">
                      {activeLanguage === 'ar'
                        ? `جرب صنف ${selectedInspectFood.nameAr} الطازج مع فنجان إسبريسو غامق أو كابوتشينو دافئ في كونتيغو وتذوق المعنى الفعلي للتحلية!`
                        : `Enjoy our fresh baked and delicious ${selectedInspectFood.nameEn} with our hot robust espresso shot or Cappuccino velvet foam.`}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedInspectFood(null)}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-gold-600 via-gold-400 to-gold-500 text-black font-extrabold hover:opacity-95 text-xs transition-all tracking-wide cursor-pointer text-center"
                  >
                    {activeLanguage === 'ar' ? 'متابعة التصفح' : 'Keep Exploring'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 5. GOURMET RECIPES INSPECT DRAWER / DIALOG */}
        <AnimatePresence>
          {selectedInspectItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 25 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 25 }}
                className="bg-gradient-to-br from-[#121218] to-[#08080b] border border-gold-500/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative"
              >
                <div className="h-56 relative overflow-hidden flex flex-col justify-end p-6 bg-gradient-to-t from-[#08080b] to-transparent">
                  {itemImg(selectedInspectItem.imageUrl) ? (
                    <img
                      src={selectedInspectItem.imageUrl}
                      alt={selectedInspectItem.nameEn}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-b from-gold-950/30 to-[#08080b]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08080b] via-black/50 to-black/20 z-10" />

                  <button
                    onClick={() => setSelectedInspectItem(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/60 border border-gold-500/25 text-gold-400 hover:bg-gold-500 hover:text-black transition-all cursor-pointer z-20"
                  >
                    <span className="text-sm font-bold block px-1">×</span>
                  </button>

                  <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-gold-500 text-black shadow-lg z-20">
                    {renderItemIcon(selectedInspectItem.iconType)}
                  </div>

                  <div className="space-y-1 text-right z-20 relative">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-gold-400 block font-bold">
                      {selectedInspectItem.category === 'hot' ? 'HOT INFUSED BEVERAGE' : selectedInspectItem.category === 'cold' ? 'ICED REFRESHING DRINK' : selectedInspectItem.category === 'dessert' ? 'DELICATE GOURMET DESSERT' : 'TRADITIONAL TUNISIAN SALTY GOURMET'}
                    </span>
                    <h3 className="text-2xl font-extrabold text-white font-sans">{selectedInspectItem.nameAr}</h3>
                    <h4 className="text-xs text-gold-200 font-mono italic opacity-90">{selectedInspectItem.nameEn}</h4>
                  </div>
                </div>

                <div className="p-6 space-y-5 overflow-y-auto max-h-[450px] scrollbar-none">
                  {/* Ingredient explanations */}
                  <div className="space-y-2.5">
                    <div className="bg-[#121218]/90 rounded-2xl p-4 border border-gold-500/10 text-right shadow-sm">
                      <span className="text-[10px] text-gold-400 font-extrabold block mb-1 uppercase tracking-wide">المكونات والنكهة الرئيسية</span>
                      <p className="text-xs text-gray-200 leading-relaxed font-sans font-medium">
                        {selectedInspectItem.descriptionAr || 'خلطة كافي كونتيغو الحصرية المجهزة طازجاً على أيدي خبراء المقهى لتنال إعجابكم بمذاقها الساحر.'}
                      </p>
                    </div>

                    <div className="bg-[#121218]/90 rounded-2xl p-4 border border-gold-500/10 text-left shadow-sm">
                      <span className="text-[10px] text-gold-400 font-extrabold block mb-1 uppercase tracking-wide">Barista Blend Notes</span>
                      <p className="text-xs text-gray-300 leading-relaxed font-mono">
                        {selectedInspectItem.descriptionEn || 'Contigo premium customized recipe prepared instantly with high quality materials.'}
                      </p>
                    </div>
                  </div>

                  {/* INTERACTIVE CUSTOMIZER CONTROLS */}
                  <div className="p-4 rounded-3xl border border-gold-500/15 bg-black/40 space-y-4 text-right">
                    <span className="text-[10px] text-gold-400 font-black uppercase tracking-wider block border-b border-gold-500/10 pb-2">
                      {activeLanguage === 'ar' ? '⚙️ مخصّص كوبك / طبقك على ذوقك' : '⚙️ Customise your selection'}
                    </span>

                    {/* Drink category options (hot/cold) */}
                    {(selectedInspectItem.category === 'hot' || selectedInspectItem.category === 'cold') && (
                      <div className="space-y-4 text-right">
                        {/* Sugar customizer */}
                        <div className="space-y-1.5">
                          <label className="text-xs text-gray-400 font-bold block">
                            {activeLanguage === 'ar' ? 'مستوى السُّكر' : 'Sugar Level'}
                          </label>
                          <div className="grid grid-cols-3 gap-1.5 bg-black/80 p-1 rounded-xl border border-gold-500/5">
                            {[
                              { id: 'none', ar: 'بدون سكر', en: 'No Sugar' },
                              { id: 'medium', ar: 'سكر وسط', en: 'Medium' },
                              { id: 'extra', ar: 'حلو زيادة', en: 'Sweet' }
                            ].map((level) => (
                              <button
                                key={level.id}
                                onClick={() => setCustomSugar(level.id as any)}
                                className={`py-2 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                                  customSugar === level.id
                                    ? 'bg-gold-500 text-black shadow-md font-bold'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                              >
                                {activeLanguage === 'ar' ? level.ar : level.en}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Milk customizer */}
                        <div className="space-y-1.5">
                          <label className="text-xs text-gray-400 font-bold block">
                            {activeLanguage === 'ar' ? 'صنف الحليب المفضل' : 'Milk Substitution'}
                          </label>
                          <div className="grid grid-cols-3 gap-1.5 bg-black/80 p-1 rounded-xl border border-gold-500/5">
                            {[
                              { id: 'normal', ar: 'حليب عادي', en: 'Whole' },
                              { id: 'almond', ar: 'لوز (+1.5)', en: 'Almond (+1.5)' },
                              { id: 'oat', ar: 'شوفان (+1.5)', en: 'Oat (+1.5)' }
                            ].map((milk) => (
                              <button
                                key={milk.id}
                                onClick={() => setCustomMilk(milk.id as any)}
                                className={`py-2 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                                  customMilk === milk.id
                                    ? 'bg-gold-500 text-black shadow-md font-bold'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                              >
                                {activeLanguage === 'ar' ? milk.ar : milk.en}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Food or Desserts category option */}
                    {(selectedInspectItem.category === 'food' || selectedInspectItem.category === 'dessert') && (
                      <div className="flex items-center justify-between bg-black/45 p-3 rounded-xl border border-gold-500/10">
                        <button
                          onClick={() => setCustomExtra(!customExtra)}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-black border transition-all cursor-pointer ${
                            customExtra
                              ? 'bg-gold-500/15 text-gold-400 border-gold-500/40'
                              : 'border-gray-700 text-gray-400'
                          }`}
                        >
                          {customExtra ? (activeLanguage === 'ar' ? 'مفعل ✓' : 'Active ✓') : (activeLanguage === 'ar' ? 'إضافة' : 'Add')}
                        </button>
                        <div className="text-right">
                          <span className="block text-xs font-bold text-gray-100">
                            {activeLanguage === 'ar' ? 'حشوة مضاعفة وإكسترا تن/جبن' : 'Extra Topping & Double Stuffing'}
                          </span>
                          <span className="block text-[9px] text-gold-400 font-mono">
                            {activeLanguage === 'ar' ? '+2.0 د.ت إضافية' : '+2.0 DT addition'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Calculated Price Display */}
                  <div className="flex justify-between items-center bg-gradient-to-r from-black/80 to-[#121218] border border-gold-500/15 p-4 rounded-2xl shadow-inner">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-gold-400 font-bold">
                      {activeLanguage === 'ar' ? 'القيمة الكلية للصنف بالتعديل' : 'Total Price with Custom Specs'}
                    </span>
                    <span className="text-xl font-mono font-black text-gold-400 flex items-center gap-1">
                      {(
                        selectedInspectItem.price +
                        ((selectedInspectItem.category === 'hot' || selectedInspectItem.category === 'cold') && (customMilk === 'almond' || customMilk === 'oat') ? 1.5 : 0) +
                        ((selectedInspectItem.category === 'food' || selectedInspectItem.category === 'dessert') && customExtra ? 2.0 : 0)
                      ).toFixed(1)}
                      <span className="text-xs font-sans text-gray-400">DT</span>
                    </span>
                  </div>

                  {/* Operational indicators */}
                  <div className="flex items-center gap-2 text-[10px] text-gold-400/80 font-bold justify-center pt-1">
                    <Clock className="w-4 h-4 text-gold-500 animate-pulse" />
                    <span>
                      {activeLanguage === 'ar'
                        ? 'يتم تحضير هذا الصنف طازجاً على الفور في غضون 6-10 دقائق'
                        : 'Custom prepared fresh on order within 6-10 minutes'}
                    </span>
                  </div>

                  {/* Primary interactive actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        addToBasket(selectedInspectItem.id);
                        const mods = [];
                        if (selectedInspectItem.category === 'hot' || selectedInspectItem.category === 'cold') {
                          mods.push(customSugar === 'none' ? 'بدون سكر' : customSugar === 'extra' ? 'سكر زيادة' : 'سكر متوسط');
                          if (customMilk !== 'normal') mods.push(customMilk === 'almond' ? 'حليب لوز' : 'حليب شوفان');
                        } else {
                          if (customExtra) mods.push('حشوة مضاعفة');
                        }
                        const modString = mods.length > 0 ? ` (${mods.join(' + ')})` : '';
                        triggerToast(
                          activeLanguage === 'ar'
                            ? `تم إضافة ${selectedInspectItem.nameAr}${modString} إلى صينية طلباتك! 🎨☕`
                            : `Added ${selectedInspectItem.nameEn} with customized preferences to tray! 🎨☕`,
                          'success'
                        );
                        setSelectedInspectItem(null);
                      }}
                      className="py-3.5 rounded-2xl bg-gradient-to-r from-gold-600 via-gold-400 to-gold-500 text-black font-black hover:opacity-95 active:scale-98 transition-all text-xs cursor-pointer text-center shadow-lg"
                    >
                      {activeLanguage === 'ar' ? 'أضف هذا الصنف لصينية الطلب' : 'Add Custom to Tray'}
                    </button>
                    <button
                      onClick={() => setSelectedInspectItem(null)}
                      className="py-3.5 rounded-2xl bg-[#1c1c24] border border-gold-500/10 text-gold-400 font-bold hover:bg-gold-500/10 transition-all text-xs cursor-pointer text-center"
                    >
                      {activeLanguage === 'ar' ? 'العودة للمنيو' : 'Go Back to Menu'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 6. INSTANT FLOATING STORY PROCESSING NOTIFICATION */}
        <AnimatePresence>
          {storyProgress && (
            <div className="fixed bottom-6 right-6 z-[120000] p-4 rounded-2xl border border-gold-500/30 bg-[#0e0e14] shadow-2xl flex items-center gap-3.5 max-w-sm animate-pulse">
              <div className="p-2 bg-gold-500 text-black rounded-xl text-xs font-black animate-spin">
                ⏳
              </div>
              <div className="text-right">
                <span className="block text-xs font-serif font-black text-gold-400">{activeLanguage === 'ar' ? 'جاري تحضير الستوري...' : 'Compiling Story design...'}</span>
                <span className="block text-[9px] text-gray-500 font-mono font-bold mt-0.5">{storyProgress}</span>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* 7. GLOBAL ACTION CUSTOM DURATION TOASTS */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.95 }}
              className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[100001] px-5 py-3.5 rounded-2xl border flex items-center gap-2.5 font-bold shadow-2xl whitespace-nowrap text-xs text-right ${
                toastMessage.type === 'success'
                  ? 'bg-emerald-950/90 text-emerald-400 border-emerald-500/30 shadow-emerald-950/20'
                  : toastMessage.type === 'error'
                  ? 'bg-red-950/90 text-red-400 border-red-500/30 shadow-red-950/20'
                  : 'bg-black/85 text-gold-400 border-gold-500/30 shadow-black/40'
              }`}
            >
              {toastMessage.type === 'success' ? (
                <span>✓</span>
              ) : toastMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-400" />
              ) : (
                <Sparkles className="w-4 h-4 text-gold-400 animate-spin" />
              )}
              <span>{toastMessage.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Master Credits Footer */}
        <footer className="w-full text-center border-t border-gold-600/5 mt-16 pt-8 pb-6 bg-[#040406]/55 relative">
          <p className="text-[10px] text-gold-500/40 uppercase font-mono tracking-[4px] font-bold">
            © {new Date().getFullYear()} Contigo Coffee & Cafe Restaurant • All Rights Reserved
          </p>
          <p className="text-[9px] text-gray-600 font-mono mt-1 font-bold">
            Gourmet Coffee Experiences Crafted in Tunisia 🇹🇳
          </p>
        </footer>

        <AIWaiter activeLanguage={activeLanguage} />
        <OfflineIndicator activeLanguage={activeLanguage} />
      </div>
    </>
  );

  function itemImg(src: string | undefined): boolean {
    return !!src;
  }
}
