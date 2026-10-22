"use client"

import * as React from "react"
import Image from "next/image"
import { motion, useInView, useReducedMotion } from "motion/react"

import { Button } from "@/components/ui/button"

type FooterLink = { label: string; badge?: string }

const columns: { heading: string; links: FooterLink[] }[] = [
  {
    heading: "Shop",
    links: [
      { label: "All products" },
      { label: "All collections" },
      { label: "BluGrad®" },
      { label: "WinterTech" },
      { label: "Revert®" },
      { label: "Bestsellers" },
      { label: "On Sale", badge: "New" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "All products" },
      { label: "Sustainability" },
      { label: "Team" },
      { label: "Careers" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Returns" },
      { label: "Privacy Policy" },
      { label: "Cookies Policy" },
      { label: "Terms & Regulations" },
    ],
  },
]

const COLUMN_STAGGER = 0.12
const LOGO_DELAY = 0.2

function SiteFooter() {
  const footerRef = React.useRef<HTMLElement>(null)
  const inView = useInView(footerRef, { once: true, amount: 0.3 })
  const reducedMotion = useReducedMotion()
  const revealed = inView || Boolean(reducedMotion)

  function fadeIn(order: number) {
    return {
      initial: reducedMotion ? false : { opacity: 0, y: 12 },
      animate: revealed ? { opacity: 1, y: 0 } : undefined,
      transition: {
        delay: order * COLUMN_STAGGER,
        duration: 0.6,
        ease: "easeOut" as const,
      },
    }
  }

  return (
    <footer ref={footerRef} className="w-full overflow-hidden bg-muted">
      <div className="mx-auto flex w-full max-w-[1728px] flex-col gap-12 px-4 pt-16 pb-10 md:gap-20 md:px-6 md:pt-20 md:pb-20 lg:px-12">
        <div className="flex flex-col justify-between gap-16 md:flex-row">
          <div className="grid grid-cols-2 gap-x-6 gap-y-16 md:flex md:gap-6">
            {columns.map((column, index) => (
              <motion.nav
                key={column.heading}
                aria-label={column.heading}
                className="flex flex-col gap-6 md:w-[252px]"
                {...fadeIn(index)}
              >
                <p className="text-lg leading-5 text-muted-foreground">
                  {column.heading}
                </p>
                <ul className="flex flex-col gap-6">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Button
                        variant="link"
                        nativeButton={false}
                        render={<a href="#" />}
                        className="h-8 gap-2 border-0 p-0 text-lg text-foreground"
                      >
                        {link.label}
                        {link.badge && (
                          <span className="flex h-5 items-center rounded-full bg-foreground px-2 text-sm leading-4 text-background">
                            {link.badge}
                          </span>
                        )}
                      </Button>
                    </li>
                  ))}
                </ul>
              </motion.nav>
            ))}
          </div>

          <motion.div
            className="flex justify-between gap-6 text-lg leading-5 md:w-[252px] md:flex-col md:justify-start md:gap-20"
            {...fadeIn(columns.length)}
          >
            <p>© TEKKUU 2026</p>
            <p>
              Design by
              <br />
              Damian Skotzke
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: "60%" }}
          animate={revealed ? { opacity: 1, y: 0 } : undefined}
          transition={{
            delay: LOGO_DELAY,
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Image
            src="/logo/tekkuu.svg"
            alt="TEKKUU"
            width={1632}
            height={345}
            // Same file as the header logo, so it is already loaded.
            loading="eager"
            className="h-auto w-full"
          />
        </motion.div>
      </div>
    </footer>
  )
}

export { SiteFooter }
