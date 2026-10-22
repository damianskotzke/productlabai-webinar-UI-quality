"use client"

import * as React from "react"
import Image from "next/image"
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "motion/react"

import type { HeroSlide } from "@/lib/catalog"

// Idle drift in px/s. Negative values move the track to the left.
const BASE_SPEED = 40
// Time constant (s) for a flick to settle back to the idle drift.
const SETTLE_TIME = 1.2
const MAX_FLICK_SPEED = 4000
// Copies of the slide set, so the loop never shows an empty edge.
const COPIES = 3

type DragState = {
  lastX: number
  lastTime: number
  velocity: number
}

function wrap(value: number, period: number) {
  if (!period) return value
  return ((value % period) - period) % period
}

function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const trackRef = React.useRef<HTMLDivElement>(null)
  const period = React.useRef(0)
  const velocity = React.useRef(-BASE_SPEED)
  const drag = React.useRef<DragState | null>(null)
  const [dragging, setDragging] = React.useState(false)
  const reducedMotion = useReducedMotion()
  const x = useMotionValue(0)

  React.useLayoutEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    let initialised = false
    const measure = () => {
      const items = track.children as HTMLCollectionOf<HTMLElement>
      const first = items[0]
      const nextSet = items[slides.length]
      if (!first || !nextSet) return

      const previous = period.current
      period.current = nextSet.offsetLeft - first.offsetLeft

      if (!initialised) {
        // Match the Figma frame: the second slide starts ~10% in from the left.
        const step = period.current / slides.length
        x.set(wrap(viewport.clientWidth * 0.0987 - step, period.current))
        initialised = true
      } else if (previous) {
        x.set(wrap((x.get() / previous) * period.current, period.current))
      }
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [slides.length, x])

  useAnimationFrame((_, delta) => {
    if (drag.current) return

    const dt = Math.min(delta, 64) / 1000
    const direction = Math.sign(velocity.current) || -1
    const target = reducedMotion ? 0 : direction * BASE_SPEED
    velocity.current +=
      (target - velocity.current) * (1 - Math.exp(-dt / SETTLE_TIME))
    x.set(wrap(x.get() + velocity.current * dt, period.current))
  })

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = {
      lastX: event.clientX,
      lastTime: event.timeStamp,
      velocity: 0,
    }
    setDragging(true)
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const state = drag.current
    if (!state) return

    const dx = event.clientX - state.lastX
    const dt = (event.timeStamp - state.lastTime) / 1000
    x.set(wrap(x.get() + dx, period.current))

    if (dt > 0) {
      state.velocity = 0.8 * (dx / dt) + 0.2 * state.velocity
    }
    state.lastX = event.clientX
    state.lastTime = event.timeStamp
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const state = drag.current
    if (!state) return

    const idle = event.timeStamp - state.lastTime > 80
    const flick = Math.max(
      -MAX_FLICK_SPEED,
      Math.min(MAX_FLICK_SPEED, state.velocity)
    )
    // A pause before release keeps only the direction, not the speed.
    velocity.current = idle
      ? (Math.sign(flick) || Math.sign(velocity.current) || -1) * BASE_SPEED
      : flick
    drag.current = null
    setDragging(false)
  }

  return (
    <div
      ref={viewportRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="w-full cursor-grab touch-pan-y overflow-hidden select-none data-[dragging=true]:cursor-grabbing"
      data-dragging={dragging}
      aria-roledescription="carousel"
      aria-label="BluGrad® collection"
    >
      <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-6">
        {Array.from({ length: COPIES }, (_, copy) =>
          slides.map((slide) => (
            <HeroSlideCard
              key={`${copy}-${slide.product.sku}`}
              slide={slide}
              hidden={copy > 0}
            />
          ))
        )}
      </motion.div>
    </div>
  )
}

function HeroSlideCard({
  slide,
  hidden,
}: {
  slide: HeroSlide
  hidden: boolean
}) {
  const { product, photo } = slide

  return (
    <div
      aria-hidden={hidden || undefined}
      className="group relative hero-slide shrink-0 overflow-hidden rounded-[32px] bg-black md:rounded-[40px]"
    >
      <Image
        src={photo}
        alt={hidden ? "" : `${product.name} in BluGrad® textile`}
        fill
        sizes="(max-width: 1212px) 88vw, 1067px"
        // Copies share one URL, so eager loading costs no extra requests.
        loading="eager"
        draggable={false}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute top-6 left-6 flex h-8 items-center gap-2 rounded-full bg-black py-2 pr-3 pl-1 text-sm text-white transition-colors duration-200 hover:bg-white hover:text-black">
        <Image
          src={product.image}
          alt=""
          width={24}
          height={24}
          draggable={false}
          className="size-6 rounded-full bg-white object-cover object-top"
        />
        <span className="leading-5">{product.name}</span>
        <span className="pt-0.5 font-mono text-xs leading-4 font-light text-muted-foreground uppercase">
          {product.sku}
        </span>
      </div>
    </div>
  )
}

export { HeroCarousel }
