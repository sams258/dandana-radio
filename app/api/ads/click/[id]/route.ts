import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "../../../../../payload.config";

// Phase 2: log click event to AdEvents table before redirect.

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  const payload = await getPayload({ config: configPromise });

  let ad: Record<string, unknown>;
  try {
    const doc = await payload.findByID({
      collection: "ads",
      id,
      overrideAccess: true,
    });
    ad = doc as Record<string, unknown>;
  } catch {
    return new NextResponse("Ad not found", { status: 404 });
  }

  if (!ad) {
    return new NextResponse("Ad not found", { status: 404 });
  }

  // Only active ads may be clicked
  if (ad.status !== "active") {
    return new NextResponse("Ad is not active", { status: 403 });
  }

  // Check scheduling window
  const now = Date.now();
  if (ad.startDate && typeof ad.startDate === "string") {
    if (new Date(ad.startDate).getTime() > now) {
      return new NextResponse("Ad has not started yet", { status: 403 });
    }
  }
  if (ad.endDate && typeof ad.endDate === "string") {
    if (new Date(ad.endDate).getTime() < now) {
      return new NextResponse("Ad has expired", { status: 403 });
    }
  }

  const clickUrl = typeof ad.clickUrl === "string" ? ad.clickUrl : "";

  // Validate the destination URL
  if (!clickUrl) {
    return new NextResponse("Invalid click URL", { status: 400 });
  }
  if (!clickUrl.startsWith("https://")) {
    return new NextResponse("Invalid click URL", { status: 400 });
  }
  if (clickUrl.startsWith("javascript:") || clickUrl.startsWith("data:")) {
    return new NextResponse("Invalid click URL", { status: 400 });
  }

  return NextResponse.redirect(clickUrl, { status: 302 });
}
