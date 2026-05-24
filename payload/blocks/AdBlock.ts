import type { Block } from "payload";

// Single source of truth for the AdBlock — imported by Articles (Lexical) and Pages (sections).
export const AdBlock: Block = {
  slug: "adBlock",
  labels: { singular: "Ad Placement", plural: "Ad Placements" },
  fields: [
    {
      name: "placement",
      type: "relationship",
      relationTo: "ad-placements",
      required: true,
      hasMany: false,
      admin: { description: "Which ad placement slot to render here." },
    },
    {
      name: "showLabel",
      type: "checkbox",
      defaultValue: true,
      admin: { description: "Show the sponsored/ad label above the ad." },
    },
    {
      name: "labelOverride",
      type: "text",
      localized: true,
      admin: { description: "Override the ad's own label text. Leave blank to use the ad's label." },
    },
  ],
};
