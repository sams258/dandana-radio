import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({
    R2_BUCKET_NAME:      process.env.R2_BUCKET_NAME      ? "set" : "MISSING",
    R2_ENDPOINT:         process.env.R2_ENDPOINT         ? "set" : "MISSING",
    R2_ACCESS_KEY_ID:    process.env.R2_ACCESS_KEY_ID    ? "set" : "MISSING",
    R2_SECRET_ACCESS_KEY:process.env.R2_SECRET_ACCESS_KEY? "set" : "MISSING",
    R2_PUBLIC_URL:       process.env.R2_PUBLIC_URL       ? "set" : "MISSING",
    endpoint_value:      process.env.R2_ENDPOINT,
    bucket_value:        process.env.R2_BUCKET_NAME,
  });
}
