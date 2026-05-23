# Dandana Radio — Project Context

> Generated from the actual codebase. Contains only what is implemented, not what was discussed.

---

## 1. PROJECT OVERVIEW

**Name:** Radio Dandana / راديو دندنة  
**Purpose:** A single-page bilingual (Arabic/English) live radio streaming website for an Arabic music station.  
**Audience:** Arabic-speaking listeners; site defaults to Arabic, with a one-click toggle to English.  
**Language:** TypeScript  
**Framework:** Next.js 16.2.6 (App Router, Turbopack)  
**Styling:** Tailwind CSS v4 + inline styles + CSS custom properties  
**Key dependencies:**
- `react` 19.2.4 / `react-dom` 19.2.4
- `lucide-react` ^1.16.0 — icons
- `framer-motion` ^12.38.0 — installed but not currently used in components
- `tailwindcss` ^4, `@tailwindcss/postcss` ^4

**Deployment target:** Vercel (`vercel.json` present), region `fra1` (Frankfurt).

---

## 2. PROJECT STRUCTURE

```
dandana-radio/
├── app/
│   ├── api/
│   │   └── nowplaying/
│   │       └── route.ts          # Server-side API route: fetches RadioBoss metadata and returns sanitised JSON
│   ├── components/
│   │   ├── Footer.tsx            # Site footer with logo, tagline, copyright year
│   │   ├── HeroSection.tsx       # Full-screen hero with animated logo, tagline, CTA buttons, social icons, music notes particle effect
│   │   ├── Navbar.tsx            # Fixed top navigation with language toggle, desktop links, mobile hamburger menu
│   │   ├── RadioPlayer.tsx       # The radio player card: album art, track info, waveform, visualizer bar, play/stop/mute/volume controls
│   │   ├── Sections.tsx          # AboutSection, ScheduleSection, ContactSection — all three page sections in one file
│   │   └── Visualizer.tsx        # Randomised animated bar visualizer used inside RadioPlayer
│   ├── hooks/
│   │   ├── useNowPlaying.ts      # Polls /api/nowplaying every 15 s and exposes current track data
│   │   └── usePlayer.ts          # Manages HTML5 Audio element lifecycle, stream play/stop, volume, mute state
│   ├── lib/
│   │   └── lang.tsx              # LangProvider context + useLang hook + all Arabic/English translation strings
│   ├── favicon.ico
│   ├── globals.css               # CSS custom properties, global resets, utility classes, keyframe animations
│   ├── layout.tsx                # Root layout: metadata, Google Fonts preload, html/body shell
│   └── page.tsx                  # Root page: mounts LangProvider wrapping Navbar + all page sections
├── public/
│   ├── dandana1.png              # Original logo (not referenced in current code)
│   ├── dandana2.png              # Transparent horizontal logo used in HeroSection
│   ├── logo.png                  # Copy of transparent logo used in Navbar, RadioPlayer fallback art, Footer
│   ├── logo1.png                 # Unused alternate logo file
│   └── (next.svg, vercel.svg, file.svg, globe.svg, window.svg)  # Next.js scaffold assets, unused
├── dandana2.png                  # Duplicate of public/dandana2.png at project root (unused by app)
├── AGENTS.md                     # AI agent instructions (read Next.js docs before writing code)
├── CLAUDE.md                     # Points to AGENTS.md
├── next.config.ts                # Image remote patterns + device/image size config
├── tailwind.config.ts            # Theme extension: gold/black/cream colour tokens, arabic font family, custom animations
├── tsconfig.json                 # TypeScript config, strict mode, path alias @/*
├── vercel.json                   # Vercel deployment config: region fra1, security headers, no-store on /api/*
├── package.json                  # Scripts and dependencies
├── postcss.config.mjs            # PostCSS with @tailwindcss/postcss
└── eslint.config.mjs             # ESLint config
```

---

## 3. STREAM & API CONFIGURATION

**Live stream URL** (from `usePlayer.ts`):
```
https://c34.radioboss.fm:9019/stream
```
A cache-busting timestamp query param (`?t=<Date.now()>`) is appended on every `play()` call to prevent stale stream buffers.

