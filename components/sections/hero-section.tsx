import Image from "next/image"

import { FadeIn } from "@/components/fade-in"
import { HeroCarousel } from "@/components/hero-carousel"
import { Button } from "@/components/ui/button"
import { heroSlides, textiles } from "@/lib/catalog"
import { intro } from "@/lib/intro"

const pill = "h-12 rounded-full px-4 text-lg"
// Tighter card on short screens, so it fits inside a smaller slide.
const shortScreen = "[@media(max-height:760px)]"

function ArrowUpRight() {
  return <Image src="/icons/arrow-up-right.svg" alt="" width={24} height={24} />
}

function HeroSection() {
  return (
    <section className="flex w-full flex-col items-center gap-6">
      <div className="relative w-full">
        <FadeIn delay={intro.carousel} duration={1} y={0}>
          <HeroCarousel slides={heroSlides} />
        </FadeIn>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center pb-8">
          <FadeIn
            delay={intro.card}
            y={16}
            className={`pointer-events-auto mx-4 flex flex-col items-center gap-8 rounded-[32px] bg-black px-8 pt-8 pb-8 text-center backdrop-blur-md md:gap-12 md:rounded-[40px] md:px-20 md:pt-10 md:pb-12 ${shortScreen}:gap-6 ${shortScreen}:pt-8 ${shortScreen}:pb-8`}
          >
            <div className="flex max-w-80 flex-col gap-2">
              <h1 className="text-display text-white">
                BluGrad
                <span className="text-muted-foreground italic">®</span>
              </h1>
              <p className="text-lg leading-6 tracking-normal text-muted-foreground">
                Beat every weather in with our new textile technology.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                className={`${pill} bg-white text-black hover:bg-white/80`}
              >
                Shop
              </Button>
              <Button
                className={`${pill} bg-white text-black hover:bg-white/80`}
              >
                Learn more
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="flex w-full max-w-[1728px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 md:px-6 lg:px-12">
        <FadeIn
          delay={intro.textiles}
          className="-mx-4 flex w-[calc(100%+2rem)] [scrollbar-width:none] items-center gap-1 overflow-x-auto px-2 md:mx-0 md:w-auto md:gap-4 md:overflow-visible md:px-0"
        >
          {textiles.slice(0, 3).map((textile, index) => (
            <Button
              key={textile}
              variant={index === 0 ? "secondary" : "ghost"}
              className={pill}
            >
              {textile}
            </Button>
          ))}
          <Button variant="ghost" className={`${pill} gap-2`}>
            Shop all
            <ArrowUpRight />
          </Button>
        </FadeIn>

        <FadeIn delay={intro.trust} className="flex items-center gap-3">
          <Image src="/icons/users.svg" alt="" width={24} height={24} />
          <p className="hidden text-lg text-muted-foreground lg:block">
            We’re trusted by 20,000+ fashion-forward customers
          </p>
          <Button
            variant="ghost"
            className="h-8 gap-2 rounded-full pr-1 pl-2 text-lg"
          >
            Check reviews
            <ArrowUpRight />
          </Button>
        </FadeIn>
      </div>
    </section>
  )
}

export { HeroSection }
