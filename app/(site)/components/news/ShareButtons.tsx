'use client';

import type { ReactNode } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
  locale: 'ar' | 'en';
}

interface Platform {
  id: string;
  name: string;
  bg: string;
  border: string;
  color: string;
  href: (url: string, title: string) => string;
  icon: ReactNode;
}

const PLATFORMS: Platform[] = [
  {
    id:     'whatsapp',
    name:   'WhatsApp',
    bg:     'rgba(37,211,102,0.15)',
    border: '1px solid rgba(37,211,102,0.30)',
    color:  '#25D366',
    href:   (url, title) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12 0C5.373 0 0 5.373 0 12c0 2.138.563 4.138 1.535 5.874L0 24l6.334-1.518A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0m0 22c-1.892 0-3.659-.524-5.168-1.428l-.37-.22-3.836 1.005 1.026-3.742-.241-.394A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10"/>
      </svg>
    ),
  },
  {
    id:     'facebook',
    name:   'Facebook',
    bg:     'rgba(24,119,242,0.15)',
    border: '1px solid rgba(24,119,242,0.30)',
    color:  '#1877F2',
    href:   (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    id:     'x',
    name:   'X',
    bg:     'rgba(0,0,0,0.85)',
    border: '1px solid rgba(255,255,255,0.30)',
    color:  '#ffffff',
    href:   (url, title) =>
      `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.066H5.117z"/>
      </svg>
    ),
  },
  {
    id:     'messenger',
    name:   'Messenger',
    bg:     'rgba(0,132,255,0.15)',
    border: '1px solid rgba(0,132,255,0.30)',
    color:  '#0084FF',
    href:   (url) =>
      `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(url)}`,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.374 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.465 3.442.465 6.626 0 12-4.974 12-11.111C24 4.975 18.626 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.26L19.752 8l-6.561 6.963z"/>
      </svg>
    ),
  },
  {
    id:     'snapchat',
    name:   'Snapchat',
    bg:     'rgba(255,252,0,0.15)',
    border: '1px solid rgba(255,252,0,0.40)',
    color:  '#000000',
    href:   (url) =>
      `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(url)}`,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.065.005C9.778.006 5.42 1.108 5.42 7.192c0 .2.007.394.013.577l-.016.009c-.39.216-.794.335-1.205.335-.49 0-.837-.19-.904-.232-.043-.026-.077-.04-.11-.04-.08 0-.142.065-.142.145 0 .067.045.127.117.152.032.01 1.197.4 1.442 1.9.013.077.08.133.16.133h.025l.208-.026.08-.01c.337 0 .744.155 1.09.527.34.366.506.804.464 1.222-.042.418-.285.752-.677.94-.13.062-.325.125-.597.18-1.05.21-2.713.543-3.01 1.54a.154.154 0 00-.011.056c0 .061.042.117.105.137.026.009.78.258 2.03.48 1.14.2 1.27.614 1.285.71.02.147.057.296.078.437.05.312.264.494.544.494.15 0 .307-.05.47-.15.396-.24.86-.368 1.34-.368.518 0 .985.158 1.287.346.504.31.917.488 1.4.488.484 0 .897-.178 1.4-.488.302-.188.77-.346 1.287-.346.48 0 .944.128 1.34.368.163.1.32.15.47.15.28 0 .494-.182.544-.494.021-.14.058-.29.078-.437.015-.096.145-.51 1.285-.71 1.25-.222 2.004-.47 2.03-.48a.143.143 0 00.094-.192c-.297-.997-1.96-1.33-3.01-1.54-.272-.055-.467-.118-.597-.18-.392-.188-.635-.522-.677-.94-.042-.418.124-.856.465-1.222.345-.372.752-.527 1.09-.527l.287.036h.025c.08 0 .147-.056.16-.133.245-1.5 1.41-1.89 1.443-1.9a.157.157 0 00.116-.152c0-.08-.062-.145-.142-.145-.033 0-.067.014-.11.04-.067.042-.414.232-.904.232-.41 0-.815-.12-1.205-.335l-.016-.009c.006-.183.013-.377.013-.577C18.577 1.108 14.352.005 12.065.005z"/>
      </svg>
    ),
  },
];

const SHARE_LABEL = { ar: 'شارك هذا المقال', en: 'Share this article' } as const;

export function ShareButtons({ url, title, locale }: ShareButtonsProps) {
  return (
    <section aria-label={SHARE_LABEL[locale]}>
      <style>{`
        .share-btn { transition: background 0.15s ease; }
        .share-btn-whatsapp:hover  { background: rgba(37,211,102,0.30) !important; }
        .share-btn-facebook:hover  { background: rgba(24,119,242,0.30) !important; }
        .share-btn-x:hover         { background: rgba(0,0,0,0.95) !important; }
        .share-btn-messenger:hover { background: rgba(0,132,255,0.30) !important; }
        .share-btn-snapchat:hover  { background: rgba(255,252,0,0.40) !important; }
      `}</style>

      <p style={{
        fontFamily:     "'Cairo', sans-serif",
        fontSize:       '0.78rem',
        color:          'var(--text-muted)',
        textAlign:      'start',
        margin:         0,
        marginBlockEnd: '0.75rem',
      }}>
        {SHARE_LABEL[locale]}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {PLATFORMS.map((p) => (
          <a
            key={p.id}
            href={p.href(url, title)}
            target="_blank"
            rel="noopener noreferrer"
            className={`share-btn share-btn-${p.id}`}
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            '8px',
              background:     p.bg,
              border:         p.border,
              color:          p.color,
              borderRadius:   '8px',
              paddingBlock:   '8px',
              paddingInline:  '14px',
              textDecoration: 'none',
              fontFamily:     "'Cairo', sans-serif",
              fontSize:       '0.8rem',
              fontWeight:     '500',
            }}
          >
            {p.icon}
            {p.name}
          </a>
        ))}
      </div>
    </section>
  );
}
