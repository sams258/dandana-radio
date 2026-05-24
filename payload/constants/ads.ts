// Shared constants for the advertising system — import from here only, no magic strings.

export const AD_TYPES = ["image", "video", "audio", "text", "embed"] as const;
export type AdType = (typeof AD_TYPES)[number];

export const AD_STATUSES = ["draft", "active", "paused", "archived"] as const;
export type AdStatus = (typeof AD_STATUSES)[number];

export const AD_LOCALES = ["ar", "en", "both"] as const;
export type AdLocale = (typeof AD_LOCALES)[number];

export const AD_LABEL_TYPES = ["ad", "sponsored", "advertisement", "custom"] as const;
export type AdLabelType = (typeof AD_LABEL_TYPES)[number];

export const AD_LABEL_MAP: Record<AdLabelType, { ar: string; en: string }> = {
  ad:            { ar: "إعلان",        en: "Ad" },
  sponsored:     { ar: "برعاية",       en: "Sponsored" },
  advertisement: { ar: "محتوى مدعوم",  en: "Advertisement" },
  custom:        { ar: "",             en: "" },
};

export const PAGE_SCOPES = [
  "global",
  "homepage",
  "news_home",
  "news_article",
  "news_category",
] as const;
export type PageScope = (typeof PAGE_SCOPES)[number];

export const DEFAULT_SIZES = [
  "leaderboard",
  "mobile_leaderboard",
  "rectangle",
  "large_rectangle",
  "halfpage",
  "square",
  "billboard",
  "skyscraper",
  "custom",
] as const;
export type DefaultSize = (typeof DEFAULT_SIZES)[number];

export const DEFAULT_SIZE_DIMENSIONS: Record<DefaultSize, { w: number; h: number } | null> = {
  leaderboard:        { w: 728,  h: 90 },
  mobile_leaderboard: { w: 320,  h: 50 },
  rectangle:          { w: 300,  h: 250 },
  large_rectangle:    { w: 336,  h: 280 },
  halfpage:           { w: 300,  h: 600 },
  square:             { w: 250,  h: 250 },
  billboard:          { w: 970,  h: 250 },
  skyscraper:         { w: 160,  h: 600 },
  custom:             null,
};

export const ALLOWED_AD_EMBED_HOSTS: string[] = [
  "securepubads.g.doubleclick.net",
  "pagead2.googlesyndication.com",
];

export const MOBILE_BREAKPOINT = 768;
