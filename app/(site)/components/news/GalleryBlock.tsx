"use client";

import Image from "next/image";
import { useState } from "react";

export function GalleryBlock({ fields }: { fields: Record<string, unknown> }) {
  const images  = fields.images as { image: Record<string, unknown>; caption?: string }[] | undefined;
  const [active, setActive] = useState(0);

  if (!images?.length) return null;
  const current = images[active];
  const imgUrl  = (current.image?.url || (current.image?.sizes as Record<string, unknown> | undefined)?.hero) as string;

  return (
    <div style={{ margin: "1.5rem 0" }}>
      <div style={{
        position:     "relative",
        height:       "360px",
        borderRadius: "14px",
        overflow:     "hidden",
        marginBottom: "0.75rem",
      }}>
        <Image src={imgUrl} alt={current.caption || ""} fill className="object-cover" unoptimized />
      </div>
      {images.length > 1 && (
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {images.map((img, i) => {
            const thumbUrl =
              ((img.image?.sizes as Record<string, unknown> | undefined)?.thumbnail as Record<string, unknown> | undefined)?.url as string
              || img.image?.url as string;
            return (
              <div
                key={i}
                onClick={() => setActive(i)}
                style={{
                  width:        "64px",
                  height:       "64px",
                  position:     "relative",
                  borderRadius: "8px",
                  overflow:     "hidden",
                  cursor:       "pointer",
                  border:       i === active ? "2px solid var(--gold-mid)" : "2px solid transparent",
                  opacity:      i === active ? 1 : 0.6,
                  transition:   "all 0.2s",
                }}
              >
                <Image src={thumbUrl} alt="" fill className="object-cover" unoptimized />
              </div>
            );
          })}
        </div>
      )}
      {current.caption && (
        <p style={{
          fontSize:   "0.8rem",
          color:      "var(--text-muted)",
          marginTop:  "0.5rem",
          fontFamily: "'Cairo', sans-serif",
        }}>
          {current.caption}
        </p>
      )}
    </div>
  );
}
