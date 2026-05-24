import configPromise from "../../../payload.config";
import { getPayload } from "payload";
import type { Where } from "payload";

// ── Minimal types (payload-types.ts not yet generated) ────────

export interface MediaSize {
  url?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface Media {
  id: string | number;
  url?: string | null;
  filename?: string | null;
  alt?: string | null;
  sizes?: {
    thumbnail?: MediaSize;
    hero?: MediaSize;
    logo?: MediaSize;
  };
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  role?: string;
}

export interface Tag {
  id: string | number;
  name: string;
  slug: string;
}

export interface Category {
  id: string | number;
  name: string;
  slug: string;
  description?: string | null;
  color?: string | null;
  parent?: Category | string | number | null;
}

export interface Article {
  id: string | number;
  title: string;
  slug: string;
  excerpt?: string | null;
  featuredImage?: Media | string | number | null;
  body?: Record<string, unknown> | null;
  category?: Category | string | number | null;
  tags?: (Tag | string | number)[] | null;
  author?: User | string | number | null;
  status?: string | null;
  publishedAt?: string | null;
  featured?: boolean | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: Media | string | number | null;
}

// ─────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 12;

async function getPayloadInstance() {
  return getPayload({ config: configPromise });
}

export async function getArticles({
  page = 1,
  category,
  locale = "ar",
}: {
  page?: number;
  category?: string;
  locale?: "ar" | "en";
}) {
  const payload = await getPayloadInstance();

  const where: Where = {
    status: { equals: "published" },
    publishedAt: { less_than_equal: new Date().toISOString() },
  };

  if (category) {
    where["category.slug"] = { equals: category };
  }

  const result = await payload.find({
    collection: "articles",
    where,
    sort:           "-publishedAt",
    limit:          ITEMS_PER_PAGE,
    page,
    locale,
    fallbackLocale: "en",
    depth:          2,
  });

  return result as unknown as {
    docs: Article[];
    totalDocs: number;
    totalPages: number;
    page: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
  };
}

export async function getArticleBySlug(slug: string, locale: "ar" | "en" = "ar") {
  const payload = await getPayloadInstance();

  const result = await payload.find({
    collection: "articles",
    where: {
      slug:   { equals: slug },
      status: { equals: "published" },
    },
    locale,
    fallbackLocale: "en",
    depth:          3,
    limit:          1,
  });

  return (result.docs[0] ?? null) as Article | null;
}

export async function getFeaturedArticles(locale: "ar" | "en" = "ar") {
  const payload = await getPayloadInstance();

  const result = await payload.find({
    collection: "articles",
    where: {
      status:   { equals: "published" },
      featured: { equals: true },
    },
    sort:           "-publishedAt",
    limit:          5,
    locale,
    fallbackLocale: "en",
    depth:          2,
  });

  return result.docs as unknown as Article[];
}

export async function getCategoryBySlug(slug: string, locale: "ar" | "en" = "ar") {
  const payload = await getPayloadInstance();

  const result = await payload.find({
    collection:     "categories",
    where:          { slug: { equals: slug } },
    locale,
    fallbackLocale: "en",
    limit:          1,
  });

  return (result.docs[0] ?? null) as Category | null;
}

export async function getAllCategories(locale: "ar" | "en" = "ar") {
  const payload = await getPayloadInstance();

  const result = await payload.find({
    collection:     "categories",
    locale,
    fallbackLocale: "en",
    limit:          100,
    sort:           "name",
  });

  return result.docs as unknown as Category[];
}

export async function getAllArticleSlugs() {
  const payload = await getPayloadInstance();

  const result = await payload.find({
    collection: "articles",
    where: { status: { equals: "published" } },
    limit: 1000,
    select: { slug: true },
  });

  return result.docs.map((doc) => ({ slug: (doc as unknown as { slug: string }).slug }));
}

export async function getAllCategorySlugs() {
  const payload = await getPayloadInstance();

  const result = await payload.find({
    collection: "categories",
    limit: 100,
    select: { slug: true },
  });

  return result.docs.map((doc) => ({ slug: (doc as unknown as { slug: string }).slug }));
}
