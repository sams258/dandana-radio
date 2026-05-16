"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, Square, Volume2, VolumeX, Users, Radio, RotateCcw } from "lucide-react";
import { usePlayer } from "../hooks/usePlayer";
import { useNowPlaying } from "../hooks/useNowPlaying";
import { Visualizer } from "./Visualizer";
import { useLang } from "../lib/lang";

export function RadioPlayer() {
  const { lang, t } = useLang();
  const { state, volume, muted, togglePlay, toggleMute, handleVolumeChange, isPlaying, isLoading, isError, play } = usePlayer();
  const { data: np } = useNowPlaying();
  const [imgError, setImgError] = useState(false);

  const isAr = lang === "ar";

  return (
    <section
      id="player"
      className="w-full max-w-3xl mx-auto px-4 py-6"
      aria-label={isAr ? "مشغّل الراديو" : "Radio Player"}
    >
      {/* ── PLAYER CARD ── */}
      <div
        className="glass-card rounded-2xl overflow-hidden"
        style={{
          boxShadow:
            "0 0 0 1px rgba(201,169,110,0.08), 0 24px 64px rgba(0,0,0,0.7), 0 0 80px rgba(139,105,20,0.08) inset",
        }}
      >
        {/* Gold top-edge accent */}
        <div
          className="h-[2px] w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, var(--gold-deep) 20%, var(--gold-mid) 50%, var(--gold-deep) 80%, transparent 100%)",
          }}
        />

        <div className="p-6 md:p-8">
          {/* ── TOP ROW: Cover art + Now Playing info ── */}
          <div className="flex gap-4 items-start mb-6">
            {/* Album art / logo fallback */}
            <div
              className="relative shrink-0 rounded-xl overflow-hidden"
              style={{
                width: "88px", height: "88px", minWidth: "88px",
                boxShadow: "0 0 0 1px rgba(201,169,110,0.2), 0 8px 24px rgba(0,0,0,0.6)",
              }}
            >
              {np.coverUrl && !imgError ? (
                <Image
                  src={np.coverUrl}
                  alt={np.title}
                  fill
                  className="object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #131313, #1e1a10)" }}>
                  <Image
                    src="/logo.png"
                    alt="Radio Dandana"
                    width={80}
                    height={80}
                    className="object-contain p-1 opacity-80"
                  />
                </div>
              )}

              {/* Spinning disc ring when playing */}
              {isPlaying && (
                <div
                  className="absolute inset-0 rounded-xl animate-spin-slow"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent 60%, rgba(201,169,110,0.15) 100%)",
                    animationDuration: "6s",
                  }}
                />
              )}
            </div>

            {/* Now Playing text */}
            <div className="flex-1 min-w-0">
              {/* LIVE badge */}
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex items-center justify-center w-3 h-3">
                  <span
                    className="pulse-ring absolute inline-flex w-3 h-3 rounded-full"
                    style={{
                      background: isPlaying ? "var(--gold-mid)" : "var(--text-subtle)",
                    }}
                  />
                  <span
                    className="relative inline-flex w-2 h-2 rounded-full"
                    style={{
                      background: isPlaying ? "var(--gold-light)" : "var(--text-subtle)",
                    }}
                  />
                </span>
                <span
                  className="text-[10px] font-semibold tracking-[0.2em] uppercase"
                  style={{ color: "var(--gold-mid)", fontFamily: "monospace" }}
                >
                  {t("player.live")}
                </span>
                {np.listeners > 0 && (
                  <span
                    className="flex items-center gap-1 text-[10px] ms-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Users size={10} />
                    {np.listeners.toLocaleString(isAr ? "ar-EG" : "en-US")}{" "}
                    {t("player.listeners")}
                  </span>
                )}
              </div>

              {/* Now Playing label */}
              <p
                className="text-[11px] uppercase tracking-widest mb-1"
                style={{ color: "var(--text-muted)", fontFamily: "monospace" }}
              >
                {t("player.now")}
              </p>

              {/* Song title — marquee if long */}
              <div className="marquee-track">
                <div className="marquee-inner">
                  <span
                    className={`text-lg md:text-xl font-medium ${isAr ? "font-arabic" : ""}`}
                    style={{ color: "var(--gold-light)" }}
                  >
                    {isLoading
                      ? t("player.loading")
                      : isError
                      ? t("player.error")
                      : np.title || "Radio Dandana"}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {/* duplicate for seamless loop */}
                    {isLoading
                      ? t("player.loading")
                      : isError
                      ? t("player.error")
                      : np.title || "Radio Dandana"}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                </div>
              </div>

              {/* Artist name */}
              {np.artist && !isLoading && !isError && (
                <p
                  className={`text-sm mt-0.5 ${isAr ? "font-arabic" : ""}`}
                  style={{ color: "var(--text-muted)" }}
                >
                  {np.artist}
                </p>
              )}

              {/* Up next */}
              {np.nextTitle && (
                <p style={{ color: "var(--text-subtle)", fontSize: "0.72rem", marginTop: "4px" }}>
                  {lang === "ar" ? "التالي:" : "Up next:"} {np.nextArtist} {np.nextArtist && np.nextTitle ? "–" : ""} {np.nextTitle}
                </p>
              )}
            </div>
          </div>

          {/* ── VISUALIZER ── */}
          <div
            className="flex justify-center mb-6"
            style={{ opacity: isPlaying ? 1 : 0.35, transition: "opacity 0.5s" }}
          >
            <Visualizer isPlaying={isPlaying} barCount={32} />
          </div>

          {/* ── CONTROLS ROW ── */}
          <div className="flex items-center gap-4">
            {/* Play / Stop button */}
            <button
              onClick={isError ? play : togglePlay}
              disabled={isLoading}
              aria-label={isPlaying ? (isAr ? "إيقاف" : "Stop") : (isAr ? "تشغيل" : "Play")}
              className="shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                background: isError
                  ? "rgba(180,60,60,0.15)"
                  : isLoading
                  ? "rgba(201,169,110,0.08)"
                  : isPlaying
                  ? "linear-gradient(135deg, var(--gold-deep), var(--gold-mid))"
                  : "linear-gradient(135deg, var(--gold-mid), var(--gold-light))",
                boxShadow: isPlaying
                  ? "0 0 24px rgba(201,169,110,0.4), 0 4px 12px rgba(0,0,0,0.5)"
                  : "0 4px 12px rgba(0,0,0,0.4)",
                border: "1px solid rgba(201,169,110,0.3)",
                opacity: isLoading ? 0.7 : 1,
                color: isError ? "#c06060" : isLoading ? "var(--gold-mid)" : "#080808",
              }}
            >
              {isError ? (
                <RotateCcw size={22} />
              ) : isLoading ? (
                <Radio size={22} className="animate-pulse" />
              ) : isPlaying ? (
                <Square size={20} fill="currentColor" />
              ) : (
                <Play size={22} fill="currentColor" className={isAr ? "" : "translate-x-0.5"} />
              )}
            </button>

            {/* Volume section */}
            <div className="flex items-center gap-2 flex-1">
              <button
                onClick={toggleMute}
                aria-label={muted ? (isAr ? "رفع كتم الصوت" : "Unmute") : (isAr ? "كتم الصوت" : "Mute")}
                className="shrink-0 p-1.5 rounded-lg transition-colors focus:outline-none focus-visible:ring-1"
                style={{
                  color: muted ? "var(--text-muted)" : "var(--gold-mid)",
                  background: "rgba(201,169,110,0.06)",
                }}
              >
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>

              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={muted ? 0 : volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                aria-label={t("player.volume")}
                dir="ltr" // range input always LTR for consistent UX
                style={{
                  background: `linear-gradient(to right, var(--gold-mid) 0%, var(--gold-mid) ${(muted ? 0 : volume) * 100}%, var(--text-subtle) ${(muted ? 0 : volume) * 100}%, var(--text-subtle) 100%)`,
                }}
              />
            </div>

            {/* Error state inline message */}
            {isError && (
              <p
                className="text-xs shrink-0"
                style={{ color: "#c06060" }}
              >
                {t("player.error")}
              </p>
            )}
          </div>
        </div>

        {/* Gold bottom edge */}
        <div
          className="h-[1px] w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--gold-deep), transparent)",
          }}
        />
      </div>
    </section>
  );
}
