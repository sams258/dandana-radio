import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";
import { Users } from "./payload/collections/Users";
import { Pages } from "./payload/collections/Pages";
import { Translations } from "./payload/collections/Translations";
import { Media } from "./payload/collections/Media";

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || process.env.NEXTAUTH_SECRET || "",
  db: postgresAdapter({
    pool: { connectionString: process.env.POSTGRES_URL || "" },
  }),
  editor: lexicalEditor({}),
  sharp,
  localization: {
    locales: [
      { label: "العربية", code: "ar" },
      { label: "English", code: "en" },
    ],
    defaultLocale: "ar",
    fallback: true,
  },
  admin: {
    user: "users",
    meta: {
      titleSuffix: "— Dandana Radio CMS",
    },
  },
  collections: [Users, Pages, Translations, Media],
  globals: [],
  typescript: {
    outputFile: "payload-types.ts",
  },
});