**RadioBoss API** (from `app/api/nowplaying/route.ts`):
```
Base URL:   https://c34.radioboss.fm
Station ID: 1019
API Key:    38D1T98921NV
```

**Endpoints called:**

| Endpoint | Purpose |
|----------|---------|
| `GET /api/info/1019?key=38D1T98921NV` | Current track, artist, album, artwork URL, live status, recent tracks list |

**Poll interval:** 15 000 ms (15 seconds), set as `POLL_MS` constant in `useNowPlaying.ts`.

**API route behaviour:**
- `export const dynamic = "force-dynamic"` — disables static caching for the route
- Parses `currenttrack_info["@attributes"]` for artist/title/album/duration
- Parses `links.artwork` for cover art URL
- Falls back to splitting the `nowplaying` string on ` - ` if `currenttrack_info` is absent
- Filters `recent[]` to remove entries where artist/title is blank or matches dandana radio / jingle / promo keywords
- Returns a `FALLBACK` constant on any fetch or parse error

---

## 4. COMPONENTS

### `Navbar.tsx`
- **Renders:** Fixed top header with logo, desktop nav links, language toggle pill, "Listen Now" CTA button, mobile hamburger + slide-down menu.
- **Hooks:** `useLang()` for translations and direction.
- **State:** `scrolled` (boolean, set when `window.scrollY > 40`) changes background from transparent to `rgba(8,8,8,0.92)` with blur; `menuOpen` (boolean) toggles mobile menu.
- **Nav links:** Home (`#hero`), About (`#about`), Schedule (`#schedule`), Contact (`#contact`).
- **Language toggle:** Shows `"عربي"` when `lang === "en"` and `"EN"` when `lang === "ar"`.

### `HeroSection.tsx`
- **Renders:** Full-screen section with animated logo, tagline (shimmer text), subtitle, two CTA buttons, social icon row, scroll hint line.
- **Hooks:** `useLang()`.
- **State:** `notesContainerRef` — a `useRef<HTMLDivElement>` pointing to the notes particle container.
- **Key behaviour:**
  - Dynamically creates `<span>` elements containing musical note characters (♩ ♪ ♫ ♬ 𝄞 𝄢 ♭ ♮ ♯) and appends them to the DOM container on a 600 ms interval. Up to 35 notes live at once; older ones are removed.
  - Notes animate via `@keyframes noteFloat` (defined in an inline `<style>` tag inside the component) — float upward with random drift, fade in/out.
  - Logo uses `@keyframes logoGlow` (also inline `<style>`) — alternates between two `drop-shadow` filter states over 3 s.
  - Social links: Facebook (`https://www.facebook.com/sawalefkon/`), TikTok (`https://www.tiktok.com/@dandana.radio`), Instagram (`https://www.instagram.com/dandana.radio`).
- **Image:** `/dandana2.png` with `unoptimized` prop, rendered at `width={800} height={430}`.

### `RadioPlayer.tsx`
- **Renders:** A `glass-card` player with three rows: (1) album art + track info + waveform animation, (2) bar visualizer, (3) play/stop button + mute button + volume slider.
- **Hooks:** `useLang()`, `usePlayer()`, `useNowPlaying()`.
- **State:** `imgError` (boolean) — falls back to logo when album art fails to load.
- **Three `useEffect` calls for Media Session API:**
  1. Updates `navigator.mediaSession.metadata` (title, artist, album, artwork) and `playbackState` whenever `isPlaying`, `isLoading`, or track data changes.
  2. Registers OS action handlers (`play` → `play()`, `pause`/`stop` → `stop()`). Disables skip/seek buttons — appropriate for live radio.
  3. Updates `document.title` to `"Artist — Title | راديو دندنة"` when playing a named track; resets to default otherwise.
