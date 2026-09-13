import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  const isProduction = process.env.NODE_ENV !== "development";
  console.log(`Application environment detected: ${isProduction ? "PRODUCTION (Shared)" : "DEVELOPMENT"}`);

  // Middleware to parse JSON post bodies
  app.use(express.json());

  // Initialize Gemini Client safely using the official SDK
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      console.log("Gemini client successfully initialized on sever.");
    } catch (e) {
      console.error("Failed to initialize Gemini Client:", e);
    }
  } else {
    console.log("GEMINI_API_KEY environment variable not found. Fallback responder will be used.");
  }

  // API health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "Contigo Coffee Menu", hasAi: !!ai });
  });

  // Smart Tunisian Virtual Barista API endpoint
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid request payload. 'messages' array is required." });
      }

      // Find the last user input text message
      const userMessage = messages[messages.length - 1]?.content || "";
      const query = userMessage.toLowerCase().trim();

      // IF KEY EXISTS: execute real GenAI generation
      if (ai) {
        try {
          // Re-format messages array to the strict systemInstruction format
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: userMessage,
            config: {
              systemInstruction: "أنت النادل الافتراضي الذكي لبوابة مقهى ومطعم Coffee Contigo الفاخر في تونس. أجب بلطف فائق وود كبير وبلهجة تونسية دافئة وجميلة تفوح منها رائحة القهوة والزهر، ورحّب بالزبائن المقيمين أو المارين. ساعدهم على اختيار المشروبات الساخنة والباردة والمأكولات اللذيذة المتوفرة في المنيو (مثل شباتي المهدية الحار، الفريكاسي التونسي، الكلاوب ساندويتش كونتيغو، الكرواسون، كعكة الشوكولاتة المميزة، المقرونة السباغيتي التونسية الحارة بالتن، سلطة مشوية بالبيض والتن وزيت الزيتون). اقترح عليهم أفضل التشكيلات (مثلا اللاتيه الساخن مع الكرواسون، القهوة العربي بالزهر مع التحلية، الفريكاسي مع عصير برتقال منعش). الويفي فايبر أوبتيك 50 ميغا فائق السرعة متوفر مجاناً كامل الجلسة وباسورد هو ContigoCoffee2026 والـ SSID هو Contigo_VIP_Guest. توصيل الدليفري متوفر بالهاتف ومجاني للطلبات فوق 10 دينار وفي وقت قياسي يتراوح بين 20-40 دقيقة. رد بإيجاز شديد واختصار ولطف دائم بالتونسي العامية الأصيلة."
            }
          });
          return res.json({ text: response.text });
        } catch (genError) {
          console.error("Gemini runtime generation failed, using smart fallback:", genError);
          // Fallback to rules if API fails during processing
        }
      }

      // SMART RULE-BASED Tunisian Keyword Responder Fallback (extremely realistic!)
      let reply = "";
      if (query.includes("ويفي") || query.includes("wifi") || query.includes("واي") || query.includes("انترنت") || query.includes("internet") || query.includes("شبكة") || query.includes("فايبر") || query.includes("ميج") || query.includes("50")) {
        reply = "على السلامة يا غالي! الويفي فايبر أوبتيك (Fibre Optic 50 Mbps) متوفر مجاناً وبسرعة طيارة في كامل المقهى! اسم الشبكة هو 📶 **Contigo_VIP_Guest** والباسورد هو 🔑 **ContigoCoffee2026**. تنجم تكونكتي وتخدم على روحك مرتاح في أجواء هادئة! شنية المشروب المزياان اللي تلطّف بيه أوقاتك توا؟";
      } else if (query.includes("ديليفري") || query.includes("توصيل") || query.includes("وصل") || query.includes("delivery") || query.includes("الدار") || query.includes("تطلب")) {
        reply = "أهلاً بيك! خدمة الدليفري والتوصيل السريع متوفرة ومؤمنة في جرتك أينما كنت! 🛵 نوصيلولك قهوتك سخونة تفرّح القلب وماكلتنا طازجة في وقت يتراوح بين 20-40 دقيقة. الدفع نقداً عند الاستلام. الطلب مجاني وسهل برشا للطلبات ابتداءً من 10 د.ت، ورسوم التوصيل العادية هي 3 دينار لكل مكان. تنجم تطلبنا ديراكت بالهاتف على الأرقام: **55 392 088** أو **21 881 503**!";
      } else if (query.includes("مأكول") || query.includes("أكل") || query.includes("شباتي") || query.includes("فريكاسي") || query.includes("بانيني") || query.includes("سلايد") || query.includes("سلطة") || query.includes("مقرونة") || query.includes("سندوتش") || query.includes("ساندوتش") || query.includes("food") || query.includes("جوع")) {
        reply = "يا غالي، منيو المأكولات التونسية والشقية في كونتيغو حكاية أخرى! 🥪 ننصحك بـ **شباتي المهدية التونسي فخر البلاد** الحار والوفير بالجبن والتن (7.5 د.ت)، ولا كعبات **فريكاسي تونسي بنين وحار** على الطريقة التقليدية (3.5 د.ت). وعنا زادة **كلوب ساندوتش كونتيغو الفاخر** بالدجاج المقرمش (11.5 د.ت)، وسلطة مشوية بالبيض والتن روعة (8.0 د.ت)، ولا مقرونة سباغيتي تونسية حارة بالتن الدوّخ (13.0 د.ت) تملى العين وتشبع! فاش تشتهي تبدا اليوم؟";
      } else if (query.includes("مشروب") || query.includes("قهوة") || query.includes("لاتيه") || query.includes("عصير") || query.includes("شاي") || query.includes("أتاي") || query.includes("فرابي") || query.includes("إسبريسو") || query.includes("كابتشينو") || query.includes("coffee") || query.includes("drink")) {
        reply = "مرحب بيك! في كونتيغو نقدّموا أفضل أنواع الإسبريسو الكريمة المركّزة (3.5 د.ت)، وكابتشينو برغوة كاكاو حريرية (4.5 د.ت). وما يفوتكش **الشاي الأخضر التونسي بالنعناع** المنعش (3.0 د.ت) أو **القهوة العربي بالزهر** الفائحة اللي تعدل المزاج (4.5 د.ت). في الصيف والحر، ننصحك بـ **آيس لاتيه بارد** أو **قهوة فرابي مثلجة** بالرغوة الغنية (6.0 د.ت) وعصير برتقال طبيعي 100% طازج تزيدك نشاط (5.0 د.ت). كوبك المفضل حاضر يحب يروي عطشك! ☕❄️";
      } else if (query.includes("حلو") || query.includes("حلويات") || query.includes("كراب") || query.includes("كعك") || query.includes("كيك") || query.includes("كرواسون") || query.includes("نوتيلا") || query.includes("dessert") || query.includes("cake")) {
        reply = "على السلامة! حلويات كونتيغو تذوب في الفم ذوبان! 🥞 عنا **كراب النوتيلا** الغنية المحشوة بالكامل بالشوكولاتة الفاخرة (7.5 د.ت)، و**كعكة كونتيغو المميزة** بالشوكولاتة الداكنة الكثيفة والراقية (8.5 د.ت)، وزادة **كرواسون الزبيدة الفرنساوي السخون المقرمش** (3.5 د.ت) يتماشى ياسر مع قهوة عربي بالزهر الصباح! شنية الحلو اللي يعدلك الكيف توا؟";
      } else if (query.includes("هاي") || query.includes("سلام") || query.includes("أهلا") || query.includes("مرحبا") || query.includes("صباح") || query.includes("مساء") || query.includes("contigo") || query.includes("اهلين") || query.includes("شكون")) {
        reply = "يا مية أهلاً وسهلاً بيك في مقهى ومطعم **Coffee Contigo** في تونس الخضراء! 👋☕ أنا النادل الافتراضي الذكي متاعك، ومستعد نعاونك تكتشف منيو المأكولات والقهوة الفواحة أو نأمنلك الرقم السري للواي فاي 50Mbs السريع، أو نسجل طلب التوصيل السريع متاعك للدار. قولي يا باهي، شنوة يحب خاطرك تشرب ولا تاكل اليوم؟ 😊✨";
      } else {
        reply = "يرحّب بيك كافي ومطعم **Contigo Coffee**! نحن هوني باش نخلوا يومك أجمل بقهوة سخونة ومأكولات تونسية بنينة وحلويات تذوب في الفم. تنجم تستفسرني على أي حاجة في المنيو، الواي فاي السريع 50 ميغا بالفايبر، ولا تيلفون الدليفري والتوصيل للدار. شرفنا بطلبك وشنية نجم نعاونك بيه يا غالي؟ 😊🌸";
      }

      res.json({ text: reply });
    } catch (error) {
      console.error("Endpoint chat failed:", error);
      res.json({ text: "إن شاء الله نهارك زين وسعيد! تمنيت نجاوبك بالتفصيل لكن صار عطب تقني بسيط على السيرفر. ننصحك تطلب عصير البرتقال المنعش أو كعكة الشوكولاتة من كونتيغو بنة عالمية! 🍊🍰" });
    }
  });

  // Vite middleware setup for Development or static asset loading for Production
  if (!isProduction) {
    const viteModule = await import("vite");
    const vite = await viteModule.createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Catch-all to serve transform-injected index.html in development to prevent 404s
    const fs = await import("fs");
    app.get("*", async (req, res, next) => {
      if (req.originalUrl.startsWith("/api") || req.originalUrl.startsWith("/@")) {
        return next();
      }
      try {
        const templatePath = path.resolve(process.cwd(), "index.html");
        let template = fs.readFileSync(templatePath, "utf-8");
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        next(e);
      }
    });
  } else {
    // In production, serve compiled static files from dist/ folder
    const distPath = path.join(process.cwd(), "dist");
    
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is booted and actively running on port ${PORT}`);
  });
}

startServer();
