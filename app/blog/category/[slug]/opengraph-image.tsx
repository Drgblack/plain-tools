import { ImageResponse } from "next/og"
import { categories } from "@/lib/blog-data"

export const runtime = "edge"
export const alt = "Plain Blog Category"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image({ params }: { params: { slug: string } }) {
  const category = categories.find((c) => c.slug === params.slug)
  const title = category?.label || "Blog"

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

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "900px",
          }}
        >
          <span
            style={{
              fontSize: "22px",
              fontWeight: 600,
              color: "#6385FF",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Category
          </span>
          <h1
            style={{
              fontSize: "72px",
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              margin: 0,
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
