import type { CollectionConfig } from "payload";
import {
  lexicalEditor,
  HeadingFeature,
  BlockquoteFeature,
  LinkFeature,
  UploadFeature,
  BlocksFeature,
} from "@payloadcms/richtext-lexical";
import { AdBlock } from "../blocks/AdBlock";

export const Articles: CollectionConfig = {
  slug: "articles",
  admin: {
    useAsTitle: "title",
    group: "News",
    defaultColumns: ["title", "category", "status", "publishedAt", "author"],
    description: "News articles, published or in draft.",
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true;
      return { status: { equals: "published" } };
    },
    create: ({ req }) => !!req.user,
    update: ({ req }) => {
      const role = req.user?.role;
      if (["super-admin", "admin", "editor"].includes(role || "")) return true;
      return { author: { equals: req.user?.id } };
    },
    delete: ({ req }) => ["super-admin", "admin"].includes(req.user?.role || ""),
  },
  versions: {
    drafts: { autosave: { interval: 2000 } },
    maxPerDoc: 20,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [
            { name: "title", type: "text", required: true, localized: true },
            {
              name: "slug",
              type: "text",
              required: true,
              unique: true,
              admin: { description: "URL slug. Auto-generated from English title if left blank." },
              hooks: {
                beforeValidate: [
                  ({ value, data }) => {
                    if (value) return value;
                    const title = data?.title?.en || data?.title?.ar || "";
                    return title
                      .toLowerCase()
                      .replace(/[^a-z0-9؀-ۿ\s-]/g, "")
                      .replace(/\s+/g, "-")
                      .replace(/-+/g, "-")
                      .substring(0, 100);
                  },
                ],
              },
            },
            {
              name: "excerpt",
              type: "textarea",
              required: true,
              localized: true,
              admin: { description: "Short summary shown in article cards and previews." },
            },
            { name: "featuredImage", type: "upload", relationTo: "media", required: true },
            {
              name: "body",
              type: "richText",
              required: true,
              localized: true,
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                  HeadingFeature({ enabledHeadingSizes: ["h2", "h3", "h4"] }),
                  BlockquoteFeature(),
                  LinkFeature({}),
                  UploadFeature({
                    collections: { media: { fields: [] } },
                  }),
                  BlocksFeature({
                    blocks: [
                      {
                        slug: "audioEmbed",
                        labels: { singular: "Audio Player", plural: "Audio Players" },
                        fields: [
                          {
                            name: "audio",
                            type: "upload",
                            relationTo: "media",
                            required: true,
                            admin: { description: "Upload MP3 or audio file" },
                          },
                          { name: "title", type: "text", localized: true },
                          { name: "description", type: "textarea", localized: true },
                        ],
                      },
                      {
                        slug: "videoEmbed",
                        labels: { singular: "Video Embed", plural: "Video Embeds" },
                        fields: [
                          {
                            name: "url",
                            type: "text",
                            required: true,
                            admin: { description: "YouTube, Vimeo, or direct MP4 URL" },
                          },
                          { name: "caption", type: "text", localized: true },
                        ],
                      },
                      {
                        slug: "imageGallery",
                        labels: { singular: "Image Gallery", plural: "Image Galleries" },
                        fields: [
                          {
                            name: "images",
                            type: "array",
                            minRows: 2,
                            fields: [
                              { name: "image", type: "upload", relationTo: "media", required: true },
                              { name: "caption", type: "text", localized: true },
                            ],
                          },
                        ],
                      },
                      {
                        slug: "pullQuote",
                        labels: { singular: "Pull Quote", plural: "Pull Quotes" },
                        fields: [
                          { name: "quote", type: "textarea", required: true, localized: true },
                          { name: "attribution", type: "text", localized: true },
                        ],
                      },
                      {
                        slug: "infoBox",
                        labels: { singular: "Info Box", plural: "Info Boxes" },
                        fields: [
                          { name: "title", type: "text", localized: true },
                          { name: "body", type: "textarea", required: true, localized: true },
                          {
                            name: "variant",
                            type: "select",
                            defaultValue: "info",
                            options: [
                              { label: "Info",    value: "info" },
                              { label: "Warning", value: "warning" },
                              { label: "Success", value: "success" },
                            ],
                          },
                        ],
                      },
                      AdBlock,
                    ],
                  }),
                ],
              }),
            },
          ],
        },
        {
          label: "Taxonomy",
          fields: [
            { name: "category", type: "relationship", relationTo: "categories", required: true },
            { name: "tags", type: "relationship", relationTo: "tags", hasMany: true },
            {
              name: "author",
              type: "relationship",
              relationTo: "users",
              required: true,
              admin: { description: "Article author" },
            },
          ],
        },
        {
          label: "Publishing",
          fields: [
            {
              name: "status",
              type: "select",
              required: true,
              defaultValue: "draft",
              options: [
                { label: "Draft",     value: "draft" },
                { label: "In Review", value: "review" },
                { label: "Approved",  value: "approved" },
                { label: "Published", value: "published" },
                { label: "Rejected",  value: "rejected" },
                { label: "Archived",  value: "archived" },
              ],
              access: {
                update: ({ req, data }) => {
                  const role = req.user?.role;
                  if (["super-admin", "admin", "editor"].includes(role || "")) return true;
                  return ["draft", "review"].includes(data?.status || "");
                },
              },
            },
            {
              name: "publishedAt",
              type: "date",
              admin: {
                date: { pickerAppearance: "dayAndTime" },
                description: "When the article should go live. Leave blank for immediate publishing.",
              },
            },
            {
              name: "featured",
              type: "checkbox",
              defaultValue: false,
              admin: { description: "Show in Headlines block on the home page." },
            },
            {
              name: "rejectionNotes",
              type: "textarea",
              admin: {
                condition: (data) => data?.status === "rejected",
                description: "Notes from editor explaining the rejection.",
              },
            },
          ],
        },
        {
          label: "SEO",
          fields: [
            { name: "metaTitle", type: "text", localized: true },
            { name: "metaDescription", type: "textarea", localized: true },
            { name: "ogImage", type: "upload", relationTo: "media" },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        if (!data.author && req.user) {
          data.author = req.user.id;
        }
        if (data.status === "published" && !data.publishedAt) {
          data.publishedAt = new Date().toISOString();
        }
        return data;
      },
    ],
  },
};
