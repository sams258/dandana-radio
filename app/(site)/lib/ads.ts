import configPromise from "../../../payload.config";
import { getPayload } from "payload";
import type { Where } from "payload";
import {
  ALLOWED_AD_EMBED_HOSTS,
  type AdType,
  type AdStatus,
  type AdLocale,
  type AdLabelType,
} from "../../../payload/constants/ads";
import type { Media } from "./payload";

// ── Types ─────────────────────────────────────────────────────────────────

export interface Advertiser {
  id: string | number;
  name: string;
  slug: string;
  status?: "active" | "inactive" | null;
  websiteUrl?: string | null;
}

export interface Ad {
  id: string | number;
  title: string;
  advertiser?: Advertiser | string | number | null;
  type: AdType;
  status: AdStatus;
  locale: AdLocale;
  labelType: AdLabelType;
  customLabelAr?: string | null;
  customLabelEn?: string | null;
  clickUrl: string;
  openInNewTab?: boolean | null;
  requiresConsent?: boolean | null;
  // locale-resolved strings when fetched with a specific locale
  media?: Media | string | number | null;
  mobileSrc?: Media | string | number | null;
  alt?: string | null;
  textContent?: string | null;
  embedProvider?: string | null;
  embedUrl?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface AdPlacement {
  id: string | number;
  name: string;
  key: string;
  description?: string | null;
  allowedTypes: string[];
  defaultSize: string;
  width?: number | null;
  height?: number | null;
  pageScope: string;
  maxAds: number;
  hideWhenEmpty: boolean;
  fallbackAd?: Ad | string | number | null;
  enabled: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────

async function getPayloadInstance() {
  return getPayload({ config: configPromise });
}

// ── Public API ────────────────────────────────────────────────────────────

export async function getPlacementByKey(key: string): Promise<AdPlacement | null> {
  const payload = await getPayloadInstance();

  const result = await payload.find({
    collection: "ad-placements",
    where: { key: { equals: key } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  });

  return (result.docs[0] ?? null) as AdPlacement | null;
}

export async function getAdsForPlacement({
  key,
  locale,
  limit,
}: {
  key: string;
  locale: "ar" | "en";
  limit?: number;
}): Promise<{ placement: AdPlacement; ads: Ad[] } | null> {
  const payload = await getPayloadInstance();

  // 1. Resolve placement
  const placementResult = await payload.find({
    collection: "ad-placements",
    where: { key: { equals: key } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  });

  const placement = (placementResult.docs[0] ?? null) as AdPlacement | null;
  if (!placement || !placement.enabled) return null;

  // 2. Build ads query
  const now = new Date().toISOString();
  const localeValues = locale === "ar" ? ["ar", "both"] : ["en", "both"];
  const fetchLimit = Math.min(limit ?? placement.maxAds, placement.maxAds);

  const where: Where = {
    and: [
      { status: { equals: "active" } },
      { locale: { in: localeValues } },
      { type: { in: placement.allowedTypes } },
      {
        or: [
          { startDate: { exists: false } },
          { startDate: { less_than_equal: now } },
        ],
      },
      {
        or: [
          { endDate: { exists: false } },
          { endDate: { greater_than_equal: now } },
        ],
      },
    ],
  };

  const adsResult = await payload.find({
    collection: "ads",
    where,
    locale,
    sort: "-updatedAt",
    limit: fetchLimit,
    depth: 2,
    overrideAccess: true,
  });

  const ads = adsResult.docs as unknown as Ad[];

  // Phase 2 hook point — called for each eligible ad
  for (const ad of ads) {
    recordEligibility(String(ad.id), key, locale);
  }

  return { placement, ads };
}

// Phase 2: write to AdEvents table with event_type = eligibility
export function recordEligibility(
  _adId: string,
  _placementKey: string,
  _locale: "ar" | "en",
): void {
  // no-op in Phase 1
}

export function validateEmbedUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return ALLOWED_AD_EMBED_HOSTS.includes(hostname);
  } catch {
    return false;
  }
}
