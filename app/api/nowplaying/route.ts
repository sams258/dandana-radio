import { NextResponse } from "next/server";

const STATION_ID = "1019";
const API_KEY    = "38D1T98921NV";
const BASE_URL   = "https://c34.radioboss.fm";

export const dynamic = "force-dynamic";

let cachedNextArtist = "";
let cachedNextTitle  = "";

const FALLBACK = {
  artist: "Radio Dandana", title: "راديو دندنة", album: "",
  duration: "", coverUrl: null, listeners: 0, isLive: true,
  nextArtist: "", nextTitle: "", recent: [],
};

export async function GET() {
  try {
    const res     = await fetch(`${BASE_URL}/api/info/${STATION_ID}?key=${API_KEY}`, { cache: "no-store" });
    const rawText = await res.text();

    let json: Record<string, unknown> = {};
    try { json = JSON.parse(rawText); } catch { json = {}; }

    if (!res.ok) {
      console.error("[/api/nowplaying] HTTP error", res.status, rawText.slice(0, 500));
      return NextResponse.json(FALLBACK);
    }

    if (!json || Object.keys(json).length === 0) {
      console.error("[/api/nowplaying] JSON parse failed:", rawText.slice(0, 500));
      return NextResponse.json(FALLBACK);
    }

    const attrs         = (json?.currenttrack_info as Record<string, Record<string, string>>)?.["@attributes"] ?? {};
    const nextAttrs     = (json?.nexttrack_info as Record<string, Record<string, string>>)?.["@attributes"] ?? {};
    const links         = (json?.links as Record<string, string>) ?? {};
    const artworkUrl    = links?.artwork ?? null;
    const nowplayingStr = (json?.nowplaying ?? json?.autodj_title ?? "") as string;
    const fallbackArtist = nowplayingStr.split(" - ")[0] || "Radio Dandana";
    const fallbackTitle  = nowplayingStr.split(" - ").slice(1).join(" - ") || "راديو دندنة";

    const nextArtistRaw = nextAttrs.ARTIST   ?? "";
    const nextTitleRaw  = nextAttrs.TITLE    ?? "";
    const nextCastTitle = (nextAttrs.CASTTITLE ?? "").toLowerCase();

    const isNextJingle =
      !nextArtistRaw ||
      !nextTitleRaw  ||
      nextArtistRaw.toLowerCase().includes("dandana") ||
      nextTitleRaw.toLowerCase().includes("jingle")   ||
      nextTitleRaw.toLowerCase().includes("promo")    ||
      nextCastTitle.includes("jingle")                ||
      nextCastTitle.includes("promo")                 ||
      nextArtistRaw.toLowerCase().includes("jingle");

    if (!isNextJingle) {
      cachedNextArtist = nextArtistRaw;
      cachedNextTitle  = nextTitleRaw;
    }

    const nextArtist = isNextJingle ? cachedNextArtist : nextArtistRaw;
    const nextTitle  = isNextJingle ? cachedNextTitle  : nextTitleRaw;

    return NextResponse.json({
      artist:    attrs.ARTIST    || fallbackArtist,
      title:     attrs.TITLE     || fallbackTitle,
      album:     attrs.ALBUM     || "",
      duration:  attrs.DURATION  || "",
      coverUrl:  artworkUrl,
      listeners: Number(json?.listeners ?? 0),
      isLive:    json?.live === true,
      nextArtist,
      nextTitle,
      recent: ((json?.recent as Record<string, string>[]) ?? []).filter((r) => {
        const hasTitle  = r.tracktitle  && r.tracktitle.trim()  !== "";
        const hasArtist = r.trackartist && r.trackartist.trim() !== "";
        const isJingle  = (r.trackartist ?? "").toLowerCase().includes("dandana radio") ||
                          (r.tracktitle  ?? "").toLowerCase().includes("jingle")         ||
                          (r.tracktitle  ?? "").toLowerCase().includes("promo");
        return hasTitle && hasArtist && !isJingle;
      }),
    });

  } catch (err) {
    console.error("[/api/nowplaying]", err);
    return NextResponse.json(FALLBACK);
  }
}
