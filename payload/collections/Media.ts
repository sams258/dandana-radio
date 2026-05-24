import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "filename",
    group: "Content",
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => ["super-admin", "admin"].includes(req.user?.role || ""),
  },
  upload: {
    imageSizes: [
      { name: "thumbnail", width: 300,  height: 300,  position: "centre" },
      { name: "hero",      width: 1200, height: 630,  position: "centre" },
      { name: "logo",      width: 400,  height: 400,  position: "centre" },
    ],
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/*", "audio/*", "video/*"],
  },
  fields: [
    { name: "alt", type: "text", localized: true, admin: { description: "Alt text for accessibility" } },
    { name: "caption", type: "text", localized: true },
    {
      name: "usage",
      type: "select",
      defaultValue: "general",
      options: [
        { label: "Logo",          value: "logo" },
        { label: "Hero Image",    value: "hero" },
        { label: "Article Image", value: "article" },
        { label: "Audio File",    value: "audio" },
        { label: "Video File",    value: "video" },
        { label: "General",       value: "general" },
      ],
    },
  ],
};
