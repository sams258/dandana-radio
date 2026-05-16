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
  const { volume, muted, togglePlay, toggleMute, handleVolumeChange, isPlaying, isLoading, isError, play } = usePlayer();
  const { data: np } = useNowPlaying();
  const [imgError, setImgError] = useState(false);

  const isAr = lang === "ar";

  const displayTitle = isLoading
    ? t("player.loading")
    : isError
    ? t("player.error")
    : np.title || "Radio Dandana";

  const useMarquee = displayTitle.length > 30;

  return (
    <section
      id="player"
      className="w-full max-w-2xl mx-auto"
      style={{ padding: "2rem 1.5rem" }}
      aria-label={isAr ? "مشغّل الراديو" : "Radio Player"}
    >
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

        <div style={{ padding: "2rem" }}>
          {/* ROW 1 — Album art + track info */}
          <div style={{ display: "flex", flexDirection: "row", gap: "1.25rem", alignItems: "center", marginBottom: "1.5rem" }}>
            {/* Album art */}
            <div
              style={{
                width: "88px",
                height: "88px",
                minWidth: "88px",
                minHeight: "88px",
                position: "relative",
                borderRadius: "12px",
                overflow: "hidden",
                flexShrink: 0,
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              }}
            >
              {np.coverUrl && !imgError ? (
                <Image
                  src={np.coverUrl}
                  alt={np.title}
                  fill
                  style={{ objectFit: "cover" }}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #131313, #1e1a10)" }}
                >
                  <Image
                    src="/logo.png"
                    alt="Radio Dandana"
                    width={70}
                    height={40}
                    className="object-contain p-2 opacity-75"
                  />
                </div>
              )}
              {isPlaying && (
                <div
                  className="absolute inset-0 animate-spin-slow"
                  style={{
                    borderRadius: "12px",
                    background:
                      "conic-gradient(from 0deg, transparent 60%, rgba(201,169,110,0.15) 100%)",
                    animationDuration: "6s",
                  }}
                />
              )}
            </div>

            {/* Track info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1, minWidth: 0 }}>
              {/* LIVE badge row */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="relative flex items-center justify-center w-3 h-3">
                  <span
                    className="pulse-ring absolute inline-flex w-3 h-3 rounded-full"
                    style={{ background: isPlaying ? "var(--gold-mid)" : "var(--text-subtle)" }}
                  />
                  <span
                    className="relative inline-flex w-2 h-2 rounded-full"
                    style={{ background: isPlaying ? "var(--gold-light)" : "var(--text-subtle)" }}
                  />
                </span>
                <span
                  style={{
                    color: "var(--gold-mid)",
                    fontFamily: "monospace",
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  {t("player.live")}
                </span>
                {np.listeners > 0 && (
                  <span
                    className="flex items-center gap-1 ms-2"
                    style={{ color: "var(--text-muted)", fontSize: "10px" }}
                  >
                    <Users size={10} />
                    {np.listeners.toLocaleString(isAr ? "ar-EG" : "en-US")}{" "}
                    {t("player.listeners")}
                  </span>
                )}
              </div>

              {/* "يُعزف الآن" label */}
              <p
                style={{
                  color: "var(--text-muted)",
                  fontFamily: "monospace",
                  fontSize: "10px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                {t("player.now")}
              </p>

              {/* Song title — marquee only if title > 30 chars */}
              {useMarquee ? (
                <div className="marquee-track">
                  <div className="marquee-inner">
                    <span
                      className={`text-lg font-semibold ${isAr ? "font-arabic" : ""}`}
                      style={{ color: "var(--gold-light)" }}
                    >
                      {displayTitle}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{displayTitle}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                  </div>
                </div>
              ) : (
                <span
                  className={`text-lg font-semibold truncate ${isAr ? "font-arabic" : ""}`}
                  style={{ color: "var(--gold-light)" }}
                >
                  {displayTitle}
                </span>
              )}

              {/* Artist name */}
              {np.artist && !isLoading && !isError && (
                <p
                  className={`text-sm ${isAr ? "font-arabic" : ""}`}
                  style={{ color: "var(--text-muted)" }}
                >
                  {np.artist}
                </p>
              )}

              {/* Up Next */}
              {np.nextTitle && (
                <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
                  {lang === "ar" ? "التالي:" : "Up next:"}{" "}
                  {np.nextArtist} — {np.nextTitle}
                </p>
              )}
            </div>
          </div>

          {/* ROW 2 — Visualizer */}
          <div
            style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem", opacity: isPlaying ? 1 : 0.3, transition: "opacity 0.5s" }}
          >
            <Visualizer isPlaying={isPlaying} barCount={32} />
          </div>

          {/* ROW 3 — Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
                  : "transparent",
                boxShadow: isPlaying
                  ? "0 0 24px rgba(201,169,110,0.4), 0 4px 12px rgba(0,0,0,0.5)"
                  : "0 4px 12px rgba(0,0,0,0.4)",
                border: isError
                  ? "1px solid rgba(180,60,60,0.3)"
                  : isPlaying
                  ? "1px solid rgba(201,169,110,0.3)"
                  : "2px solid var(--gold-mid)",
                opacity: isLoading ? 0.7 : 1,
                color: isError ? "#c06060" : isLoading ? "var(--gold-mid)" : isPlaying ? "#080808" : "var(--gold-mid)",
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

            {/* Volume row */}
            <div className="flex items-center gap-3 flex-1">
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
                dir="ltr"
                className="flex-1"
                style={{
                  background: `linear-gradient(to right, var(--gold-mid) 0%, var(--gold-mid) ${(muted ? 0 : volume) * 100}%, var(--text-subtle) ${(muted ? 0 : volume) * 100}%, var(--text-subtle) 100%)`,
                }}
              />
            </div>

            {isError && (
              <p className="text-xs shrink-0" style={{ color: "#c06060" }}>
                {t("player.error")}
              </p>
            )}
          </div>
        </div>

        {/* Gold bottom edge */}
        <div
          className="h-[1px] w-full"
          style={{
            background: "linear-gradient(90deg, transparent, var(--gold-deep), transparent)",
          }}
        />
      </div>
    </section>
  );
}
