'use client';

import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

const STREAM_URL = 'https://c34.radioboss.fm:9019/stream';
const POLL_MS    = 15_000;

export interface NowPlaying {
  title:    string;
  artist:   string;
  album:    string;
  coverUrl: string | null;
}

type PlayerState = 'idle' | 'loading' | 'playing' | 'error';

interface PlayerContextValue {
  isPlaying: boolean;
  isLoading: boolean;
  isError:   boolean;
  play:        () => void;
  stop:        () => void;
  toggle:      () => void;
  volume:      number;
  setVolume:   (v: number) => void;
  muted:       boolean;
  toggleMute:  () => void;
  nowPlaying:  NowPlaying | null;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const stoppingRef = useRef(false);
  const [state,      setState]     = useState<PlayerState>('idle');
  const [volume,     setVolumeState] = useState(0.85);
  const [muted,      setMuted]     = useState(false);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);

  // Initialise audio element (client-only — Audio is not available on the server)
  useEffect(() => {
    const audio       = new Audio();
    audio.preload     = 'none';
    audio.crossOrigin = 'anonymous';
    audioRef.current  = audio;

    const onPlaying = () => setState('playing');
    const onWaiting = () => setState('loading');
    const onStalled = () => setState('loading');
    const onError   = () => {
      if (stoppingRef.current) return;
      setState('error');
    };

    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('stalled', onStalled);
    audio.addEventListener('error',   onError);

    return () => {
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('stalled', onStalled);
      audio.removeEventListener('error',   onError);
      audio.src = '';
      audio.load();
    };
  }, []);

  // Sync volume + mute to the audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  // Now-playing polling
  useEffect(() => {
    const fetchNow = async () => {
      try {
        const res = await fetch('/api/nowplaying', { cache: 'no-store' });
        if (!res.ok) return;
        const json = await res.json();
        setNowPlaying({
          title:    json.title    || 'راديو دندنة',
          artist:   json.artist   || 'Radio Dandana',
          album:    json.album    || '',
          coverUrl: json.coverUrl || null,
        });
      } catch {
        // preserve last known value on network error
      }
    };

    fetchNow();
    const id = setInterval(fetchNow, POLL_MS);
    return () => clearInterval(id);
  }, []);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = STREAM_URL + '?t=' + Date.now();
    audio.load();
    setState('loading');
    audio.play().catch(() => setState('error'));
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    stoppingRef.current = true;
    audio.pause();
    audio.src = '';
    audio.load();
    setState('idle');
    setTimeout(() => { stoppingRef.current = false; }, 300);
  }, []);

  const toggle = useCallback(() => {
    if (state === 'playing' || state === 'loading') stop();
    else play();
  }, [state, play, stop]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    setMuted(false);
  }, []);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  const value: PlayerContextValue = {
    isPlaying: state === 'playing',
    isLoading: state === 'loading',
    isError:   state === 'error',
    play,
    stop,
    toggle,
    volume,
    setVolume,
    muted,
    toggleMute,
    nowPlaying,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within <PlayerProvider>');
  return ctx;
}
