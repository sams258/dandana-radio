# Dandana Radio — Project Context

> Generated from the actual codebase. Contains only what is implemented, not what was discussed.

---

## 1. PROJECT OVERVIEW

**Name:** Radio Dandana / راديو دندنة  
**Purpose:** Bilingual (Arabic/English) live radio streaming website + news system for an Arabic music station.  
**Audience:** Arabic-speaking listeners; site defaults to Arabic, with a one-click toggle to English.  
**Language:** TypeScript (strict mode)  
**Framework:** Next.js 16.2.6 (App Router, Turbopack)  
**CMS:** Payload CMS 3.84.1 (embedded in the same Next.js app)  
**Database:** PostgreSQL via `@payloadcms/db-postgres`  
**Styling:** Tailwind CSS v4 + inline styles + CSS custom properties  
**Deployment:** Vercel, region `fra1` (Frankfurt)

**Key dependencies:**

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.2.6 | Framework |
| `react` / `react-dom` | 19.2.4 | UI |
| `payload` | ^3.84.1 | Headless CMS |
| `@payloadcms/db-postgres` | ^3.84.1 | DB adapter |
| `@payloadcms/richtext-lexical` | ^3.84.1 | Lexical editor + renderer |
| `@payloadcms/storage-s3` | ^3.84.1 | Cloudflare R2 media storage |
| `@payloadcms/plugin-seo` | ^3.84.1 | Installed, not yet wired to config |
| `@payloadcms/plugin-nested-docs` | ^3.84.1 | Installed, not yet wired to config |
| `sharp` | ^0.34.5 | Image processing |
| `lucide-react` | ^1.16.0 | Icons |
| `framer-motion` | ^12.38.0 | Installed, not yet used |

---

## 2. PROJECT STRUCTURE

```
dandana-radio/
├── app/
│   ├── (payload)/                        # Payload CMS routes (route group, no URL prefix)
│   │   ├── admin/
│   │   │   ├── [[...segments]]/
│   │   │   │   ├── page.tsx              # Payload admin panel catch-all
│   │   │   │   └── not-found.tsx
│   │   │   ├── importMap.ts              # Manual import map for Payload client components
│   │   │   └── importMap.js              # Auto-generated JS version (do not edit)
│   │   ├── api/[...slug]/route.ts        # Payload REST + GraphQL API catch-all
│   │   └── layout.tsx                    # Payload admin shell (RootLayout, server functions)
│   │
│   ├── (site)/                           # Public-facing site (route group, no URL prefix)
│   │   ├── layout.tsx                    # Site layout: metadata, Google Fonts, html/body
│   │   ├── page.tsx                      # Radio home page (/, untouched)
│   │   ├── lib/
│   │   │   ├── payload.ts                # Data access layer: all Payload queries + inline types
│   │   │   └── splitBodyForAd.ts         # Splits Lexical body at first paragraph for ad injection
│   │   ├── components/
│   │   │   └── news/
│   │   │       ├── ArticleCard.tsx        # Article card (client component)
│   │   │       ├── GalleryBlock.tsx       # Image gallery with thumbnail strip (client component)
│   │   │       ├── NewsNav.tsx            # Sticky news nav with categories + lang toggle (client)
│   │   │       └── RichTextRenderer.tsx   # Lexical JSON → React renderer (client component)
│   │   ├── news/                          # Arabic news pages (no /ar/ prefix)
│   │   │   ├── page.tsx                   # /news — news home
│   │   │   ├── [slug]/page.tsx            # /news/[slug] — article page
│   │   │   └── category/[slug]/page.tsx   # /news/category/[slug] — category listing
│   │   └── en/
│   │       └── news/                      # English news pages
│   │           ├── page.tsx               # /en/news — news home
│   │           ├── [slug]/page.tsx         # /en/news/[slug] — article page
│   │           └── category/[slug]/page.tsx # /en/news/category/[slug] — category listing
│   │
│   ├── api/
│   │   └── nowplaying/route.ts            # RadioBoss metadata proxy (live stream)
│   ├── components/                        # Radio site components (untouched)
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── Navbar.tsx
│   │   ├── RadioPlayer.tsx
│   │   ├── Sections.tsx
│   │   └── Visualizer.tsx
│   ├── hooks/
│   │   ├── useNowPlaying.ts
│   │   └── usePlayer.ts
│   ├── lib/
│   │   └── lang.tsx
│   ├── globals.css
│   ├── layout.tsx                         # Root layout (unused — site uses (site)/layout.tsx)
│   └── favicon.ico
│
├── payload/
│   └── collections/
│       ├── Users.ts
│       ├── Media.ts
│       ├── Pages.ts
│       ├── Translations.ts
│       ├── Articles.ts
│       ├── Categories.ts
│       └── Tags.ts
│
├── payload.config.ts                      # Payload config: DB, localization, collections, S3 plugin
├── next.config.ts                         # withPayload wrapper + image remote patterns
├── tailwind.config.ts
├── tsconfig.json                          # strict: true, path alias @/*
├── vercel.json                            # fra1 region, security headers, no-store on /api/*
└── package.json
```

