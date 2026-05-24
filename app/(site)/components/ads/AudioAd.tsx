"use client";

import { useRef, useState } from "react";
import type { Ad } from "../../lib/ads";
import { AdWrapper } from "./AdWrapper";
import { AdLabel } from "./AdLabel";

interface AudioAdProps {
  ad: Ad;
  locale: "ar" | "en";
  placementKey: string;
  isRadioPlaying: boolean;
}

export function AudioAd({ ad, locale, placementKey, isRadioPlaying }: AudioAdProps) {
  const media = typeof ad.media === "object" && ad.media !== null ? ad.media : null;
  const audioUrl = media?.url ?? null;
  const advertiserId = String(
    typeof ad.advertiser === "object" && ad.advertiser !== null ? ad.advertiser.id : ad.advertiser ?? "",
  );

  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!audioUrl) return null;

  const buttonLabel =
    locale === "ar" ? "تشغيل الإعلان الصوتي" : "Play sponsored audio";

  const ariaLabel = isRadioPlaying
    ? locale === "ar"
      ? "تشغيل الإعلان الصوتي (سيوقف الراديو مؤقتاً)"
      : "Play sponsored audio (will pause radio)"
    : buttonLabel;

  function handleToggle() {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl!);
      audioRef.current.onended = () => setPlaying(false);
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(console.error);
      setPlaying(true);
    }
  }

  return (
    <AdWrapper
      adId={String(ad.id)}
      placementId={placementKey}
      locale={locale}
      type="audio"
      advertiserId={advertiserId}
    >
      <AdLabel
        labelType={ad.labelType}
        customLabelAr={ad.customLabelAr}
        customLabelEn={ad.customLabelEn}
        locale={locale}
      />
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={handleToggle}
        style={{
          padding:          "0.6rem 1.25rem",
          background:       "linear-gradient(135deg, var(--gold-deep), var(--gold-mid))",
          color:            "#080808",
          border:           "none",
          borderRadius:     "20px",
          fontFamily:       "'Cairo', sans-serif",
          fontSize:         "0.85rem",
          fontWeight:       "600",
          cursor:           "pointer",
        }}
      >
        {playing
          ? (locale === "ar" ? "⏸ إيقاف" : "⏸ Pause")
          : `▶ ${buttonLabel}`}
      </button>
    </AdWrapper>
  );
}
