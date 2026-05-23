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
  },
  access: {
    create: ({ req }) => {
      const email = (req.user?.email || "").toLowerCase();
      return ALLOWED_EMAILS.includes(email);
    },
    read: () => true,
    update: ({ req }) => {
      const email = (req.user?.email || "").toLowerCase();
      return ALLOWED_EMAILS.includes(email);
    },
    delete: () => false,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "select",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
      defaultValue: "editor",
    },
  ],
};
