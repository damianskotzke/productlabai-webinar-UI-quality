"use client"

import * as React from "react"
import { motion, useInView, useReducedMotion } from "motion/react"

import { MoreCarousel, type MoreGeometry } from "@/components/more-carousel"
import { Button } from "@/components/ui/button"

// Figma frame the section scales from.
const FRAME_WIDTH = 1728
const MIN_SCALE = 0.5

// Dot grid from Figma: column x from the centre, and row distance from the
// box edge (the box is 296px tall in Figma; rows sit at 252/340/428px).
const DOT_COLUMNS = [-688, -448, 0, 448, 688]
const DOT_ROW_GAPS = [104, 192, 280]

// Side columns keep their Figma distance from the box edge (box is 640px).
function dotLeft(x: number) {
  if (x === 0) return "50%"
  const fromEdge = Math.abs(x) - 320
  return `calc(50% + ${Math.sign(x)} * (var(--bw) / 2 + ${fromEdge}px * var(--s)))`
}

// Dots appear from the box outwards.
const dots = DOT_ROW_GAPS.flatMap((gap) =>
  [-1, 1].flatMap((side) => DOT_COLUMNS.map((x) => ({ x, gap, side })))
).sort((a, b) => Math.hypot(a.x, a.gap) - Math.hypot(b.x, b.gap))

// Reveal order: black box, then dots, then the carousel.
const DOTS_DELAY = 0.35
const DOT_STAGGER = 0.02
const CAROUSEL_DELAY = DOTS_DELAY + dots.length * DOT_STAGGER + 0.1

function MoreSection() {
  const sectionRef = React.useRef<HTMLElement>(null)
  const boxRef = React.useRef<HTMLDivElement>(null)
  const geometry = React.useRef<MoreGeometry>({
    scale: 1,
    boxHalfWidth: 320,
  })
  const inView = useInView(sectionRef, { once: true, amount: 0.4 })
  const reducedMotion = useReducedMotion()
  const revealed = inView || Boolean(reducedMotion)
  const initial = reducedMotion ? false : "hidden"
  const animate = revealed ? "visible" : "hidden"

  React.useLayoutEffect(() => {
    const section = sectionRef.current
    const box = boxRef.current
    if (!section || !box) return

    const measure = () => {
      const scale = Math.min(
        1,
        Math.max(MIN_SCALE, section.clientWidth / FRAME_WIDTH)
      )
      geometry.current = {
        scale,
        boxHalfWidth: box.offsetWidth / 2,
      }
      section.style.setProperty("--s", String(scale))
      section.style.setProperty("--bh", `${box.offsetHeight}px`)
      section.style.setProperty("--bw", `${box.offsetWidth}px`)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(section)
    observer.observe(box)
    return () => observer.disconnect()
  }, [])

  return (
    // Height: box + dot rows above and below (2 × 280px scaled) + one dot.
    <section
      ref={sectionRef}
      className="relative h-[calc(var(--bh)+var(--s)*560px+8px)] w-full overflow-hidden"
      style={
        { "--s": 1, "--bh": "296px", "--bw": "640px" } as React.CSSProperties
      }
    >
      <motion.div
        initial={initial}
        animate={animate}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { delay: CAROUSEL_DELAY, duration: 0.8 },
          },
        }}
        className="absolute inset-0"
      >
        <MoreCarousel geometry={geometry} />
      </motion.div>

      {dots.map((dot, index) => (
        <motion.span
          key={`${dot.x}:${dot.side * dot.gap}`}
          initial={initial}
          animate={animate}
          variants={{
            hidden: { opacity: 0, scale: 0 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: {
                delay: DOTS_DELAY + index * DOT_STAGGER,
                type: "spring",
                stiffness: 400,
                damping: 20,
              },
            },
          }}
          className="pointer-events-none absolute -mt-1 -ml-1 size-2 rounded-full bg-muted-foreground"
          style={{
            left: dotLeft(dot.x),
            top: `calc(50% + ${dot.side} * (var(--bh) / 2 + ${dot.gap}px * var(--s)))`,
          }}
        />
      ))}

      <motion.div
        ref={boxRef}
        initial={initial}
        animate={animate}
        variants={{
          hidden: { opacity: 0, scale: 0.96 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.6, ease: "easeOut" },
          },
        }}
        className="absolute top-1/2 left-1/2 z-10 w-[min(640px,calc(100%-96px))] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="flex flex-col items-center gap-8 rounded-[32px] bg-black px-5 pt-8 pb-8 text-center md:gap-12 md:rounded-[40px] md:px-20 md:pt-10 md:pb-12">
          <div className="flex flex-col gap-2">
            <h2 className="text-display text-balance text-white">
              There is more to it
            </h2>
            <p className="text-lg leading-6 tracking-normal text-muted-foreground">
              Check our other products, explore collections, and filter to you
              needs and preferences.
            </p>
          </div>
          <Button className="h-12 rounded-full bg-white px-4 text-lg text-black hover:bg-white/80">
            Shop all
          </Button>
        </div>
      </motion.div>
    </section>
  )
}

export { MoreSection }
