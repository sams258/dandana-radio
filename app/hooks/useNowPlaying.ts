"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const POLL_MS = 15_000; // refresh every 15 seconds

export interface NowPlayingData {
  artist:    string;
  title:     string;
  album:     string;
  duration:  string;
  coverUrl:  string | null;
  listeners: number;
  isLive:    boolean;
  recent:    { title: string; trackartist: string; tracktitle: string; started: string }[];
}

const FALLBACK: NowPlayingData = {
  artist: "Radio Dandana", title: "راديو دندنة", album: "",
  duration: "", coverUrl: null, listeners: 0, isLive: true,
  recent: [],
};

export function useNowPlaying() {
  const [data, setData]       = useState<NowPlayingData>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchNow = useCallback(async () => {
    try {
      const res = await fetch("/api/nowplaying", { cache: "no-store" });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();

      setData({
        artist:    json.artist,
        title:     json.title,
        album:     json.album,
        duration:  json.duration,
        coverUrl:  json.coverUrl,
        listeners: json.listeners,
        isLive:    json.isLive,
        recent:    json.recent ?? [],
      });
      setError(null);
    } catch (e) {
      // Fall back gracefully — don't crash the player
      console.warn("[useNowPlaying] fetch error:", e);
      setError("metadata_unavailable");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNow();
    timerRef.current = setInterval(fetchNow, POLL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchNow]);

  return { data, loading, error, refetch: fetchNow };
}
