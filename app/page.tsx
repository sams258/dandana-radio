"use client";

import { LangProvider } from "./lib/lang";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { RadioPlayer } from "./components/RadioPlayer";
import { AboutSection, ScheduleSection, ContactSection } from "./components/Sections";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <LangProvider>
      <Navbar />
      <main>
        <div className="max-w-5xl mx-auto w-full">
          <HeroSection />

          {/* Player section — anchored below hero */}
          <section
            id="listen"
            className="py-8 px-4 sm:px-6"
            style={{ background: "linear-gradient(to bottom, var(--black-void), var(--black-deep))" }}
          >
            <RadioPlayer />
          </section>

          <AboutSection />
          <ScheduleSection />
          <ContactSection />
        </div>
      </main>
      <Footer />
    </LangProvider>
  );
}
