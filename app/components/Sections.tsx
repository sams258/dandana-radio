"use client";

import React, { useState } from "react";
import { Mic, Moon, Sun, Sunset, Coffee } from "lucide-react";
import { useLang } from "../lib/lang";

// ──────────────────────────────────────────────
// ABOUT SECTION
// ──────────────────────────────────────────────
export function AboutSection() {
  const { t, lang, dir } = useLang();

  return (
    <section
      id="about"
      dir={dir}
      className="py-24 px-6 max-w-4xl mx-auto"
      aria-labelledby="about-heading"
    >
      <div className="divider-gold mb-16" />

      <div className="flex flex-col md:flex-row gap-12 items-center">
        {/* Mic icon ornament */}
        <div
          className="shrink-0 w-28 h-28 rounded-full flex items-center justify-center"
          style={{
            background: "radial-gradient(circle, rgba(139,105,20,0.2), rgba(8,8,8,0.8))",
            border: "1px solid rgba(201,169,110,0.2)",
            boxShadow: "0 0 40px rgba(139,105,20,0.12)",
          }}
        >
          <Mic size={44} style={{ color: "var(--gold-mid)" }} />
        </div>

        <div>
          <h2
            id="about-heading"
            className={`text-3xl md:text-4xl font-light mb-5 ${
              lang === "ar" ? "font-arabic" : ""
            }`}
            style={{ color: "var(--gold-light)" }}
          >
            {t("about.title")}
          </h2>
          <p
            className={`text-base leading-relaxed ${lang === "ar" ? "font-arabic" : ""}`}
            style={{
              color: "var(--text-muted)",
              lineHeight: lang === "ar" ? "2.1" : "1.9",
              maxWidth: "560px",
            }}
          >
            {t("about.body")}
          </p>
        </div>
      </div>

      <div className="divider-gold mt-16" />
    </section>
  );
}

// ──────────────────────────────────────────────
// SCHEDULE SECTION
// ──────────────────────────────────────────────
const scheduleItems = [
  { key: "morning", timeKey: "schedule.time.m", nameKey: "schedule.morning", Icon: Coffee,  gradient: "from-amber-900/20 to-black/40"  },
  { key: "noon",    timeKey: "schedule.time.n", nameKey: "schedule.noon",    Icon: Sun,     gradient: "from-yellow-900/15 to-black/40" },
  { key: "evening", timeKey: "schedule.time.e", nameKey: "schedule.evening", Icon: Sunset,  gradient: "from-orange-950/25 to-black/40" },
  { key: "night",   timeKey: "schedule.time.x", nameKey: "schedule.night",   Icon: Moon,    gradient: "from-indigo-950/20 to-black/40" },
];

export function ScheduleSection() {
  const { t, lang, dir } = useLang();

  return (
    <section
      id="schedule"
      dir={dir}
      className="py-16 px-6 max-w-4xl mx-auto"
      aria-labelledby="schedule-heading"
    >
      <h2
        id="schedule-heading"
        className={`text-3xl md:text-4xl font-light mb-10 text-center ${
          lang === "ar" ? "font-arabic" : ""
        }`}
        style={{ color: "var(--gold-light)" }}
      >
        {t("schedule.title")}
      </h2>

      <div className="grid grid-cols-2 gap-3 w-full">
        {scheduleItems.map(({ key, timeKey, nameKey, Icon }) => (
          <div
            key={key}
            className="glass-card rounded-xl p-5 flex items-center gap-4"
          >
            <div
              className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.15)" }}
            >
              <Icon size={20} style={{ color: "var(--gold-mid)" }} />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <p
                className={`text-sm font-semibold truncate ${lang === "ar" ? "font-arabic" : ""}`}
                style={{ color: "var(--gold-light)" }}
              >
                {t(nameKey)}
              </p>
              <p
                className="text-xs font-mono"
                style={{ color: "var(--text-muted)" }}
                dir="ltr"
              >
                {t(timeKey)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="divider-gold mt-16" />
    </section>
  );
}

// ──────────────────────────────────────────────
// CONTACT SECTION
// ──────────────────────────────────────────────
export function ContactSection() {
  const { t, lang, dir } = useLang();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Replace with your actual form submission logic
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(201,169,110,0.2)",
    borderRadius: "10px",
    padding: "10px 14px",
    color: "var(--text-primary)",
    width: "100%",
    outline: "none",
    fontFamily: "Cairo, 'IBM Plex Sans Arabic', sans-serif",
    display: "block",
    fontSize: "0.9rem",
    lineHeight: lang === "ar" ? "1.8" : "1.6",
    transition: "border-color 0.2s",
  };

  return (
    <section
      id="contact"
      dir={dir}
      className="py-16 px-6 max-w-2xl mx-auto"
      aria-labelledby="contact-heading"
    >
      <h2
        id="contact-heading"
        className={`text-3xl md:text-4xl font-light mb-10 text-center ${
          lang === "ar" ? "font-arabic" : ""
        }`}
        style={{ color: "var(--gold-light)" }}
      >
        {t("contact.title")}
      </h2>

      <div className="w-full max-w-xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="glass-card rounded-2xl p-7 flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1.5 w-full">
          <label
            htmlFor="contact-name"
            className={`text-sm ${lang === "ar" ? "font-arabic" : ""}`}
            style={{ color: "var(--text-muted)" }}
          >
            {t("contact.name")}
          </label>
          <input
            id="contact-name"
            type="text"
            required
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "rgba(201,169,110,0.45)")}
            onBlur={(e)  => (e.target.style.borderColor = "rgba(201,169,110,0.2)")}
          />
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <label
            htmlFor="contact-email"
            className={`text-sm ${lang === "ar" ? "font-arabic" : ""}`}
            style={{ color: "var(--text-muted)" }}
          >
            {t("contact.email")}
          </label>
          <input
            id="contact-email"
            type="email"
            required
            dir="ltr"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "rgba(201,169,110,0.45)")}
            onBlur={(e)  => (e.target.style.borderColor = "rgba(201,169,110,0.2)")}
          />
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <label
            htmlFor="contact-msg"
            className={`text-sm ${lang === "ar" ? "font-arabic" : ""}`}
            style={{ color: "var(--text-muted)" }}
          >
            {t("contact.message")}
          </label>
          <textarea
            id="contact-msg"
            rows={5}
            required
            style={{ ...inputStyle, resize: "vertical" }}
            onFocus={(e) => (e.target.style.borderColor = "rgba(201,169,110,0.45)")}
            onBlur={(e)  => (e.target.style.borderColor = "rgba(201,169,110,0.2)")}
          />
        </div>

        <button
          type="submit"
          className={`py-3 px-8 rounded-xl font-semibold text-sm self-start mt-2 transition-all duration-300 hover:scale-[1.02] ${
            lang === "ar" ? "font-arabic" : ""
          }`}
          style={{
            background: sent
              ? "rgba(100,180,100,0.2)"
              : "linear-gradient(135deg, var(--gold-deep), var(--gold-mid))",
            color: sent ? "#6db87a" : "#080808",
            border: sent ? "1px solid rgba(100,180,100,0.3)" : "none",
          }}
        >
          {sent ? (lang === "ar" ? "✓ تم الإرسال" : "✓ Sent!") : t("contact.send")}
        </button>
      </form>
      </div>
    </section>
  );
}
