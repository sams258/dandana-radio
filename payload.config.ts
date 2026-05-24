import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import sharp from "sharp";

import { Users } from "./payload/collections/Users";
import { Pages } from "./payload/collections/Pages";
import { Translations } from "./payload/collections/Translations";
import { Media } from "./payload/collections/Media";
import { Articles } from "./payload/collections/Articles";
import { Categories } from "./payload/collections/Categories";
import { Tags } from "./payload/collections/Tags";

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
      { label: "English",  code: "en" },
    ],
    defaultLocale: "ar",
    fallback: true,
  },
  admin: {
    user: "users",
    meta: { titleSuffix: "— Dandana Radio CMS" },
  },
  collections: [Users, Pages, Translations, Media, Articles, Categories, Tags],
  plugins: [
    s3Storage({
      collections: { media: true },
      bucket: process.env.R2_BUCKET_NAME || "",
      config: {
        endpoint: process.env.R2_ENDPOINT,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
        },
        region: "auto",
        forcePathStyle: true,
      },
    }),
  ],
  typescript: { outputFile: "payload-types.ts" },
});
