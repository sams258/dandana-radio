"use client";

import Image from "next/image";
import { useState } from "react";
import type { JSX } from "react";

// ── Custom Block Renderers ────────────────────────────────────

function AudioBlock({ fields }: { fields: Record<string, unknown> }) {
  const audio  = fields.audio  as Record<string, unknown>;
  const title  = fields.title  as string | undefined;
  const desc   = fields.description as string | undefined;
  const srcUrl = audio?.url as string | undefined;

  return (
    <div
      style={{
        background:   "rgba(201,169,110,0.06)",
        border:       "1px solid rgba(201,169,110,0.2)",
        borderRadius: "14px",
        padding:      "1.25rem 1.5rem",
        margin:       "1.5rem 0",
      }}
    >
      {title && (
        <p style={{
          fontSize:     "0.85rem",
          fontWeight:   "600",
          color:        "var(--gold-mid)",
          marginBottom: "0.5rem",
          fontFamily:   "'Cairo', sans-serif",
        }}>
          {title}
        </p>
      )}
      <audio
        controls
        style={{ width: "100%", accentColor: "var(--gold-mid)" }}
        src={srcUrl}
      />
      {desc && (
        <p style={{
          fontSize:   "0.8rem",
          color:      "var(--text-muted)",
          marginTop:  "0.5rem",
          fontFamily: "'Cairo', sans-serif",
        }}>
          {desc}
        </p>
      )}
    </div>
  );
}

function VideoBlock({ fields }: { fields: Record<string, unknown> }) {
  const url     = fields.url     as string | undefined;
  const caption = fields.caption as string | undefined;

  const embedUrl = url
    ?.replace("watch?v=", "embed/")
    ?.replace("youtu.be/", "www.youtube.com/embed/");

  return (
    <div style={{ margin: "1.5rem 0" }}>
      <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
        <iframe
          src={embedUrl}
          style={{
            position:     "absolute",
            top:          0,
            left:         0,
            width:        "100%",
            height:       "100%",
            borderRadius: "14px",
            border:       "none",
          }}
          allowFullScreen
        />
      </div>
      {caption && (
        <p style={{
          textAlign:  "center",
          fontSize:   "0.8rem",
          color:      "var(--text-muted)",
          marginTop:  "0.5rem",
          fontFamily: "'Cairo', sans-serif",
        }}>
          {caption}
        </p>
      )}
    </div>
  );
}

function GalleryBlock({ fields }: { fields: Record<string, unknown> }) {
  const images  = fields.images as { image: Record<string, unknown>; caption?: string }[] | undefined;
  const [active, setActive] = useState(0);

  if (!images?.length) return null;
  const current = images[active];
  const imgUrl  = (current.image?.url || (current.image?.sizes as Record<string, unknown> | undefined)?.hero) as string;

  return (
    <div style={{ margin: "1.5rem 0" }}>
      {/* Main image */}
      <div style={{
        position:     "relative",
        height:       "360px",
        borderRadius: "14px",
        overflow:     "hidden",
        marginBottom: "0.75rem",
      }}>
        <Image src={imgUrl} alt={current.caption || ""} fill className="object-cover" unoptimized />
      </div>
      {/* Thumbnails */}
      {images.length > 1 && (
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {images.map((img, i) => {
            const thumbUrl = ((img.image?.sizes as Record<string, unknown> | undefined)?.thumbnail as Record<string, unknown> | undefined)?.url as string
              || img.image?.url as string;
            return (
              <div
                key={i}
                onClick={() => setActive(i)}
                style={{
                  width:        "64px",
                  height:       "64px",
                  position:     "relative",
                  borderRadius: "8px",
                  overflow:     "hidden",
                  cursor:       "pointer",
                  border:       i === active
                    ? "2px solid var(--gold-mid)"
                    : "2px solid transparent",
                  opacity:    i === active ? 1 : 0.6,
                  transition: "all 0.2s",
                }}
              >
                <Image src={thumbUrl} alt="" fill className="object-cover" unoptimized />
              </div>
            );
          })}
        </div>
      )}
      {current.caption && (
        <p style={{
          fontSize:   "0.8rem",
          color:      "var(--text-muted)",
          marginTop:  "0.5rem",
          fontFamily: "'Cairo', sans-serif",
        }}>
          {current.caption}
        </p>
      )}
    </div>
  );
}

function PullQuoteBlock({ fields }: { fields: Record<string, unknown> }) {
  return (
    <blockquote
      style={{
        borderInlineStart:  "4px solid var(--gold-mid)",
        paddingInlineStart: "1.5rem",
        margin:             "2rem 0",
        background:         "rgba(201,169,110,0.04)",
        borderRadius:       "0 12px 12px 0",
        padding:            "1.25rem 1.5rem",
      }}
    >
      <p style={{
        fontSize:     "1.2rem",
        fontStyle:    "italic",
        color:        "var(--gold-light)",
        fontFamily:   "'Cairo', sans-serif",
        lineHeight:   "1.8",
        marginBottom: typeof fields.attribution === "string" && fields.attribution ? "0.75rem" : 0,
      }}>
        {fields.quote as string}
      </p>
      {typeof fields.attribution === "string" && fields.attribution && (
        <cite style={{
          fontSize:   "0.85rem",
          color:      "var(--text-muted)",
          fontFamily: "monospace",
          fontStyle:  "normal",
        }}>
          — {fields.attribution}
        </cite>
      )}
    </blockquote>
  );
}

