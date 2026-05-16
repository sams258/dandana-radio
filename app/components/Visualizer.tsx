"use client";

import React, { useMemo } from "react";

interface VisualizerProps {
  isPlaying: boolean;
  barCount?: number;
}

export function Visualizer({ isPlaying, barCount = 28 }: VisualizerProps) {
  // Generate stable random delays and heights per bar
  const bars = useMemo(() => {
    return Array.from({ length: barCount }, (_, i) => ({
      delay:    (Math.random() * 1.2).toFixed(2),
      duration: (0.5 + Math.random() * 0.8).toFixed(2),
      maxH:     Math.floor(20 + Math.random() * 80),
    }));
  }, [barCount]);

  return (
    <div
      aria-hidden="true"
      className="flex items-end gap-[2px] h-10"
      style={{ width: barCount * 6 + "px" }}
    >
      {bars.map((bar, i) => (
        <div
          key={i}
          className="vis-bar rounded-t-sm flex-1"
          style={{
            height: `${bar.maxH}%`,
            background: `linear-gradient(to top, var(--gold-deep), var(--gold-mid))`,
            animationDuration:  isPlaying ? `${bar.duration}s` : "0s",
            animationDelay:     isPlaying ? `${bar.delay}s`    : "0s",
            transform:          isPlaying ? undefined           : "scaleY(0.08)",
            transition:         "transform 0.4s ease",
            opacity:            isPlaying ? 0.85 : 0.25,
          }}
        />
      ))}
    </div>
  );
}
