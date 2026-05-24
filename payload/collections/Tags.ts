import type { CollectionConfig } from "payload";

export const Tags: CollectionConfig = {
  slug: "tags",
  admin: {
    useAsTitle: "name",
    group: "News",
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => ["super-admin", "admin", "editor"].includes(req.user?.role || ""),
    delete: ({ req }) => ["super-admin", "admin"].includes(req.user?.role || ""),
  },
  fields: [
    { name: "name", type: "text", required: true, localized: true },
    { name: "slug", type: "text", required: true, unique: true },
  ],
};
