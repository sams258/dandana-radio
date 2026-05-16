"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ──────────────────────────────────────────────
// RadioBoss API config
// To change: update STATION_ID, API_KEY, BASE_URL
// ──────────────────────────────────────────────
const STATION_ID = "1019";
const API_KEY    = "38D1T98921NV";
const BASE_URL   = "https://c34.radioboss.fm";
const POLL_MS    = 15_000; // refresh every 15 seconds

export interface NowPlayingData {
  artist:    string;
  title:     string;
  album:     string;
  coverUrl:  string | null;
  listeners: number;
  isLive:    boolean;
  startTime: number | null; // epoch ms
  duration:  number | null; // seconds
}

const FALLBACK: NowPlayingData = {
  artist:    "Radio Dandana",
  title:     "راديو دندنة",
  album:     "",
  coverUrl:  null,
  listeners: 0,
  isLive:    true,
  startTime: null,
  duration:  null,
};

export function useNowPlaying() {
  const [data, setData]       = useState<NowPlayingData>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchNow = useCallback(async () => {
    try {
      // RadioBoss API endpoint
      const url = `${BASE_URL}/api/station/nowplaying?stationid=${STATION_ID}&apikey=${API_KEY}`;
      const res = await fetch(url, { cache: "no-store" });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();

      // RadioBoss response shape: { nowplaying: { song, artist, album, ... }, listeners, ... }
      // Adjust the mapping below if the actual response shape differs
      const np = json?.nowplaying ?? json?.data?.nowplaying ?? json;

      setData({
        artist:    np?.artist   ?? np?.Artist   ?? "Radio Dandana",
        title:     np?.song     ?? np?.Song     ?? np?.title ?? "راديو دندنة",
        album:     np?.album    ?? np?.Album    ?? "",
        coverUrl:  np?.coverurl ?? np?.cover    ?? null,
        listeners: Number(json?.listeners ?? json?.data?.listeners ?? 0),
        isLive:    true,
        startTime: np?.starttime ? Number(np.starttime) * 1000 : null,
        duration:  np?.duration  ? Number(np.duration)         : null,
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
