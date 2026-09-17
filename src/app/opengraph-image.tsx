import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

/**
 * Imagen Open Graph oficial (B3). Composición institucional con la marca real:
 * si existe logo-dark.svg, la marca en blanco sobre purple-900; con el master
 * en PNG (solo versión clara) la marca va sobre neutral-50 con una banda
 * purple-900 al pie. Sin mockups ni ilustraciones. Los textos son los mismos
 * de la versión anterior (aprobados): eyebrow, eslogan y dominio.
 */
export const alt = "Novum Integral — Software y consultoría para el sector solidario";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const eyebrow = "Software y consultoría para el sector solidario";

function brand(file: string) {
  const full = path.join(process.cwd(), "public", "brand", file);
  if (!existsSync(full)) return null;
  const buf = readFileSync(full);
  if (file.endsWith(".svg")) {
    const m = buf
      .toString("utf8")
      .match(/viewBox\s*=\s*"[\s,]*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
    return {
      src: `data:image/svg+xml;base64,${buf.toString("base64")}`,
      ratio: m ? Number(m[1]) / Number(m[2]) : 4,
    };
  }
  const ratio = buf.readUInt32BE(16) / buf.readUInt32BE(20);
  return { src: `data:image/png;base64,${buf.toString("base64")}`, ratio };
}

export default function OpenGraphImage() {
  const dark = brand("logo-dark.svg");
  const light = dark ? null : (brand("logo.svg") ?? brand("logo.png"));
  const mark = dark ?? light;
  const onDark = Boolean(dark) || !mark;
  const logoHeight = 96;

  const colors = onDark
    ? { bg: "#2c0e72", eyebrow: "#8bcb68", text: "#eceaf1", domain: "#c9c5d4", dot: "#68b04a" }
    : { bg: "#f7f6fa", eyebrow: "#4b16a8", text: "#17141f", domain: "#5b5670", dot: "#68b04a" };

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px 64px",
        backgroundColor: colors.bg,
        backgroundImage: onDark
          ? "radial-gradient(circle at 88% 12%, rgba(122, 56, 192, 0.55) 0%, rgba(122, 56, 192, 0) 46%)"
          : "radial-gradient(circle at 92% 6%, rgba(122, 56, 192, 0.16) 0%, rgba(122, 56, 192, 0) 44%)",
        color: colors.text,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
        {mark ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mark.src}
            width={Math.round(logoHeight * mark.ratio)}
            height={logoHeight}
            alt=""
            style={{ objectFit: "contain" }}
          />
        ) : (
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>
            Novum Integral
          </div>
        )}
        <div
          style={{
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: colors.eyebrow,
            fontWeight: 600,
          }}
        >
          {eyebrow}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ fontSize: 34, lineHeight: 1.35, color: colors.text, maxWidth: 940 }}>
          {site.tagline}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: colors.dot }} />
          <div style={{ fontSize: 24, color: colors.domain }}>novumintegral.com</div>
        </div>
      </div>
      {onDark ? null : (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 14,
            backgroundColor: "#2c0e72",
            display: "flex",
          }}
        />
      )}
    </div>,
    { ...size },
  );
}
