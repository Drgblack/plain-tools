"use client"

import { useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  magneticIntensity?: number
  onClick?: () => void
  disabled?: boolean
  asChild?: boolean
}

export function MagneticButton({ 
  children, 
  className = "",
  magneticIntensity = 0.3,
  onClick,
  disabled = false,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isPressed, setIsPressed] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { stiffness: 400, damping: 25 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || disabled) return

    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY

    x.set(distanceX * magneticIntensity)
    y.set(distanceY * magneticIntensity)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const handleClick = () => {
    if (disabled) return
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 150)
    onClick?.()
  }

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      disabled={disabled}
      style={{
        x: xSpring,
        y: ySpring,
      }}
      animate={{
        scale: isPressed ? 0.95 : 1,
      }}
      transition={{ duration: 0.1, ease: "easeOut" }}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Ripple effect container */}
      <motion.span
        className="absolute inset-0 bg-white/10 rounded-lg"
        initial={{ scale: 0, opacity: 0 }}
        animate={isPressed ? { scale: 2, opacity: [0, 0.3, 0] } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        style={{ transformOrigin: "center" }}
      />
      {children}
    </motion.button>
  )
}
