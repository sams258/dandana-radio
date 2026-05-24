import Link from "next/link";
import { getFeaturedArticles, getArticles, getAllCategories } from "../lib/payload";
import { ArticleCard } from "../components/news/ArticleCard";
import { NewsNav } from "../components/news/NewsNav";
import { AdSlot } from "../components/ads/AdSlot";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "أخبار | راديو دندنة",
  description: "آخر أخبار الموسيقى العربية والفنانين والحفلات",
  alternates:  { languages: { en: "/en/news", ar: "/news" } },
};

export const revalidate = 60;

export default async function NewsHomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;

  const [featured, recent, categories] = await Promise.all([
    getFeaturedArticles("ar"),
    getArticles({ locale: "ar", page }),
    getAllCategories("ar"),
  ]);

  const cats = categories.map((c) => ({
    id:   c.id,
    name: typeof c.name === "string" ? c.name : "",
    slug: c.slug,
  }));

  return (
    <div style={{ minHeight: "100vh", background: "var(--black-void)" }}>
      <NewsNav locale="ar" categories={cats} />

      <main dir="rtl" style={{
        maxWidth: "1200px",
        margin:   "0 auto",
        padding:  "2rem clamp(1rem,4vw,2.5rem) 4rem",
      }}>

        <AdSlot placementKey="news_home_top" locale="ar" />

        {/* Featured — magazine grid */}
        {featured.length > 0 && (
          <section style={{ marginBottom: "3rem" }}>
            <div dir="rtl" style={{
              display:             "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gridTemplateRows:    "auto auto",
              gap:                 "1.25rem",
            }}>
              {featured.slice(0, 3).map((article, i) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  locale="ar"
                  featured={i === 0}
                />
              ))}
            </div>
          </section>
        )}

        {/* Divider */}
        <div className="divider-gold" style={{ marginBottom: "2.5rem" }} />

        {/* Recent articles */}
        <section>
          <h2 style={{
            fontSize:     "1.25rem",
            fontWeight:   "600",
            color:        "var(--gold-light)",
            marginBottom: "1.5rem",
            fontFamily:   "'Cairo', sans-serif",
            direction:    "rtl",
          }}>
            آخر الأخبار
          </h2>

          <div dir="rtl" style={{
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap:                 "1.25rem",
          }}>
            {recent.docs.map((article) => (
              <ArticleCard key={article.id} article={article} locale="ar" />
            ))}
          </div>

          {/* Pagination */}
          {recent.totalPages > 1 && (
            <div style={{
              display:        "flex",
              justifyContent: "center",
              gap:            "0.75rem",
              marginTop:      "3rem",
            }}>
              {Array.from({ length: recent.totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/news?page=${p}`}
                  style={{
                    width:          "40px",
                    height:         "40px",
                    borderRadius:   "50%",
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    background:     p === recent.page
                      ? "linear-gradient(135deg, var(--gold-deep), var(--gold-mid))"
                      : "rgba(201,169,110,0.06)",
                    color:          p === recent.page ? "#080808" : "var(--gold-mid)",
                    border:         "1px solid rgba(201,169,110,0.2)",
                    textDecoration: "none",
                    fontSize:       "0.85rem",
                    fontFamily:     "monospace",
                  }}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
