"use client"

import * as React from "react"
import Image from "next/image"
import { motion, useInView, useReducedMotion } from "motion/react"

import { FadeIn } from "@/components/fade-in"
import { StreamText } from "@/components/stream-text"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { textileDetails, textiles, type Textile } from "@/lib/catalog"

// Scroll-in order: label, textile names one by one, image, description.
const NAME_DELAY = 0.1
const NAME_STAGGER = 0.08
const IMAGE_DELAY = 0.2
const DESCRIPTION_DELAY = NAME_DELAY + textiles.length * NAME_STAGGER + 0.1

function TextilesSection() {
  const [active, setActive] = React.useState<Textile>(textiles[0])
  // The first description waits for the reveal sequence; later ones stream at once.
  const [switched, setSwitched] = React.useState(false)
  const sectionRef = React.useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.3 })
  const reducedMotion = useReducedMotion()
  const revealed = inView || Boolean(reducedMotion)

  return (
    <section
      id="textiles"
      ref={sectionRef}
      className="w-full max-w-[1728px] px-4 py-24 md:px-6 md:py-40 lg:px-12"
    >
      <Tabs
        value={active}
        onValueChange={(value) => {
          setActive(value as Textile)
          setSwitched(true)
        }}
        orientation="vertical"
        className="flex flex-col gap-10 lg:flex-row lg:items-stretch lg:justify-between"
      >
        <div className="flex flex-col justify-between gap-10 md:gap-16 lg:w-[min(491px,34%)] lg:shrink-0">
          <div className="flex flex-col gap-10 md:gap-20">
            <FadeIn play={revealed}>
              <p className="text-lg leading-5">Textiles</p>
            </FadeIn>
            <TabsList
              variant="line"
              className="w-full items-start gap-3 p-0 md:gap-6"
            >
              {textiles.map((textile, index) => (
                <FadeIn
                  key={textile}
                  play={revealed}
                  delay={NAME_DELAY + index * NAME_STAGGER}
                >
                  <TabsTrigger
                    value={textile}
                    className="h-auto flex-none rounded-none border-0 p-0 text-display! font-medium text-muted-foreground after:hidden hover:text-foreground/70 data-active:text-foreground"
                  >
                    {textile}
                  </TabsTrigger>
                </FadeIn>
              ))}
            </TabsList>
          </div>

          {textiles.map((textile) => (
            <TabsContent
              key={textile}
              value={textile}
              className="flex-none text-lg leading-6 tracking-[0.01em]"
            >
              <p>
                <StreamText
                  text={textileDetails[textile].description}
                  play={revealed}
                  delay={switched ? 0 : DESCRIPTION_DELAY}
                  stagger={0.025}
                />
              </p>
            </TabsContent>
          ))}
        </div>

        <FadeIn
          play={revealed}
          delay={IMAGE_DELAY}
          duration={0.9}
          y={24}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] bg-black md:rounded-[40px] lg:max-w-[1080px] lg:flex-1"
        >
          {textiles.map((textile) => {
            const isActive = textile === active
            return (
              <motion.div
                key={textile}
                aria-hidden={!isActive}
                initial={false}
                animate={{
                  opacity: isActive ? 1 : 0,
                  scale: isActive ? 1 : 1.04,
                }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
                style={{ zIndex: isActive ? 1 : 0 }}
              >
                <Image
                  src={textileDetails[textile].image}
                  alt={isActive ? `${textile} textile close-up` : ""}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1080px"
                  className="object-cover"
                />
              </motion.div>
            )
          })}
        </FadeIn>
      </Tabs>
    </section>
  )
}

export { TextilesSection }
