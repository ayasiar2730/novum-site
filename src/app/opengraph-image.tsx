import { ImageResponse } from "next/og";
import { site } from "@/content/site";

/**
 * Imagen Open Graph PROVISIONAL (tipográfica).
 * En el Corte 2 se reemplaza por la composición de marca con el SVG oficial.
 */
export const alt = "Novum Integral — Software y consultoría para el sector solidario";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
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
        <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>
          Novum Integral
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 30, lineHeight: 1.35, color: "#eceaf1", maxWidth: 980 }}>{site.tagline}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: "#68b04a" }} />
          <div style={{ fontSize: 24, color: "#c9c5d4" }}>novumintegral.com</div>
        </div>
      </div>
    </div>,
    { ...size },
  );
}
