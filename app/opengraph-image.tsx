import { ImageResponse } from "next/og"

export const runtime = "nodejs"
export const alt = "Plain - Professional-grade PDF utilities processed 100% locally in your browser"
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
          padding: "60px 72px",
          backgroundColor: "#000000",
          position: "relative",
        }}
      >
        {/* Subtle grid texture */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(rgba(51, 51, 51, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(51, 51, 51, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Top row: Logo and Badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: "100%",
            zIndex: 10,
          }}
        >
          {/* Plain logo top-left */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span
              style={{
                fontSize: "42px",
                fontWeight: 700,
                color: "#F2F2F2",
                letterSpacing: "-0.02em",
              }}
            >
              Plain
            </span>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#0070f3",
                marginTop: "8px",
              }}
            />
          </div>

          {/* 100% Local badge top-right */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 18px",
              backgroundColor: "rgba(17, 17, 17, 0.9)",
              border: "1px solid #333",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#22C55E",
              }}
            />
            <span
              style={{
                fontSize: "16px",
                color: "rgba(255, 255, 255, 0.8)",
                fontWeight: 500,
              }}
            >
              100% Local
            </span>
            <div
              style={{
                width: "1px",
                height: "14px",
                backgroundColor: "#333",
              }}
            />
            <span
              style={{
                fontSize: "16px",
                color: "rgba(255, 255, 255, 0.6)",
                fontWeight: 500,
              }}
            >
              No Uploads
            </span>
          </div>
        </div>

        {/* Centre content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: "24px",
            zIndex: 10,
          }}
        >
          {/* Main title */}
          <span
            style={{
              fontSize: "80px",
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
            }}
          >
            Plain
          </span>

          {/* Tagline */}
          <span
            style={{
              fontSize: "28px",
              color: "rgba(255, 255, 255, 0.6)",
              fontWeight: 400,
              textAlign: "center",
            }}
          >
            Professional-grade PDF utilities. 100% local.
          </span>
        </div>

        {/* Bottom row: Trust indicators */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "32px",
            width: "100%",
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#22C55E",
              }}
            />
            <span
              style={{
                fontSize: "14px",
                color: "rgba(255, 255, 255, 0.5)",
                fontWeight: 500,
              }}
            >
              Zero Server Architecture
            </span>
          </div>
          <div
            style={{
              width: "1px",
              height: "14px",
              backgroundColor: "#333",
            }}
          />
          <span
            style={{
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.5)",
              fontWeight: 500,
            }}
          >
            No Uploads Required
          </span>
          <div
            style={{
              width: "1px",
              height: "14px",
              backgroundColor: "#333",
            }}
          />
          <span
            style={{
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.5)",
              fontWeight: 500,
            }}
          >
            Verifiable Privacy
          </span>
        </div>

        {/* Glowing blue accent line at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "#0070f3",
            boxShadow: "0 0 20px rgba(0, 112, 243, 0.6), 0 0 40px rgba(0, 112, 243, 0.3)",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}

