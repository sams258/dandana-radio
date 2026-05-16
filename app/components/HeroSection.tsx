"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useLang } from "../lib/lang";

export function HeroSection() {
  const { t, lang, dir } = useLang();
  const notesContainerRef = useRef<HTMLDivElement>(null);

  // Flying music notes
  useEffect(() => {
    const container = notesContainerRef.current;
    if (!container) return;

    const noteChars = ["♩", "♪", "♫", "♬", "𝄞", "𝄢", "♭", "♮", "♯"];
    const notes: HTMLSpanElement[] = [];

    function createNote() {
      if (!container) return;
      const note = document.createElement("span");
      const char = noteChars[Math.floor(Math.random() * noteChars.length)];
      note.textContent = char;

      const startX = Math.random() * 100;
      const size = Math.random() * 18 + 10;
      const duration = Math.random() * 12 + 10;
      const delay = Math.random() * 8;
      const opacity = Math.random() * 0.35 + 0.08;
      const drift = (Math.random() - 0.5) * 120;

      note.style.cssText = `
        position: absolute;
        left: ${startX}%;
        bottom: -40px;
        font-size: ${size}px;
        color: var(--gold-mid);
        opacity: 0;
        pointer-events: none;
        user-select: none;
        animation: noteFloat ${duration}s ${delay}s ease-in infinite;
        --drift: ${drift}px;
        --opacity: ${opacity};
      `;

      container.appendChild(note);
      notes.push(note);

      if (notes.length > 35) {
        const old = notes.shift();
        old?.remove();
      }
    }

    const interval = setInterval(createNote, 600);
    for (let i = 0; i < 18; i++) createNote();

    return () => {
      clearInterval(interval);
      notes.forEach(n => n.remove());
    };
  }, []);

  return (
    <section
      id="hero"
      dir={dir}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      aria-label={lang === "ar" ? "القسم الرئيسي" : "Hero"}
    >
      <style>{`
        @keyframes noteFloat {
          0%   { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10%  { opacity: var(--opacity); }
          90%  { opacity: var(--opacity); }
          100% { transform: translateY(-110vh) translateX(var(--drift)) rotate(25deg); opacity: 0; }
        }
        @keyframes logoGlow {
          0%   { filter: drop-shadow(0 0 30px rgba(201,169,110,0.4)) drop-shadow(0 0 60px rgba(201,169,110,0.2)) drop-shadow(0 0 100px rgba(139,105,20,0.15)); }
          100% { filter: drop-shadow(0 0 60px rgba(201,169,110,0.7)) drop-shadow(0 0 100px rgba(201,169,110,0.35)) drop-shadow(0 0 160px rgba(139,105,20,0.3)); }
        }
      `}</style>

      {/* Music notes container */}
      <div
        ref={notesContainerRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Radial gold glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 60%, rgba(139,105,20,0.14) 0%, transparent 70%)",
          zIndex: 1,
        }}
      />

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 h-48"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--black-void))",
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-8 max-w-3xl mx-auto">
        {/* Logo */}
        <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto 2.5rem auto", padding: "0 1rem" }}>
          <Image
            src="/dandana2.png"
            alt="Radio Dandana"
            width={800}
            height={430}
            priority
            unoptimized
            className="w-full h-auto object-contain"
            style={{
              filter: "drop-shadow(0 0 40px rgba(201,169,110,0.5)) drop-shadow(0 0 80px rgba(201,169,110,0.25)) drop-shadow(0 0 120px rgba(139,105,20,0.2))",
              animation: "logoGlow 3s ease-in-out infinite alternate",
            }}
          />
        </div>

        {/* Main tagline */}
        <h1
          className={`text-5xl md:text-7xl font-light leading-tight mb-4 animate-fade-up ${
            lang === "ar" ? "font-arabic" : ""
          }`}
          style={{ animationDelay: "0.3s", animationFillMode: "both" }}
        >
          <span className="shimmer-text">{t("hero.tagline")}</span>
        </h1>

        {/* Subtitle */}
        <p
          className={`text-base md:text-lg mb-0 max-w-md animate-fade-up ${
            lang === "ar" ? "font-arabic" : ""
          }`}
          style={{
            color: "var(--text-muted)",
            animationDelay: "0.5s",
            animationFillMode: "both",
            lineHeight: lang === "ar" ? "2" : "1.7",
          }}
        >
          {t("hero.subtitle")}
        </p>

        {/* CTA buttons */}
        <div
          className="animate-fade-up"
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "1.5rem",
            justifyContent: "center",
            marginTop: "2.5rem",
            animationDelay: "0.7s",
            animationFillMode: "both",
          }}
        >
          <a
            href="#player"
            className="no-underline px-10 py-4 rounded-full font-semibold text-base min-w-[180px] text-center transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold-mid) 50%, var(--gold-light) 100%)",
              color: "#080808",
              boxShadow: "0 0 40px rgba(201,169,110,0.35), 0 4px 20px rgba(0,0,0,0.4)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: "1.4",
              fontFamily: lang === "ar" ? "Cairo, sans-serif" : "inherit",
              textDecoration: "none",
              textDecorationLine: "none",
            }}
          >
            {t("hero.cta")}
          </a>
          <a
            href="#schedule"
            className="no-underline px-10 py-4 rounded-full text-base min-w-[180px] text-center transition-all duration-300 hover:scale-105"
            style={{
              color: "var(--gold-mid)",
              border: "1.5px solid rgba(201,169,110,0.45)",
              background: "rgba(201,169,110,0.06)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: "1.4",
              fontFamily: lang === "ar" ? "Cairo, sans-serif" : "inherit",
              textDecoration: "none",
              textDecorationLine: "none",
            }}
          >
            {t("hero.cta2")}
          </a>
        </div>

        {/* Social icons */}
        <div style={{ display: "flex", gap: "1.25rem", justifyContent: "center", marginTop: "2rem" }}>
          {[
            {
              href: "https://www.facebook.com/sawalefkon/",
              label: "Facebook",
              svg: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              ),
            },
            {
              href: "https://www.tiktok.com/@dandana.radio",
              label: "TikTok",
              svg: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
                </svg>
              ),
            },
            {
              href: "https://www.instagram.com/dandana.radio",
              label: "Instagram",
              svg: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              ),
            },
          ].map(({ href, label, svg }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--gold-mid)",
                border: "1.5px solid rgba(201,169,110,0.3)",
                background: "rgba(201,169,110,0.06)",
                transition: "all 0.25s ease",
                textDecoration: "none",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "rgba(201,169,110,0.15)";
                el.style.borderColor = "rgba(201,169,110,0.7)";
                el.style.boxShadow = "0 0 18px rgba(201,169,110,0.3)";
                el.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "rgba(201,169,110,0.06)";
                el.style.borderColor = "rgba(201,169,110,0.3)";
                el.style.boxShadow = "none";
                el.style.transform = "translateY(0)";
              }}
            >
              {svg}
            </a>
          ))}
        </div>

        {/* Scroll hint */}
        <div
          className="mt-16 flex flex-col items-center gap-2 animate-fade-in"
          style={{ animationDelay: "1.2s", animationFillMode: "both" }}
          aria-hidden="true"
        >
          <div
            className="w-[1px] h-10 animate-pulse"
            style={{ background: "linear-gradient(to bottom, var(--gold-mid), transparent)" }}
          />
        </div>
      </div>
    </section>
  );
}
