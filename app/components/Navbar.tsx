"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useLang } from "../lib/lang";

export function Navbar() {
  const { t, lang, dir, toggleLang } = useLang();
  const [scrolled, setScrolled]      = useState(false);
  const [menuOpen, setMenuOpen]      = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks: { key: string; href: string; ar?: string; en?: string }[] = [
    { key: "news",         href: "/news",     ar: "أخبار",  en: "News"     },
    { key: "nav.home",     href: "#hero"                                    },
    { key: "nav.about",    href: "#about"                                   },
    { key: "nav.schedule", href: "#schedule"                                },
    { key: "nav.contact",  href: "#contact"                                 },
  ];

  const linkLabel = (link: { key: string; ar?: string; en?: string }) =>
    link.ar !== undefined && link.en !== undefined
      ? lang === "ar" ? link.ar : link.en
      : t(link.key);

  return (
    <header
      dir={dir}
      className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? "rgba(8,8,8,0.92)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(201,169,110,0.1)"
          : "1px solid transparent",
      }}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between h-[72px]" style={{ paddingInline: "clamp(1.25rem, 4vw, 2.5rem)" }}>
        {/* Logo */}
        <a href="#hero" className="shrink-0 flex items-center">
          <Image
            src="/logo.png"
            alt="Radio Dandana"
            width={120}
            height={44}
            className="object-contain transition-opacity group-hover:opacity-90"
            priority
          />
        </a>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <li key={link.key}>
              <a
                href={link.href}
                className={`text-sm tracking-wide transition-colors duration-200 hover:text-gold-mid ${
                  lang === "ar" ? "font-arabic" : ""
                }`}
                style={{
                  color: "var(--text-muted)",
                  fontSize: lang === "ar" ? "0.9rem" : "0.875rem",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--gold-mid)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--text-muted)")
                }
              >
                {linkLabel(link)}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side: lang toggle + listen CTA */}
        <div className="hidden md:flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            aria-label="Toggle language"
            style={{
              padding: "6px 16px",
              borderRadius: "20px",
              fontSize: "0.8rem",
              fontWeight: "600",
              letterSpacing: "0.08em",
              color: "var(--gold-mid)",
              border: "1.5px solid rgba(201,169,110,0.4)",
              background: "rgba(201,169,110,0.07)",
              cursor: "pointer",
              fontFamily: "Cairo, sans-serif",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
              minWidth: "52px",
              textAlign: "center",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,169,110,0.15)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,169,110,0.7)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,169,110,0.07)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,169,110,0.4)";
            }}
          >
            {lang === "ar" ? "EN" : "عربي"}
          </button>

          {/* Listen Now CTA */}
          <a
            href="#player"
            className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, var(--gold-deep), var(--gold-mid))",
              color: "#080808",
              fontFamily: lang === "ar" ? "Cairo, sans-serif" : "inherit",
              boxShadow: "0 0 20px rgba(201,169,110,0.2)",
            }}
          >
            {t("nav.listen")}
          </a>
        </div>

        {/* Mobile: lang + burger */}
        <div className="md:hidden" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            onClick={toggleLang}
            aria-label="Toggle language"
            style={{
              padding: "6px 16px",
              borderRadius: "20px",
              fontSize: "0.8rem",
              fontWeight: "600",
              letterSpacing: "0.08em",
              color: "var(--gold-mid)",
              border: "1.5px solid rgba(201,169,110,0.4)",
              background: "rgba(201,169,110,0.07)",
              cursor: "pointer",
              fontFamily: "Cairo, sans-serif",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
              minWidth: "52px",
              textAlign: "center",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,169,110,0.15)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,169,110,0.7)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,169,110,0.07)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,169,110,0.4)";
            }}
          >
            {lang === "ar" ? "EN" : "عربي"}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(201,169,110,0.07)",
              border: "1.5px solid rgba(201,169,110,0.25)",
              color: "var(--gold-mid)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          dir={lang === "ar" ? "rtl" : "ltr"}
          style={{
            background: "rgba(8,8,8,0.97)",
            borderTop: "1px solid rgba(201,169,110,0.12)",
            padding: "1.25rem 1.5rem 1.75rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: lang === "ar" ? "flex-end" : "flex-start",
            gap: "0.25rem",
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: "0.85rem 1rem",
                borderRadius: "10px",
                color: "var(--text-muted)",
                fontFamily: "Cairo, sans-serif",
                fontSize: "1rem",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: lang === "ar" ? "flex-end" : "flex-start",
                textAlign: lang === "ar" ? "end" : "start",
                transition: "all 0.2s",
                borderBottom: "1px solid rgba(201,169,110,0.06)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--gold-mid)";
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(201,169,110,0.05)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)";
                (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
              }}
            >
              {linkLabel(link)}
            </a>
          ))}
          <a
            href="#player"
            onClick={() => setMenuOpen(false)}
            style={{
              marginTop: "0.75rem",
              padding: "0.85rem 1.5rem",
              borderRadius: "50px",
              textAlign: "center",
              fontFamily: "Cairo, sans-serif",
              fontSize: "0.95rem",
              fontWeight: "600",
              textDecoration: "none",
              background: "linear-gradient(135deg, var(--gold-deep), var(--gold-mid))",
              color: "#080808",
              boxShadow: "0 0 20px rgba(201,169,110,0.2)",
              display: "block",
            }}
          >
            {t("nav.listen")}
          </a>
        </div>
      )}
    </header>
  );
}
