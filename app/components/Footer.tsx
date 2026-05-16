"use client";

import React from "react";
import Image from "next/image";
import { useLang } from "../lib/lang";

export function Footer() {
  const { t, lang, dir } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer
      dir={dir}
      className="py-10 px-6 mt-8"
      style={{ borderTop: "1px solid rgba(201,169,110,0.08)" }}
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-5 text-center">
        <Image
          src="/logo.png"
          alt="Radio Dandana"
          width={56}
          height={56}
          className="opacity-60"
        />

        <p
          className={`text-sm ${lang === "ar" ? "font-arabic" : ""}`}
          style={{ color: "var(--text-muted)" }}
        >
          {t("footer.tagline")}
        </p>

        <p
          className="text-xs font-mono"
          style={{ color: "var(--text-subtle)" }}
        >
          © {year} Radio Dandana — {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
