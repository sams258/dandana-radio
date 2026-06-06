'use client';

import { usePlayer } from '../../context/PlayerContext';

export function GlobalPlayer() {
  const {
    isPlaying, isLoading, toggle,
    volume, setVolume, muted, toggleMute,
    nowPlaying,
  } = usePlayer();

  const displayTitle  = nowPlaying?.title  || 'راديو دندنة';
  const displayArtist = nowPlaying?.artist || 'بث مباشر';

  return (
    <div
      role="region"
      aria-label="مشغّل الراديو"
      style={{
        position:        'fixed',
        bottom:          0,
        insetInline:     0,
        height:          '72px',
        zIndex:          1000,
        background:      'rgba(8,8,8,0.95)',
        backdropFilter:  'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop:       '1px solid rgba(201,169,110,0.15)',
        display:         'flex',
        alignItems:      'center',
        paddingInline:   'clamp(1rem, 4vw, 2rem)',
        gap:             '1rem',
      }}
    >
      <style>{`
        @keyframes gp-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* ── Start zone: logo mark + station name ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
        <div style={{
          width:          '32px',
          height:         '32px',
          borderRadius:   '50%',
          background:     'linear-gradient(135deg, var(--gold-deep), var(--gold-mid))',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          fontSize:       '14px',
          fontWeight:     700,
          color:          '#080808',
          fontFamily:     "'Cairo', sans-serif",
          flexShrink:     0,
        }}>
          د
        </div>
        <span style={{
          fontFamily: "'Cairo', sans-serif",
          fontSize:   '0.8rem',
          color:      'var(--gold-mid)',
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}>
          راديو دندنة
        </span>
      </div>

      {/* ── Center zone: play button + now-playing text ── */}
      <div style={{
        flex:           1,
        display:        'flex',
        alignItems:     'center',
        gap:            '0.875rem',
        justifyContent: 'center',
        minWidth:       0,
      }}>
        {/* Play / Pause / Loading button */}
        <button
          onClick={toggle}
          aria-label={isPlaying ? 'إيقاف' : 'تشغيل'}
          style={{
            width:        '44px',
            height:       '44px',
            borderRadius: '50%',
            border:       '1px solid rgba(201,169,110,0.4)',
            background:   isPlaying
              ? 'linear-gradient(135deg, var(--gold-deep), var(--gold-mid))'
              : 'rgba(201,169,110,0.08)',
            color:      isPlaying ? '#080808' : 'var(--gold-mid)',
            display:    'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor:     'pointer',
            flexShrink: 0,
            transition: 'all 0.2s ease',
            padding:    0,
          }}
        >
          {isLoading ? (
            <svg
              width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5"
              aria-hidden="true"
              style={{ animation: 'gp-spin 1s linear infinite' }}
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
          ) : isPlaying ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
          )}
        </button>

        {/* Now-playing text */}
        <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
          <style>{`
            @keyframes gp-marquee {
              0%   { transform: translateX(0%); }
              100% { transform: translateX(-100%); }
            }
            .gp-scroll-outer {
              overflow: hidden;
              white-space: nowrap;
            }
            .gp-scroll-inner {
              display: inline-block;
              padding-inline-end: 3rem;
              animation: gp-marquee 14s linear infinite;
            }
            .gp-scroll-inner.paused {
              animation-play-state: paused;
            }
            @media (min-width: 640px) {
              .gp-scroll-inner {
                animation: none;
                padding-inline-end: 0;
              }
              .gp-scroll-outer {
                text-overflow: ellipsis;
                display: block;
              }
            }
          `}</style>

          {/* Title */}
          <div className="gp-scroll-outer">
            <span
              className={`gp-scroll-inner${!isPlaying ? ' paused' : ''}`}
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize:   '0.85rem',
                fontWeight: 600,
                color:      'var(--gold-light)',
              }}
            >
              {displayTitle}
            </span>
          </div>

          {/* Artist */}
          <div className="gp-scroll-outer">
            <span
              className={`gp-scroll-inner${!isPlaying ? ' paused' : ''}`}
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize:   '0.72rem',
                color:      'var(--text-muted)',
              }}
            >
              {displayArtist}
            </span>
          </div>
        </div>
      </div>

      {/* ── End zone: mute button + volume slider ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
        <button
          onClick={toggleMute}
          aria-label={muted ? 'رفع كتم الصوت' : 'كتم الصوت'}
          style={{
            background: 'none',
            border:     'none',
            cursor:     'pointer',
            color:      'var(--gold-mid)',
            padding:    '4px',
            display:    'flex',
            alignItems: 'center',
          }}
        >
          {muted || volume === 0 ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <line x1="23" y1="9" x2="17" y2="15"/>
              <line x1="17" y1="9" x2="23" y2="15"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
          )}
        </button>

        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="مستوى الصوت"
          dir="ltr"
          style={{
            width:      '80px',
            background: `linear-gradient(to right, var(--gold-mid) 0%, var(--gold-mid) ${(muted ? 0 : volume) * 100}%, var(--text-subtle) ${(muted ? 0 : volume) * 100}%, var(--text-subtle) 100%)`,
          }}
        />
      </div>
    </div>
  );
}
