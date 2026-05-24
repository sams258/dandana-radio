import { AD_LABEL_MAP, type AdLabelType } from "../../../../payload/constants/ads";

interface AdLabelProps {
  labelType: AdLabelType;
  customLabelAr?: string | null;
  customLabelEn?: string | null;
  locale: "ar" | "en";
}

export function AdLabel({ labelType, customLabelAr, customLabelEn, locale }: AdLabelProps) {
  let text: string;

  if (labelType === "custom") {
    text = locale === "ar" ? (customLabelAr ?? "") : (customLabelEn ?? "");
  } else {
    text = AD_LABEL_MAP[labelType][locale];
  }

  if (!text) return null;

  return (
    <div
      style={{
        fontSize:   "0.7rem",
        color:      "var(--text-muted)",
        fontFamily: "monospace",
        marginBlockEnd: "0.25rem",
        textAlign:  "start",
      }}
    >
      {text}
    </div>
  );
}
