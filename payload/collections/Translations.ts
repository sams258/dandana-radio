import type { CollectionConfig } from "payload";

export const Translations: CollectionConfig = {
  slug: "translations",
  admin: {
    useAsTitle: "key",
    group: "Content",
    description: "All text content displayed on the website in Arabic and English.",
    defaultColumns: ["key", "section", "updatedAt"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "key",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "Unique identifier e.g. hero.tagline — do not change after creation",
        readOnly: false,
      },
    },
    {
      name: "section",
      type: "select",
      required: true,
      options: [
        { label: "Navigation", value: "nav" },
        { label: "Hero",       value: "hero" },
        { label: "Player",     value: "player" },
        { label: "About",      value: "about" },
        { label: "Schedule",   value: "schedule" },
        { label: "Contact",    value: "contact" },
        { label: "Footer",     value: "footer" },
      ],
    },
    {
      name: "arabic",
      label: "Arabic (العربية)",
      type: "textarea",
      required: true,
      admin: {
        rtl: true,
        description: "Arabic text shown when the site is in Arabic mode",
      },
    },
    {
      name: "english",
      label: "English",
      type: "textarea",
      required: true,
      admin: {
        description: "English text shown when the site is in English mode",
      },
    },
    {
      name: "notes",
      type: "textarea",
      admin: {
        description: "Internal notes for editors — not shown on the website",
      },
    },
  ],
};
