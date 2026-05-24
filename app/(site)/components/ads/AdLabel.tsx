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
    <span
      style={{
        fontSize:      "0.65rem",
        color:         "rgba(255,255,255,0.4)",
        fontFamily:    "monospace",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        marginBottom:  "4px",
        display:       "block",
      }}
    >
      {text}
    </span>
  );
}
