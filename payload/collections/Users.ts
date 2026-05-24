import type { CollectionConfig } from "payload";

const ALLOWED_EMAILS = (process.env.ALLOWED_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase());

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
    group: "System",
    defaultColumns: ["email", "name", "role"],
  },
  access: {
    create: ({ req }) => {
      const email = (req.user?.email || "").toLowerCase();
      const role = req.user?.role;
      return ALLOWED_EMAILS.includes(email) && (role === "super-admin" || role === "admin");
    },
    read: ({ req }) => {
      const role = req.user?.role;
      if (role === "super-admin" || role === "admin") return true;
      return { id: { equals: req.user?.id } };
    },
    update: ({ req }) => {
      const role = req.user?.role;
      return role === "super-admin" || role === "admin";
    },
    delete: ({ req }) => req.user?.role === "super-admin",
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "contributor",
      options: [
        { label: "Super Admin",  value: "super-admin" },
        { label: "Admin",        value: "admin" },
        { label: "Editor",       value: "editor" },
        { label: "Journalist",   value: "journalist" },
        { label: "Contributor",  value: "contributor" },
      ],
      access: {
        update: ({ req }) => req.user?.role === "super-admin",
      },
    },
    { name: "bio", type: "textarea", localized: true },
    { name: "avatar", type: "upload", relationTo: "media" },
  ],
};
