import type { Payload } from "payload";

const PLACEMENTS = [
  {
    name:          "News Article — After Intro",
    key:           "news_article_after_intro",
    description:   "Appears after the first paragraph in all article pages",
    allowedTypes:  ["image", "text"],
    defaultSize:   "rectangle",
    pageScope:     "news_article",
    maxAds:        1,
    hideWhenEmpty: true,
    enabled:       true,
  },
  {
    name:          "News Home — Top Banner",
    key:           "news_home_top",
    description:   "Appears at the top of the news listing page, above the featured article",
    allowedTypes:  ["image", "text"],
    defaultSize:   "leaderboard",
    pageScope:     "news_home",
    maxAds:        1,
    hideWhenEmpty: true,
    enabled:       true,
  },
] as const;

// Called from payload.config.ts onInit. Safe to call on every startup — checks before inserting.
// Skips gracefully if the table hasn't been migrated yet (e.g. during next build).
export async function seedAdPlacements(payload: Payload): Promise<void> {
  try {
    for (const placement of PLACEMENTS) {
      const existing = await payload.find({
        collection: "ad-placements",
        where: { key: { equals: placement.key } },
        limit: 1,
        overrideAccess: true,
      });

      if (existing.docs.length > 0) continue;

      await payload.create({
        collection: "ad-placements",
        data: placement,
        overrideAccess: true,
      });

      payload.logger.info(`[seed] Created ad placement: ${placement.key}`);
    }
  } catch (err: unknown) {
    // Table may not exist yet (pre-migration build/cold start). Skip silently.
    const code =
      (err as { code?: string })?.code ??
      (err as { cause?: { code?: string } })?.cause?.code;
    if (code === "42P01") return; // PostgreSQL: relation does not exist yet
    // Check wrapped Payload error messages as a fallback
    const msg = (err as { message?: string })?.message ?? "";
    if (msg.includes("does not exist")) return;
    payload.logger.error({ err }, "[seed] seedAdPlacements failed");
  }
}