---

## 3. ROUTING & LANGUAGE STRATEGY

| Route | Language | Renders |
|-------|----------|---------|
| `/` | Arabic (default) | Radio home page |
| `/news` | Arabic | News home |
| `/news/[slug]` | Arabic | Article |
| `/news/category/[slug]` | Arabic | Category listing |
| `/en/news` | English | News home |
| `/en/news/[slug]` | English | Article |
| `/en/news/category/[slug]` | English | Category listing |
| `/admin/[[...segments]]` | — | Payload CMS admin |
| `/api/[...slug]` | — | Payload REST/GraphQL API |
| `/api/nowplaying` | — | RadioBoss proxy |

**Rules:**
- Arabic is the default — no `/ar/` prefix ever.
- English uses `/en/` prefix.
- All article slugs are English-only clean strings (no Arabic characters in URLs).
- The radio home page at `/` is completely separate from news and must never be touched.

---

## 4. PAYLOAD CMS

### Configuration (`payload.config.ts`)

```ts
localization: {
  locales: [{ label: "العربية", code: "ar" }, { label: "English", code: "en" }],
  defaultLocale: "ar",
  fallback: true,
}
```

**Collections registered:** Users, Pages, Translations, Media, Articles, Categories, Tags, Advertisers, AdPlacements, Ads

**Plugin:** `s3Storage` wired to the `media` collection. Requires these env vars (all currently `MISSING` in dev):

| Env var | Purpose |
|---------|---------|
| `R2_BUCKET_NAME` | Cloudflare R2 bucket |
| `R2_ENDPOINT` | R2 endpoint URL |
| `R2_ACCESS_KEY_ID` | R2 credentials |
| `R2_SECRET_ACCESS_KEY` | R2 credentials |
| `R2_PUBLIC_URL` | Public URL for served files |

**Other required env vars:**

| Env var | Purpose |
|---------|---------|
| `PAYLOAD_SECRET` | JWT signing secret |
| `POSTGRES_URL` | PostgreSQL connection string |
| `ALLOWED_EMAILS` | Comma-separated list of emails allowed to create users |

**Note:** `payload-types.ts` is not generated (running `npx payload generate:types` fails on Node 20 due to undici/CacheStorage incompatibility). The news frontend uses manually-written inline interfaces in `app/(site)/lib/payload.ts` instead.

### Admin Import Map (`app/(payload)/admin/importMap.ts`)

Manually maintained — Payload cannot auto-generate this in this setup:

```ts
"@payloadcms/next/rsc#CollectionCards"
"@payloadcms/storage-s3/client#S3ClientUploadHandler"
"@payloadcms/richtext-lexical/rsc#RscEntryLexicalCell"    // NOT RichTextCell
"@payloadcms/richtext-lexical/rsc#RscEntryLexicalField"   // NOT RichTextField
"@payloadcms/richtext-lexical/client#BlocksFeatureClient"
```

**Important:** `@payloadcms/richtext-lexical` v3.84.x exports `RscEntryLexicalCell` / `RscEntryLexicalField` from `/rsc`, not `RichTextCell` / `RichTextField` (the names that appear in older docs).

---

## 5. PAYLOAD COLLECTIONS

### Users (`payload/collections/Users.ts`)
- `auth: true` — handles login
- `useAsTitle: "name"` (not email)
- `ALLOWED_EMAILS` env var gates user creation
- **5 roles** (role field only editable by `super-admin`):

