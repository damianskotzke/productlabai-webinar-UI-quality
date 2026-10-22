"use client"

import * as React from "react"
import Image from "next/image"
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "motion/react"

import { StreamText } from "@/components/stream-text"

const MISSION =
  "At TEKKUU we believe that future of wearables are consciously and ethically engineered and crafted textiles. We hire and co-operate with the keenest and freshest mind in the textile industry to deliver you tasteful items you enjoy to wear in comfort."

// Pointer distance (px) from a dot's centre that opens its image.
const PROXIMITY_RADIUS = 80
const DOT_SIZE = 8
const IMAGE_SIZE = 320

// Dot positions on the Figma frame (% of width, % of height), top row first.
const dots = [
  { x: 0, y: 0, image: "behind-the-scenes-04" },
  { x: 50, y: 0, image: "behind-the-scenes-01" },
  { x: 100, y: 0, image: "behind-the-scenes-02" },
  { x: 0, y: 100, image: "behind-the-scenes-03" },
  { x: 50, y: 100, image: "behind-the-scenes-05" },
  { x: 100, y: 100, image: "behind-the-scenes-06" },
]

// Reveal order: label, then dots, then the mission streams word by word.
const LABEL_DELAY = 0
const DOTS_DELAY = 0.15
const DOT_STAGGER = 0.08
const WORDS_DELAY = 0.45

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.6, ease: "easeOut" },
  }),
}

const popDot: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: DOTS_DELAY + index * DOT_STAGGER,
      type: "spring",
      stiffness: 400,
      damping: 20,
    },
  }),
}

function MissionSection() {
  const sectionRef = React.useRef<HTMLElement>(null)
  const anchorRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const [active, setActive] = React.useState<number | null>(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.4 })
  const reducedMotion = useReducedMotion()
  const revealed = inView || Boolean(reducedMotion)

  function onPointerMove(event: React.PointerEvent<HTMLElement>) {
    const hit = anchorRefs.current.findIndex((anchor) => {
      if (!anchor) return false
      const rect = anchor.getBoundingClientRect()
      return (
        Math.hypot(
          event.clientX - (rect.left + rect.width / 2),
          event.clientY - (rect.top + rect.height / 2)
        ) <= PROXIMITY_RADIUS
      )
    })
    setActive(hit === -1 ? null : hit)
  }

  return (
    <section
      id="mission"
      ref={sectionRef}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setActive(null)}
      className="relative flex w-full max-w-[1728px] items-center justify-center overflow-x-clip px-4 py-[clamp(176px,26svh,312px)] md:px-6"
    >
      <motion.div
        initial={reducedMotion ? false : "hidden"}
        animate={revealed ? "visible" : "hidden"}
        className="relative z-0 flex w-full max-w-[1080px] flex-col items-center gap-6 text-center"
      >
        <motion.p
          variants={fadeUp}
          custom={LABEL_DELAY}
          className="text-sm leading-5"
        >
          Mission
        </motion.p>
        <p className="text-display">
          <StreamText text={MISSION} play={revealed} delay={WORDS_DELAY} />
        </p>

        {/* Dot frame from Figma: 84px above and below the text, up to 1248px wide. */}
        <motion.div
          initial={reducedMotion ? false : "hidden"}
          animate={revealed ? "visible" : "hidden"}
          className="pointer-events-none absolute -top-[84px] -bottom-[84px] left-1/2 z-10 w-[min(1248px,calc(100vw-48px))] -translate-x-1/2"
        >
          {dots.map((dot, index) => (
            <div
              key={dot.image}
              ref={(node) => {
                anchorRefs.current[index] = node
              }}
              className="absolute size-0"
              style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
            >
              <motion.div variants={popDot} custom={index}>
                <ProximityImage image={dot.image} open={active === index} />
              </motion.div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

function ProximityImage({ image, open }: { image: string; open: boolean }) {
  // Only opens on the client, after a pointer move, so `window` exists here.
  const size = open ? Math.min(IMAGE_SIZE, window.innerWidth * 0.7) : DOT_SIZE

  return (
    <motion.div
      initial={false}
      animate={{
        width: size,
        height: size,
        borderRadius: open ? 40 : DOT_SIZE / 2,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="absolute -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-muted-foreground"
    >
      <motion.div
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, delay: open ? 0.08 : 0 }}
        className="absolute inset-0"
      >
        <Image
          src={`/images/behind-the-scenes/${image}.png`}
          alt=""
          fill
          sizes={`${IMAGE_SIZE}px`}
          className="object-cover"
        />
      </motion.div>
    </motion.div>
  )
}

export { MissionSection }
