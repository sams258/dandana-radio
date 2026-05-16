"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useLang } from "../lib/lang";

export function HeroSection() {
  const { t, lang, dir } = useLang();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated particle/star field on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width  = canvas.width  = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles: { x: number; y: number; r: number; speed: number; opacity: number; dx: number; dy: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x:       Math.random() * width,
        y:       Math.random() * height,
        r:       Math.random() * 1.5 + 0.3,
        speed:   Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.5 + 0.1,
        dx:      (Math.random() - 0.5) * 0.3,
        dy:      -(Math.random() * 0.3 + 0.1),
      });
    }

    let raf: number;
    function draw() {
      ctx!.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(201,169,110,${p.opacity})`;
        ctx!.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.y < -5)  p.y = height + 5;
        if (p.x < -5)  p.x = width + 5;
        if (p.x > width + 5) p.x = -5;
      }
      raf = requestAnimationFrame(draw);
    }
    draw();

    const onResize = () => {
      width  = canvas.width  = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      id="hero"
      dir={dir}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      aria-label={lang === "ar" ? "القسم الرئيسي" : "Hero"}
    >
      {/* Canvas stars */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
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
        <div className="mb-10 w-full flex justify-center px-4">
          <div style={{ position: "relative", width: "100%", maxWidth: "520px", height: "auto" }}>
            <Image
              src="/logo.png"
              alt="Radio Dandana"
              width={520}
              height={280}
              priority
              className="w-full h-auto object-contain"
              style={{ filter: "drop-shadow(0 0 60px rgba(201,169,110,0.3))" }}
            />
          </div>
        </div>

        {/* Main tagline */}
        <h1
          className={`text-5xl md:text-7xl font-light leading-tight mb-4 animate-fade-up ${
            lang === "ar" ? "font-arabic" : ""
          }`}
          style={{
            animationDelay: "0.3s",
            animationFillMode: "both",
          }}
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
          className="flex flex-row flex-wrap gap-5 justify-center mt-12 animate-fade-up"
          style={{ animationDelay: "0.7s", animationFillMode: "both" }}
        >
          <a
            href="#player"
            className="px-10 py-4 rounded-full font-semibold text-base min-w-[180px] text-center transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold-mid) 50%, var(--gold-light) 100%)",
              color: "#080808",
              boxShadow: "0 0 40px rgba(201,169,110,0.35), 0 4px 20px rgba(0,0,0,0.4)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: "1.4",
              fontFamily: lang === "ar" ? "Cairo, sans-serif" : "inherit",
            }}
          >
            {t("hero.cta")}
          </a>
          <a
            href="#schedule"
            className="px-10 py-4 rounded-full text-base min-w-[180px] text-center transition-all duration-300 hover:scale-105"
            style={{
              color: "var(--gold-mid)",
              border: "1.5px solid rgba(201,169,110,0.45)",
              background: "rgba(201,169,110,0.06)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: "1.4",
              fontFamily: lang === "ar" ? "Cairo, sans-serif" : "inherit",
            }}
          >
            {t("hero.cta2")}
          </a>
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
