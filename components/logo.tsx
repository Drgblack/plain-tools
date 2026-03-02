import Link from "next/link"

interface LogoProps {
  className?: string
  linkToHome?: boolean
  variant?: "default" | "compact"
}

/**
 * Primary Logo Component
 * - Default: Full "Plain" wordmark with electric blue dot accent
 * - Compact: Just the "P" mark with dot for tight spaces
 */
export function Logo({ className = "", linkToHome = true, variant = "default" }: LogoProps) {
  const logoContent = variant === "compact" ? (
    <span className={`inline-flex items-baseline ${className}`} translate="no">
      <span className="text-[19px] font-semibold tracking-tight text-white notranslate">P</span>
      <span className="ms-0.5 h-[6px] w-[6px] rounded-full bg-accent" />
    </span>
  ) : (
    <span className={`inline-flex items-baseline ${className}`} translate="no">
      <span className="text-[19px] font-semibold tracking-tight text-white notranslate">Plain</span>
      <span className="ms-0.5 h-[6px] w-[6px] rounded-full bg-accent" />
    </span>
  )

  if (linkToHome) {
    return (
      <Link 
        href="/" 
        className="group inline-flex rounded outline-none transition-all duration-150 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label="Plain - Home"
      >
        {logoContent}
      </Link>
    )
  }

  return logoContent
}

/**
 * Primary Logo SVG - Full wordmark
 * Use for: Headers, marketing materials, light backgrounds
 */
export function LogoSVG({ 
  className = "",
  variant = "dark"
}: { 
  className?: string
  variant?: "dark" | "light"
}) {
  const textColor = variant === "dark" ? "#F2F2F2" : "#1A1A1F"
  
  return (
    <svg 
      viewBox="0 0 72 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Plain"
    >
      {/* "Plain" wordmark - Inter/system font style */}
      <path 
        d="M0 15.5V1h4.8c1.4 0 2.5.35 3.3 1.05.8.7 1.2 1.65 1.2 2.85 0 1.2-.4 2.15-1.2 2.85-.8.7-1.9 1.05-3.3 1.05H2.4v6.7H0zm2.4-8.8h2.2c.75 0 1.32-.17 1.72-.52.4-.35.6-.83.6-1.43 0-.6-.2-1.08-.6-1.43-.4-.35-.97-.52-1.72-.52H2.4v3.9zM12.2 15.5V1h2.4v12.3h6.4v2.2H12.2zM26.8 15.5l-1.1-3.1h-5.2l-1.1 3.1h-2.6L22.4 1h2.6l5.6 14.5h-3.8zm-3.7-10.4l-1.8 5.1h3.6l-1.8-5.1zM31 15.5V1h2.4v14.5H31zM36.8 15.5V1h2.4l6.2 9.8V1h2.4v14.5h-2.4l-6.2-9.8v9.8h-2.4z"
        fill={textColor}
      />
      {/* Electric blue dot accent */}
      <circle cx="66" cy="14" r="3" fill="#6385FF" />
    </svg>
  )
}

/**
 * Compact Logo SVG - Just the mark
 * Use for: Favicons, small spaces, app icons
 */
export function LogoMark({ 
  className = "",
  size = 32
}: { 
  className?: string
  size?: number
}) {
  return (
    <svg 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-label="Plain"
    >
      {/* Dark background for contrast */}
      <rect width="32" height="32" rx="6" fill="#1A1B1F" />
      {/* Abstract PDF-inspired "P" shape */}
      <path 
        d="M10 8h7c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4v6h-3V8z"
        fill="#F2F2F2"
      />
      {/* Inner cutout for P bowl */}
      <path 
        d="M13 11h3.5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5H13V11z"
        fill="#1A1B1F"
      />
      {/* Electric blue accent dot */}
      <circle cx="24" cy="22" r="3" fill="#6385FF" />
    </svg>
  )
}
