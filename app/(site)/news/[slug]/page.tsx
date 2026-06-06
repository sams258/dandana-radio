import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlug, getAllArticleSlugs, getAllCategories } from "../../lib/payload";
import { RichTextRenderer } from "../../components/news/RichTextRenderer";
import { NewsNav } from "../../components/news/NewsNav";
import { AdSlot } from "../../components/ads/AdSlot";
import { splitBodyForAd } from "../../lib/splitBodyForAd";
import { ShareButtons } from "../../components/news/ShareButtons";

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllArticleSlugs();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article  = await getArticleBySlug(slug, "ar");
  if (!article) return { title: "مقال غير موجود | راديو دندنة" };

  const imgUrl = typeof article.featuredImage === "object" && article.featuredImage !== null
    ? article.featuredImage.url
    : null;

  return {
    title:       `${article.title} | راديو دندنة`,
    description: typeof article.excerpt === "string" ? article.excerpt : "",
    alternates:  { languages: { ar: `/news/${slug}`, en: `/en/news/${slug}` } },
    openGraph: {
      title:       typeof article.title   === "string" ? article.title   : "",
      description: typeof article.excerpt === "string" ? article.excerpt : "",
      images:      imgUrl ? [imgUrl] : [],
      url:         `https://www.dandanaradio.com/news/${slug}`,
      type:        'article',
      siteName:    'راديو دندنة',
    },
  };
}

export const revalidate = 60;

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const shareUrl = `https://dandanaradio.com/news/${slug}`;
  const [article, categories] = await Promise.all([
    getArticleBySlug(slug, "ar"),
    getAllCategories("ar"),
  ]);

  if (!article) notFound();

  const imgUrl = typeof article.featuredImage === "object" && article.featuredImage !== null
    ? (article.featuredImage?.sizes?.hero?.url || article.featuredImage?.url)
    : null;
  const author   = typeof article.author   === "object" && article.author   !== null ? article.author   : null;
  const category = typeof article.category === "object" && article.category !== null ? article.category : null;

  const cats = categories.map((c) => ({
    id:   c.id,
    name: typeof c.name === "string" ? c.name : "",
    slug: c.slug,
  }));

  return (
    <div style={{ minHeight: "100vh", background: "var(--black-void)" }}>
      <NewsNav
        locale="ar"
        categories={cats}
        activeCategory={typeof category?.slug === "string" ? category.slug : undefined}
        currentSlug={slug}
      />

      <article dir="rtl" style={{
        maxWidth: "860px",
        margin:   "0 auto",
        padding:  "2rem clamp(1rem,4vw,2.5rem) 5rem",
      }}>

        {/* Category + date */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
          {category && (
            <span style={{
              background:   category.color || "var(--gold-mid)",
              color:        "#080808",
              padding:      "4px 14px",
              borderRadius: "20px",
              fontSize:     "0.75rem",
              fontWeight:   "600",
              fontFamily:   "'Cairo', sans-serif",
            }}>
              {typeof category.name === "string" ? category.name : ""}
            </span>
          )}
          {article.publishedAt && (
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
              {new Date(article.publishedAt).toLocaleDateString("ar-LB", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 style={{
          fontSize:     "clamp(1.75rem, 4vw, 2.5rem)",
          fontWeight:   "700",
          color:        "var(--gold-light)",
          lineHeight:   "1.4",
          marginBottom: "1rem",
          fontFamily:   "'Cairo', sans-serif",
        }}>
          {typeof article.title === "string" ? article.title : ""}
        </h1>

        {/* Excerpt */}
        <p style={{
          fontSize:     "1.1rem",
          color:        "var(--text-muted)",
          lineHeight:   "1.9",
          marginBottom: "1.5rem",
          fontFamily:   "'Cairo', sans-serif",
        }}>
          {typeof article.excerpt === "string" ? article.excerpt : ""}
        </p>

        {/* Author */}
        {author && (
          <div style={{
            display:       "flex",
            alignItems:    "center",
            gap:           "0.75rem",
            marginBottom:  "2rem",
            paddingBottom: "1.5rem",
            borderBottom:  "1px solid rgba(201,169,110,0.1)",
          }}>
            <div style={{
              width:          "36px",
              height:         "36px",
              borderRadius:   "50%",
              background:     "linear-gradient(135deg, var(--gold-deep), var(--gold-mid))",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              fontSize:       "0.85rem",
              fontWeight:     "700",
              color:          "#080808",
              fontFamily:     "'Cairo', sans-serif",
            }}>
              {(typeof author.name === "string" ? author.name : "?")[0]}
            </div>
            <span style={{ color: "var(--gold-mid)", fontSize: "0.9rem", fontFamily: "'Cairo', sans-serif" }}>
              {typeof author.name === "string" ? author.name : ""}
            </span>
          </div>
        )}

        {/* Featured image */}
        {imgUrl && (
          <div style={{
            position:     "relative",
            height:       "clamp(240px, 40vw, 480px)",
            borderRadius: "16px",
            overflow:     "hidden",
            marginBottom: "2.5rem",
          }}>
            <Image
              src={imgUrl}
              alt={typeof article.title === "string" ? article.title : ""}
              fill
              sizes="(max-width: 860px) 100vw, 860px"
              className="object-cover"
              unoptimized
              priority
            />
          </div>
        )}

        {/* Body — split after first paragraph to insert ad */}
        {article.body && (() => {
          const { before, after } = splitBodyForAd(article.body as Record<string, unknown>);
          return (
            <>
              <RichTextRenderer content={before} locale="ar" />
              <AdSlot placementKey="news_article_after_intro" locale="ar" />
              {after && <RichTextRenderer content={after} locale="ar" />}
            </>
          );
        })()}

        {/* Share buttons */}
        <div style={{ borderTop: "1px solid rgba(201,169,110,0.1)", marginBlockStart: "2.5rem", paddingBlockStart: "1.5rem" }}>
          <ShareButtons
            url={shareUrl}
            title={typeof article.title === "string" ? article.title : ""}
            locale="ar"
          />
        </div>

        {/* Back link */}
        <div style={{ marginTop: "3rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(201,169,110,0.1)" }}>
          <Link
            href="/news"
            style={{
              color:          "var(--gold-mid)",
              fontFamily:     "'Cairo', sans-serif",
              fontSize:       "0.9rem",
              textDecoration: "none",
              display:        "inline-flex",
              alignItems:     "center",
              gap:            "0.5rem",
            }}
          >
            ← العودة إلى الأخبار
          </Link>
        </div>
      </article>
    </div>
  );
}
