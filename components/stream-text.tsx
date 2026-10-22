"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"

/**
 * Streams text in word by word: each word fades in from a light blur.
 * It plays when `play` turns true. Remount (change `key`) to replay.
 */
function StreamText({
  text,
  play = true,
  delay = 0,
  stagger = 0.035,
}: {
  text: string
  play?: boolean
  delay?: number
  stagger?: number
}) {
  const reducedMotion = useReducedMotion()
  const words = text.split(" ")

  return words.map((word, index) => (
    <React.Fragment key={index}>
      <motion.span
        initial={reducedMotion ? false : { opacity: 0, filter: "blur(6px)" }}
        animate={
          play || reducedMotion
            ? { opacity: 1, filter: "blur(0px)" }
            : undefined
        }
        transition={{
          delay: delay + index * stagger,
          duration: 0.5,
          ease: "easeOut",
        }}
        className="inline-block"
      >
        {word}
      </motion.span>{" "}
    </React.Fragment>
  ))
}

export { StreamText }
