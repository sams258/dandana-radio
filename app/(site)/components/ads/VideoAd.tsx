import type { Ad } from "../../lib/ads";
import { AdWrapper } from "./AdWrapper";
import { AdLabel } from "./AdLabel";

interface VideoAdProps {
  ad: Ad;
  locale: "ar" | "en";
  placementKey: string;
}

export function VideoAd({ ad, locale, placementKey }: VideoAdProps) {
  const media = typeof ad.media === "object" && ad.media !== null ? ad.media : null;
  const videoUrl    = media?.url ?? null;
  const posterUrl   = media?.sizes?.thumbnail?.url ?? null;
  const altText     = ad.alt ?? "";
  const advertiserId = String(
    typeof ad.advertiser === "object" && ad.advertiser !== null ? ad.advertiser.id : ad.advertiser ?? "",
  );

  if (!videoUrl) return null;

  return (
    <AdWrapper
      adId={String(ad.id)}
      placementId={placementKey}
      locale={locale}
      type="video"
      advertiserId={advertiserId}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <AdLabel
          labelType={ad.labelType}
          customLabelAr={ad.customLabelAr}
          customLabelEn={ad.customLabelEn}
          locale={locale}
        />
        <div aria-label={altText} style={{ width: "100%" }}>
          {/* No autoplay. No sound on load. Controls visible. Click-to-play via native controls. */}
          <video
            src={videoUrl}
            poster={posterUrl ?? undefined}
            controls
            muted
            playsInline
            preload="metadata"
            style={{ width: "100%", borderRadius: "8px", display: "block" }}
          />
        </div>
      </div>
    </AdWrapper>
  );
}
