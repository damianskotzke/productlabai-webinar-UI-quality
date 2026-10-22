"use client"

import * as React from "react"
import Image from "next/image"
import { motion, useAnimationFrame, useReducedMotion } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

/** Live layout values, measured by the section. */
export type MoreGeometry = {
  /** Section scale against the 1728px Figma frame (0.5 – 1). */
  scale: number
  /** Half the black box width, in px. */
  boxHalfWidth: number
}

const images = Array.from(
  { length: 8 },
  (_, index) => `/images/more/more-${String(index + 1).padStart(2, "0")}.png`
)

// Two copies of the set keep the wrap point far outside the viewport.
const items = [...images, ...images]

const BASE_SIZE = 160
// Distance between items along the track, before compression (px).
const SPACING = 240
const TRACK_LENGTH = items.length * SPACING
// Drift speed in px/s. Positive values move items to the right.
const SPEED = 32
// Time constant (s) for the drift to stop or restart on hover.
const EASE_TIME = 0.35

// From Figma: item centres sit 448, 688 and 876px from the box centre,
// with sizes 160, 132 and 96px. Beyond 688px the spacing compresses.
const COMPRESS_FROM = 688
const COMPRESSION = 0.78
const sizeStops = [
  { at: 448, size: 160 },
  { at: 688, size: 132 },
  { at: 876, size: 96 },
]
const MIN_SIZE = 40
const FIGMA_BOX_HALF_WIDTH = 320

// Lightbox: the image fills the viewport minus this padding, at its 4:3
// aspect, with the hero slide corner radius.
const LIGHTBOX_PADDING = 24
const IMAGE_ASPECT = 4 / 3
const LIGHTBOX_RADIUS = 40
const MORPH = { type: "spring", duration: 0.55, bounce: 0.12 } as const

function compress(distance: number) {
  if (distance <= COMPRESS_FROM) return distance
  return COMPRESS_FROM + (distance - COMPRESS_FROM) * COMPRESSION
}

function sizeAt(distance: number) {
  const [first, ...rest] = sizeStops
  if (distance <= first.at) return first.size

  let previous = first
  for (const stop of rest) {
    if (distance <= stop.at) {
      const t = (distance - previous.at) / (stop.at - previous.at)
      return previous.size + t * (stop.size - previous.size)
    }
    previous = stop
  }

  // Past the last stop, keep shrinking at the same rate.
  const [a, b] = sizeStops.slice(-2)
  const slope = (b.size - a.size) / (b.at - a.at)
  return Math.max(MIN_SIZE, b.size + slope * (distance - b.at))
}

/** Where item `index` is for a given track offset. */
function layoutItem(
  index: number,
  offset: number,
  { scale, boxHalfWidth }: MoreGeometry
) {
  // Position on the track, centred on the box.
  const u = ((index * SPACING + offset) % TRACK_LENGTH) - TRACK_LENGTH / 2
  const distance = compress(Math.abs(u))
  const side = Math.sign(u) || 1
  // Measured from the box edge (320px in Figma), so items keep their
  // spacing from the box when it is narrower.
  return {
    centre: side * (boxHalfWidth + (distance - FIGMA_BOX_HALF_WIDTH) * scale),
    size: sizeAt(distance) * scale,
  }
}

type Box = { left: number; top: number; width: number; height: number }

type Pose = { x: number; y: number; scale: number; clipPath: string }

/** The full-size image frame, centred in the viewport. */
function lightboxBox(): Box {
  const maxWidth = window.innerWidth - LIGHTBOX_PADDING * 2
  const maxHeight = window.innerHeight - LIGHTBOX_PADDING * 2
  const width = Math.min(maxWidth, maxHeight * IMAGE_ASPECT)
  const height = width / IMAGE_ASPECT
  return {
    left: (window.innerWidth - width) / 2,
    top: (window.innerHeight - height) / 2,
    width,
    height,
  }
}

/**
 * The pose that lays the full-size frame exactly over a thumbnail: scaled to
 * its height, cropped to a square like `object-fit: cover`, same corners.
 */
function thumbnailPose(thumb: DOMRect, box: Box): Pose {
  const inset = (box.width - box.height) / 2
  return {
    x: thumb.left + thumb.width / 2 - (box.left + box.width / 2),
    y: thumb.top + thumb.height / 2 - (box.top + box.height / 2),
    scale: thumb.height / box.height,
    clipPath: `inset(0px ${inset}px 0px ${inset}px round ${box.height / 4}px)`,
  }
}

const OPEN_POSE: Pose = {
  x: 0,
  y: 0,
  scale: 1,
  clipPath: `inset(0px 0px 0px 0px round ${LIGHTBOX_RADIUS}px)`,
}

type Lightbox = {
  index: number
  box: Box
  /** Where the frame starts (opening) or ends (closing): the thumbnail. */
  thumbnail: Pose
  closing: boolean
}