| Role | Value |
|------|-------|
| Super Admin | `super-admin` |
| Admin | `admin` |
| Editor | `editor` |
| Journalist | `journalist` |
| Contributor | `contributor` |

- Fields: `name` (required), `role` (required, default `contributor`), `bio` (localized textarea), `avatar` (upload → media)
- Access: super-admin/admin can read all users; others can only read themselves. Only super-admin can delete. Only super-admin can change roles.

### Media (`payload/collections/Media.ts`)
- Stored on Cloudflare R2 via `s3Storage` plugin (no local `staticDir`)
- Image sizes: `thumbnail` (300×300), `hero` (1200×630), `logo` (400×400)
- MIME types: `image/*`, `audio/*`, `video/*`
- Fields: `alt` (localized), `caption` (localized), `usage` (select: logo/hero/article/audio/video/general)
- Access: public read; any logged-in user can upload/update; only super-admin/admin can delete

### Pages (`payload/collections/Pages.ts`)
- Manages radio site page structure (hero, player, about, schedule, contact sections as blocks)
- Currently admin-only; not yet wired to the front-end (radio page uses hardcoded components)
- Fields: `title` (localized), `slug`, `sections` (blocks), `seo` group

### Translations (`payload/collections/Translations.ts`)
- Key-value store for all UI strings (nav, hero, player, about, schedule, contact, footer)
- Fields: `key` (unique), `section` (select), `arabic` (textarea), `english` (textarea), `notes`
- Currently admin-only; not yet wired to front-end (radio page uses `lang.tsx` hardcoded strings)

### Categories (`payload/collections/Categories.ts`)
- Group: News
- Fields: `name` (localized, required), `slug` (unique, required), `description` (localized), `parent` (self-relation), `color` (hex string for badge)
- Access: public read; editor+ can create/update; admin+ can delete
- **4 categories pre-seeded in DB:** `music-news`, `artists`, `radio-programs`, `events`

### Tags (`payload/collections/Tags.ts`)
- Group: News
- Fields: `name` (localized, required), `slug` (unique, required)
- Access: public read; any logged-in user can create; editor+ can update; admin+ can delete

### Articles (`payload/collections/Articles.ts`)
- Group: News
- Versioning: drafts with autosave every 2 s, max 20 versions per doc
- **Tabs:** Content, Taxonomy, Publishing, SEO

**Content tab fields:**
- `title` (localized, required)
- `slug` (unique; auto-generated from `title.en` or `title.ar` via `beforeValidate` hook if blank)
- `excerpt` (localized textarea, required)
- `featuredImage` (upload → media, required)
- `body` (Lexical richText, localized, required) — see Lexical config below

**Taxonomy tab fields:**
- `category` → categories (required)
- `tags` → tags (hasMany)
- `author` → users (required; auto-set to current user via `beforeChange` hook if blank)

**Publishing tab fields:**
- `status` (select, default `draft`): draft / review / approved / published / rejected / archived
  - journalists/contributors can only set draft or review
- `publishedAt` (date with time picker; auto-set on publish if blank)
- `featured` (checkbox) — surfaces article in news home hero grid
- `rejectionNotes` (textarea, only visible when status = rejected)

**SEO tab fields:** `metaTitle` (localized), `metaDescription` (localized), `ogImage` (upload → media)

**Access:**
- Public: only `status = published` articles
- Logged-in: all articles
- Update: editors+ can update anything; journalists/contributors can only update their own
- Delete: admin+ only

**Lexical body editor features:** headings (h2/h3/h4), blockquote, link, upload, and 5 custom blocks:

| Block slug | Fields |
|-----------|--------|
| `audioEmbed` | `audio` (upload), `title` (localized), `description` (localized) |
| `videoEmbed` | `url` (YouTube/Vimeo/MP4), `caption` (localized) |
| `imageGallery` | `images` array: `image` (upload) + `caption` (localized), minRows: 2 |
| `pullQuote` | `quote` (localized textarea, required), `attribution` (localized) |
| `infoBox` | `title` (localized), `body` (localized textarea, required), `variant` (info/warning/success) |

---

## 6. NEWS FRONTEND (Phase 2B)

### Data Access Layer (`app/(site)/lib/payload.ts`)

All Payload queries go through this module. Uses `getPayload({ config: configPromise })` — instance is created per-call (Next.js caches at the request level). Types are hand-written interfaces (no generated `payload-types.ts`):

