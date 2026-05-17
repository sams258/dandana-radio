"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Lang = "ar" | "en";

interface LangContextType {
  lang: Lang;
  dir: "rtl" | "ltr";
  toggleLang: () => void;
  t: (key: string) => string;
}

const translations: Record<Lang, Record<string, string>> = {
  ar: {
    // Nav
    "nav.home":        "الرئيسية",
    "nav.about":       "عن الراديو",
    "nav.schedule":    "البرامج",
    "nav.contact":     "تواصل معنا",
    "nav.listen":      "استمع الآن",

    // Hero
    "hero.tagline":    "دندنها",
    "hero.subtitle":   "للموسيقى مساحة ،،، وللكلمة معنى",
    "hero.cta":        "استمع الآن",
    "hero.cta2":       "البرامج",

    // Player
    "player.live":     "بث مباشر",
    "player.now":      "على الهواء الآن",
    "player.volume":   "مستوى الصوت",
    "player.loading":  "جاري التحميل...",
    "player.error":    "تعذّر الاتصال بالبث",
    "player.retry":    "إعادة المحاولة",
    "player.listeners":"مستمع",

    // About
    "about.title":     "عن راديو دندنة",
    "about.body":      "راديو دندنة اذاعتك المفضلة للموسيقى العربية الأصيلة والمعاصرة. نبثّ على مدار الساعة لنرافق لحظاتك بأجمل الألحان وأعذب الأصوات من مختلف أرجاء الوطن العربي.",

    // Schedule
    "schedule.title":  "البرامج ",
    "schedule.morning":"صباح دندنة",
    "schedule.noon":   "نغمات الظهيرة",
    "schedule.evening":"أمسية طرب",
    "schedule.night":  "ليالي الأصالة",
    "schedule.time.m": "٦:٠٠ — ١٢:٠٠",
    "schedule.time.n": "١٢:٠٠ — ١٨:٠٠",
    "schedule.time.e": "١٨:٠٠ — ٢٢:٠٠",
    "schedule.time.x": "٢٢:٠٠ — ٦:٠٠",

    // Contact
    "contact.title":   "تواصل معنا",
    "contact.name":    "الاسم",
    "contact.email":   "البريد الإلكتروني",
    "contact.message": "رسالتك",
    "contact.send":    "أرسل",

    // Footer
    "footer.rights":   "جميع الحقوق محفوظة",
    "footer.tagline":  "دندنها",
  },
  en: {
    "nav.home":        "Home",
    "nav.about":       "About",
    "nav.schedule":    "Schedule",
    "nav.contact":     "Contact",
    "nav.listen":      "Listen Now",

    "hero.tagline":    "Dandenha",
    "hero.subtitle":   "Authentic Arabic music — live 24 hours a day",
    "hero.cta":        "Listen Now",
    "hero.cta2":       "Explore Schedule",

    "player.live":     "LIVE",
    "player.now":      "Now Playing",
    "player.volume":   "Volume",
    "player.loading":  "Connecting...",
    "player.error":    "Stream unavailable",
    "player.retry":    "Retry",
    "player.listeners":"listeners",

    "about.title":     "About Radio Dandana",
    "about.body":      "Radio Dandana is your premier destination for authentic and contemporary Arabic music. We broadcast 24/7, accompanying your moments with the finest melodies and voices from across the Arab world.",

    "schedule.title":  "Programme Schedule",
    "schedule.morning":"Dandana Morning",
    "schedule.noon":   "Midday Melodies",
    "schedule.evening":"Evening Tarab",
    "schedule.night":  "Nights of Authenticity",
    "schedule.time.m": "06:00 — 12:00",
    "schedule.time.n": "12:00 — 18:00",
    "schedule.time.e": "18:00 — 22:00",
    "schedule.time.x": "22:00 — 06:00",

    "contact.title":   "Get in Touch",
    "contact.name":    "Your Name",
    "contact.email":   "Email Address",
    "contact.message": "Your Message",
    "contact.send":    "Send",

    "footer.rights":   "All rights reserved",
    "footer.tagline":  "A melody that unites us",
  },
};

const LangContext = createContext<LangContextType | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");

  useEffect(() => {
    document.documentElement.dir  = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = () => setLang((l) => (l === "ar" ? "en" : "ar"));
  const t = (key: string) => translations[lang][key] ?? key;

  return (
    <LangContext.Provider value={{ lang, dir: lang === "ar" ? "rtl" : "ltr", toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be inside LangProvider");
  return ctx;
}
