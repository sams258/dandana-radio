import type { CollectionConfig } from "payload";
import {
  AD_TYPES,
  DEFAULT_SIZES,
  PAGE_SCOPES,
} from "../constants/ads";

export const AdPlacements: CollectionConfig = {
  slug: "ad-placements",
  admin: {
    useAsTitle: "name",
    group: "Advertising",
    defaultColumns: ["name", "key", "pageScope", "enabled", "updatedAt"],
  },
  access: {
    create: ({ req }) => ["super-admin", "admin"].includes(req.user?.role || ""),
    read:   ({ req }) => ["super-admin", "admin", "editor"].includes(req.user?.role || ""),
    update: ({ req }) => ["super-admin", "admin"].includes(req.user?.role || ""),
    delete: ({ req }) => req.user?.role === "super-admin",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      admin: { description: "Editor-facing label. Can be changed freely." },
    },
    {
      name: "key",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description:
          "Code-facing identifier used in <AdSlot placementKey=\"...\">. Lowercase, underscores only. NEVER rename after first use.",
      },
      validate: (value: unknown): string | true => {
        if (!value || typeof value !== "string") return "Key is required.";
        if (/^[a-z0-9_]+$/.test(value)) return true;
        return "Key must be lowercase letters, digits, and underscores only (no spaces or dashes).";
      },
    },
    {
      name: "description",
      type: "textarea",
      admin: { description: "Describes where this placement appears in the site." },
    },
    {
      name: "allowedTypes",
      type: "select",
      hasMany: true,
      required: true,
      options: AD_TYPES.map((t) => ({ label: t.charAt(0).toUpperCase() + t.slice(1), value: t })),
      admin: { description: "Which ad types are allowed in this placement." },
    },
    {
      name: "defaultSize",
      type: "select",
      required: true,
      options: DEFAULT_SIZES.map((s) => ({
        label: s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        value: s,
      })),
    },
    {
      name: "width",
      type: "number",
      admin: {
        description: "Custom width in px (only when Default Size is Custom).",
        condition: (_, siblingData) =>
          (siblingData as Record<string, unknown>)?.defaultSize === "custom",
      },
    },
    {
      name: "height",
      type: "number",
      admin: {
        description: "Custom height in px (only when Default Size is Custom).",
        condition: (_, siblingData) =>
          (siblingData as Record<string, unknown>)?.defaultSize === "custom",
      },
    },
    {
      name: "pageScope",
      type: "select",
      required: true,
      options: PAGE_SCOPES.map((s) => ({
        label: s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        value: s,
      })),
    },
    {
      name: "maxAds",
      type: "number",
      required: true,
      defaultValue: 1,
      min: 1,
      max: 10,
      admin: { description: "Maximum number of ads to serve from this placement at once." },
    },
    {
      name: "hideWhenEmpty",
      type: "checkbox",
      defaultValue: true,
      admin: { description: "Hide the placement entirely when no eligible ads are available." },
    },
    {
      name: "fallbackAd",
      type: "relationship",
      relationTo: "ads",
      hasMany: false,
      admin: { description: "Ad to show when no eligible ads are found." },
    },
    {
      name: "enabled",
      type: "checkbox",
      defaultValue: true,
      admin: { description: "Disable to stop serving all ads in this placement without deleting it." },
    },
    {
      name: "createdBy",
      type: "relationship",
      relationTo: "users",
      hasMany: false,
      admin: { readOnly: true, position: "sidebar" },
    },
    {
      name: "updatedBy",
      type: "relationship",
      relationTo: "users",
      hasMany: false,
      admin: { readOnly: true, position: "sidebar" },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (operation === "create") {
          data.createdBy = req.user?.id;
        }
        data.updatedBy = req.user?.id;
        return data;
      },
    ],
  },
};