```ts
export interface Article { id, title, slug, excerpt, featuredImage, body,
  category, tags, author, status, publishedAt, featured, metaTitle, metaDescription, ogImage }
export interface Category { id, name, slug, description, color, parent }
export interface Media { id, url, filename, alt, sizes: { thumbnail, hero, logo } }
export interface User { id, name, email, role }
export interface Tag { id, name, slug }
```

**Exported functions:**

| Function | Purpose |
|----------|---------|
| `getArticles({ page, category, locale })` | Paginated published articles (12/page) |
| `getArticleBySlug(slug, locale)` | Single published article by slug |
| `getFeaturedArticles(locale)` | Up to 5 featured published articles |
| `getCategoryBySlug(slug, locale)` | Single category by slug |
| `getAllCategories(locale)` | All categories (up to 100, sorted by name) |
| `getAllArticleSlugs()` | All published article slugs (for `generateStaticParams`) |
| `getAllCategorySlugs()` | All category slugs (for `generateStaticParams`) |

All functions accept `locale: "ar" | "en"` (default `"ar"`). Localized fields are returned as resolved strings when a locale is specified.

### Components

**`ArticleCard.tsx`** (`"use client"`)
- Props: `article: Article`, `locale`, `featured?: boolean`
- `featured` cards get `col-span-2 row-span-2`, taller image (340px vs 200px), more clamp lines
- Category badge positioned top-right (AR) or top-left (EN) over the image
- Uses `dir={locale === "ar" ? "rtl" : "ltr"}` on the `<Link>` wrapper
- Date formatted with `ar-LB` or `en-GB` locale

**`NewsNav.tsx`** (`"use client"`)
- Props: `locale`, `categories[]`, `activeCategory?: string`
- Sticky, `z-index: 40`, `rgba(8,8,8,0.92)` + blur backdrop
- Logo links back to `/` (radio site); divider; "الأخبار"/"News" link; category links; spacer; language toggle pill
- Active category/news-home link styled gold, others muted
- Language toggle: AR→`/en/news`, EN→`/news`

**`RichTextRenderer.tsx`** (`"use client"`)
- Accepts `content: Record<string, unknown>` (the Lexical JSON `body` field)
- Walks `content.root.children` recursively via `renderNode()`
- Handles node types: `text` (with format bitmask bold/italic/underline/strikethrough), `paragraph`, `heading` (h2/h3/h4), `quote`, `list`, `listitem`, `link`, `block`
- Dispatches blocks by `fields.blockType` to: `AudioBlock`, `VideoBlock`, `GalleryBlock`, `PullQuoteBlock`, `InfoBoxBlock`
- `GalleryBlock` has interactive thumbnail strip (local `useState` for active index)
- `VideoBlock` rewrites YouTube watch URLs to embed URLs

### Pages

All news pages share this pattern:
- `export const revalidate = 60` — ISR, 1-minute TTL
- `generateStaticParams()` for `[slug]` routes — pre-renders known slugs at build time
- `generateMetadata()` with `alternates.languages` for `ar`↔`en` hreflang
- Data fetched with `Promise.all()` for categories + main content in parallel
- `if (!article) notFound()` guard for 404

| Page | Route | Rendering |
|------|-------|-----------|
| `(site)/news/page.tsx` | `/news` | Dynamic (uses `searchParams`) |
| `(site)/news/[slug]/page.tsx` | `/news/[slug]` | SSG + ISR |
| `(site)/news/category/[slug]/page.tsx` | `/news/category/[slug]` | SSG + ISR |
| `(site)/en/news/page.tsx` | `/en/news` | Dynamic |
| `(site)/en/news/[slug]/page.tsx` | `/en/news/[slug]` | SSG + ISR |
| `(site)/en/news/category/[slug]/page.tsx` | `/en/news/category/[slug]` | SSG + ISR |

News home layout: featured 2-col magazine grid (first article spans 2 cols) → gold divider → "آخر الأخبار"/"Latest News" heading → `auto-fill minmax(280px,1fr)` grid → pagination (circular Link buttons, gold gradient for active page).

Article page layout: `dir="rtl"` (AR) / `dir="ltr"` (EN) → category badge + date → h1 title → excerpt → author avatar (initial letter in gold circle) → featured hero image → `RichTextRenderer` body → back link.

