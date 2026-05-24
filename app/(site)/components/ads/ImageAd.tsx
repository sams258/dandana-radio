import Image from "next/image";
import Link from "next/link";
import type { Ad } from "../../lib/ads";
import { AdWrapper } from "./AdWrapper";
import { AdLabel } from "./AdLabel";
import { MOBILE_BREAKPOINT } from "../../../../payload/constants/ads";

interface ImageAdProps {
  ad: Ad;
  locale: "ar" | "en";
  placementKey: string;
}

export function ImageAd({ ad, locale, placementKey }: ImageAdProps) {
  const media = typeof ad.media === "object" && ad.media !== null ? ad.media : null;
  const mobileSrc =
    typeof ad.mobileSrc === "object" && ad.mobileSrc !== null ? ad.mobileSrc : null;

  const desktopUrl = media?.sizes?.hero?.url ?? media?.url ?? null;
  const mobileUrl  = mobileSrc?.sizes?.thumbnail?.url ?? mobileSrc?.url ?? null;
  const altText    = ad.alt ?? "";

  const advertiserId = String(
    typeof ad.advertiser === "object" && ad.advertiser !== null ? ad.advertiser.id : ad.advertiser ?? "",
  );

  if (!desktopUrl) return null;

  const clickHref = `/api/ads/click/${ad.id}`;
  const target    = ad.openInNewTab ? "_blank" : "_self";
  const rel       = ad.openInNewTab ? "noopener noreferrer" : undefined;

  return (
    <AdWrapper
      adId={String(ad.id)}
      placementId={placementKey}
      locale={locale}
      type="image"
      advertiserId={advertiserId}
    >
      <AdLabel
        labelType={ad.labelType}
        customLabelAr={ad.customLabelAr}
        customLabelEn={ad.customLabelEn}
        locale={locale}
      />
      <Link href={clickHref} target={target} rel={rel} style={{ display: "block" }}>
        {/* Desktop image */}
        <div
          style={{ position: "relative", width: "100%" }}
          className={mobileUrl ? "ad-desktop-only" : undefined}
        >
          <Image
            src={desktopUrl}
            alt={altText}
            width={728}
            height={90}
            style={{ width: "100%", height: "auto", display: "block" }}
            unoptimized
          />
        </div>

        {/* Mobile image (shown below breakpoint via CSS) */}
        {mobileUrl && (
          <>
            <style>{`
              @media (min-width: ${MOBILE_BREAKPOINT}px) { .ad-mobile-only { display: none; } }
              @media (max-width: ${MOBILE_BREAKPOINT - 1}px) { .ad-desktop-only { display: none; } }
            `}</style>
            <div className="ad-mobile-only" style={{ position: "relative", width: "100%" }}>
              <Image
                src={mobileUrl}
                alt={altText}
                width={320}
                height={50}
                style={{ width: "100%", height: "auto", display: "block" }}
                unoptimized
              />
            </div>
          </>
        )}
      </Link>
    </AdWrapper>
  );
}
