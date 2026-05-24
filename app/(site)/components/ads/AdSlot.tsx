import { getAdsForPlacement } from "../../lib/ads";
import { AdRenderer } from "./AdRenderer";
import type { Ad } from "../../lib/ads";

interface AdSlotProps {
  placementKey: string;
  locale: "ar" | "en";
}

// Server component — fetches eligible ads and delegates rendering to AdRenderer (client).
export async function AdSlot({ placementKey, locale }: AdSlotProps) {
  const result = await getAdsForPlacement({ key: placementKey, locale });

  if (!result) {
    // Placement not found or disabled
    return null;
  }

  const { placement, ads } = result;

  if (ads.length === 0) {
    // No eligible ads — try fallback
    const fallback =
      typeof placement.fallbackAd === "object" && placement.fallbackAd !== null
        ? (placement.fallbackAd as Ad)
        : null;

    if (fallback) {
      return (
        <AdRenderer
          ads={[fallback]}
          locale={locale}
          placementKey={placementKey}
          placement={placement}
        />
      );
    }

    if (placement.hideWhenEmpty) return null;

    // Preserve layout spacing when hideWhenEmpty is false
    return <div data-placement-id={String(placement.id)} />;
  }

  return (
    <AdRenderer ads={ads} locale={locale} placementKey={placementKey} placement={placement} />
  );
}
