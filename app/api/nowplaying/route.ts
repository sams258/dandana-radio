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
      return NextResponse.json({
        _debug: true,
        _error: `HTTP ${res.status}`,
        _url: url,
        _rawResponse: rawText.slice(0, 500),
        artist: "Radio Dandana", title: "راديو دندنة", album: "",
        duration: "", coverUrl: null, listeners: 0, isLive: true,
        nextArtist: "", nextTitle: "", recent: [],
      });
    }

    let json: Record<string, unknown>;
    try {
      json = JSON.parse(rawText);
    } catch {
      return NextResponse.json({
        _debug: true,
        _error: "JSON parse failed",
        _url: url,
        _rawResponse: rawText.slice(0, 500),
        artist: "Radio Dandana", title: "راديو دندنة", album: "",
        duration: "", coverUrl: null, listeners: 0, isLive: true,
        nextArtist: "", nextTitle: "", recent: [],
      });
    }

    const attrs     = (json?.currenttrack_info as Record<string, Record<string, string>>)?.["@attributes"] ?? {};
    const nextAttrs = (json?.nexttrack_info    as Record<string, Record<string, string>>)?.["@attributes"] ?? {};
    const links     = (json?.links as Record<string, string>) ?? {};
    const artworkUrl = links?.artwork ?? null;
    const nowplayingStr = (json?.nowplaying ?? json?.autodj_title ?? "") as string;
    const fallbackArtist = nowplayingStr.split(" - ")[0] || "Radio Dandana";
    const fallbackTitle  = nowplayingStr.split(" - ").slice(1).join(" - ") || "راديو دندنة";

    return NextResponse.json({
      _debug: true,
      _url: url,
      _rawKeys: Object.keys(json),
      artist:     attrs.ARTIST    || fallbackArtist,
      title:      attrs.TITLE     || fallbackTitle,
      album:      attrs.ALBUM     || "",
      duration:   attrs.DURATION  || "",
      coverUrl:   artworkUrl,
      listeners:  Number(json?.listeners ?? 0),
      isLive:     json?.live === true,
      nextArtist: nextAttrs.ARTIST || "",
      nextTitle:  nextAttrs.TITLE  || "",
      recent:     (json?.recent as unknown[]) ?? [],
    });

  } catch (err) {
    return NextResponse.json({
      _debug: true,
      _error: String(err),
      _url: url,
      artist: "Radio Dandana", title: "راديو دندنة", album: "",
      duration: "", coverUrl: null, listeners: 0, isLive: true,
      nextArtist: "", nextTitle: "", recent: [],
    });
  }
}
