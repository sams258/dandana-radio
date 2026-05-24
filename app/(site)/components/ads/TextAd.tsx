import Link from "next/link";
import type { Ad } from "../../lib/ads";
import { AdWrapper } from "./AdWrapper";
import { AdLabel } from "./AdLabel";
import { DEFAULT_SIZE_DIMENSIONS, type DefaultSize } from "../../../../payload/constants/ads";

interface TextAdProps {
  ad: Ad;
  locale: "ar" | "en";
  placementKey: string;
  defaultSize: string;
  placementWidth?: number;
}

export function TextAd({ ad, locale, placementKey, defaultSize, placementWidth }: TextAdProps) {
  const dims = DEFAULT_SIZE_DIMENSIONS[defaultSize as DefaultSize] ?? null;
  const maxW = placementWidth ?? dims?.w ?? null;
  const text = ad.textContent ?? "";
  const advertiserId = String(
    typeof ad.advertiser === "object" && ad.advertiser !== null ? ad.advertiser.id : ad.advertiser ?? "",
  );

  if (!text) return null;

  const clickHref = `/api/ads/click/${ad.id}`;
  const target    = ad.openInNewTab ? "_blank" : "_self";
  const rel       = ad.openInNewTab ? "noopener noreferrer" : undefined;

  return (
    <div style={maxW !== null ? { maxWidth: maxW, marginInline: "auto" } : undefined}>
      <AdWrapper
        adId={String(ad.id)}
        placementId={placementKey}
        locale={locale}
        type="text"
        advertiserId={advertiserId}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <AdLabel
            labelType={ad.labelType}
            customLabelAr={ad.customLabelAr}
            customLabelEn={ad.customLabelEn}
            locale={locale}
          />
          <Link
            href={clickHref}
            target={target}
            rel={rel}
            style={{
              display:        "block",
              width:          "100%",
              padding:        "0.75rem 1rem",
              background:     "rgba(201,169,110,0.06)",
              border:         "1px solid rgba(201,169,110,0.15)",
              borderRadius:   "8px",
              color:          "var(--gold-light)",
              fontFamily:     "'Cairo', sans-serif",
              fontSize:       "0.9rem",
              lineHeight:     "1.6",
              textDecoration: "none",
            }}
          >
            {text}
          </Link>
        </div>
      </AdWrapper>
    </div>
  );
}
