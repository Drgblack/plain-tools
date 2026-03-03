import { ImageResponse } from "next/og"

export const runtime = "nodejs"

export async function GET() {
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
            width: "850px",
            height: "420px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse at center, rgba(99, 133, 255, 0.12) 0%, transparent 70%)",
          }}
        />
        
        {/* Subtle divider line in background */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "2px",
            height: "200px",
            backgroundColor: "rgba(99, 133, 255, 0.15)",
            borderRadius: "1px",
          }}
        />
        
        {/* Vignette overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.5) 100%)",
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "28px",
              padding: "10px 20px",
              borderRadius: "24px",
              backgroundColor: "rgba(99, 133, 255, 0.1)",
              border: "1px solid rgba(99, 133, 255, 0.2)",
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
                fontSize: "16px",
                fontWeight: 500,
                color: "#a8b8ff",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Compare
            </span>
          </div>
          
          {/* Title */}
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 700,
              color: "#f5f5f7",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Plain vs Online PDF Tools
          </h1>
          
          {/* Subtitle */}
          <p
            style={{
              fontSize: "24px",
              fontWeight: 400,
              color: "rgba(245, 245, 247, 0.55)",
              marginTop: "24px",
              lineHeight: 1.4,
            }}
          >
            Architecture and privacy comparison
          </p>
          
          {/* Comparison visual */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "40px",
              marginTop: "40px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(99, 133, 255, 0.15)",
                  border: "1px solid rgba(99, 133, 255, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "24px", color: "#6385ff" }}>P</span>
              </div>
              <span style={{ fontSize: "14px", color: "rgba(245, 245, 247, 0.6)" }}>Client-side</span>
            </div>
            
            <span style={{ fontSize: "24px", color: "rgba(245, 245, 247, 0.3)" }}>vs</span>
            
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(245, 245, 247, 0.05)",
                  border: "1px solid rgba(245, 245, 247, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "24px", color: "rgba(245, 245, 247, 0.5)" }}>?</span>
              </div>
              <span style={{ fontSize: "14px", color: "rgba(245, 245, 247, 0.6)" }}>Upload-based</span>
            </div>
          </div>
        </div>
        
        {/* Footer wordmark */}
        <div
          style={{
            position: "absolute",
            bottom: "44px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
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
              color: "rgba(245, 245, 247, 0.75)",
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