function MoreCarousel({
  geometry,
}: {
  geometry: React.RefObject<MoreGeometry>
}) {
  const buttonRefs = React.useRef<(HTMLButtonElement | null)[]>([])
  const offset = React.useRef(0)
  const speed = React.useRef(SPEED)
  const hovered = React.useRef(false)
  const reducedMotion = useReducedMotion()
  const [lightbox, setLightbox] = React.useState<Lightbox | null>(null)

  useAnimationFrame((_, delta) => {
    const dt = Math.min(delta, 64) / 1000
    const target = hovered.current || reducedMotion || lightbox ? 0 : SPEED
    speed.current += (target - speed.current) * (1 - Math.exp(-dt / EASE_TIME))
    offset.current = (offset.current + speed.current * dt) % TRACK_LENGTH

    items.forEach((_, index) => {
      const button = buttonRefs.current[index]
      if (!button) return
      const { centre, size } = layoutItem(
        index,
        offset.current,
        geometry.current
      )
      button.style.transform = `translateX(${centre}px) scale(${size / BASE_SIZE})`
    })
  })

  // Keep the open frame fitted to the viewport.
  React.useEffect(() => {
    if (!lightbox) return
    const onResize = () =>
      setLightbox((current) =>
        current ? { ...current, box: lightboxBox() } : current
      )
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [lightbox])

  function open(index: number) {
    const button = buttonRefs.current[index]
    if (!button) return
    const box = lightboxBox()
    setLightbox({
      index,
      box,
      thumbnail: thumbnailPose(button.getBoundingClientRect(), box),
      closing: false,
    })
  }

  // Fly back to where the thumbnail is now, then unmount.
  function close() {
    setLightbox((current) => {
      if (!current || current.closing) return current
      const button = buttonRefs.current[current.index]
      return {
        ...current,
        closing: true,
        thumbnail: button
          ? thumbnailPose(button.getBoundingClientRect(), current.box)
          : current.thumbnail,
      }
    })
  }

  const image = lightbox ? items[lightbox.index] : null

  return (
    <>
      {items.map((src, index) => {
        const duplicate = index >= images.length
        return (
          <button
            key={index}
            ref={(node) => {
              buttonRefs.current[index] = node
            }}
            type="button"
            aria-label={`Open image ${(index % images.length) + 1}`}
            aria-hidden={duplicate || undefined}
            tabIndex={duplicate ? -1 : undefined}
            onPointerEnter={() => {
              hovered.current = true
            }}
            onPointerLeave={() => {
              hovered.current = false
            }}
            onFocus={() => {
              hovered.current = true
            }}
            onBlur={() => {
              hovered.current = false
            }}
            onClick={() => open(index)}
            className={cn(
              "absolute top-1/2 left-1/2 -mt-20 -ml-20 size-40 cursor-zoom-in overflow-hidden rounded-[40px] bg-muted-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              // The open frame stands in for its thumbnail.
              lightbox?.index === index && "invisible"
            )}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="160px"
              className="object-cover"
            />
          </button>
        )
      })}

      <Dialog
        open={lightbox !== null}
        onOpenChange={(open) => !open && close()}
      >
        <DialogContent
          showCloseButton={false}
          // Same backdrop as the Spotlight dialog, faded out while closing.
          overlayClassName={cn(
            "bg-black/20 transition-opacity duration-300 supports-backdrop-filter:backdrop-blur-md",
            lightbox?.closing && "opacity-0"
          )}
          onClick={close}
          className="top-0 left-0 block h-dvh w-screen max-w-none translate-x-0 translate-y-0 animate-none! rounded-none bg-transparent p-0 ring-0 sm:max-w-none"
        >
          <DialogTitle className="sr-only">Image preview</DialogTitle>
          {lightbox && image && (
            <motion.div
              initial={lightbox.thumbnail}
              animate={lightbox.closing ? lightbox.thumbnail : OPEN_POSE}
              transition={reducedMotion ? { duration: 0 } : MORPH}
              onAnimationComplete={() => {
                if (lightbox.closing) setLightbox(null)
              }}
              className="absolute overflow-hidden"
              style={{
                left: lightbox.box.left,
                top: lightbox.box.top,
                width: lightbox.box.width,
                height: lightbox.box.height,
              }}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes={`${Math.ceil(lightbox.box.width)}px`}
                className="object-cover"
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: lightbox.closing ? 0 : 1 }}
                transition={{
                  duration: 0.2,
                  delay: lightbox.closing ? 0 : 0.25,
                }}
                className="absolute top-4 right-4 md:top-6 md:right-6"
              >
                <Button
                  size="icon"
                  onClick={close}
                  className="size-10 rounded-full bg-white text-black hover:bg-white/80"
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                  <span className="sr-only">Close</span>
                </Button>
              </motion.div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export { MoreCarousel }
