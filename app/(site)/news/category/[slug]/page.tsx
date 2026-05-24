import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryBySlug, getArticles, getAllCategories, getAllCategorySlugs } from "../../../lib/payload";
import { ArticleCard } from "../../../components/news/ArticleCard";
import { NewsNav } from "../../../components/news/NewsNav";

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllCategorySlugs();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug, "ar");
  if (!category) return { title: "تصنيف غير موجود | راديو دندنة" };
  return {
    title:      `${typeof category.name === "string" ? category.name : ""} | راديو دندنة`,
    alternates: { languages: { ar: `/news/category/${slug}`, en: `/en/news/category/${slug}` } },
  };
}

export const revalidate = 60;

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const [category, articles, categories] = await Promise.all([
    getCategoryBySlug(slug, "ar"),
    getArticles({ locale: "ar", category: slug }),
    getAllCategories("ar"),
  ]);

  if (!category) notFound();

  const cats = categories.map((c) => ({
    id:   c.id,
    name: typeof c.name === "string" ? c.name : "",
    slug: c.slug,
  }));

  return (
    <div style={{ minHeight: "100vh", background: "var(--black-void)" }}>
      <NewsNav locale="ar" categories={cats} activeCategory={slug} currentCategory={slug} />

      <main dir="rtl" style={{
        maxWidth: "1200px",
        margin:   "0 auto",
        padding:  "2rem clamp(1rem,4vw,2.5rem) 4rem",
      }}>
        <h1 style={{
          fontSize:     "2rem",
          fontWeight:   "700",
          color:        "var(--gold-light)",
          marginBottom: "0.5rem",
          fontFamily:   "'Cairo', sans-serif",
          direction:    "rtl",
        }}>
          {typeof category.name === "string" ? category.name : ""}
        </h1>

        {category.description && (
          <p style={{
            color:        "var(--text-muted)",
            marginBottom: "2rem",
            fontFamily:   "'Cairo', sans-serif",
            direction:    "rtl",
          }}>
            {typeof category.description === "string" ? category.description : ""}
          </p>
        )}

        <div className="divider-gold" style={{ marginBottom: "2rem" }} />

        {articles.docs.length === 0 ? (
          <p style={{
            color:      "var(--text-muted)",
            fontFamily: "'Cairo', sans-serif",
            direction:  "rtl",
          }}>
            لا توجد مقالات في هذا التصنيف بعد.
          </p>
        ) : (
          <div dir="rtl" style={{
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap:                 "1.25rem",
          }}>
            {articles.docs.map((article) => (
              <ArticleCard key={article.id} article={article} locale="ar" />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
