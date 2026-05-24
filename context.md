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
│   │   │   └── payload.ts                # Data access layer: all Payload queries + inline types
│   │   ├── components/
│   │   │   └── news/
│   │   │       ├── ArticleCard.tsx        # Article card (client component)
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

## 7. RADIO SITE (Phase 1 — Untouched)

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

## 8. DESIGN SYSTEM

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

## 9. BUILD & DEPLOYMENT

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

## 10. KNOWN ISSUES & DECISIONS

**`payload-types.ts` not generated:** `npx payload generate:types` crashes on Node 20 (undici `CacheStorage` incompatibility). The news data layer uses manually-written interfaces in `app/(site)/lib/payload.ts`. When this is resolved, replace those interfaces with the generated types and update the import.

**R2 env vars missing in dev:** All five R2 vars (`R2_BUCKET_NAME`, `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PUBLIC_URL`) are absent from `.env.local`. Media uploads return 500 in dev. Use `/api/debug-r2` to check var presence at runtime.

**`@payloadcms/plugin-seo` and `@payloadcms/plugin-nested-docs`** are installed but not added to `payload.config.ts` plugins array — available for future phases.

**Why `RadioPlayer` has `dir="ltr"` always:** The player layout (art left, controls LTR) must not flip in RTL mode. Individual Arabic text spans inside use `dir="auto"`.

**Why `stoppingRef` exists in `usePlayer`:** Clearing `audio.src` fires the audio `"error"` event internally. The ref prevents this from being mistaken for a genuine stream error.

**Why news home pages are Dynamic (not SSG):** They use `searchParams` (for `?page=N` pagination), which forces dynamic rendering in Next.js App Router. All other news routes are SSG with 60s revalidation.

**Phase status:** Phase 2A and 2B complete and pushed. Phase 1 advertising system (collections, components, data layer) is complete but NOT YET committed.
