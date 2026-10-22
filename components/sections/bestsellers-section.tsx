"use client"

import * as React from "react"
import Image from "next/image"
import { motion, useInView, useReducedMotion } from "motion/react"

import { Button } from "@/components/ui/button"
import { bestsellers, formatPrice, type PricedProduct } from "@/lib/catalog"

const CARD_STAGGER = 0.1

function BestsellersSection() {
  const gridRef = React.useRef<HTMLDivElement>(null)
  const inView = useInView(gridRef, { once: true, amount: 0.15 })
  const reducedMotion = useReducedMotion()

  return (
    <section
      id="collection"
      className="flex w-full max-w-[1728px] flex-col gap-10 px-4 md:gap-20 md:px-6 lg:px-12"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h2 className="text-display">Bestsellers</h2>
        <div className="-mx-2 flex items-center gap-2 md:mx-0 md:gap-6">
          <Button
            variant="ghost"
            className="h-8 gap-2 rounded-full px-2 text-lg"
          >
            <Image src="/icons/filter.svg" alt="" width={24} height={24} />
            Filter
          </Button>
          <Button
            variant="ghost"
            className="h-8 gap-2 rounded-full px-2 text-lg"
          >
            Shop all
            <Image
              src="/icons/arrow-up-right.svg"
              alt=""
              width={24}
              height={24}
            />
          </Button>
        </div>
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-6 md:gap-y-20 lg:grid-cols-4"
      >
        {bestsellers.map((product, index) => (
          <motion.div
            key={product.sku}
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            animate={inView || reducedMotion ? { opacity: 1, y: 0 } : undefined}
            transition={{
              delay: index * CARD_STAGGER,
              duration: 0.6,
              ease: "easeOut",
            }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: PricedProduct }) {
  return (
    <article className="group flex flex-col gap-4 md:gap-6">
      <div className="relative aspect-[9/16] overflow-hidden rounded-[24px] bg-muted md:rounded-[40px]">
        <Image
          src={product.image}
          alt={`${product.name} in ${product.textile}`}
          fill
          sizes="(max-width: 1024px) 50vw, 390px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-black/8" />
        <Button
          aria-label={`Play ${product.name} preview`}
          className="absolute right-3 bottom-3 size-10 rounded-full bg-white p-2 transition-transform duration-200 hover:scale-110 hover:bg-white md:right-6 md:bottom-6"
        >
          <Image src="/icons/play.svg" alt="" width={24} height={24} />
        </Button>
      </div>

      <div className="flex flex-col gap-[7px]">
        <div className="flex items-center gap-2">
          <span className="text-sm leading-5">{product.textile}</span>
          <span className="font-mono text-xs leading-4 text-muted-foreground uppercase">
            {product.sku}
          </span>
        </div>
        <div className="flex flex-col gap-1 text-base leading-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:text-lg">
          <h3>{product.name}</h3>
          <p className="shrink-0 sm:text-right">{formatPrice(product.price)}</p>
        </div>
      </div>
    </article>
  )
}

export { BestsellersSection }
