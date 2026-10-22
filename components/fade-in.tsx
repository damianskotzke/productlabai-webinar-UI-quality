"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"

/**
 * Fades its children in and up. Plays on mount, or when `play` turns true.
 * Use `delay` to build a sequence.
 */
function FadeIn({
  children,
  delay = 0,
  duration = 0.6,
  y = 12,
  play = true,
  className,
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  y?: number
  play?: boolean
  className?: string
}) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y }}
      animate={play || reducedMotion ? { opacity: 1, y: 0 } : undefined}
      transition={{ delay, duration, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export { FadeIn }
