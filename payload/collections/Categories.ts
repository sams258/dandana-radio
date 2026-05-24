import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
    group: "News",
    defaultColumns: ["name", "slug", "parent"],
  },
  access: {
    read: () => true,
    create: ({ req }) => ["super-admin", "admin", "editor"].includes(req.user?.role || ""),
    update: ({ req }) => ["super-admin", "admin", "editor"].includes(req.user?.role || ""),
    delete: ({ req }) => ["super-admin", "admin"].includes(req.user?.role || ""),
  },
  fields: [
    { name: "name", type: "text", required: true, localized: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { description: "URL identifier, e.g. music-news" },
    },
    { name: "description", type: "textarea", localized: true },
    { name: "parent", type: "relationship", relationTo: "categories" },
    { name: "color", type: "text", admin: { description: "Hex color for category badge, e.g. #C9A96E" } },
  ],
};
