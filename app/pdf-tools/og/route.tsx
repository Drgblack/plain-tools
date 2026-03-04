import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const title = searchParams.get("title") || "Plain"
  const subtitle = searchParams.get("subtitle") || ""
  const kind = searchParams.get("kind") || "default"
  
  // Kind-specific accent labels
  const kindLabels: Record<string, string> = {
    learn: "Learn",
    tool: "Tool",
    compare: "Compare",
    blog: "Plain Blog",
    default: "",
  }
  
  const kindLabel = kindLabels[kind] || ""

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f1419",
          position: "relative",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "800px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse at center, rgba(99, 133, 255, 0.15) 0%, transparent 70%)",
          }}
        />
        
        {/* Vignette overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.4) 100%)",
          }}
        />
        
        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px",
            maxWidth: "1000px",
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Kind label */}
          {kindLabel && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "24px",
                padding: "8px 16px",
                borderRadius: "20px",
                backgroundColor: "rgba(99, 133, 255, 0.12)",
                border: "1px solid rgba(99, 133, 255, 0.25)",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#6385ff",
                }}
              />
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: 500,
                  color: "#a8b8ff",
                  letterSpacing: "0.02em",
                }}
              >
                {kindLabel}
              </span>
            </div>
          )}
          
          {/* Title */}
          <h1
            style={{
              fontSize: title.length > 40 ? "52px" : "64px",
              fontWeight: 700,
              color: "#f5f5f7",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              margin: 0,
              textWrap: "balance",
            }}
          >
            {title}
          </h1>
          
          {/* Subtitle */}
          {subtitle && (
            <p
              style={{
                fontSize: "24px",
                fontWeight: 400,
                color: "rgba(245, 245, 247, 0.6)",
                marginTop: "20px",
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Footer wordmark */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {/* Accent bar */}
          <div
            style={{
              width: "4px",
              height: "24px",
              borderRadius: "2px",
              backgroundColor: "#6385ff",
            }}
          />
          <span
            style={{
              fontSize: "22px",
              fontWeight: 600,
              color: "rgba(245, 245, 247, 0.8)",
              letterSpacing: "-0.01em",
            }}
          >
            Plain
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
