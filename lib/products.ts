export const shirtCategories = ["Meme Shirts", "Sports Merch", "Anime Merch"] as const;

export type ShirtCategory = (typeof shirtCategories)[number];

export type Product = {
  sku: string;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  collection: ShirtCategory;
  category: string;
  fit: "Oversized" | "Boxy" | "Relaxed";
  badge: string;
  description: string;
  story: string;
  vibe: string;
  materials: string;
  leadTime: string;
  sizes: string[];
  highlights: string[];
  palette: {
    base: string;
    shell: string;
    accent: string;
    glow: string;
    text: string;
  };
  storefrontImage: string | null;
  catalogImages: string[];
  inventory: number;
  active: boolean;
  featured: boolean;
  soldOut: boolean;
};

type ProductSeed = Omit<
  Product,
  "active" | "featured" | "inventory" | "soldOut" | "storefrontImage" | "catalogImages"
>;

export const defaultInventory = 24;

const productSeeds: ProductSeed[] = [
  {
    sku: "SB",
    slug: "social-battery-critical",
    name: "Social Battery Critical",
    subtitle: "Meme tee for leaving early",
    price: 899,
    collection: "Meme Shirts",
    category: "Graphic Tee",
    fit: "Oversized",
    badge: "Low battery energy",
    description:
      "A bright oversized tee for people who attend the function and mentally leave after seven minutes.",
    story:
      "The print reads like a warning label, which is helpful because small talk should come with hazard signs.",
    vibe: "Awkward, loud, and useful when words feel expensive.",
    materials: "220 GSM soft cotton",
    leadTime: "Dispatches in 48 hours",
    sizes: ["S", "M", "L", "XL"],
    highlights: ["Big front print", "Oversized street fit", "Soft ribbed collar"],
    palette: {
      base: "#fff5b8",
      shell: "#ffffff",
      accent: "#ffcf24",
      glow: "#ff5f7a",
      text: "#16110a",
    },
  },
  {
    sku: "ER",
    slug: "emotionally-rendering",
    name: "Emotionally Rendering",
    subtitle: "Unwearable office-hours tee",
    price: 999,
    collection: "Meme Shirts",
    category: "Statement Tee",
    fit: "Boxy",
    badge: "Dark mode brain",
    description:
      "For days when your face says fine but the loading spinner has been active since breakfast.",
    story:
      "A clean boxy tee with a deliberately uncomfortable joke about pretending to function.",
    vibe: "Dry, blunt, and just barely polite enough to wear outside.",
    materials: "230 GSM combed cotton",
    leadTime: "Dispatches in 72 hours",
    sizes: ["S", "M", "L", "XL"],
    highlights: ["Boxy crop", "High-density chest text", "Back neck hit"],
    palette: {
      base: "#ffffff",
      shell: "#fff1a6",
      accent: "#111111",
      glow: "#42d392",
      text: "#16110a",
    },
  },
  {
    sku: "BO",
    slug: "benchwarmer-olympics",
    name: "Benchwarmer Olympics",
    subtitle: "Sports merch for elite sitting",
    price: 1099,
    collection: "Sports Merch",
    category: "Fan Tee",
    fit: "Relaxed",
    badge: "Participation legend",
    description:
      "A sports tee for the athlete who knows hydration strategy, snack timing, and exactly where the shade is.",
    story:
      "Made for match days, gaming tournaments, and anyone who treats spectating like a serious discipline.",
    vibe: "Stadium energy without pretending you trained for this.",
    materials: "Dry-touch cotton blend",
    leadTime: "Dispatches in 48 hours",
    sizes: ["S", "M", "L", "XL"],
    highlights: ["Sporty number print", "Relaxed match-day fit", "Breathable finish"],
    palette: {
      base: "#ffdf3b",
      shell: "#ffffff",
      accent: "#1d4ed8",
      glow: "#ff5f7a",
      text: "#121212",
    },
  },
  {
    sku: "FC",
    slug: "final-whistle-chaos",
    name: "Final Whistle Chaos",
    subtitle: "Loud sports banter tee",
    price: 1199,
    collection: "Sports Merch",
    category: "Match Tee",
    fit: "Oversized",
    badge: "Extra time approved",
    description:
      "Built for people who shout tactical advice at screens and call it emotional investment.",
    story:
      "The shirt keeps the scoreboard energy high even when the actual score does not cooperate.",
    vibe: "Competitive, funny, and mildly unserious.",
    materials: "240 GSM cotton jersey",
    leadTime: "Made to order in 4 days",
    sizes: ["M", "L", "XL"],
    highlights: ["Oversized game-day block", "Sleeve number detail", "Durable print"],
    palette: {
      base: "#ffffff",
      shell: "#ffe24a",
      accent: "#ef4444",
      glow: "#1d4ed8",
      text: "#111111",
    },
  },
  {
    sku: "PA",
    slug: "plot-armor-expired",
    name: "Plot Armor Expired",
    subtitle: "Anime tee for doomed side quests",
    price: 999,
    collection: "Anime Merch",
    category: "Graphic Tee",
    fit: "Oversized",
    badge: "Arc ruined",
    description:
      "A bright anime-inspired tee for anyone who enters every situation like a side character with rent due.",
    story:
      "Designed with manga-panel energy, exaggerated warning text, and a joke that lands before the boss fight.",
    vibe: "Dramatic, self-aware, and one frame away from disaster.",
    materials: "220 GSM open-end cotton",
    leadTime: "Dispatches in 48 hours",
    sizes: ["S", "M", "L", "XL"],
    highlights: ["Manga-panel layout", "Oversized back graphic", "Soft washed handfeel"],
    palette: {
      base: "#fff4b1",
      shell: "#ffffff",
      accent: "#7c3aed",
      glow: "#ff5f7a",
      text: "#141414",
    },
  },
  {
    sku: "FR",
    slug: "filler-episode-survivor",
    name: "Filler Episode Survivor",
    subtitle: "Anime merch for useless arcs",
    price: 1099,
    collection: "Anime Merch",
    category: "Statement Tee",
    fit: "Boxy",
    badge: "Season two behavior",
    description:
      "A boxy tee for days that technically happen but do nothing for character development.",
    story:
      "The print is playful, the fit is clean, and the joke works even if your life currently has no main quest.",
    vibe: "Goofy anime energy with just enough existential seasoning.",
    materials: "230 GSM enzyme-washed cotton",
    leadTime: "Dispatches in 72 hours",
    sizes: ["S", "M", "L", "XL"],
    highlights: ["Boxy crop", "Front and back print", "Smooth washed finish"],
    palette: {
      base: "#ffffff",
      shell: "#ffeb57",
      accent: "#06b6d4",
      glow: "#f97316",
      text: "#101010",
    },
  },
];

export const products: Product[] = productSeeds.map((product, index) => ({
  ...product,
  inventory: defaultInventory,
  active: true,
  featured: index < 4,
  storefrontImage: null,
  catalogImages: [],
  soldOut: false,
}));

export const featuredProducts = products.filter((product) => product.featured).slice(0, 4);

export const collections = ["All", ...shirtCategories];
export const fits = ["All", ...new Set(products.map((product) => product.fit))];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductBySku(sku: string) {
  return products.find((product) => product.sku === sku);
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
