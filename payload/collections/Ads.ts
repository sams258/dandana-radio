import type { CollectionConfig } from "payload";
import {
  AD_TYPES,
  AD_STATUSES,
  AD_LOCALES,
  AD_LABEL_TYPES,
  ALLOWED_AD_EMBED_HOSTS,
} from "../constants/ads";

export const Ads: CollectionConfig = {
  slug: "ads",
  admin: {
    useAsTitle: "title",
    group: "Advertising",
    defaultColumns: ["title", "advertiser", "type", "status", "locale", "endDate", "updatedAt"],
  },
  access: {
    create: ({ req }) => ["super-admin", "admin"].includes(req.user?.role || ""),
    read:   ({ req }) => ["super-admin", "admin", "editor"].includes(req.user?.role || ""),
    update: ({ req }) => ["super-admin", "admin"].includes(req.user?.role || ""),
    delete: ({ req }) => req.user?.role === "super-admin",
  },
  fields: [
    // ── Always visible ──────────────────────────────────────────────────────
    {
      name: "title",
      type: "text",
      required: true,
      admin: { description: "Internal name only, e.g. 'Rotana Q2 Banner AR'. Not shown to users." },
    },
    {
      name: "advertiser",
      type: "relationship",
      relationTo: "advertisers",
      required: true,
      hasMany: false,
    },
    {
      name: "type",
      type: "select",
      required: true,
      options: AD_TYPES.map((t) => ({
        label: t.charAt(0).toUpperCase() + t.slice(1),
        value: t,
      })),
      admin: { description: "Changing type shows/hides the relevant fields below." },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: AD_STATUSES.map((s) => ({
        label: s.charAt(0).toUpperCase() + s.slice(1),
        value: s,
      })),
    },
    {
      name: "locale",
      type: "select",
      required: true,
      defaultValue: "ar",
      options: AD_LOCALES.map((l) => ({
        label: l === "both" ? "Both (AR + EN)" : l.toUpperCase(),
        value: l,
      })),
      admin: { description: "Which audience locale(s) this ad targets." },
    },
    {
      name: "labelType",
      type: "select",
      required: true,
      defaultValue: "ad",
      options: AD_LABEL_TYPES.map((l) => ({
        label: l.charAt(0).toUpperCase() + l.slice(1),
        value: l,
      })),
    },
    {
      name: "customLabelAr",
      type: "text",
      admin: {
        description: "Arabic label shown above the ad (only when Label Type is Custom).",
        condition: (_, siblingData) =>
          (siblingData as Record<string, unknown>)?.labelType === "custom",
      },
      validate: (value: unknown, { data }: { data: unknown }): string | true => {
        const d = data as Record<string, unknown>;
        if (d?.labelType !== "custom") return true;
        if (value && typeof value === "string" && value.trim()) return true;
        return "Custom Arabic label is required when Label Type is Custom.";
      },
    },
    {
      name: "customLabelEn",
      type: "text",
      admin: {
        description: "English label shown above the ad (only when Label Type is Custom).",
        condition: (_, siblingData) =>
          (siblingData as Record<string, unknown>)?.labelType === "custom",
      },
      validate: (value: unknown, { data }: { data: unknown }): string | true => {
        const d = data as Record<string, unknown>;
        if (d?.labelType !== "custom") return true;
        if (value && typeof value === "string" && value.trim()) return true;
        return "Custom English label is required when Label Type is Custom.";
      },
    },
    {
      name: "clickUrl",
      type: "text",
      required: true,
      admin: { description: "Destination URL when the ad is clicked. Must be https://." },
    },
    {
      name: "openInNewTab",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description:
          "Open click URL in a new tab. Auto-set on create: true for external URLs, false for internal (/... or dandanaradio.com).",
      },
    },
    {
      name: "requiresConsent",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description:
          "Auto-set on create: true for embed ads (third-party scripts), false for all other types.",
      },
    },

    // ── Conditional on type ─────────────────────────────────────────────────
    {
      name: "media",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Image, video file, or audio file for this ad.",
        condition: (_, siblingData) => {
          const type = (siblingData as Record<string, unknown>)?.type as string | undefined;
          return ["image", "video", "audio"].includes(type || "");
        },
      },
    },
    {
      name: "mobileSrc",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Optional smaller image/video shown below 768px breakpoint.",
        condition: (_, siblingData) => {
          const type = (siblingData as Record<string, unknown>)?.type as string | undefined;
          return ["image", "video"].includes(type || "");
        },
      },
    },
    {
      name: "alt",
      type: "text",
      localized: true,
      admin: {
        description: "Alt text for accessibility (required for image/video ads). Fill in both AR and EN.",
        condition: (_, siblingData) => {
          const type = (siblingData as Record<string, unknown>)?.type as string | undefined;
          return ["image", "video"].includes(type || "");
        },
      },
    },
    {
      name: "textContent",
      type: "textarea",
      localized: true,
      admin: {
        description: "Ad copy text (required for text ads). Fill in both AR and EN.",
        condition: (_, siblingData) =>
          (siblingData as Record<string, unknown>)?.type === "text",
      },
    },
    {
      name: "embedProvider",
      type: "text",
      admin: {
        description: "Label only — e.g. \"Google Ad Manager\". Not used in rendering.",
        condition: (_, siblingData) =>
          (siblingData as Record<string, unknown>)?.type === "embed",
      },
    },
    {
      name: "embedUrl",
      type: "text",
      admin: {
        description: "Full URL from your ad server. Domain must be in the approved whitelist.",
        condition: (_, siblingData) =>
          (siblingData as Record<string, unknown>)?.type === "embed",
      },
      validate: (value: unknown, { data }: { data: unknown }): string | true => {
        const d = data as Record<string, unknown>;
        if (d?.type !== "embed") return true;
        if (!value || typeof value !== "string") return "Embed URL is required for embed ads.";
        try {
          const { hostname } = new URL(value);
          if (ALLOWED_AD_EMBED_HOSTS.includes(hostname)) return true;
          return "Embed URL domain is not in the approved whitelist.";
        } catch {
          return "Embed URL is not a valid URL.";
        }
      },
    },

    // ── Scheduling ──────────────────────────────────────────────────────────
    {
      name: "startDate",
      type: "date",
      admin: {
        date: { pickerAppearance: "dayAndTime" },
        description: "When this ad becomes eligible. Leave blank to start immediately.",
      },
    },
    {
      name: "endDate",
      type: "date",
      admin: {
        date: { pickerAppearance: "dayAndTime" },
        description: "When this ad stops being served. Leave blank to run indefinitely.",
      },
    },

    // ── Audit trail ─────────────────────────────────────────────────────────
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
    {
      name: "pausedAt",
      type: "date",
      admin: { readOnly: true, position: "sidebar" },
    },
    {
      name: "pausedBy",
      type: "relationship",
      relationTo: "users",
      hasMany: false,
      admin: { readOnly: true, position: "sidebar" },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req, operation, originalDoc }) => {
        // Audit fields
        if (operation === "create") {
          data.createdBy = req.user?.id;

          // Compute openInNewTab default on create
          if (data.openInNewTab === undefined || data.openInNewTab === null) {
            const url: string = data.clickUrl || "";
            const isInternal =
              url.startsWith("/") || url.includes("dandanaradio.com");
            data.openInNewTab = !isInternal;
          }

          // Compute requiresConsent default on create
          if (data.requiresConsent === undefined || data.requiresConsent === null) {
            data.requiresConsent = data.type === "embed";
          }
        }

        data.updatedBy = req.user?.id;

        // Paused status transitions
        const prevStatus = (originalDoc as Record<string, unknown> | undefined)?.status;
        if (prevStatus !== "paused" && data.status === "paused") {
          data.pausedAt = new Date().toISOString();
          data.pausedBy = req.user?.id;
        } else if (prevStatus === "paused" && data.status !== "paused") {
          data.pausedAt = null;
          data.pausedBy = null;
        }

        // Alt text validation for image/video
        if (["image", "video"].includes(data.type)) {
          const alt = data.alt as unknown;
          const hasAlt =
            (typeof alt === "string" && alt.trim().length > 0) ||
            (typeof alt === "object" &&
              alt !== null &&
              ((alt as Record<string, string>).ar?.trim() ||
                (alt as Record<string, string>).en?.trim()));
          if (!hasAlt) {
            throw new Error("Alt text is required for image and video ads.");
          }
        }

        return data;
      },
    ],
  },
};
