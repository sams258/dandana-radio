// Stable wrapper for every ad render.
// Phase 2 will attach IntersectionObserver via document.querySelectorAll('[data-ad-id]').

interface AdWrapperProps {
  adId: string;
  placementId: string;
  locale: "ar" | "en";
  type: string;
  advertiserId: string;
  children: React.ReactNode;
}

export function AdWrapper({
  adId,
  placementId,
  locale,
  type,
  advertiserId,
  children,
}: AdWrapperProps) {
  return (
    <div
      data-ad-id={adId}
      data-ad-placement-id={placementId}
      data-ad-locale={locale}
      data-ad-type={type}
      data-advertiser-id={advertiserId}
    >
      {children}
    </div>
  );
}
