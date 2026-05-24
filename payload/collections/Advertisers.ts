import type { CollectionConfig } from "payload";

export const Advertisers: CollectionConfig = {
  slug: "advertisers",
  admin: {
    useAsTitle: "name",
    group: "Advertising",
    defaultColumns: ["name", "status", "contactName", "updatedAt"],
  },
  access: {
    create: ({ req }) => ["super-admin", "admin"].includes(req.user?.role || ""),
    read:   ({ req }) => ["super-admin", "admin", "editor"].includes(req.user?.role || ""),
    update: ({ req }) => ["super-admin", "admin"].includes(req.user?.role || ""),
    delete: ({ req }) => req.user?.role === "super-admin",
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      unique: true,
      admin: {
        description: "Auto-generated from name on create. Do not change after first save.",
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value;
            const name = (data?.name as string | undefined) || "";
            return name
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, "")
              .replace(/\s+/g, "-")
              .replace(/-+/g, "-")
              .substring(0, 100);
          },
        ],
      },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "active",
      options: [
        { label: "Active",   value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
    {
      name: "websiteUrl",
      type: "text",
      admin: { description: "Must start with https://" },
      validate: (value: unknown): string | true => {
        if (!value) return true;
        if (typeof value === "string" && value.startsWith("https://")) return true;
        return "Website URL must start with https://";
      },
    },
    { name: "contactName",  type: "text" },
    { name: "contactEmail", type: "email" },
    { name: "logo",         type: "upload", relationTo: "media" },
    { name: "notes",        type: "textarea" },
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