- **Display title logic:** Shows loading/error translation strings or `np.title`; falls back to `"Radio Dandana"`.
- **Marquee:** Activated when `displayTitle.length > 30`; title is doubled in the DOM and scrolled via `.marquee-inner` CSS animation.
- **Play button states:** idle → gold gradient + Play icon; loading → dimmed + pulsing Radio icon; playing → gold gradient + Stop icon; error → red tint + RotateCcw icon. Clicking in error state calls `play()` directly (retry).
- **Volume slider fill:** `linear-gradient(to right, …)` computed inline from `volume * 100` percentage; forced `dir="ltr"` so the fill always grows left-to-right regardless of page direction.
- **WaveformAnimation (inline component):** 12 bars, each 3 px wide with individual `height`, `duration` (0.48 s–0.72 s), and `delay` (0 s–0.20 s). Animates via `@keyframes waveBar` (4-stop keyframe at 0%/25%/50%/75%/100%). Fully opaque when playing, 20% opacity when stopped.
- **Section element:** `dir="ltr"` — see §8 for rationale.

### `Visualizer.tsx`
- **Renders:** A row of animated bars used as a wider spectrum-style visualizer below the track info.
- **Props:** `isPlaying: boolean`, `barCount?: number` (default 28; RadioPlayer passes 32).
- **State:** `bars` array generated once on mount via `useEffect`, each bar with random `delay`, `duration`, and `maxH` (height 20–100%). A `mounted` flag prevents SSR hydration mismatch — returns a fixed-height placeholder until mounted.
- **Animation:** Uses `.vis-bar` class (defined in `globals.css`) which applies `@keyframes bar-dance`. Bars animate only when `isPlaying`; otherwise `animationDuration` is `"0s"` and they scale to 8% height.

### `Sections.tsx` — three exported components

**`AboutSection`**
- Renders: Section with a large Mic icon ornament and a body paragraph.
- Hooks: `useLang()`.

**`ScheduleSection`**
- Renders: Section with a 2-column grid of 4 schedule cards (Morning, Noon, Evening, Night), each with an icon (Coffee, Sun, Sunset, Moon), programme name, and time range.
- Hooks: `useLang()`.

**`ContactSection`**
- Renders: Section with a contact form (name, email, message, submit button).
- Hooks: `useLang()`.
- State: `sent` (boolean) — toggles button to a green "✓ Sent!" state for 4 seconds. No actual form submission is wired; `handleSubmit` only calls `e.preventDefault()` and sets `sent = true`.

### `Footer.tsx`
- **Renders:** Centred footer with `/logo.png` at 160 px wide, tagline text, and `© {year} Radio Dandana — {rights}`. Year is computed at render time via `new Date().getFullYear()`.
- **Hooks:** `useLang()`.

---

## 5. HOOKS

### `usePlayer.ts`

**Purpose:** Manages the HTML5 Audio element for live stream playback.

**Returns:**
```ts
{
  state: "idle" | "loading" | "playing" | "error",
  volume: number,          // 0–1, default 0.85
  muted: boolean,
  togglePlay: () => void,
  toggleMute:  () => void,
  handleVolumeChange: (v: number) => void,
  play:  () => void,
  stop:  () => void,
  isPlaying: boolean,
  isLoading: boolean,
  isError:   boolean,
}
```

**Key implementation details:**
- `audioRef` — the `HTMLAudioElement` is created in a `useEffect` on mount with `preload="none"` and `crossOrigin="anonymous"`. It is never recreated.
- `stoppingRef` — a `useRef<boolean>` flag set to `true` during the `stop()` call and cleared after 300 ms via `setTimeout`. The `"error"` event handler checks this flag and does nothing if stopping was intentional — prevents false error state when clearing the `src` attribute triggers the audio error event.
- `play()` always sets `audio.src = STREAM_URL + "?t=" + Date.now()` before calling `audio.load()` — this forces a fresh connection and prevents the browser from replaying a cached/stale buffer.
- Volume changes apply immediately to the audio element via a separate `useEffect` watching `[volume, muted]`.

### `useNowPlaying.ts`

**Purpose:** Polls the `/api/nowplaying` route and exposes current track metadata.

**Returns:** `{ data: NowPlayingData, loading: boolean, error: string | null, refetch: () => void }`

**`NowPlayingData` interface:**
```ts
{
  artist:    string;
  title:     string;
  album:     string;
  duration:  string;
  coverUrl:  string | null;
  listeners: number;
  isLive:    boolean;
  recent:    { title: string; trackartist: string; tracktitle: string; started: string }[];
}
```

