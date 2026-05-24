"use client";

import Link from "next/link";
import Image from "next/image";

interface NewsNavProps {
  locale:           "ar" | "en";
  categories:       { id: string | number; name: string; slug: string }[];
  activeCategory?:  string;
  currentSlug?:     string;
  currentCategory?: string;
}

export function NewsNav({ locale, categories, activeCategory, currentSlug, currentCategory }: NewsNavProps) {
  const isAr     = locale === "ar";
  const dir      = isAr ? "rtl" : "ltr";
  const newsHome = isAr ? "/news" : "/en/news";
  const altLabel = isAr ? "EN" : "عربي";

  const getAltHref = () => {
    const base = isAr ? "/en" : "";
    if (currentSlug)     return `${base}/news/${currentSlug}`;
    if (currentCategory) return `${base}/news/category/${currentCategory}`;
    return isAr ? "/en/news" : "/news";
  };
  const altHref = getAltHref();

  return (
    <nav
      dir={dir}
      style={{
        position:       "sticky",
        top:            0,
        zIndex:         50,
        background:     "rgba(8,8,8,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom:   "1px solid rgba(201,169,110,0.1)",
        padding:        "0 clamp(1rem,4vw,2.5rem)",
      }}
    >
      <div style={{
        maxWidth:   "1200px",
        margin:     "0 auto",
        display:    "flex",
        alignItems: "center",
        gap:        "1.5rem",
        height:     "64px",
        overflowX:  "auto",
      }}>
        {/* Logo — back to radio site */}
        <Link href="/" style={{ flexShrink: 0 }}>
          <Image src="/logo.png" alt="Radio Dandana" width={80} height={44} className="object-contain" />
        </Link>

        {/* Divider */}
        <div style={{
          width:      "1px",
          height:     "28px",
          background: "rgba(201,169,110,0.2)",
          flexShrink: 0,
        }} />

        {/* News home link */}
        <Link
          href={newsHome}
          style={{
            color:          !activeCategory ? "var(--gold-mid)" : "var(--text-muted)",
            fontFamily:     "'Cairo', sans-serif",
            fontSize:       "0.9rem",
            fontWeight:     !activeCategory ? "600" : "400",
            textDecoration: "none",
            whiteSpace:     "nowrap",
            flexShrink:     0,
          }}
        >
          {isAr ? "الأخبار" : "News"}
        </Link>

        {/* Category links */}
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`${newsHome}/category/${cat.slug}`}
            style={{
              color:          activeCategory === cat.slug ? "var(--gold-mid)" : "var(--text-muted)",
              fontFamily:     "'Cairo', sans-serif",
              fontSize:       "0.85rem",
              fontWeight:     activeCategory === cat.slug ? "600" : "400",
              textDecoration: "none",
              whiteSpace:     "nowrap",
              flexShrink:     0,
              transition:     "color 0.2s",
            }}
          >
            {cat.name}
          </Link>
        ))}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Language toggle */}
        <Link
          href={altHref}
          style={{
            padding:        "5px 14px",
            borderRadius:   "20px",
            fontSize:       "0.8rem",
            fontWeight:     "600",
            color:          "var(--gold-mid)",
            border:         "1.5px solid rgba(201,169,110,0.4)",
            background:     "rgba(201,169,110,0.07)",
            textDecoration: "none",
            flexShrink:     0,
            fontFamily:     "'Cairo', sans-serif",
          }}
        >
          {altLabel}
        </Link>
      </div>
    </nav>
  );
}
