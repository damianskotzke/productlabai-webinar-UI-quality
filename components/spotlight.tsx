"use client"

import * as React from "react"
import Image from "next/image"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import { Kbd } from "@/components/ui/kbd"
import { cn } from "@/lib/utils"
import {
  formatPrice,
  navLinks,
  products,
  textileDetails,
  textiles,
} from "@/lib/catalog"

const SpotlightContext = React.createContext<(open: boolean) => void>(() => {})

// Group headings follow the footer column headings: 18px, grey.
const groupClass =
  "p-0 pt-6 **:[[cmdk-group-heading]]:px-4 **:[[cmdk-group-heading]]:pb-3 **:[[cmdk-group-heading]]:text-lg **:[[cmdk-group-heading]]:leading-5 **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground"
// Right-aligned price or arrow. A shortcut slot also hides cmdk's check icon.
const shortcutClass = "shrink-0 text-lg tracking-normal text-foreground"
const itemClass =
  "gap-4 rounded-3xl! px-4 py-2 text-lg leading-5 data-selected:bg-muted"

/** Holds the one Spotlight dialog and the ⌘K / Ctrl+K shortcut. */
function SpotlightProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const close = () => setOpen(false)

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <SpotlightContext value={setOpen}>
      {children}

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Spotlight"
        description="Search products, textiles and pages"
        overlayClassName="bg-black/20 supports-backdrop-filter:backdrop-blur-md"
        className="top-[max(24px,12vh)] max-w-[calc(100%-32px)] gap-0 rounded-[40px]! bg-background p-4 shadow-[0_24px_80px_rgb(0_0_0/0.12)] ring-0 sm:max-w-2xl md:p-6"
      >
        <Command className="rounded-none! bg-transparent p-0">
          <CommandInput placeholder="Search">
            <Kbd className="h-5 rounded-full bg-background px-2 text-sm leading-4 text-foreground">
              esc
            </Kbd>
          </CommandInput>
          <CommandList className="max-h-[min(60svh,560px)] scroll-pb-2">
            <CommandEmpty className="py-10 text-lg text-muted-foreground">
              Nothing found.
            </CommandEmpty>

            <CommandGroup heading="Products" className={groupClass}>
              {products.map((product) => (
                <CommandItem
                  key={product.sku}
                  value={`${product.name} ${product.sku} ${product.textile}`}
                  onSelect={close}
                  className={itemClass}
                >
                  <Image
                    src={product.image}
                    alt=""
                    width={48}
                    height={48}
                    className="size-12 rounded-xl bg-muted object-cover object-top"
                  />
                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm leading-5">
                        {product.textile}
                      </span>
                      <span className="font-mono text-xs leading-4 text-muted-foreground uppercase">
                        {product.sku}
                      </span>
                    </div>
                    <span className="truncate">{product.name}</span>
                  </div>
                  {product.price !== undefined && (
                    <CommandShortcut className={shortcutClass}>
                      {formatPrice(product.price)}
                    </CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="Textiles" className={groupClass}>
              {textiles.map((textile) => (
                <CommandItem
                  key={textile}
                  onSelect={close}
                  className={itemClass}
                >
                  <Image
                    src={textileDetails[textile].image}
                    alt=""
                    width={48}
                    height={48}
                    className="size-12 rounded-xl bg-muted object-cover"
                  />
                  {textile}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="Pages" className={groupClass}>
              {navLinks.map((link) => (
                <CommandItem
                  key={link}
                  onSelect={close}
                  className={cn(itemClass, "py-3")}
                >
                  {link}
                  <CommandShortcut className={shortcutClass}>
                    <Image
                      src="/icons/arrow-up-right.svg"
                      alt=""
                      width={24}
                      height={24}
                    />
                  </CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </SpotlightContext>
  )
}

/** The grey search pill. Below `md` it shrinks to an icon. */
function SearchTrigger() {
  const setOpen = React.useContext(SpotlightContext)

  return (
    <button
      type="button"
      aria-label="Search"
      onClick={() => setOpen(true)}
      className="flex h-12 w-12 shrink-0 items-center gap-2 rounded-full bg-muted px-3 transition-colors outline-none hover:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_5%)] focus-visible:ring-3 focus-visible:ring-ring/50 md:w-60 md:px-4"
    >
      <Image src="/icons/search.svg" alt="" width={24} height={24} />
      <span className="hidden flex-1 text-left text-lg text-foreground/40 md:block">
        Search
      </span>
      <Kbd className="hidden h-5 rounded-full bg-background px-2 text-sm leading-4 text-foreground md:inline-flex">
        ⌘+K
      </Kbd>
    </button>
  )
}

export { SpotlightProvider, SearchTrigger }