**FALLBACK constant:**
```ts
{ artist: "Radio Dandana", title: "راديو دندنة", album: "", duration: "",
  coverUrl: null, listeners: 0, isLive: true, recent: [] }
```

**Key implementation details:**
- `fetchNow` is wrapped in `useCallback` with empty deps so the `useEffect` interval only registers once.
- On fetch error, logs a warning and sets `error = "metadata_unavailable"` — does **not** overwrite `data` with fallback, so the last known track remains visible.
- `timerRef` holds the interval ID for cleanup on unmount.

### `useLang` (from `lib/lang.tsx`)

**Purpose:** Provides language state and translations to the component tree.

**Returns:** `{ lang: "ar" | "en", dir: "rtl" | "ltr", toggleLang: () => void, t: (key: string) => string }`

**Key details:** Documented fully in §6.

---

## 6. LANGUAGE & RTL SYSTEM

### `LangProvider`

- Wraps the entire app in `page.tsx`.
- Default language: `"ar"` (Arabic).
- On every `lang` change, updates `document.documentElement.dir` and `document.documentElement.lang` via `useEffect` — this makes the browser reflow RTL/LTR for the whole page.
- `t(key)` returns the translation string for the current language; falls back to the key itself if missing.

### Direction switching

- `dir` value exposed from context: `"rtl"` when `lang === "ar"`, `"ltr"` when `lang === "en"`.
- Navbar, HeroSection, AboutSection, ScheduleSection, ContactSection, Footer all apply `dir={dir}` from context.
- RadioPlayer applies `dir="ltr"` statically (see §8).
- Individual Arabic text spans use `dir="auto"` so the browser detects direction from character content.

### Translation keys

| Key | Arabic | English |
|-----|--------|---------|
| `nav.home` | الرئيسية | Home |
| `nav.about` | عن الراديو | About |
| `nav.schedule` | البرامج | Schedule |
| `nav.contact` | تواصل معنا | Contact |
| `nav.listen` | استمع الآن | Listen Now |
| `hero.tagline` | دندنها | Dandenha |
| `hero.subtitle` | للموسيقى مساحة ،،، وللكلمة معنى | Authentic Arabic music — live 24 hours a day |
| `hero.cta` | استمع الآن | Listen Now |
| `hero.cta2` | البرامج | Explore Schedule |
| `player.live` | بث مباشر | LIVE |
| `player.now` | على الهواء الآن | Now Playing |
| `player.volume` | مستوى الصوت | Volume |
| `player.loading` | جاري التحميل... | Connecting... |
| `player.error` | تعذّر الاتصال بالبث | Stream unavailable |
| `player.retry` | إعادة المحاولة | Retry |
| `player.listeners` | مستمع | listeners |
| `about.title` | عن راديو دندنة | About Radio Dandana |
| `about.body` | *(full paragraph)* | *(full paragraph)* |
| `schedule.title` | البرامج  | Programme Schedule |
| `schedule.morning` | صباح دندنة | Dandana Morning |
| `schedule.noon` | نغمات الظهيرة | Midday Melodies |
| `schedule.evening` | أمسية طرب | Evening Tarab |
| `schedule.night` | ليالي الأصالة | Nights of Authenticity |
| `schedule.time.m` | ٦:٠٠ — ١٢:٠٠ | 06:00 — 12:00 |
| `schedule.time.n` | ١٢:٠٠ — ١٨:٠٠ | 12:00 — 18:00 |
| `schedule.time.e` | ١٨:٠٠ — ٢٢:٠٠ | 18:00 — 22:00 |
| `schedule.time.x` | ٢٢:٠٠ — ٦:٠٠ | 22:00 — 06:00 |
| `contact.title` | تواصل معنا | Get in Touch |
| `contact.name` | الاسم | Your Name |
| `contact.email` | البريد الإلكتروني | Email Address |
| `contact.message` | رسالتك | Your Message |
| `contact.send` | أرسل | Send |
| `footer.rights` | جميع الحقوق محفوظة | All rights reserved |
| `footer.tagline` | دندنها | A melody that unites us |

---

## 7. DESIGN SYSTEM

### CSS Custom Properties (`globals.css`)

