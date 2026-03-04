import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Plain Blog"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "80px 88px",
          backgroundColor: "#0F1012",
          position: "relative",
        }}
      >
        {/* Subtle document grid texture */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(rgba(99, 133, 255, 0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99, 133, 255, 0.025) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />
        
        {/* Electric blue accent line at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "5px",
            background: "linear-gradient(90deg, transparent 0%, #6385FF 20%, #6385FF 80%, transparent 100%)",
          }}
        />

        {/* Center content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "28px",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontSize: "88px",
                fontWeight: 700,
                color: "#FFFFFF",
                letterSpacing: "-0.03em",
              }}
            >
              Plain
            </span>
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "#6385FF",
                marginLeft: "4px",
                marginTop: "20px",
              }}
            />
          </div>

          {/* Title */}
          <span
            style={{
              fontSize: "36px",
              color: "rgba(255, 255, 255, 0.55)",
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            Blog
          </span>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "4px",
              backgroundColor: "#6385FF",
              borderRadius: "2px",
            }}
          />
          <span
            style={{
              fontSize: "17px",
              color: "rgba(255, 255, 255, 0.4)",
              fontWeight: 500,
              letterSpacing: "0.01em",
            }}
          >
            plain.tools/blog
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
