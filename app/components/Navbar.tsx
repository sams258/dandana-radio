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

  const navLinks = [
    { key: "nav.home",     href: "#hero"     },
    { key: "nav.about",    href: "#about"    },
    { key: "nav.schedule", href: "#schedule" },
    { key: "nav.contact",  href: "#contact"  },
  ];

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
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-[72px]">
        {/* Logo */}
        <a href="#hero" className="shrink-0 flex items-center gap-3 group">
          <Image
            src="/logo.png"
            alt="Radio Dandana"
            width={44}
            height={44}
            className="rounded-lg object-contain transition-opacity group-hover:opacity-90"
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
                {t(link.key)}
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
            className="px-3 py-1.5 rounded-lg text-xs tracking-widest uppercase transition-all duration-200 font-mono focus:outline-none focus-visible:ring-1"
            style={{
              color:   "var(--gold-mid)",
              border:  "1px solid rgba(201,169,110,0.25)",
              background: "rgba(201,169,110,0.04)",
            }}
          >
            {lang === "ar" ? "EN" : "عر"}
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
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleLang}
            className="px-2.5 py-1 rounded text-xs font-mono focus:outline-none"
            style={{ color: "var(--gold-mid)", border: "1px solid rgba(201,169,110,0.25)" }}
          >
            {lang === "ar" ? "EN" : "عر"}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="p-1.5 rounded focus:outline-none"
            style={{ color: "var(--gold-mid)" }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden px-5 pb-5 pt-2 flex flex-col gap-3"
          style={{ background: "rgba(8,8,8,0.97)", borderTop: "1px solid rgba(201,169,110,0.08)" }}
        >
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-base py-2 ${lang === "ar" ? "font-arabic text-right" : ""}`}
              style={{ color: "var(--text-muted)" }}
            >
              {t(link.key)}
            </a>
          ))}
          <a
            href="#player"
            onClick={() => setMenuOpen(false)}
            className="mt-2 text-center py-2.5 rounded-full text-sm font-semibold"
            style={{
              background: "linear-gradient(135deg, var(--gold-deep), var(--gold-mid))",
              color: "#080808",
            }}
          >
            {t("nav.listen")}
          </a>
        </div>
      )}
    </header>
  );
}