---

## 7. ADVERTISING SYSTEM (Phase 1 Ads — complete, commit `4950488`)

### Constants (`payload/constants/ads.ts`)

Zero magic strings — all enum values exported as typed `as const` arrays:

| Constant | Values |
|----------|--------|
| `AD_TYPES` | image, video, audio, text, embed |
| `AD_STATUSES` | draft, active, paused, archived |
| `AD_LOCALES` | ar, en, both |
| `AD_LABEL_TYPES` | ad, sponsored, advertisement, custom |
| `PAGE_SCOPES` | global, homepage, news_home, news_article, news_category |
| `DEFAULT_SIZES` | leaderboard, mobile_leaderboard, rectangle, large_rectangle, halfpage, square, billboard, skyscraper, custom |
| `ALLOWED_AD_EMBED_HOSTS` | securepubads.g.doubleclick.net, pagead2.googlesyndication.com |
| `MOBILE_BREAKPOINT` | 768 |
| `AD_LABEL_MAP` | Maps label type → `{ ar, en }` display strings |

### Collections

**Advertisers** (`payload/collections/Advertisers.ts`)
- Slug: `advertisers`, group: Advertising
- Fields: `name`, `slug` (auto-generated), `status`, `websiteUrl` (https:// validated), `contactName`, `contactEmail`, `logo` (media), `notes`, `createdBy`/`updatedBy` (sidebar, readOnly)
- Access: create/update admin+; read editor+; delete super-admin

**AdPlacements** (`payload/collections/AdPlacements.ts`)
- Slug: `ad-placements`, group: Advertising
- Fields: `name`, `key` (unique, `/^[a-z0-9_]+$/` validated), `description`, `allowedTypes` (multi-select), `defaultSize`, `width`/`height` (shown only when custom), `pageScope`, `maxAds` (1–10), `hideWhenEmpty`, `fallbackAd` (→ ads), `enabled`, `createdBy`/`updatedBy`
- Access: create/update admin+; read editor+; delete super-admin
- Note: `key` not truly readOnly after create (Payload v3 `admin.readOnly` is static only)

**Ads** (`payload/collections/Ads.ts`)
- Slug: `ads`, group: Advertising
- Always-visible fields: `title`, `advertiser`, `type`, `status`, `locale`, `labelType`, `customLabelAr`/`En`, `clickUrl`, `openInNewTab`, `requiresConsent`
- Conditional fields (by `type`): `media`, `mobileSrc`, `alt` (localized), `textContent` (localized), `embedProvider`, `embedUrl`
- Scheduling: `startDate`, `endDate`
- Audit sidebar: `createdBy`, `updatedBy`, `pausedAt`, `pausedBy`
- `beforeChange` hook handles: audit fields, computed defaults on create, paused status transitions (sets/clears `pausedAt`+`pausedBy`), alt text validation
- `embedUrl` field-level `validate` checks hostname against `ALLOWED_AD_EMBED_HOSTS`
- Access: create/update admin+; read editor+; delete super-admin

### Shared Block (`payload/blocks/AdBlock.ts`)

- Slug: `adBlock`, registered in both Articles (Lexical `BlocksFeature`) and Pages (sections)
- Fields: `placement` (→ ad-placements), `showLabel` (checkbox), `labelOverride` (localized)
- Note: `RichTextRenderer` does not yet render `adBlock` nodes — to be added in Phase 2A ads

### Data Access Layer (`app/(site)/lib/ads.ts`)

Same pattern as `lib/payload.ts`. All queries use `overrideAccess: true` (ads collection is not publicly readable; server-side code applies its own constraints).

**Exported types:** `Advertiser`, `Ad`, `AdPlacement`

**Exported functions:**

| Function | Purpose |
|----------|---------|
| `getAdsForPlacement({ key, locale, limit? })` | Finds placement by key, queries active ads filtered by locale, date window, allowedTypes. Returns `{ placement, ads }` or null |
| `getPlacementByKey(key)` | Simple placement lookup by key |
| `recordEligibility(adId, placementKey, locale)` | **No-op in Phase 1.** Phase 2 hook point — will write to AdEvents table |
| `validateEmbedUrl(url)` | Returns true if URL hostname is in `ALLOWED_AD_EMBED_HOSTS` |

`getAdsForPlacement` locale filtering: `ar` → `["ar","both"]`, `en` → `["en","both"]`. Date window uses `exists: false OR less_than_equal/greater_than_equal`.

### Components (`app/(site)/components/ads/`)

| Component | Type | Notes |
|-----------|------|-------|
| `AdWrapper.tsx` | server-safe | Renders `<div>` with 5 `data-*` attributes for Phase 2 IntersectionObserver |
| `AdLabel.tsx` | server-safe | Reads `AD_LABEL_MAP`, renders locale-aware label above ad |
| `AdSlot.tsx` | **server component** | Fetches via `getAdsForPlacement`, handles fallback + hideWhenEmpty, delegates to `AdRenderer` |
| `AdRenderer.tsx` | `"use client"` | Random selection from eligible set via `useState` initializer; switches on `ad.type` |
| `ImageAd.tsx` | client | Next.js `Image`, desktop/mobile src swap at `MOBILE_BREAKPOINT` via CSS class |
| `TextAd.tsx` | client | Styled `Link` with text content |
| `VideoAd.tsx` | client | `<video controls muted playsInline preload="metadata">` — no autoplay |
| `AudioAd.tsx` | `"use client"` | Play button; `useRef<HTMLAudioElement>` for playback; `isRadioPlaying` prop for aria label |
| `EmbedAd.tsx` | client | Validates URL client-side (duplicated logic — see known issues); sandboxed iframe without `allow-same-origin` |

Click flow: all ad clicks go through `/api/ads/click/[id]` — never expose `clickUrl` directly in client HTML.

**Modified files (dimension fix, commit `6185529`):**
- `app/(site)/components/ads/AdSlot.tsx` — passes placement object to `AdRenderer`
- `app/(site)/components/ads/AdRenderer.tsx` — extracts and forwards dimension props (`defaultSize`, `placementWidth`, `placementHeight`) to `ImageAd` and `TextAd`
- `app/(site)/components/ads/ImageAd.tsx` — resolves and enforces placement dimensions; leaderboard `objectFit: contain`, others `cover`; falls back to unconstrained for custom size with no explicit w/h
- `app/(site)/components/ads/TextAd.tsx` — enforces `maxWidth` from placement width

### Click Route (`app/api/ads/click/[id]/route.ts`)

GET handler. Validates: ad exists → status active → date window → clickUrl starts with `https://` → redirect 302. Returns 404/403/400 for invalid cases. Phase 2 adds click event logging before redirect.

### Seeded Placements

| key | description | size | page scope |
|-----|-------------|------|------------|
| `news_article_after_intro` | After first paragraph in article pages | rectangle (300×250) | news_article |
| `news_home_top` | Top of news listing, above featured | leaderboard (728×90) | news_home |

Seed runs via `payload.config.ts` `onInit` hook — idempotent, silently skips if tables not yet migrated.

---

## 8. RADIO SITE (Phase 0 — Untouched)

The radio home page at `/` lives in `app/(site)/page.tsx` and uses components in `app/components/`. These files are **never modified** during news system work.

### Stream & API

- **Live stream:** `https://c34.radioboss.fm:9019/stream` (timestamp param appended on every play)
- **RadioBoss API:** `https://c34.radioboss.fm/api/info/1019?key=38D1T98921NV`
- **Poll interval:** 15 000 ms

### Components (all in `app/components/`)

| Component | Key behaviour |
|-----------|--------------|
| `Navbar.tsx` | Fixed, scrolled background after 40px, language toggle, mobile hamburger |
| `HeroSection.tsx` | Animated logo glow, floating music notes (up to 35, interval 600ms), shimmer tagline |
| `RadioPlayer.tsx` | Album art, track marquee (>30 chars), waveform (12 bars), visualizer, play/stop/mute/volume. `dir="ltr"` always. Media Session API wired. |
| `Visualizer.tsx` | 32 randomised bars, `useEffect` mount guard (SSR safety) |
| `Sections.tsx` | `AboutSection`, `ScheduleSection` (4 schedule cards), `ContactSection` (fake submit, 4s sent state) |
| `Footer.tsx` | Logo, tagline, `© {year}` |

### Hooks

| Hook | Returns |
|------|---------|
| `usePlayer` | `state` (idle/loading/playing/error), `volume`, `muted`, `togglePlay`, `toggleMute`, `handleVolumeChange`, `play`, `stop`, `isPlaying`, `isLoading`, `isError` |
| `useNowPlaying` | `data: NowPlayingData`, `loading`, `error`, `refetch` — polls every 15s; does not overwrite data on error |
| `useLang` | `lang`, `dir`, `toggleLang`, `t(key)` — updates `document.documentElement.dir/lang` on change |

### Language System (`app/lib/lang.tsx`)

- `LangProvider` wraps the entire radio page in `app/(site)/page.tsx`
- Default: `"ar"` (RTL). Toggle switches to `"en"` (LTR).
- `t(key)` returns from a hardcoded bilingual string map (not from Payload Translations collection — those are wired separately for the CMS)
- All radio components apply `dir={dir}` except `RadioPlayer` which is always `dir="ltr"`

---

## 9. DESIGN SYSTEM

### CSS Custom Properties (`app/globals.css`)

```css
--gold-deep:    #8B6914
--gold-mid:     #C9A96E   /* primary accent */
--gold-light:   #E8D5A3
--gold-shimmer: #F5ECD0
--black-void:   #080808   /* deepest background */
--black-deep:   #0D0D0D
--black-card:   #131313
--black-glass:  rgba(13,13,13,0.8)
--text-primary: #F0E6CC
--text-muted:   #8A7A5A
--text-subtle:  #3A3020
```

### Fonts

- **Cairo** 300/400/500/600/700 — primary (Arabic + UI)
- **IBM Plex Sans Arabic** 300/400/500 — secondary
- Loaded from Google Fonts in `app/(site)/layout.tsx`

### Key Utility Classes

| Class | Definition |
|-------|-----------|
| `.glass-card` | `background: var(--black-glass)`, `backdrop-filter: blur(28px)`, gold border at 13% opacity |
| `.text-gold` | `color: var(--gold-mid)` |
| `.shimmer-text` | Gold shimmer gradient, animated |
| `.divider-gold` | 1px transparent→gold→transparent horizontal gradient |
| `.pulse-ring` | Scales 0.85×→2.4×, fades out — used on LIVE dot |
| `.vis-bar` | `transform-origin: bottom; animation: bar-dance` |
| `.marquee-inner` | `animation: marquee 20s linear infinite; white-space: nowrap` — pauses on hover |

---

## 10. BUILD & DEPLOYMENT

**Build:** `npm run build` — zero TypeScript errors required.

**Route output from last clean build:**
```
○  /                          Static
ƒ  /admin/[[...segments]]     Dynamic
ƒ  /api/[...slug]             Dynamic
ƒ  /api/nowplaying            Dynamic
ƒ  /en/news                   Dynamic (searchParams)
●  /en/news/[slug]            SSG + 1min revalidate
●  /en/news/category/[slug]   SSG + 1min revalidate
ƒ  /news                      Dynamic (searchParams)
●  /news/[slug]               SSG + 1min revalidate
●  /news/category/[slug]      SSG + 1min revalidate
```

Pre-rendered slugs at last build:
- Article: `test-article`
- Categories: `events`, `radio-programs`, `artists`, `music-news`

**Deployment config (`vercel.json`):**
- Region: `fra1`
- Security headers on all routes (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`)
- `Cache-Control: no-store` on `/api/*`

**`next.config.ts` image remote patterns:**
- `c34.radioboss.fm` — RadioBoss album art
- `*.public.blob.vercel-storage.com` — Vercel Blob (legacy)
- `pub-*.r2.dev` — Cloudflare R2 public URLs
- `process.env.R2_PUBLIC_URL` hostname — custom R2 domain

---

## 11. KNOWN ISSUES & DECISIONS

**`payload-types.ts` not generated:** `npx payload generate:types` crashes on Node 22 (Payload CLI + undici/CacheStorage incompatibility, open upstream issue). The news and ads data layers use manually-written interfaces in `lib/payload.ts` and `lib/ads.ts`. Replace with generated types when the upstream bug is resolved.

**R2 env vars present in dev:** `R2_BUCKET_NAME`, `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PUBLIC_URL` are all set in `.env.local` (Cloudflare R2 bucket `dandana-media`). Media uploads work in dev.

**`AdPlacements.key` and `Advertisers.slug` not readOnly after create:** Payload v3's `admin.readOnly` is a static boolean — conditional readOnly (editable on create, locked after) requires a custom admin component. Mitigation: strong field description warns editors. Keys and slugs set correctly by the seed and by admin convention.

**`validateEmbedUrl` duplicated in `EmbedAd.tsx`:** `lib/ads.ts` transitively imports Payload's Postgres adapter (server-only). Importing a runtime value from it in a client component would break client bundling. The 5-line pure function is duplicated in `EmbedAd.tsx` importing only `ALLOWED_AD_EMBED_HOSTS` from the constants file (no server deps). `lib/ads.ts` still exports `validateEmbedUrl` for server-side collection hook use.

**`AdBlock` nodes not rendered in `RichTextRenderer`:** `RichTextRenderer.tsx` does not yet have a `case "adBlock"` handler. Inserting an AdBlock in an article body will silently skip the node. To be added in Phase 2A ads.

**`@payloadcms/plugin-seo` and `@payloadcms/plugin-nested-docs`** installed but not added to `payload.config.ts` — available for future phases.

**Why `RadioPlayer` has `dir="ltr"` always:** Player layout (art left, controls LTR) must not flip in RTL mode. Individual Arabic text spans inside use `dir="auto"`.

**Why `stoppingRef` exists in `usePlayer`:** Clearing `audio.src` fires the audio `"error"` event internally. The ref prevents this from being mistaken for a genuine stream error.

**Why news home pages are Dynamic (not SSG):** They use `searchParams` (for `?page=N` pagination), which forces dynamic rendering in Next.js App Router. All other news routes are SSG with 60s revalidation.

**Why ad pages use `overrideAccess: true`:** The Ads collection's read access is restricted to editor+ roles. The server-side data layer applies its own constraints (status=active, date window, locale). `overrideAccess: true` bypasses collection ACL for trusted server code.

---

## 12. PHASE STATUS & NEXT STEPS

| Phase | Status | Commit |
|-------|--------|--------|
| Phase 1 — Radio site | complete | `f791dfc` |
| Phase 2A — Payload CMS collections | complete | `fb9aa9b`, `5e25c1b` |
| Phase 2B — News public frontend | complete | `09f751b` |
| Phase 1 Ads — Advertising system collections + components | complete | `4950488` |
| Phase 2A Advertising — Wire placements into news frontend | complete | — |

**Phase 2A Advertising — complete**
- RichTextRenderer converted to server component
- GalleryBlock.tsx extracted (client component) to enable the server conversion
- locale prop threaded through all 8 renderNode call sites
- adBlock case added: renders AdSlot when placement.key is available, null otherwise
- news_home_top wired above featured hero in /news and /en/news
- news_article_after_intro wired via splitBodyForAd.ts in both article pages
- app/(site)/lib/splitBodyForAd.ts: splits Lexical root.children at first paragraph node; returns { before, after: null } if no paragraph found or split would be the last node
- Build: 20 pages clean, zero TypeScript errors
- ImageAd constrained to placement dimensions via DEFAULT_SIZE_DIMENSIONS lookup
- Leaderboard uses objectFit contain (no cropping), all other sizes use objectFit cover
- TextAd wrapped in maxWidth container matching placement width
- Placement object passed from AdSlot through AdRenderer to ImageAd and TextAd
- Falls back to unconstrained rendering when defaultSize is custom with no explicit w/h

**Next: Phase 2A Ads — Wire placements into news frontend**
- `news_home_top` → `/news` and `/en/news` pages, above featured article section
- `news_article_after_intro` → `/news/[slug]` and `/en/news/[slug]`, after first rendered paragraph in `RichTextRenderer`
- Add `adBlock` case to `RichTextRenderer.tsx`

**Next: Phase 2B Ads — Impression + click logging**
- New `AdEvents` Payload collection: `adId`, `placementKey`, `locale`, `event_type` (eligibility/impression/click), `timestamp`, `userAgent`, `ip` (hashed)
- Implement `recordEligibility()` body in `lib/ads.ts`
- Implement click logging in `/api/ads/click/[id]` before redirect

**Next: Phase 2C Ads — Viewability tracking**
- Client-side `IntersectionObserver` attached to all `[data-ad-id]` elements
- IAB MRC standard: 50% of ad pixels visible for ≥1 second = impression
- Fire `recordImpression()` server action on threshold crossing
