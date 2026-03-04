export function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
    </div>
  )
}

export function SectionDividerSubtle({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Very subtle gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </div>
  )
}
