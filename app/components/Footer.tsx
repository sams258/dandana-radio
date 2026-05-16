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
      style={{ paddingTop: "3rem", paddingBottom: "3rem", paddingInline: "1.5rem", borderTop: "1px solid rgba(201,169,110,0.08)" }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", textAlign: "center" }}>
        <Image
          src="/logo.png"
          alt="Radio Dandana"
          width={160}
          height={86}
          className="object-contain opacity-70 mx-auto"
          style={{ width: "160px", height: "auto" }}
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
