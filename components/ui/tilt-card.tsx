"use client"

import { useRef, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  tiltIntensity?: number
  glowOnHover?: boolean
}

export function TiltCard({ 
  children, 
  className = "", 
  tiltIntensity = 10,
  glowOnHover = true 
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [tiltIntensity, -tiltIntensity])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-tiltIntensity, tiltIntensity])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`relative ${className}`}
    >
      {/* Glow effect on hover */}
      {glowOnHover && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-xl"
          style={{
            background: "transparent",
            boxShadow: isHovered 
              ? "0 0 10px rgba(0, 112, 243, 0.25), inset 0 0 0 1px #0070f3" 
              : "inset 0 0 0 1px #333",
          }}
          animate={{
            boxShadow: isHovered 
              ? "0 0 10px rgba(0, 112, 243, 0.25), inset 0 0 0 1px #0070f3" 
              : "inset 0 0 0 1px #333",
          }}
          transition={{ duration: 0.15 }}
        />
      )}
      <div style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </motion.div>
  )
}
