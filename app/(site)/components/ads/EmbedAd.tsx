import type { Ad } from "../../lib/ads";
import { AdWrapper } from "./AdWrapper";
import { AdLabel } from "./AdLabel";
import { ALLOWED_AD_EMBED_HOSTS } from "../../../../payload/constants/ads";

// validateEmbedUrl is duplicated here from ads.ts because ads.ts has server-only
// Payload dependencies that cannot be bundled for the client.
function validateEmbedUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return ALLOWED_AD_EMBED_HOSTS.includes(hostname);
  } catch {
    return false;
  }
}

interface EmbedAdProps {
  ad: Ad;
  locale: "ar" | "en";
  placementKey: string;
}

export function EmbedAd({ ad, locale, placementKey }: EmbedAdProps) {
  const embedUrl = ad.embedUrl ?? "";
  const advertiserId = String(
    typeof ad.advertiser === "object" && ad.advertiser !== null ? ad.advertiser.id : ad.advertiser ?? "",
  );

  // Silently render nothing if URL fails whitelist check
  if (!embedUrl || !validateEmbedUrl(embedUrl)) return null;

  return (
    <AdWrapper
      adId={String(ad.id)}
      placementId={placementKey}
      locale={locale}
      type="embed"
      advertiserId={advertiserId}
    >
      <AdLabel
        labelType={ad.labelType}
        customLabelAr={ad.customLabelAr}
        customLabelEn={ad.customLabelEn}
        locale={locale}
      />
      {/* No allow-same-origin — intentionally omitted for third-party isolation */}
      <iframe
        src={embedUrl}
        sandbox="allow-scripts allow-popups"
        style={{
          border:  "none",
          width:   "100%",
          height:  "100%",
          display: "block",
        }}
        title="Advertisement"
        aria-label="Advertisement"
      />
    </AdWrapper>
  );
}
