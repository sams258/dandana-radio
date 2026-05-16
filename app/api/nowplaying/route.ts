import { NextResponse } from "next/server";

const STATION_ID = "1019";
const API_KEY    = "38D1T98921NV";
const BASE_URL   = "https://c34.radioboss.fm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const url = `${BASE_URL}/api/info/${STATION_ID}?key=${API_KEY}`;
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) throw new Error(`RadioBoss ${res.status}`);

    const json = await res.json();

    const attrs     = json?.currenttrack_info?.["@attributes"] ?? {};
    const nextAttrs = json?.nexttrack_info?.["@attributes"]    ?? {};
    const artworkUrl = json?.links?.artwork ?? null;

    const nowplayingStr = json?.nowplaying ?? json?.autodj_title ?? "";
    const fallbackArtist = nowplayingStr.split(" - ")[0] ?? "Radio Dandana";
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
      recent:     json?.recent     ?? [],
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
