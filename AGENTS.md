<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# TEKKUU landing page

A one-page e-commerce front page. It is the example project for the Design Practice webinar „Dlaczego AI robi przeciętne UI?” (course Product Lab AI). See `README.md`.

- Full-page overview (bitmap): `docs/landing-page.png`.
- Figma file: https://www.figma.com/design/ZbmNn9OzI6l6TWIsALNRiu/Product-Lab-AI--Community-Resources?node-id=0-1

## Workflow rules

- **Build section by section.** Do not start a new section until the user gives its Figma link (read it with the Figma MCP) and its instructions.
- **Figma is the source of truth.** Read the section's Figma node before you change it. Match the screenshot.
- **Use shadcn/ui first.** Add components with `pnpm dlx shadcn@latest add <name>`. Adjust them with `className`. Build a custom component only when no shadcn component can do the job (example: the hero carousel physics).
- **Interactivity is set per section.** Many elements are hover-only with no action. Do not add behaviour the instructions do not ask for.
- **Never commit or push** without explicit approval.

## Stack

- Next.js 16 (App Router). Read `node_modules/next/dist/docs/` before you use an API. Example: `next/image` uses `preload`/`loading`, not `priority`.
- Tailwind v4, tokens in `app/globals.css`.
- shadcn style `base-vega` on Base UI (`@base-ui/react`), not Radix. Use `render={<a />}` + `nativeButton={false}` for link buttons.
- cmdk `CommandDialog` needs a `<Command>` root inside it.
- Animation: `motion` (`motion/react`). Reuse the helpers:
  - `components/fade-in.tsx` — fade + rise, on mount or when `play` turns true; build sequences with `delay`.
  - `components/stream-text.tsx` — word-by-word text streaming.
  - `lib/intro.ts` — load-sequence timings for the header and hero.
- Scroll reveals play once (`useInView(..., { once: true })`) and respect `useReducedMotion`.
- Spotlight: one `SpotlightProvider` (`components/spotlight.tsx`) wraps the page and owns the dialog and ⌘K; place `<SearchTrigger />` anywhere.
- Header (`components/site-header.tsx`): one fixed bar. After 60px of scroll its items glide (motion `layout`) into the compact pill from Figma node 29:2969 — 80px tall, fully rounded, Collection · Search · Basket. The white pill is a separate layer that fades in at its final size (never animate the bar's own size or background). `main` keeps top padding for the fixed bar.
- Icons: Figma SVG exports in `public/icons/`; hugeicons only inside shadcn components.

## Fonts

- PP Neue Montreal Medium (+ Medium Italic for `®`) loads with `next/font/local` from `app/fonts/`. It is a commercial font: **never commit the font files** (`.gitignore` blocks them). If the files are missing, the build fails — tell the user to get them from Pangram Pangram or to switch to Inter (see `README.md`).
- Geist Mono (SKUs) loads with `next/font/google`.
- The logo (`public/logo/tekkuu.svg`) is set in Frama by Pangram Pangram. It falls under that font licence and cannot be used commercially. Do not reuse it in other projects.

## Design tokens (from Figma)

- Text: black. Secondary text: `#909090` (`text-muted-foreground`). Surfaces: `#f0f0f0` (`bg-muted` / `secondary`).
- Letter spacing: −2% site-wide (set on `html`).
- Page frame 1728px, content 1632px (48px gutters). Pills: `rounded-full`, h-12 (48px) or h-8 (32px), text-lg.
- Large cards: 40px radius (32px or 24px on phones).

## Responsive rules

- Use `text-display` for every 48/56 heading (32/40 → 40/48 at `md` → 48/56 at `lg`). It is a custom utility in `app/globals.css`; on shadcn parts that set their own size, use `text-display!`.
- Gutters: `px-4` phone, `md:px-6`, `lg:px-12`.
- Plan for short screens too: the hero slide (`hero-slide` utility) is capped by `100svh` and switches to 3:4 in portrait.
- `body` has `overflow-x: clip`; still fix any element that is wider than the viewport.

## Assets

- `public/images/hero/` — hero carousel photos.
- `public/images/products/` — product shots. Files with the `-hero` suffix go with the hero carousel.
- `public/images/textiles/`, `behind-the-scenes/`, `more/` — textiles, mission and "There is more to it" sections.
- `public/logo/tekkuu.svg`, `public/icons/`.
- Product names, SKUs and textiles live in `lib/catalog.ts`.

## Sections

1. ✅ Header + hero (`components/site-header.tsx`, `components/sections/hero-section.tsx`, `components/hero-carousel.tsx`, `components/spotlight.tsx`) — load sequence: header items → carousel → card → bottom bar
2. ✅ Mission (`components/sections/mission-section.tsx`) — six dots open into `behind-the-scenes` images within 80px of the pointer; reveal plays once on first scroll-in, then the text streams word by word
3. ✅ Bestsellers (`components/sections/bestsellers-section.tsx`) — cards fade in one by one on first scroll-in; photo zoom and play-button scale on hover; Filter, Shop all and Play do nothing
4. ✅ Textiles (`components/sections/textiles-section.tsx`) — shadcn `Tabs` (vertical); scroll reveal: label → names → image → description; image cross-fades, description streams in word by word on each switch. Copy lives in `textileDetails` (`lib/catalog.ts`)
5. ✅ "There is more to it" (`components/sections/more-section.tsx`, `components/more-carousel.tsx`) — reveal: box → dots → carousel. One endless track passes behind the box; size depends on distance to the box (Figma: 160/132/96px). Layout scales with width (`--s`) and box size (`--bh`, `--bw`). Hover pauses; click opens a lightbox (shadcn `Dialog`, `overlayClassName` prop added to `DialogContent`): the image flies from its thumbnail to full size and back, over the same backdrop as the Spotlight dialog
6. ✅ Footer (`components/site-footer.tsx`) — link columns fade in one by one, logo rises in from below. Links are hover-only (`#`)
