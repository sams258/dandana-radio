import Link from "next/link";
import { getFeaturedArticles, getArticles, getAllCategories } from "../../lib/payload";
import { ArticleCard } from "../../components/news/ArticleCard";
import { NewsNav } from "../../components/news/NewsNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "News | Radio Dandana",
  description: "Latest Arabic music news, artists, and events",
  alternates:  { languages: { en: "/en/news", ar: "/news" } },
};

export const revalidate = 60;

export default async function EnNewsHomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;

  const [featured, recent, categories] = await Promise.all([
    getFeaturedArticles("en"),
    getArticles({ locale: "en", page }),
    getAllCategories("en"),
  ]);

  const cats = categories.map((c) => ({
    id:   c.id,
    name: typeof c.name === "string" ? c.name : "",
    slug: c.slug,
  }));

  return (
    <div style={{ minHeight: "100vh", background: "var(--black-void)" }}>
      <NewsNav locale="en" categories={cats} />

      <main dir="ltr" style={{
        maxWidth: "1200px",
        margin:   "0 auto",
        padding:  "2rem clamp(1rem,4vw,2.5rem) 4rem",
      }}>

        {/* Featured — magazine grid */}
        {featured.length > 0 && (
          <section style={{ marginBottom: "3rem" }}>
            <div dir="ltr" style={{
              display:             "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gridTemplateRows:    "auto auto",
              gap:                 "1.25rem",
            }}>
              {featured.slice(0, 3).map((article, i) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  locale="en"
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
            direction:    "ltr",
          }}>
            Latest News
          </h2>

          <div dir="ltr" style={{
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap:                 "1.25rem",
          }}>
            {recent.docs.map((article) => (
              <ArticleCard key={article.id} article={article} locale="en" />
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
                  href={`/en/news?page=${p}`}
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
