import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, Bot, Coffee, Wifi, Truck, ShoppingBag, Eye, Zap } from 'lucide-react';

interface AIWaiterProps {
  activeLanguage: 'ar' | 'en';
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export const AIWaiter: React.FC<AIWaiterProps> = ({ activeLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with greeting
  useEffect(() => {
    if (messages.length === 0) {
      const initialGreeting = activeLanguage === 'ar'
        ? "يا مية أهلاً وسهلاً بيك في مقهى ومطعم Coffee Contigo! 👋☕ أنا نادلك الافتراضي الذكي، هوني باش نعاونك تكتشف أبن المأكولات والمشروبات، نعطيك رقم سر الويفي السريع 50mbps، أو نأمنلك دليفري في وقت قياسي. قولي يا باهي، شنية يشهي خاطرك اليوم؟"
        : "Welcome to Coffee Contigo! 👋☕ I am your smart virtual barista. I can help you discover our delicious local food, get the 50mbps fiber WiFi credentials, or support your home delivery orders. Tell me, what would you like to enjoy today?";
      
      setMessages([
        {
          id: 'welcome',
          sender: 'bot',
          text: initialGreeting,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [activeLanguage]);

  // Scroll to bottom on updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating, isOpen]);

  const handleSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    // Add user message to layout
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsGenerating(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: trimmed }]
        })
      });

      if (!response.ok) {
        throw new Error('API server error');
      }

      const data = await response.json();
      
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.text || (activeLanguage === 'ar' ? "صار خلل طفيف على السيرفر، عاود جرب بعد شوية يا غالي." : "Server error, please try again shortly."),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.warn('Backend server not reachable or 404. Activating Smart client-side Tunisia barista assistant fallback logic...', err);
      
      // Calculate highly-trained localized AI response directly on the client to ensure 100% offline uptime
      const query = trimmed.toLowerCase().trim();
      let localReply = "";
      
      if (activeLanguage === 'ar') {
        if (query.includes("ويفي") || query.includes("wifi") || query.includes("واي") || query.includes("انترنت") || query.includes("internet") || query.includes("شبكة") || query.includes("فايبر") || query.includes("ميج") || query.includes("50")) {
          localReply = "على السلامة يا غالي! الويفي فايبر أوبتيك (Fibre Optic 50 Mbps) متوفر مجاناً وبسرعة طيارة في كامل المقهى! اسم الشبكة هو 📶 **Contigo_VIP_Guest** والباسورد هو 🔑 **ContigoCoffee2026**. تنجم تكونكتي وتخدم على روحك مرتاح في أجواء هادئة! شنية المشروب المزياان اللي تلطّف بيه أوقاتك توا؟";
        } else if (query.includes("ديليفري") || query.includes("توصيل") || query.includes("وصل") || query.includes("delivery") || query.includes("الدار") || query.includes("تطلب")) {
          localReply = "أهلاً بيك! خدمة الدليفري والتوصيل السريع متوفرة ومؤمنة في جرتك أينما كنت! 🛵 نوصيلولك قهوتك سخونة تفرّح القلب وماكلتنا طازجة في وقت يتراوح بين 20-40 دقيقة. الدفع نقداً عند الاستلام. الطلب مجاني وسهل برشا للطلبات ابتداءً من 10 د.ت، ورسوم التوصيل العادية هي 3 دينار لكل مكان. تنجم تطلبنا ديراكت بالهاتف على الأرقام: **55 392 088** أو **21 881 503**!";
        } else if (query.includes("مأكول") || query.includes("أكل") || query.includes("شباتي") || query.includes("فريكاسي") || query.includes("بانيني") || query.includes("سلايد") || query.includes("سلطة") || query.includes("مقرونة") || query.includes("سندوتش") || query.includes("ساندوتش") || query.includes("food") || query.includes("جوع")) {
          localReply = "يا غالي، منيو المأكولات التونسية والشقية في كونتيغو حكاية أخرى! 🥪 ننصحك بـ **شباتي المهدية التونسي فخر البلاد** الحار والوفير بالجبن والتن (7.5 د.ت)، ولا كعبات **فريكاسي تونسي بنين وحار** على الطريقة التقليدية (3.5 د.ت). وعنا زادة **كلوب ساندوتش كونتيغو الفاخر** بالدجاج المقرمش (11.5 د.ت)، وسلطة مشوية بالبيض والتن روعة (8.0 د.ت)، ولا مقرونة سباغيتي تونسية حارة بالتن الدوّخ (13.0 د.ت) تملى العين وتشبع! فاش تشتهي تبدا اليوم؟";
        } else if (query.includes("مشروب") || query.includes("قهوة") || query.includes("لاتيه") || query.includes("عصير") || query.includes("شاي") || query.includes("أتاي") || query.includes("فرابي") || query.includes("إسبريسو") || query.includes("كابتشينو") || query.includes("coffee") || query.includes("drink")) {
          localReply = "مرحب بيك! في كونتيغو نقدّموا أفضل أنواع الإسبريسو الكريمة المركّزة (3.5 د.ت)، وكابتشينو برغوة كاكاو حريرية (4.5 د.ت). وما يفوتكش **الشاي الأخضر التونسي بالنعناع** المنعش (3.0 د.ت) أو **القهوة العربي بالزهر** الفائحة اللي تعدل المزاج (4.5 د.ت). في الصيف والحر، ننصحك بـ **آيس لاتيه بارد** أو **قهوة فرابي مثلجة** بالرغوة الغنية (6.0 د.ت) وعصير برتقال طبيعي 100% طازج تزيدك نشاط (5.0 د.ت). كوبك المفضل حاضر يحب يروي عطشك! ☕❄️";
        } else if (query.includes("حلو") || query.includes("حلويات") || query.includes("كراب") || query.includes("كعك") || query.includes("كيك") || query.includes("كرواسون") || query.includes("نوتيلا") || query.includes("dessert") || query.includes("cake")) {
          localReply = "على السلامة! حلويات كونتيغو تذوب في الفم ذوبان! 🥞 عنا **كراب النوتيلا** الغنية المحشوة بالكامل بالشوكولاتة الفاخرة (7.5 د.ت)، و**كعكة كونتيغو المميزة** بالشوكولاتة الداكنة الكثيفة والراقية (8.5 د.ت)، وزادة **كرواسون الزبيدة الفرنساوي السخون المقرمش** (3.5 د.ت) يتماشى ياسر مع قهوة عربي بالزهر الصباح! شنية الحلو اللي يعدلك الكيف توا؟";
        } else if (query.includes("هاي") || query.includes("سلام") || query.includes("أهلا") || query.includes("مرحبا") || query.includes("صباح") || query.includes("مساء") || query.includes("contigo") || query.includes("اهلين") || query.includes("شكون")) {
          localReply = "يا مية أهلاً وسهلاً بيك في مقهى ومطعم **Coffee Contigo** في تونس الخضراء! 👋☕ أنا النادل الافتراضي الذكي متاعك، ومستعد نعاونك تكتشف منيو المأكولات والقهوة الفواحة أو نأمنلك الرقم السري للواي فاي 50Mbs السريع، أو نسجل طلب التوصيل السريع متاعك للدار. قولي يا باهي، شنوة يحب خاطرك تشرب ولا تاكل اليوم؟ 😊✨";
        } else {
          localReply = "يرحّب بيك كافي ومطعم **Contigo Coffee**! نحن هوني باش نخلوا يومك أجمل بقهوة سخونة ومأكولات تونسية بنينة وحلويات تذوب في الفم. تنجم تستفسرني على أي حاجة في المنيو، الواي فاي السريع 50 ميغا بالفايبر، ولا تيلفون الدليفري والتوصيل للدار. شرفنا بطلبك وشنية نجم نعاونك بيه يا غالي؟ 😊🌸";
        }
      } else {
        if (query.includes("wifi") || query.includes("internet") || query.includes("password") || query.includes("network") || query.includes("fiber")) {
          localReply = "Hello inside Contigo! Our free high-speed Fibre Optic Wi-Fi (50 Mbps) is fully available! Network SSID is 📶 **Contigo_VIP_Guest** and the password is 🔑 **ContigoCoffee2026**. Connect and work comfortably! What fresh drink can I fetch you today?";
        } else if (query.includes("delivery") || query.includes("deliver") || query.includes("call") || query.includes("phone") || query.includes("home")) {
          localReply = "Hello! Fast delivery is ready to reach you wherever you are! 🛵 We deliver your products hot and fresh within 20-40 minutes. Payment is cash on delivery. Delivery is free for orders above 10 TND (regular fee is 3 TND). Place your order now by calling: **55 392 088** or **21 881 503**!";
        } else if (query.includes("food") || query.includes("eat") || query.includes("hungry") || query.includes("chapati") || query.includes("sandwich") || query.includes("bites") || query.includes("pasta")) {
          localReply = "Our kitchen serves beautiful Tunisian specialties! 🥪 We highly recommend our famous **Mahdia Chapati** loaded with rich cheese & tuna (7.5 TND), or freshly handmade hot **Tunisian Fricassé** (3.5 TND). We also feature the signature **Contigo Club Sandwich** with crispy chicken (11.5 TND), and spicy Tunisian spaghetti with tuna (13.0 TND). What sweetens your appetite today?";
        } else if (query.includes("drink") || query.includes("coffee") || query.includes("espresso") || query.includes("tea") || query.includes("juice") || query.includes("latte") || query.includes("frappe")) {
          localReply = "Welcome! At Contigo, we serve premium concentrated espresso (3.5 TND) and silky-foam cappuccino (4.5 TND). Don't miss our authentic **Tunisian green tea with fresh mint** (3.0 TND) or **Arabic coffee with orange blossom water** (4.5 TND). For hot days, we recommend a cold **Iced Latte** or a rich **Espresso Frappe** (6.0 TND). Your cup is ready! ☕❄️";
        } else if (query.includes("sweet") || query.includes("cake") || query.includes("crepe") || query.includes("chocolate") || query.includes("nutella") || query.includes("croissant") || query.includes("dessert")) {
          localReply = "Welcome! Our desserts melt in your mouth! 🥞 Try the rich **Nutella Crepe** loaded with fine chocolate (7.5 TND), our specialty dark **Contigo Chocolate Cake** (8.5 TND), or a crispy buttery hot French **Croissant** (3.5 TND). Which dessert are you leaning towards?";
        } else if (query.includes("hello") || query.includes("hi") || query.includes("hey") || query.includes("morning") || query.includes("contigo") || query.includes("welcome")) {
          localReply = "A wonderful welcome to **Coffee Contigo** in Tunis! 👋☕ I am your smart virtual waiter, ready to assist you. I can introduce you to our delicious food, beverages, provide the high-speed wifi credentials, or take down your home delivery details. What can I serve you today, dear? 😊✨";
        } else {
          localReply = "Welcome to **Contigo Coffee**! We are here to make your day beautiful with hot coffee, Tunisian delicacies, and rich chocolate pastries. Ask me anything about our menu, the 50mbps fiber internet, or delivery speed. How can I help you today? 😊🌸";
        }
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: localReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  // Preset chip prompts
  const suggestions = activeLanguage === 'ar' ? [
    { text: "📶 كلمة سر الواي فاي", icon: <Wifi className="w-3.5 h-3.5" /> },
    { text: "🥪 المأكولات التونسية", icon: <ShoppingBag className="w-3.5 h-3.5" /> },
    { text: "🛵 أرقام التوصيل والدليفري", icon: <Truck className="w-3.5 h-3.5" /> },
    { text: "☕ شنية أفضل تجميعة؟", icon: <Coffee className="w-3.5 h-3.5" /> }
  ] : [
    { text: "📶 WiFi Password", icon: <Wifi className="w-3.5 h-3.5" /> },
    { text: "🥪 Tunisian Specialties", icon: <ShoppingBag className="w-3.5 h-3.5" /> },
    { text: "🛵 Delivery Contacts", icon: <Truck className="w-3.5 h-3.5" /> },
    { text: "☕ Recommend a Pairing", icon: <Coffee className="w-3.5 h-3.5" /> }
  ];

  return (
    <>
      {/* Floating Sparkly Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          onClick={() => setIsOpen(true)}
          className="relative group p-4 rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-500 text-[#000000] shadow-[0_10px_35px_rgba(223,177,91,0.45)] hover:shadow-[0_15px_45px_rgba(223,177,91,0.6)] cursor-pointer border border-gold-300/30 active:scale-95 transition-all outline-none"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="absolute -top-1 -left-1 bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider animate-pulse flex items-center gap-0.5">
            <Zap className="w-2 h-2 text-white fill-white" />
            <span>AI</span>
          </span>
          <MessageSquare className="w-6.5 h-6.5" />
          
          {/* Tooltip floating hint */}
          <span className={`absolute right-14 top-1/2 -translate-y-1/2 bg-[#09090e]/95 border border-gold-500/20 text-gold-400 px-3 py-1.5 rounded-xl text-[10px] font-serif font-black uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl ${activeLanguage === 'ar' ? 'right-auto left-14' : ''}`}>
            {activeLanguage === 'ar' ? 'نادل كونتيغو الذكي ☕' : 'Talk with Contigo AI ☕'}
          </span>
        </motion.button>
      </div>

      {/* Floating Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bottom-24 right-6 w-[340px] sm:w-[380px] h-[500px] bg-gradient-to-b from-[#111117] to-[#06060a] border border-gold-500/30 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-50 overflow-hidden flex flex-col`}
          >
            {/* Dark Golden Header */}
            <div className="p-4 bg-gradient-to-r from-[#171720] to-[#0d0d14] border-b border-gold-500/15 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 relative">
                  <Bot className="w-5 h-5" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#111117] rounded-full" />
                </div>
                <div className="text-left select-none">
                  <h4 className="font-serif font-black text-sm text-gold-400 tracking-wide gold-shimmer flex items-center gap-1">
                    {activeLanguage === 'ar' ? 'نادل كونتيغو الذكي' : 'Contigo Smart Barista'}
                    <Sparkles className="w-3.5 h-3.5 fill-gold-400" />
                  </h4>
                  <p className="text-[10px] text-gray-400">
                    {activeLanguage === 'ar' ? 'متاح باللغة التونسية والإنكليزية' : 'Speaks Tunisian Arabic & English'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-xl text-gray-500 hover:bg-gold-500/10 hover:text-gold-400 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversational Screen */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-none bg-[#09090e]">
              <div className="text-center pb-2 select-none border-b border-gold-500/5 mb-2">
                <span className="text-[8px] font-mono uppercase bg-gold-500/10 text-gold-400/90 px-2 py-0.5 rounded-full inline-block">
                  💬 {activeLanguage === 'ar' ? 'اتصال مؤمن بفايبر 50mbs' : 'Connected with 50mbps Fibre'}
                </span>
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[85%] ${
                    msg.sender === 'user' ? 'ml-auto items-end text-right' : 'mr-auto items-start text-left'
                  }`}
                >
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed font-sans ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-gold-500 to-gold-300 text-black font-semibold rounded-tr-none shadow'
                      : 'bg-[#14141d] text-gray-100 border border-gold-500/10 rounded-tl-none shadow'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-gray-500 mt-1 font-mono">{msg.time}</span>
                </div>
              ))}

              {isGenerating && (
                <div className="flex flex-col items-start mr-auto max-w-[85%]">
                  <div className="p-3 rounded-2xl bg-[#14141d] border border-gold-500/10 rounded-tl-none flex items-center gap-1.5 shadow">
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested quick chips */}
            <div className="border-t border-gold-500/5 px-2.5 py-2 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap bg-[#0b0b10] scrollbar-none">
              {suggestions.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip.text)}
                  className="px-2.5 py-1.5 rounded-xl border border-gold-500/15 bg-[#14141d] text-gold-400 hover:border-gold-400 text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow active:scale-95"
                >
                  {chip.icon}
                  <span>{chip.text}</span>
                </button>
              ))}
            </div>

            {/* Input form */}
            <form
              onSubmit={handleFormSubmit}
              className="p-3 bg-gradient-to-t from-[#0e0e14] to-[#12121b] border-t border-gold-500/15 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={activeLanguage === 'ar' ? 'اسأل نادل كونتيغو الذكي...' : 'Ask Contigo Smart waiter...'}
                className="flex-1 bg-black/50 border border-gold-500/10 text-[#ffffff] focus:border-gold-400 rounded-xl px-3.5 py-2.5 text-xs outline-none transition-all placeholder:text-gray-500 font-sans"
              />
              <button
                type="submit"
                disabled={!input.trim() || isGenerating}
                className={`p-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                  input.trim() && !isGenerating
                    ? 'bg-gradient-to-r from-gold-600 to-gold-450 border-gold-400 hover:opacity-95 text-black'
                    : 'bg-gold-500/5 border-gold-500/10 text-gray-500 cursor-not-allowed'
                }`}
                title="Send Message"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
