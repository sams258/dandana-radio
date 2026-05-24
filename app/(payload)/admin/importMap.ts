import { CollectionCards } from "@payloadcms/next/rsc";
import { S3ClientUploadHandler } from "@payloadcms/storage-s3/client";
import { RscEntryLexicalCell, RscEntryLexicalField } from "@payloadcms/richtext-lexical/rsc";
import { BlocksFeatureClient } from "@payloadcms/richtext-lexical/client";

export const importMap = {
  "@payloadcms/next/rsc#CollectionCards": CollectionCards,
  "@payloadcms/storage-s3/client#S3ClientUploadHandler": S3ClientUploadHandler,
  "@payloadcms/richtext-lexical/rsc#RscEntryLexicalCell": RscEntryLexicalCell,
  "@payloadcms/richtext-lexical/rsc#RscEntryLexicalField": RscEntryLexicalField,
  "@payloadcms/richtext-lexical/client#BlocksFeatureClient": BlocksFeatureClient,
};