function InfoBoxBlock({ fields }: { fields: Record<string, unknown> }) {
  const variantColors: Record<string, string> = {
    info:    "rgba(201,169,110,0.12)",
    warning: "rgba(255,165,0,0.12)",
    success: "rgba(100,200,100,0.12)",
  };
  const variantBorders: Record<string, string> = {
    info:    "rgba(201,169,110,0.3)",
    warning: "rgba(255,165,0,0.3)",
    success: "rgba(100,200,100,0.3)",
  };
  const variant = (fields.variant as string) || "info";

  return (
    <div
      style={{
        background:   variantColors[variant],
        border:       `1px solid ${variantBorders[variant]}`,
        borderRadius: "12px",
        padding:      "1.25rem 1.5rem",
        margin:       "1.5rem 0",
      }}
    >
      {typeof fields.title === "string" && fields.title && (
        <p style={{
          fontWeight:   "700",
          fontSize:     "0.95rem",
          color:        "var(--gold-light)",
          marginBottom: "0.5rem",
          fontFamily:   "'Cairo', sans-serif",
        }}>
          {fields.title}
        </p>
      )}
      <p style={{
        fontSize:   "0.9rem",
        color:      "var(--text-muted)",
        fontFamily: "'Cairo', sans-serif",
        lineHeight: "1.7",
      }}>
        {fields.body as string}
      </p>
    </div>
  );
}

// ── Node Renderer ─────────────────────────────────────────────

function renderNode(node: Record<string, unknown>, index: number): React.ReactNode {
  const type = node.type as string;

  if (type === "text") {
    let text: React.ReactNode = node.text as string;
    const format = (node.format as number) || 0;
    if (format & 1)  text = <strong key={index}>{text}</strong>;
    if (format & 2)  text = <em key={index}>{text}</em>;
    if (format & 8)  text = <u key={index}>{text}</u>;
    if (format & 16) text = <s key={index}>{text}</s>;
    return text;
  }

  if (type === "paragraph") {
    const children = node.children as Record<string, unknown>[];
    return (
      <p key={index} style={{
        marginBottom: "1.2rem",
        lineHeight:   "1.9",
        color:        "var(--text-muted)",
        fontFamily:   "'Cairo', 'IBM Plex Sans Arabic', sans-serif",
        fontSize:     "1rem",
      }}>
        {children?.map((child, i) => renderNode(child, i))}
      </p>
    );
  }

  if (type === "heading") {
    const tag      = (node.tag as string) || "h2";
    const sizes: Record<string, string> = { h2: "1.5rem", h3: "1.25rem", h4: "1.1rem" };
    const children = node.children as Record<string, unknown>[];
    const Tag      = tag as keyof JSX.IntrinsicElements;
    return (
      <Tag key={index} style={{
        fontSize:   sizes[tag] || "1.25rem",
        fontWeight: "700",
        color:      "var(--gold-light)",
        margin:     "2rem 0 1rem",
        fontFamily: "'Cairo', sans-serif",
        lineHeight: "1.4",
      }}>
        {children?.map((child, i) => renderNode(child, i))}
      </Tag>
    );
  }

  if (type === "quote") {
    const children = node.children as Record<string, unknown>[];
    return (
      <blockquote key={index} style={{
        borderInlineStart:  "3px solid var(--gold-deep)",
        paddingInlineStart: "1rem",
        margin:             "1.5rem 0",
        color:              "var(--text-muted)",
        fontStyle:          "italic",
      }}>
        {children?.map((child, i) => renderNode(child, i))}
      </blockquote>
    );
  }

  if (type === "block") {
    const fields    = node.fields as Record<string, unknown>;
    const blockType = fields?.blockType as string;
    if (blockType === "audioEmbed")   return <AudioBlock     key={index} fields={fields} />;
    if (blockType === "videoEmbed")   return <VideoBlock     key={index} fields={fields} />;
    if (blockType === "imageGallery") return <GalleryBlock   key={index} fields={fields} />;
    if (blockType === "pullQuote")    return <PullQuoteBlock key={index} fields={fields} />;
    if (blockType === "infoBox")      return <InfoBoxBlock   key={index} fields={fields} />;
    return null;
  }

  if (type === "list") {
    const children = node.children as Record<string, unknown>[];
    const listType = node.listType as string;
    const Tag      = (listType === "number" ? "ol" : "ul") as keyof JSX.IntrinsicElements;
    return (
      <Tag key={index} style={{
        paddingInlineStart: "1.5rem",
        marginBottom:       "1.2rem",
        color:              "var(--text-muted)",
        fontFamily:         "'Cairo', sans-serif",
        lineHeight:         "1.9",
      }}>
        {children?.map((child, i) => renderNode(child, i))}
      </Tag>
    );
  }

  if (type === "listitem") {
    const children = node.children as Record<string, unknown>[];
    return (
      <li key={index}>
        {children?.map((child, i) => renderNode(child, i))}
      </li>
    );
  }

  if (type === "link") {
    const children = node.children as Record<string, unknown>[];
    const fields   = node.fields   as Record<string, unknown>;
    const url      = (fields?.url as string) || "#";
    return (
      <a key={index} href={url}
        target="_blank" rel="noopener noreferrer"
        style={{ color: "var(--gold-mid)", textDecoration: "underline" }}
      >
        {children?.map((child, i) => renderNode(child, i))}
      </a>
    );
  }

  // Fallback — render children if they exist
  const children = node.children as Record<string, unknown>[] | undefined;
  if (children?.length) {
    return <div key={index}>{children.map((child, i) => renderNode(child, i))}</div>;
  }

  return null;
}

// ── Main Export ────────────────────────────────────────────────

export function RichTextRenderer({ content }: { content: Record<string, unknown> }) {
  if (!content?.root) return null;
  const root     = content.root as Record<string, unknown>;
  const children = root.children as Record<string, unknown>[];
  if (!children?.length) return null;

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      {children.map((node, i) => renderNode(node, i))}
    </div>
  );
}
