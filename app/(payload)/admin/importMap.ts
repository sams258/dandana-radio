import { CollectionCards } from "@payloadcms/next/rsc";
import { S3ClientUploadHandler } from "@payloadcms/storage-s3/client";

export const importMap = {
  "@payloadcms/next/rsc#CollectionCards": CollectionCards,
  "@payloadcms/storage-s3/client#S3ClientUploadHandler": S3ClientUploadHandler,
};
