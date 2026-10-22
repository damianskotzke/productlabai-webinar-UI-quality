"use client"

import * as React from "react"
import Image from "next/image"
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react"

import { SearchTrigger } from "@/components/spotlight"
import { Button } from "@/components/ui/button"
import { navLinks } from "@/lib/catalog"
import { intro } from "@/lib/intro"
import { cn } from "@/lib/utils"

const pillLink = "h-8 rounded-full px-2 text-lg"
// Scroll distance after which the header turns into the compact pill.
const COMPACT_AFTER = 60
// Shared timing for the morph between the full header and the pill.
const MORPH = { type: "spring", duration: 0.55, bounce: 0.12 } as const

function NavLink({ label }: { label: string }) {
  return (
    <Button
      variant="ghost"
      className={pillLink}
      nativeButton={false}
      render={<a href={`#${label.toLowerCase()}`} />}
    >
      {label}
    </Button>
  )
}

function BasketButton() {
  return (
    <Button variant="ghost" className={`${pillLink} gap-2 pr-1`}>
      Basket
      <span className="flex h-6 w-7 items-center justify-center rounded-full bg-foreground text-background">
        0
      </span>
    </Button>
  )
}

/**
 * One header item. It fades in with the load sequence, follows the morph
 * with a layout animation, and fades out when the compact pill drops it.
 */
function HeaderItem({
  ref,
  children,
  delay,
  className,
}: {
  // AnimatePresence `popLayout` needs the ref to lift exiting items out of
  // the flow at once, so the bar takes its compact size straight away.
  ref?: React.Ref<HTMLDivElement>
  children: React.ReactNode
  delay: number
  className?: string
}) {
  return (
    <motion.div
      ref={ref}
      layout="position"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.15 } }}
      transition={{
        opacity: { delay, duration: 0.5 },
        y: { delay, duration: 0.5 },
        layout: MORPH,
      }}
      className={cn("relative", className)}
    >
      {children}
    </motion.div>
  )
}

/**
 * Fixed header. At the top of the page it is the full-width bar from Figma;
 * after a short scroll the same bar morphs into a centred, fully rounded,
 * 80px pill (Collection · Search · Basket) and stays there.
 */
function SiteHeader() {
  const { scrollY } = useScroll()
  const [compact, setCompact] = React.useState(false)

  useMotionValueEvent(scrollY, "change", (value) => {
    setCompact(value > COMPACT_AFTER)
  })

  // Items that only the full bar shows. In the full bar the nav links need
  // room, so they appear from `lg` up.
  const fullOnly = (delay: number) => (compact ? 0 : delay)

  return (
    <motion.header
      layoutRoot
      className="pointer-events-none fixed inset-x-0 top-4 z-40 flex justify-center md:top-6"
    >
      <div
        className={cn(
          "pointer-events-auto relative flex h-20 items-center gap-4 md:gap-6",
          compact ? "px-4" : "w-full max-w-[1728px] px-4 md:px-6 lg:px-12"
        )}
      >
        {/* The white pill is its own layer: it fades and scales in at its
            final size, and leaves at that size (popLayout), so the bar never
            shows a stretched rectangle while the items glide into place. */}
        <AnimatePresence mode="popLayout">
          {compact && (
            <motion.div
              key="pill"
              aria-hidden
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.15 } }}
              transition={{ ...MORPH, delay: 0.08 }}
              className="absolute inset-0 rounded-full bg-background shadow-[0_8px_40px_rgb(0_0_0/0.08)]"
            />
          )}
        </AnimatePresence>

        <motion.div
          layout="position"
          transition={{ layout: MORPH }}
          className={cn(
            "relative flex items-center gap-8 xl:gap-12",
            !compact && "flex-1"
          )}
        >
          <AnimatePresence mode="popLayout">
            {!compact && (
              <HeaderItem key="logo" delay={intro.logo}>
                <a href="#" aria-label="TEKKUU home" className="block">
                  <Image
                    src="/logo/tekkuu.svg"
                    alt="TEKKUU"
                    width={90}
                    height={19}
                    loading="eager"
                  />
                </a>
              </HeaderItem>
            )}
          </AnimatePresence>

          <nav className="relative flex items-center gap-2 xl:gap-6">
            <HeaderItem
              delay={intro.nav}
              className={compact ? undefined : "hidden lg:block"}
            >
              <NavLink label={navLinks[0]} />
            </HeaderItem>
            <AnimatePresence mode="popLayout">
              {!compact &&
                navLinks.slice(1).map((link, index) => (
                  <HeaderItem
                    key={link}
                    delay={fullOnly(intro.nav + (index + 1) * 0.04)}
                    className="hidden lg:block"
                  >
                    <NavLink label={link} />
                  </HeaderItem>
                ))}
            </AnimatePresence>
          </nav>
        </motion.div>

        <HeaderItem delay={intro.search}>
          <SearchTrigger />
        </HeaderItem>

        <motion.div
          layout="position"
          transition={{ layout: MORPH }}
          className={cn("relative flex", !compact && "flex-1 justify-end")}
        >
          <HeaderItem delay={intro.basket}>
            <BasketButton />
          </HeaderItem>
        </motion.div>
      </div>
    </motion.header>
  )
}

export { SiteHeader }
