"use client";

import Image from "next/image";
import Link from "next/link";
import type { Article } from "../../lib/payload";

interface ArticleCardProps {
  article: Article;
  locale: "ar" | "en";
  featured?: boolean;
}

function formatDate(dateStr: string, locale: "ar" | "en") {
  return new Date(dateStr).toLocaleDateString(
    locale === "ar" ? "ar-LB" : "en-GB",
    { year: "numeric", month: "long", day: "numeric" }
  );
}

export function ArticleCard({ article, locale, featured = false }: ArticleCardProps) {
  const isAr    = locale === "ar";
  const href    = isAr ? `/news/${article.slug}` : `/en/news/${article.slug}`;
  const dir     = isAr ? "rtl" : "ltr";
  const imgUrl  = typeof article.featuredImage === "object" && article.featuredImage !== null
    ? (article.featuredImage?.sizes?.hero?.url || article.featuredImage?.url)
    : null;
  const category = typeof article.category === "object" && article.category !== null
    ? article.category
    : null;
  const author = typeof article.author === "object" && article.author !== null
    ? article.author
    : null;

  return (
    <Link
      href={href}
      dir={dir}
      className={`group glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02]${featured ? " col-span-2 row-span-2" : ""}`}
      style={{
        textDecoration: "none",
        display:        "block",
        border:         "1px solid rgba(201,169,110,0.12)",
        boxShadow:      "0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      {/* Featured image */}
      {imgUrl && (
        <div
          style={{
            position: "relative",
            width:    "100%",
            height:   featured ? "340px" : "200px",
            overflow: "hidden",
          }}
        >
          <Image
            src={imgUrl}
            alt={typeof article.title === "string" ? article.title : ""}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
          {/* Category badge */}
          {category && (
            <div
              style={{
                position:      "absolute",
                top:           "12px",
                insetInlineEnd: "12px",
                background:    category.color || "var(--gold-mid)",
                color:        "#080808",
                padding:      "4px 12px",
                borderRadius: "20px",
                fontSize:     "0.72rem",
                fontWeight:   "600",
                fontFamily:   "'Cairo', sans-serif",
              }}
            >
              {typeof category.name === "string" ? category.name : ""}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div style={{ padding: "1.25rem 1.5rem" }}>
        {/* Title */}
        <h2
          style={{
            fontSize:        featured ? "1.4rem" : "1.05rem",
            fontWeight:      "600",
            color:           "var(--gold-light)",
            marginBottom:    "0.5rem",
            fontFamily:      "'Cairo', 'IBM Plex Sans Arabic', sans-serif",
            lineHeight:      "1.5",
            display:         "-webkit-box",
            WebkitLineClamp: featured ? 3 : 2,
            WebkitBoxOrient: "vertical",
            overflow:        "hidden",
          }}
        >
          {typeof article.title === "string" ? article.title : ""}
        </h2>

        {/* Excerpt */}
        <p
          style={{
            fontSize:        "0.875rem",
            color:           "var(--text-muted)",
            marginBottom:    "1rem",
            fontFamily:      "'Cairo', 'IBM Plex Sans Arabic', sans-serif",
            lineHeight:      "1.7",
            display:         "-webkit-box",
            WebkitLineClamp: featured ? 3 : 2,
            WebkitBoxOrient: "vertical",
            overflow:        "hidden",
          }}
        >
          {typeof article.excerpt === "string" ? article.excerpt : ""}
        </p>

        {/* Meta row */}
        <div
          style={{
            display:    "flex",
            alignItems: "center",
            gap:        "0.75rem",
            fontSize:   "0.75rem",
            color:      "var(--text-subtle)",
            fontFamily: "monospace",
          }}
        >
          {author && (
            <span style={{ color: "var(--gold-deep)" }}>
              {typeof author.name === "string" ? author.name : ""}
            </span>
          )}
          {author && article.publishedAt && (
            <span style={{ color: "var(--text-subtle)" }}>·</span>
          )}
          {article.publishedAt && (
            <span>{formatDate(article.publishedAt, locale)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
