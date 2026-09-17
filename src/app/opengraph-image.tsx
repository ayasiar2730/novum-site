import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

/**
 * Imagen Open Graph oficial (B3). Composición institucional: la marca en su
 * versión para fondo oscuro (public/brand/logo-dark.svg), el eyebrow, el
 * eslogan y el dominio sobre purple-900 con una luz sobria. Sin mockups ni
 * ilustraciones. Mientras el SVG no exista, el nombre va tipográfico.
 * Los textos son los mismos de la versión anterior (aprobados).
 */
export const alt = "Novum Integral — Software y consultoría para el sector solidario";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function brandDark() {
  const file = path.join(process.cwd(), "public", "brand", "logo-dark.svg");
  if (!existsSync(file)) return null;
  const svg = readFileSync(file, "utf8");
  const m = svg.match(/viewBox\s*=\s*"[\s,]*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
  const ratio = m ? Number(m[1]) / Number(m[2]) : 4;
  return { src: `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`, ratio };
}

export default function OpenGraphImage() {
  const brand = brandDark();
  const logoHeight = 92;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        backgroundColor: "#2c0e72",
        backgroundImage:
          "radial-gradient(circle at 88% 12%, rgba(122, 56, 192, 0.55) 0%, rgba(122, 56, 192, 0) 46%), radial-gradient(circle at 100% 100%, rgba(104, 176, 74, 0.18) 0%, rgba(104, 176, 74, 0) 40%)",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {brand ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={brand.src}
            width={Math.round(logoHeight * brand.ratio)}
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
            color: "#8bcb68",
            fontWeight: 600,
          }}
        >
          Software y consultoría para el sector solidario
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 32, lineHeight: 1.35, color: "#eceaf1", maxWidth: 960 }}>{site.tagline}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: "#68b04a" }} />
          <div style={{ fontSize: 24, color: "#c9c5d4" }}>novumintegral.com</div>
        </div>
      </div>
    </div>,
    { ...size },
  );
}
