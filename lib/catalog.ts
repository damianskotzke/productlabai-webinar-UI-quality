export type Textile =
  "BluGrad®" | "WinterTech" | "Revert®" | "ImpossibleJeans" | "ImpossibleCotton"

export type Product = {
  name: string
  sku: string
  textile: Textile
  image: string
  /** Price in EUR. */
  price?: number
}

export type HeroSlide = {
  product: Product
  photo: string
}

const productImage = (slug: string) => `/images/products/product-${slug}.png`

export const heroSlides: HeroSlide[] = [
  {
    photo: "/images/hero/hero-header-02.png",
    product: {
      name: "Vanta Diamond Wrap",
      sku: "BG507",
      textile: "BluGrad®",
      image: productImage("Vanta-Diamond-Wrap-hero"),
    },
  },
  {
    photo: "/images/hero/hero-header-03.png",
    product: {
      name: "Axiom Loop Pullover",
      sku: "BG422",
      textile: "BluGrad®",
      image: productImage("Axiom-Loop-Pullover-hero"),
    },
  },
  {
    photo: "/images/hero/hero-header-01.png",
    product: {
      name: "Halcyon Cocoon Shell",
      sku: "BG318",
      textile: "BluGrad®",
      image: productImage("Halcyon-Cocoon-Shell-hero"),
    },
  },
]

export const products: Product[] = [
  ...heroSlides.map((slide) => slide.product),
  {
    name: "Ion Run Shell",
    sku: "BG231",
    textile: "BluGrad®",
    image: productImage("Ion-Run-Shell"),
    price: 340,
  },
  {
    name: "Terrain Cargo Vest",
    sku: "IC234",
    textile: "ImpossibleCotton",
    image: productImage("Terrain-Cargo-Vest"),
    price: 400,
  },
  {
    name: "Graphite Flight Bomber",
    sku: "R101",
    textile: "Revert®",
    image: productImage("Graphite-Flight-Bomber"),
    price: 420,
  },
  {
    name: "Polar Shift System",
    sku: "BG567",
    textile: "BluGrad®",
    image: productImage("Polar-Shift-System"),
    price: 580,
  },
  {
    name: "Vector Harness Smock",
    sku: "IC232",
    textile: "ImpossibleCotton",
    image: productImage("Vector-Harness-Smock"),
    price: 400,
  },
  {
    name: "Silver Weather Poncho",
    sku: "R103",
    textile: "Revert®",
    image: productImage("Silver-Weather-Poncho"),
    price: 220,
  },
  {
    name: "Motion Membrane Parka",
    sku: "R222",
    textile: "Revert®",
    image: productImage("Motion-Membrane-Parka"),
    price: 350,
  },
  {
    name: "Glacial Vector Parka",
    sku: "BG357",
    textile: "BluGrad®",
    image: productImage("Glacial-Vector-Parka"),
    price: 800,
  },
]

export const textiles: Textile[] = [
  "BluGrad®",
  "WinterTech",
  "Revert®",
  "ImpossibleJeans",
  "ImpossibleCotton",
]

export const navLinks = ["Collection", "Mission", "Locations"] as const

export type PricedProduct = Product & { price: number }

export const bestsellers = products.filter(
  (product): product is PricedProduct => product.price !== undefined
)

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(price)

export const textileDetails: Record<
  Textile,
  { image: string; description: string }
> = {
  "BluGrad®": {
    image: "/images/textiles/textile-BluGrad.png",
    description:
      "Fine-grid ripstop and bonded seams create a lightweight weather barrier built for abrasion resistance, everyday protection, and repairable long-term wear.",
  },
  WinterTech: {
    image: "/images/textiles/textile-WinterTech.png",
    description:
      "An open-loop technical knit combines airy softness, breathability, and resilient stretch, finished in a cool-toned treatment that keeps its tactile fibre texture visible.",
  },
  "Revert®": {
    image: "/images/textiles/textile-Revert.png",
    description:
      "Recycled-polyester weave, flexible ribbing, and stretch panels unite durable structure, easy care, and movement-focused comfort while giving existing resources renewed purpose.",
  },
  ImpossibleJeans: {
    image: "/images/textiles/textile-ImpossibleJeans.png",
    description:
      "Dense indigo twill and tonal topstitching are made to soften, fade, and grow more personal through repair, repeated wear, and time.",
  },
  ImpossibleCotton: {
    image: "/images/textiles/textile-ImpossibleCotton.png",
    description:
      "Cotton-based performance fabric pairs a breathable natural handfeel with micro-grid reinforcement and water resistance for versatile, longer-lasting everyday protection.",
  },
}
