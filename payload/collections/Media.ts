import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "filename",
    group: "Content",
    description: "Logos, hero images, and other media assets.",
  },
  access: {
    read: () => true,
  },
  upload: {
    staticDir: "public/uploads",
    imageSizes: [
      { name: "thumbnail", width: 300,  height: 300,  position: "centre" },
      { name: "hero",      width: 1200, height: 630,  position: "centre" },
      { name: "logo",      width: 400,  height: 400,  position: "centre" },
    ],
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      localized: true,
      admin: { description: "Alt text for accessibility and SEO" },
    },
    {
      name: "caption",
      type: "text",
      localized: true,
    },
    {
      name: "usage",
      type: "select",
      options: [
        { label: "Logo",        value: "logo" },
        { label: "Hero Image",  value: "hero" },
        { label: "General",     value: "general" },
      ],
      defaultValue: "general",
    },
  ],
};