```css
--gold-deep:    #8B6914   /* dark gold — used for gradients, borders */
--gold-mid:     #C9A96E   /* mid gold — primary accent colour */
--gold-light:   #E8D5A3   /* light gold — track title text */
--gold-shimmer: #F5ECD0   /* near-white gold — shimmer animation highlight */
--black-void:   #080808   /* deepest background */
--black-deep:   #0D0D0D   /* slightly lighter background */
--black-card:   #131313   /* card/surface background */
--black-glass:  rgba(13,13,13,0.8)  /* glass card fill */
--text-primary: #F0E6CC   /* main body text */
--text-muted:   #8A7A5A   /* secondary/label text */
--text-subtle:  #3A3020   /* de-emphasised text and range track fill */
```

**Tailwind colour tokens** (mirroring the CSS vars, available as `text-gold-mid`, `bg-black-void`, etc.):

| Token | Value |
|-------|-------|
| `gold.deep` | #8B6914 |
| `gold.mid` | #C9A96E |
| `gold.light` | #E8D5A3 |
| `gold.shimmer` | #F5ECD0 |
| `black.void` | #080808 |
| `black.deep` | #0D0D0D |
| `black.card` | #131313 |
| `black.panel` | #1A1A14 |
| `cream.primary` | #F0E6CC |
| `cream.muted` | #8A7A5A |
| `cream.subtle` | #3A3020 |

### Font families

- **Cairo** — weights 300/400/500/600/700 — primary Arabic and UI font
- **IBM Plex Sans Arabic** — weights 300/400/500 — secondary Arabic font
- Both loaded from Google Fonts via `<link>` in `layout.tsx` and also imported at the top of `globals.css`.
- Tailwind `fontFamily.arabic` and `fontFamily.DEFAULT` both resolve to `["Cairo", "IBM Plex Sans Arabic", "sans-serif"]`.

### Animations

| Name | Defined in | What it does |
|------|-----------|--------------|
| `shimmer` | `globals.css` | Moves a gold gradient horizontally over text using `background-position`; used on `.shimmer-text` |
| `pulse-ring` | `globals.css` | Scales a circle from 0.85× to 2.4× and fades out; used on `.pulse-ring` for the LIVE dot |
| `bar-dance` | `globals.css` | Scales a bar from 0.12 to 1 (scaleY) and back; used by `.vis-bar` on the Visualizer bars |
| `marquee` | `globals.css` | Translates `.marquee-inner` by −50% over 20 s; used for long track titles |
| `noteFloat` | `HeroSection.tsx` (inline `<style>`) | Floats music note spans upward 110 vh with random horizontal drift and fade |
| `logoGlow` | `HeroSection.tsx` (inline `<style>`) | Alternates between two `drop-shadow` filter intensities over 3 s |
| `waveBar` | `RadioPlayer.tsx` (inline `<style>`) | 4-stop scaleY keyframe (0.12 → 0.65 → 0.35 → 0.85 → 1.0) for the WaveformAnimation bars |
| `fadeUp` | `tailwind.config.ts` | Fades in and translates up 24 px; used on hero text via `animate-fade-up` |
| `fadeIn` | `tailwind.config.ts` | Simple opacity 0→1; used via `animate-fade-in` |
| `spin` (Tailwind built-in) | — | Used as `animate-spin-slow` (8 s) on the conic-gradient overlay over the album art |
| `pulse` (Tailwind built-in) | — | Used as `animate-pulse` on the Radio icon during loading state |

### Utility classes

| Class | Definition |
|-------|-----------|
| `.glass-card` | `background: var(--black-glass)`, `backdrop-filter: blur(28px)`, `border: 1px solid rgba(201,169,110,0.13)` |
| `.text-gold` | `color: var(--gold-mid)` |
| `.shimmer-text` | Gold shimmer gradient clipped to text, animated via `shimmer` keyframe |
| `.divider-gold` | 1 px tall `<div>` with a transparent → gold → transparent horizontal gradient |
| `.pulse-ring` | `animation: pulse-ring 2s ease-out infinite` |
| `.vis-bar` | `transform-origin: bottom; animation: bar-dance linear infinite` |
| `.marquee-track` | `overflow: hidden` |
| `.marquee-inner` | `display: inline-block; animation: marquee 20s linear infinite; white-space: nowrap` — pauses on hover |
| `.font-arabic` | Tailwind custom: `font-family: Cairo, IBM Plex Sans Arabic, sans-serif` |

