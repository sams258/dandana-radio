import type { CollectionConfig } from "payload";

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
    group: "Content",
    description: "Page structure and section ordering.",
    defaultColumns: ["title", "slug", "updatedAt"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "URL identifier e.g. home, about — lowercase no spaces",
      },
    },
    {
      name: "sections",
      type: "blocks",
      label: "Page Sections",
      admin: {
        description: "Drag to reorder sections. Add or remove sections as needed.",
      },
      blocks: [
        {
          slug: "hero",
          labels: { singular: "Hero Section", plural: "Hero Sections" },
          fields: [
            { name: "enabled", type: "checkbox", defaultValue: true },
            { name: "tagline", type: "text", localized: true },
            { name: "subtitle", type: "text", localized: true },
            { name: "ctaPrimaryLabel", type: "text", localized: true },
            { name: "ctaSecondaryLabel", type: "text", localized: true },
          ],
        },
        {
          slug: "player",
          labels: { singular: "Radio Player", plural: "Radio Players" },
          fields: [
            { name: "enabled", type: "checkbox", defaultValue: true },
            { name: "streamUrl", type: "text", admin: { description: "Override the default stream URL" } },
          ],
        },
        {
          slug: "about",
          labels: { singular: "About Section", plural: "About Sections" },
          fields: [
            { name: "enabled", type: "checkbox", defaultValue: true },
            { name: "title", type: "text", localized: true },
            { name: "body", type: "textarea", localized: true },
          ],
        },
        {
          slug: "schedule",
          labels: { singular: "Schedule Section", plural: "Schedule Sections" },
          fields: [
            { name: "enabled", type: "checkbox", defaultValue: true },
            { name: "title", type: "text", localized: true },
          ],
        },
        {
          slug: "contact",
          labels: { singular: "Contact Section", plural: "Contact Sections" },
          fields: [
            { name: "enabled", type: "checkbox", defaultValue: true },
            { name: "title", type: "text", localized: true },
          ],
        },
      ],
    },
    {
      name: "seo",
      type: "group",
      fields: [
        { name: "metaTitle",       type: "text",     localized: true },
        { name: "metaDescription", type: "textarea", localized: true },
      ],
    },
  ],
};
