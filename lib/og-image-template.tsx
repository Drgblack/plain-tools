"use server"

import { ImageResponse } from "next/og"

export const ogImageSize = { width: 1200, height: 630 }
export const ogImageContentType = "image/png"

interface OGImageTemplateProps {
  title: string
  subtitle?: string
  type?: "tool" | "blog" | "page"
  category?: string
}

/**
 * Reusable OG Image Template for Plain PDF Hub
 * 
 * Features:
 * - Deep black background with signature grey grid pattern
 * - Plain logo top-left
 * - "100% Local / No Uploads" badge top-right
 * - Large bold title in centre
 * - Glowing blue #0070f3 accent line at bottom
 */
export async function generateOGImage({
  title,
  subtitle,
  type = "page",
  category,
}: OGImageTemplateProps) {
  // Determine suffix based on type
  const brandSuffix = type === "blog" ? "Plain Journal" : "Plain PDF"
  const displayTitle = title.length > 50 ? title.substring(0, 47) + "..." : title

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
            alignItems: "flex-start",
            gap: "20px",
            zIndex: 10,
            maxWidth: "900px",
          }}
        >
          {/* Category tag if provided */}
          {category && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                backgroundColor: "rgba(0, 112, 243, 0.15)",
                border: "1px solid rgba(0, 112, 243, 0.3)",
                borderRadius: "6px",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  color: "#0070f3",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {category}
              </span>
            </div>
          )}

          {/* Main title */}
          <span
            style={{
              fontSize: "64px",
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            {displayTitle}
          </span>

          {/* Subtitle if provided */}
          {subtitle && (
            <span
              style={{
                fontSize: "24px",
                color: "rgba(255, 255, 255, 0.6)",
                fontWeight: 400,
                lineHeight: 1.4,
                maxWidth: "750px",
              }}
            >
              {subtitle}
            </span>
          )}
        </div>

        {/* Bottom row: Brand suffix */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            zIndex: 10,
          }}
        >
          <span
            style={{
              fontSize: "18px",
              color: "rgba(255, 255, 255, 0.4)",
              fontWeight: 500,
            }}
          >
            {brandSuffix}
          </span>
          <span
            style={{
              fontSize: "16px",
              color: "rgba(255, 255, 255, 0.3)",
              fontWeight: 400,
            }}
          >
            plain.tools
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
      ...ogImageSize,
    }
  )
}