### Global rules

- `body::before` — a fixed full-viewport SVG fractal noise texture (`opacity: 0.55`) sits at `z-index: 9999` as a film-grain effect. Pointer events are none.
- `html` — `scroll-behavior: smooth`.
- `section` — `padding-inline: clamp(1.25rem, 5vw, 3rem)` applied globally.
- `input[type="range"]` — fully custom-styled: 3 px track, 13 px gold thumb with glow on hover.
- `::-webkit-scrollbar` — 4 px, `--gold-deep` thumb.

---

## 8. KNOWN BEHAVIOURS & DECISIONS

**Why `RadioPlayer` has `dir="ltr"` even in Arabic mode:**  
The player layout (album art on the left, controls row left-to-right) must not flip in RTL mode — the volume slider fill direction, icon order, and control alignment all assume LTR flow. Individual Arabic text spans inside the player use `dir="auto"` so Arabic track names still render right-to-left within their own inline context.

**Why the audio `src` gets a `?t=<timestamp>` on every play:**  
Browsers cache HTTP audio streams aggressively. Appending a fresh timestamp query parameter forces a new network request and prevents the browser from resuming a stale or disconnected buffer from a previous session.

**Why `stoppingRef` exists in `usePlayer`:**  
Clearing `audio.src` and calling `audio.load()` (which `stop()` does) fires the audio element's `"error"` event internally. Without the ref guard, `stop()` would immediately set state to `"error"`, causing the button to briefly show the retry icon. The ref allows the error handler to distinguish intentional stops from genuine stream errors.

**Why `unoptimized` is on the hero logo image:**  
`/dandana2.png` is a large transparent PNG (800 × 430). Next.js Image optimisation converts PNGs to WebP/AVIF and may strip or alter the transparency. `unoptimized` bypasses that pipeline to preserve the full-quality transparent artwork.

**Why the playlist API was removed:**  
An earlier version used `Promise.all` to also fetch `/api/getplaylist/1019` and parse upcoming tracks from it to populate an "Up Next" field. The Up Next field was subsequently removed from the UI entirely, making the playlist fetch unnecessary. The route was reverted to a single `/api/info` fetch.

**Why `np.coverUrl` is whitelisted in `next.config.ts`:**  
The RadioBoss API returns album art hosted on `c34.radioboss.fm`. Next.js Image with `fill` or `src` from an external domain requires that domain to be listed under `images.remotePatterns`, otherwise the `<Image>` component throws a runtime error.

**Why `useNowPlaying` does not overwrite data on error:**  
On a failed poll, only `error` state is set — `data` keeps its last known value. This means the player continues to show the last known track name rather than resetting to the fallback, which is better UX when the metadata endpoint has a transient hiccup.

**Why the contact form does not actually submit:**  
`ContactSection.handleSubmit` calls `e.preventDefault()` and sets a local `sent` state for 4 seconds. No form action, fetch call, or third-party service is wired. The submission logic is explicitly marked as a placeholder.

**Grain texture layer (`body::before`):**  
The SVG noise pattern sits at `z-index: 9999` (above all content) with `pointer-events: none` — it is purely decorative and does not intercept any interaction.

---

## 9. ENVIRONMENT VARIABLES

No `.env` file is present and no `process.env` references appear anywhere in the codebase. All configuration values (API key, station ID, stream URL, base URL) are hardcoded as constants in `usePlayer.ts` and `app/api/nowplaying/route.ts`.

---

## 10. SCRIPTS

All four scripts exist in `package.json`:

| Script | Command | Purpose |
|--------|---------|---------|
| `npm run dev` | `next dev` | Start development server with Turbopack hot reload |
| `npm run build` | `next build` | Production build with TypeScript type-checking |
| `npm run start` | `next start` | Serve the production `.next` build locally |
| `npm run lint` | `eslint` | Run ESLint across the project |
