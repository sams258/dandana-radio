import { NextResponse } from "next/server";

const STATION_ID = "1019";
const API_KEY    = "38D1T98921NV";
const BASE_URL   = "https://c34.radioboss.fm";

export const dynamic = "force-dynamic";

const FALLBACK = {
  artist: "Radio Dandana", title: "راديو دندنة", album: "",
  duration: "", coverUrl: null, listeners: 0, isLive: true,
  nextArtist: "", nextTitle: "", recent: [],
};

export async function GET() {
  try {
    const [infoRes, playlistRes] = await Promise.all([
      fetch(`${BASE_URL}/api/info/${STATION_ID}?key=${API_KEY}`, { cache: "no-store" }),
      fetch(`${BASE_URL}/api/getplaylist/${STATION_ID}?key=${API_KEY}`, { cache: "no-store" }),
    ]);

    const infoText     = await infoRes.text();
    const playlistText = await playlistRes.text();

    let json: Record<string, unknown> = {};
    let playlistJson: Record<string, unknown> = {};

    try { json         = JSON.parse(infoText);     } catch { json = {}; }
    try { playlistJson = JSON.parse(playlistText); } catch { playlistJson = {}; }

    if (!infoRes.ok) {
      console.error("[/api/nowplaying] HTTP error", infoRes.status, infoText.slice(0, 500));
      return NextResponse.json(FALLBACK);
    }

    if (!json || Object.keys(json).length === 0) {
      console.error("[/api/nowplaying] JSON parse failed:", infoText.slice(0, 500));
      return NextResponse.json(FALLBACK);
    }

    const attrs         = (json?.currenttrack_info as Record<string, Record<string, string>>)?.["@attributes"] ?? {};
    const nextTrackInfo = json?.nexttrack_info as Record<string, unknown> | null;
    const nextAttrs     = (nextTrackInfo?.["@attributes"] as Record<string, string>) ?? {};
    const links         = (json?.links as Record<string, string>) ?? {};
    const artworkUrl    = links?.artwork ?? null;
    const nowplayingStr = (json?.nowplaying ?? json?.autodj_title ?? "") as string;
    const fallbackArtist = nowplayingStr.split(" - ")[0] || "Radio Dandana";
    const fallbackTitle  = nowplayingStr.split(" - ").slice(1).join(" - ") || "راديو دندنة";

    // Find next real song from playlist — skip jingles/promos
    const tracks = (playlistJson?.TRACK as Record<string, string>[] | undefined) ?? [];

    const upcomingTracks = tracks.filter((tr) => {
      const isUpcoming = tr.ITEMTYPE === "TRACK";
      const hasArtist  = tr.ARTIST && tr.ARTIST.trim() !== "";
      const hasTitle   = tr.TITLE  && tr.TITLE.trim()  !== "";
      const castTitle  = (tr.CASTTITLE ?? "").toLowerCase();
      const isJingle   = (
        castTitle.includes("jingle") ||
        castTitle.includes("promo")  ||
        castTitle.includes("station id") ||
        castTitle.includes("dandana radio") ||
        (!hasArtist && !hasTitle)
      );
      return isUpcoming && !isJingle;
    });

    const nextRealTrack = upcomingTracks[0] ?? null;

    const nextArtist = nextRealTrack?.ARTIST
      || (nextAttrs.ARTIST && !nextAttrs.ARTIST.toLowerCase().includes("dandana radio") ? nextAttrs.ARTIST : "")
      || "";
    const nextTitle  = nextRealTrack?.TITLE
      || (nextAttrs.TITLE && nextAttrs.ARTIST ? nextAttrs.TITLE : "")
      || "";

    return NextResponse.json({
      artist:     attrs.ARTIST    || fallbackArtist,
      title:      attrs.TITLE     || fallbackTitle,
      album:      attrs.ALBUM     || "",
      duration:   attrs.DURATION  || "",
      coverUrl:   artworkUrl,
      listeners:  Number(json?.listeners ?? 0),
      isLive:     json?.live === true,
      nextArtist,
      nextTitle,
      _playlist_debug: {
        totalTracks: tracks.length,
        upcomingCount: upcomingTracks.length,
        first5Tracks: tracks.slice(0, 5).map(tr => ({
          ARTIST:    tr.ARTIST,
          TITLE:     tr.TITLE,
          ITEMTYPE:  tr.ITEMTYPE,
          CASTTITLE: tr.CASTTITLE,
          STARTTIME: tr.STARTTIME,
        })),
        first3Upcoming: upcomingTracks.slice(0, 3).map(tr => ({
          ARTIST:    tr.ARTIST,
          TITLE:     tr.TITLE,
          ITEMTYPE:  tr.ITEMTYPE,
          CASTTITLE: tr.CASTTITLE,
        })),
      },
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
