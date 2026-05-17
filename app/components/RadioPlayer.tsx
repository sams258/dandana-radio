"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Play, Square, Volume2, VolumeX, Radio, RotateCcw } from "lucide-react";
import { usePlayer } from "../hooks/usePlayer";
import { useNowPlaying } from "../hooks/useNowPlaying";
import { Visualizer } from "./Visualizer";
import { useLang } from "../lib/lang";

export function RadioPlayer() {
  const { lang, t } = useLang();
  const { volume, muted, togglePlay, toggleMute, handleVolumeChange, isPlaying, isLoading, isError, play, stop } = usePlayer();
  const { data: np } = useNowPlaying();
  const [imgError, setImgError] = useState(false);

  const isAr = lang === "ar";

  // Media Session — update metadata and playback state
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;

    if (isPlaying) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title:  np.title  || "راديو دندنة",
        artist: np.artist || "Radio Dandana",
        album:  np.album  || "Radio Dandana",
        artwork: np.coverUrl
          ? [
              { src: np.coverUrl, sizes: "512x512", type: "image/jpeg" },
              { src: np.coverUrl, sizes: "256x256", type: "image/jpeg" },
            ]
          : [
              { src: "/dandana2.png", sizes: "512x512", type: "image/png" },
            ],
      });
      navigator.mediaSession.playbackState = "playing";
    } else {
      navigator.mediaSession.playbackState = isLoading ? "none" : "paused";
    }
  }, [isPlaying, isLoading, np.title, np.artist, np.album, np.coverUrl]);

  // Media Session — OS action handlers (lock screen play/pause)
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;

    navigator.mediaSession.setActionHandler("play", () => { play(); });
    navigator.mediaSession.setActionHandler("pause", () => { stop(); });
    navigator.mediaSession.setActionHandler("stop", () => { stop(); });

    // Live radio — disable skip buttons on the OS
    navigator.mediaSession.setActionHandler("previoustrack", null);
    navigator.mediaSession.setActionHandler("nexttrack", null);
    navigator.mediaSession.setActionHandler("seekbackward", null);
    navigator.mediaSession.setActionHandler("seekforward", null);

    return () => {
      navigator.mediaSession.setActionHandler("play",  null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("stop",  null);
    };
  }, [play, stop]);

  // Browser tab title — shows current track when playing
  useEffect(() => {
    if (typeof document === "undefined") return;

    if (isPlaying && np.title && np.title !== "راديو دندنة") {
      document.title = `${np.artist ? np.artist + " — " : ""}${np.title} | راديو دندنة`;
    } else {
      document.title = "Radio Dandana | راديو دندنة";
    }

    return () => {
      document.title = "Radio Dandana | راديو دندنة";
    };
  }, [isPlaying, np.title, np.artist]);

  const displayTitle = isLoading
    ? t("player.loading")
    : isError
    ? t("player.error")
    : np.title || "Radio Dandana";

  const useMarquee = displayTitle.length > 30;

  return (
    <section
      id="player"
      dir="ltr"
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
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1, minWidth: 0, alignItems: "flex-start" }}>
              {/* LIVE badge row */}
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px" }}>
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
                  dir="auto"
                  style={{
                    color: "var(--gold-mid)",
                    fontFamily: "'Cairo', 'IBM Plex Sans Arabic', sans-serif",
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  {t("player.live")}
                </span>
              </div>

              {/* "يُعزف الآن" label */}
              <p style={{
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "var(--text-muted)",
                fontFamily: "monospace",
                margin: 0,
                direction: "ltr",
              }}>
                {t("player.now")}
              </p>

              {/* Song title — marquee only if title > 30 chars */}
              {useMarquee ? (
                <div className="marquee-track">
                  <div className="marquee-inner">
                    <span
                      dir="auto"
                      className="text-lg font-semibold"
                      style={{ color: "var(--gold-light)", fontFamily: "'Cairo', 'IBM Plex Sans Arabic', sans-serif" }}
                    >
                      {displayTitle}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{displayTitle}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                  </div>
                </div>
              ) : (
                <span
                  dir="auto"
                  className="text-lg font-semibold truncate"
                  style={{ color: "var(--gold-light)", fontFamily: "'Cairo', 'IBM Plex Sans Arabic', sans-serif" }}
                >
                  {displayTitle}
                </span>
              )}

              {/* Artist name */}
              {np.artist && !isLoading && !isError && (
                <p
                  dir="auto"
                  className="text-sm"
                  style={{ color: "var(--text-muted)", fontFamily: "'Cairo', 'IBM Plex Sans Arabic', sans-serif" }}
                >
                  {np.artist}
                </p>
              )}

            </div>
          </div>

          {/* Up Next row */}
          <div style={{
            display: np.nextTitle ? "flex" : "none",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.65rem 1rem",
            borderRadius: "10px",
            background: "rgba(201,169,110,0.05)",
            border: "1px solid rgba(201,169,110,0.12)",
            marginBottom: "0.5rem",
          }}>
            <span style={{
              fontSize: "0.7rem",
              fontWeight: "600",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--gold-deep)",
              whiteSpace: "nowrap",
              fontFamily: "monospace",
            }}>
              {lang === "ar" ? "التالي" : "Up Next"}
            </span>
            <span style={{
              width: "1px",
              height: "14px",
              background: "rgba(201,169,110,0.25)",
              flexShrink: 0,
            }} />
            <span
              style={{
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
                fontFamily: "'Cairo', 'IBM Plex Sans Arabic', sans-serif",
                direction: "auto" as React.CSSProperties["direction"],
              }}
            >
              {np.nextArtist ? `${np.nextArtist} — ${np.nextTitle}` : np.nextTitle}
            </span>
          </div>

          {/* ROW 2 — Visualizer */}
          <div
            style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem", opacity: isPlaying ? 1 : 0.3, transition: "opacity 0.5s" }}
          >
            <Visualizer isPlaying={isPlaying} barCount={32} />
          </div>

          {/* ROW 3 — Controls */}
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "1rem", marginTop: "0.5rem" }}>
            {/* Play / Stop button */}
            <button
              onClick={isError ? play : togglePlay}
              disabled={isLoading}
              aria-label={isPlaying ? (isAr ? "إيقاف" : "Stop") : (isAr ? "تشغيل" : "Play")}
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                width: "68px",
                height: "68px",
                borderRadius: "50%",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: isLoading ? "wait" : "pointer",
                border: "1px solid rgba(201,169,110,0.3)",
                transition: "all 0.3s ease",
                background: isError
                  ? "rgba(180,60,60,0.15)"
                  : isLoading
                  ? "rgba(201,169,110,0.08)"
                  : isPlaying
                  ? "linear-gradient(135deg, var(--gold-deep), var(--gold-mid))"
                  : "linear-gradient(135deg, var(--gold-mid), var(--gold-light))",
                boxShadow: isPlaying
                  ? "0 0 28px rgba(201,169,110,0.45), 0 4px 16px rgba(0,0,0,0.5)"
                  : "0 4px 16px rgba(0,0,0,0.4)",
                color: isError ? "#c06060" : isLoading ? "var(--gold-mid)" : "#080808",
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isError ? (
                <RotateCcw size={24} />
              ) : isLoading ? (
                <Radio size={26} className="animate-pulse" />
              ) : isPlaying ? (
                <Square size={26} fill="currentColor" />
              ) : (
                <Play size={28} fill="currentColor" />
              )}
            </button>

            {/* Mute button + volume slider */}
            <button
              onClick={toggleMute}
              aria-label={muted ? (isAr ? "رفع كتم الصوت" : "Unmute") : (isAr ? "كتم الصوت" : "Mute")}
              style={{
                flexShrink: 0,
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                background: "rgba(201,169,110,0.06)",
                border: "1px solid rgba(201,169,110,0.15)",
                color: muted ? "var(--text-muted)" : "var(--gold-mid)",
                transition: "all 0.2s",
              }}
            >
              {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
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
