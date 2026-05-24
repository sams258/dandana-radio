"use client";

import { useState } from "react";
import type { Ad } from "../../lib/ads";
import { ImageAd } from "./ImageAd";
import { TextAd } from "./TextAd";
import { VideoAd } from "./VideoAd";
import { AudioAd } from "./AudioAd";
import { EmbedAd } from "./EmbedAd";

interface AdRendererProps {
  ads: Ad[];
  locale: "ar" | "en";
  placementKey: string;
}

export function AdRenderer({ ads, locale, placementKey }: AdRendererProps) {
  // Client-side round-robin: pick a random ad from the eligible set on first render.
  // Using useState initializer so the selection is stable for the component lifetime.
  const [selectedIndex] = useState(() =>
    ads.length > 0 ? Math.floor(Math.random() * ads.length) : 0,
  );

  const ad = ads[selectedIndex];
  if (!ad) return null;

  switch (ad.type) {
    case "image":
      return <ImageAd ad={ad} locale={locale} placementKey={placementKey} />;
    case "text":
      return <TextAd  ad={ad} locale={locale} placementKey={placementKey} />;
    case "video":
      return <VideoAd ad={ad} locale={locale} placementKey={placementKey} />;
    case "audio":
      return <AudioAd ad={ad} locale={locale} placementKey={placementKey} isRadioPlaying={false} />;
    case "embed":
      return <EmbedAd ad={ad} locale={locale} placementKey={placementKey} />;
    default:
      return null;
  }
}
