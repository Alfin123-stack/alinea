import { ImageResponse } from "next/og";
import { siteDescription } from "@/lib/site";

export const alt = "Alinea — Kenali ceritanya, sebelum kamu membacanya";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#f7f5f3",
          color: "#0d0d0d",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 32,
            letterSpacing: "-0.02em",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              border: "3px solid #0d0d0d",
              display: "flex",
            }}
          />
          alinea
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: 64,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            maxWidth: 920,
          }}
        >
          Kenali ceritanya, sebelum kamu membacanya.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 26,
            lineHeight: 1.4,
            maxWidth: 820,
            color: "#6e6a69",
          }}
        >
          {siteDescription}
        </div>
      </div>
    ),
    { ...size }
  );
}
