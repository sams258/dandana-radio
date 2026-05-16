import { NextResponse } from "next/server";

const STATION_ID = "1019";
const API_KEY    = "38D1T98921NV";
const BASE_URL   = "https://c34.radioboss.fm";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = `${BASE_URL}/api/info/${STATION_ID}?key=${API_KEY}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    const rawText = await res.text();

    if (!res.ok) {
      console.error("[/api/nowplaying] HTTP error", res.status, rawText.slice(0, 500));
      return NextResponse.json({
        artist: "Radio Dandana", title: "راديو دندنة", album: "",
        duration: "", coverUrl: null, listeners: 0, isLive: true,
        nextArtist: "", nextTitle: "", recent: [],
      });
    }

    let json: Record<string, unknown>;
    try {
      json = JSON.parse(rawText);
    } catch {
      console.error("[/api/nowplaying] JSON parse failed:", rawText.slice(0, 500));
      return NextResponse.json({
        artist: "Radio Dandana", title: "راديو دندنة", album: "",
        duration: "", coverUrl: null, listeners: 0, isLive: true,
        nextArtist: "", nextTitle: "", recent: [],
      });
    }

    const attrs         = (json?.currenttrack_info as Record<string, Record<string, string>>)?.["@attributes"] ?? {};
    const nextTrackInfo = json?.nexttrack_info as Record<string, unknown> | null;
    const nextAttrs     = (nextTrackInfo?.["@attributes"] as Record<string, string>) ?? {};
    const links         = (json?.links as Record<string, string>) ?? {};
    const artworkUrl    = links?.artwork ?? null;
    const nowplayingStr = (json?.nowplaying ?? json?.autodj_title ?? "") as string;
    const fallbackArtist = nowplayingStr.split(" - ")[0] || "Radio Dandana";
    const fallbackTitle  = nowplayingStr.split(" - ").slice(1).join(" - ") || "راديو دندنة";

    return NextResponse.json({
      artist:     attrs.ARTIST    || fallbackArtist,
      title:      attrs.TITLE     || fallbackTitle,
      album:      attrs.ALBUM     || "",
      duration:   attrs.DURATION  || "",
      coverUrl:   artworkUrl,
      listeners:  Number(json?.listeners ?? 0),
      isLive:     json?.live === true,
      nextArtist: nextAttrs.ARTIST || "",
      nextTitle:  nextAttrs.TITLE  || "",
      recent: ((json?.recent as unknown[]) ?? []).filter((r: unknown) => {
        const item = r as Record<string, string>;
        return item.tracktitle && item.tracktitle.trim() !== "";
      }),
    });

  } catch (err) {
    console.error("[/api/nowplaying]", err);
    return NextResponse.json({
      artist: "Radio Dandana", title: "راديو دندنة", album: "",
      duration: "", coverUrl: null, listeners: 0, isLive: true,
      nextArtist: "", nextTitle: "", recent: [],
    });
  }
}
