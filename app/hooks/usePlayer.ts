"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────
// Stream URL — update this constant to change the stream
// ─────────────────────────────────────────────────────
export const STREAM_URL = "https://c34.radioboss.fm:9019/stream";

type PlayerState = "idle" | "loading" | "playing" | "error";

export function usePlayer() {
  const audioRef             = useRef<HTMLAudioElement | null>(null);
  const [state, setState]    = useState<PlayerState>("idle");
  const [volume, setVolume]  = useState(0.85);
  const [muted, setMuted]    = useState(false);

  // Initialise the Audio element once on mount
  useEffect(() => {
    const audio      = new Audio();
    audio.preload    = "none";
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    const onPlaying = () => setState("playing");
    const onWaiting = () => setState("loading");
    const onError   = () => setState("error");
    const onStalled = () => setState("loading");

    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("error",   onError);
    audio.addEventListener("stalled", onStalled);

    return () => {
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("error",   onError);
      audio.removeEventListener("stalled", onStalled);
      audio.src = "";
      audio.load();
    };
  }, []);

  // Sync volume changes to the audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    // Always reload src to prevent stale stream buffers
    audio.src  = STREAM_URL + "?t=" + Date.now();
    audio.load();
    setState("loading");
    audio.play().catch(() => setState("error"));
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.src = "";
    audio.load();
    setState("idle");
  }, []);

  const togglePlay = useCallback(() => {
    if (state === "playing" || state === "loading") stop();
    else play();
  }, [state, play, stop]);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  const handleVolumeChange = useCallback((v: number) => {
    setVolume(v);
    setMuted(false);
  }, []);

  return {
    state,
    volume,
    muted,
    togglePlay,
    toggleMute,
    handleVolumeChange,
    play,
    stop,
    isPlaying: state === "playing",
    isLoading: state === "loading",
    isError:   state === "error",
  };
}
