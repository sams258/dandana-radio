import type { Metadata } from "next";
import "../globals.css";
import { PlayerProvider } from "./context/PlayerContext";
import { GlobalPlayer } from "./components/player/GlobalPlayer";

export const metadata: Metadata = {
  title: "Radio Dandana | راديو دندنة",
  description: "Radio Dandana – Your home for the finest Arabic music. راديو دندنة – وجهتك للموسيقى العربية الأصيلة.",
  openGraph: {
    title: "Radio Dandana | راديو دندنة",
    description: "Stream live Arabic music",
    images: ["/logo.png"],
  },
  icons: { icon: "/logo.png" },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ paddingBlockEnd: '80px' }}>
        <PlayerProvider>
          {children}
          <GlobalPlayer />
        </PlayerProvider>
      </body>
    </html>
  );
}
