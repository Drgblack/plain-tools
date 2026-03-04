import { ImageResponse } from "next/og"

export const runtime = "edge"

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
            top: "45%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "900px",
            height: "450px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse at center, rgba(99, 133, 255, 0.12) 0%, transparent 70%)",
          }}
        />
        
        {/* Subtle grid pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(rgba(99, 133, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 133, 255, 0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
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
              Learn
            </span>
          </div>
          
          {/* Title */}
          <h1
            style={{
              fontSize: "72px",
              fontWeight: 700,
              color: "#f5f5f7",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            PDF Learning Center
          </h1>
          
          {/* Subtitle */}
          <p
            style={{
              fontSize: "26px",
              fontWeight: 400,
              color: "rgba(245, 245, 247, 0.55)",
              marginTop: "24px",
              lineHeight: 1.4,
            }}
          >
            Clear explanations. No marketing fluff.
          </p>
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
