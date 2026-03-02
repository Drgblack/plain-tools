import { ImageResponse } from "next/og"
import { posts } from "@/lib/blog-data"

export const runtime = "edge"
export const alt = "Plain Blog"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// Calculate optimal font size for readability at small preview sizes
function getTitleFontSize(title: string): number {
  const length = title.length
  if (length > 70) return 44
  if (length > 55) return 52
  if (length > 40) return 60
  return 68
}

export default async function Image({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug)
  const title = post?.title || "Plain Blog"
  const fontSize = getTitleFontSize(title)

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
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

        {/* Document corner fold accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "72px",
            height: "72px",
            background: "linear-gradient(135deg, #16171A 50%, #1A1B1F 50%)",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span
            style={{
              fontSize: "36px",
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
            }}
          >
            Plain
          </span>
          <div
            style={{
              width: "9px",
              height: "9px",
              borderRadius: "50%",
              backgroundColor: "#6385FF",
              marginLeft: "2px",
              marginTop: "10px",
            }}
          />
        </div>

        {/* Title - positioned for maximum readability */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "1000px",
            marginTop: "-20px",
          }}
        >
          <h1
            style={{
              fontSize: `${fontSize}px`,
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1.12,
              letterSpacing: "-0.025em",
              margin: 0,
              textShadow: "0 2px 20px rgba(0,0,0,0.3)",
            }}
          >
            {title}
          </h1>
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
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
              color: "rgba(255, 255, 255, 0.45)",
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
