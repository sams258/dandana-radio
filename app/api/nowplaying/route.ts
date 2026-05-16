import { NextResponse } from "next/server";

const STATION_ID = "1019";
const API_KEY    = "38D1T98921NV";
const BASE_URL   = "https://c34.radioboss.fm";

export const revalidate = 0; // never cache

export async function GET() {
  try {
    const url = `${BASE_URL}/api/info/${STATION_ID}?key=${API_KEY}`;
    const res = await fetch(url, {
      next: { revalidate: 0 },
      headers: { "Accept": "application/json" },
    });

    if (!res.ok) throw new Error(`RadioBoss returned ${res.status}`);

    const json = await res.json();

    // RadioBoss Cloud /api/info response shape:
    // { nowplaying, currenttrack_info: { "@attributes": { ARTIST, TITLE, ALBUM } }, playback, ... }
    const attrs     = json?.currenttrack_info?.["@attributes"] ?? {};
    const listeners = Number(attrs?.LISTENERS ?? 0);

    return NextResponse.json({
      artist:    attrs.ARTIST    ?? json.nowplaying?.split(" - ")[0] ?? "Radio Dandana",
      title:     attrs.TITLE     ?? json.nowplaying?.split(" - ")[1] ?? "راديو دندنة",
      album:     attrs.ALBUM     ?? "",
      coverUrl:  null,
      listeners,
      isLive:    true,
      raw:       json, // useful for debugging in the console
    });
  } catch (err) {
    console.error("[/api/nowplaying]", err);
    return NextResponse.json(
      { artist: "Radio Dandana", title: "راديو دندنة", album: "", coverUrl: null, listeners: 0, isLive: true },
      { status: 200 } // return 200 so the client doesn't show an error state
    );
  }
}
