export const shirtCategories = [
  "Brainrot",
  "Sports Trauma",
  "Anime Delusions",
  "Contrasting T-Shirt Designs",
] as const;

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
> &
  Partial<Pick<Product, "storefrontImage" | "catalogImages">>;

export const defaultInventory = 24;

const productSeeds: ProductSeed[] = [
  {
    sku: "SB",
    slug: "social-battery-critical",
    name: "Social Battery Critical",
    subtitle: "Brainrot tee for leaving early",
    price: 899,
    collection: "Brainrot",
    category: "Graphic Tee",
    fit: "Oversized",
    badge: "Low battery energy",
    description:
      "For people whose entire personality is surviving group projects, unread messages, and events they never wanted to attend.",
    story:
      "Looks normal until someone reads it. Then suddenly everyone knows you are operating on 4% social battery.",
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
    subtitle: "Dark humor tee for pretending to function",
    price: 999,
    collection: "Brainrot",
    category: "Statement Tee",
    fit: "Boxy",
    badge: "Dark mode brain",
    description:
      "Emotionally oversized too. A boxy tee for people whose loading screen has been active since breakfast.",
    story:
      "Looks normal until someone reads it, which is exactly when the HR-safe version of your personality leaves the room.",
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
    subtitle: "Sports trauma for elite sitting",
    price: 1099,
    collection: "Sports Trauma",
    category: "Fan Tee",
    fit: "Relaxed",
    badge: "Participation legend",
    description:
      "For people whose entire personality is yelling at a screen like they are on the payroll.",
    story:
      "Sports trauma, but wearable. Made for match days, fake tactical analysis, and elite bench behavior.",
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
    subtitle: "Match-day trauma in cotton",
    price: 1199,
    collection: "Sports Trauma",
    category: "Match Tee",
    fit: "Oversized",
    badge: "Extra time approved",
    description:
      "Looks normal until someone reads it. Built for people who shout tactical advice at screens and call it emotional investment.",
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
    subtitle: "Anime delusion for doomed side quests",
    price: 999,
    collection: "Anime Delusions",
    category: "Graphic Tee",
    fit: "Oversized",
    badge: "Arc ruined",
    description:
      "Anime delusions for anyone entering every situation like a doomed side character with rent due.",
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
    subtitle: "Anime delusion for useless arcs",
    price: 1099,
    collection: "Anime Delusions",
    category: "Statement Tee",
    fit: "Boxy",
    badge: "Season two behavior",
    description:
      "Emotionally oversized too. A boxy tee for days that happen but add absolutely nothing to the plot.",
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
  {
    sku: "OD",
    slug: "opposite-day-uniform",
    name: "Opposite Day Uniform",
    subtitle: "Contrasting tee for pants energy",
    price: 1099,
    collection: "Contrasting T-Shirt Designs",
    category: "Graphic Tee",
    fit: "Oversized",
    badge: "Pants on top",
    description:
      "A white tee printed with jeans because apparently clothing has side quests now.",
    story:
      "Looks normal for half a second, then the jeans load in and the entire outfit becomes a visual bug.",
    vibe: "Deadpan, stupid, and weirdly clean.",
    materials: "230 GSM soft cotton",
    leadTime: "Dispatches in 72 hours",
    sizes: ["S", "M", "L", "XL"],
    highlights: ["Denim front graphic", "Oversized white tee", "Soft ribbed collar"],
    palette: {
      base: "#ffffff",
      shell: "#111111",
      accent: "#ffd93d",
      glow: "#ff5f7a",
      text: "#17120a",
    },
    storefrontImage: "/images/products/opposite-day-uniform-shirt.png",
    catalogImages: ["/images/products/opposite-day-uniform-shirt.png"],
  },
  {
    sku: "DT",
    slug: "double-take-department",
    name: "Double Take Department",
    subtitle: "Contrasting tee for impossible choices",
    price: 1199,
    collection: "Contrasting T-Shirt Designs",
    category: "Statement Tee",
    fit: "Boxy",
    badge: "Visual argument",
    description:
      "Looks calm until the design starts arguing with itself. Useful for people with two tabs open in their personality.",
    story:
      "A sharper contrast drop with loud type, clean blocking, and just enough visual conflict to make strangers look twice.",
    vibe: "Graphic, split, and built for main-character confusion.",
    materials: "240 GSM combed cotton",
    leadTime: "Made to order in 4 days",
    sizes: ["S", "M", "L", "XL"],
    highlights: ["Boxy crop", "High-contrast print", "Front and back graphic"],
    palette: {
      base: "#17120a",
      shell: "#ffffff",
      accent: "#ffcf24",
      glow: "#2563eb",
      text: "#ffffff",
    },
  },
  {
    sku: "CP",
    slug: "consider-your-pants-peed",
    name: "Consider Your Pants Peed",
    subtitle: "Brainrot tee for cursed warnings",
    price: 999,
    collection: "Brainrot",
    category: "Meme Tee",
    fit: "Oversized",
    badge: "Threat level wet",
    description:
      "A black tee for people who prefer their threats delivered by a deeply unserious cat.",
    story:
      "The print has old-internet energy, suspicious blue lightning, and exactly the kind of message nobody asked to receive.",
    vibe: "Chaotic, loud, and impossible to explain politely.",
    materials: "230 GSM combed cotton",
    leadTime: "Dispatches in 72 hours",
    sizes: ["S", "M", "L", "XL"],
    highlights: ["Oversized black tee", "Large front meme print", "Soft ribbed collar"],
    palette: {
      base: "#101010",
      shell: "#ffffff",
      accent: "#7dd3fc",
      glow: "#ffcf24",
      text: "#ffffff",
    },
    storefrontImage: "/images/products/consider-your-pants-peed-shirt.png",
    catalogImages: ["/images/products/consider-your-pants-peed-shirt.png"],
  },
  {
    sku: "CF",
    slug: "cahfih",
    name: "Cahfih",
    subtitle: "Brainrot tee for animal typos",
    price: 999,
    collection: "Brainrot",
    category: "Meme Tee",
    fit: "Relaxed",
    badge: "Specimen detected",
    description:
      "A clean white tee featuring a catfish that took the assignment too literally.",
    story:
      "Part cat, part fish, fully a spelling problem. This is the kind of shirt that rewards people for staring one second longer.",
    vibe: "Dry, stupid, and unexpectedly calm.",
    materials: "220 GSM soft cotton",
    leadTime: "Dispatches in 48 hours",
    sizes: ["S", "M", "L", "XL"],
    highlights: ["White tee base", "Catfish front graphic", "Relaxed daily fit"],
    palette: {
      base: "#f8f3df",
      shell: "#ffffff",
      accent: "#111111",
      glow: "#ffcf24",
      text: "#17120a",
    },
    storefrontImage: "/images/products/cahfih-shirt.png",
    catalogImages: ["/images/products/cahfih-shirt.png"],
  },
  {
    sku: "LO",
    slug: "laughed-it-off",
    name: "Laughed It Off",
    subtitle: "Dark humor tee for coping badly",
    price: 1099,
    collection: "Brainrot",
    category: "Dark Humor Tee",
    fit: "Oversized",
    badge: "Coping mechanism",
    description:
      "A minimal white tee for anyone whose emotional strategy is making the joke first.",
    story:
      "Thin-line art, quiet delivery, and a punchline that sits somewhere between therapy and group chat damage.",
    vibe: "Deadpan, uncomfortable, and clean enough to pass as normal.",
    materials: "230 GSM soft cotton",
    leadTime: "Dispatches in 72 hours",
    sizes: ["S", "M", "L", "XL"],
    highlights: ["Minimal black print", "Oversized white tee", "Soft everyday cotton"],
    palette: {
      base: "#f8f6ee",
      shell: "#ffffff",
      accent: "#111111",
      glow: "#ff5f7a",
      text: "#17120a",
    },
    storefrontImage: "/images/products/laughed-it-off-shirt.png",
    catalogImages: ["/images/products/laughed-it-off-shirt.png"],
  },
  {
    sku: "VOP",
    slug: "very-old-picture-of-me",
    name: "Very Old Picture Of Me",
    subtitle: "Brainrot tee for ancient lore",
    price: 999,
    collection: "Brainrot",
    category: "Meme Tee",
    fit: "Oversized",
    badge: "Origin story",
    description:
      "A white tee with the most technically correct baby picture possible.",
    story:
      "The design is simple, stupid, and biologically committed to the bit. Great for people with too much lore.",
    vibe: "Low-effort genius with science-class trauma.",
    materials: "220 GSM soft cotton",
    leadTime: "Dispatches in 48 hours",
    sizes: ["S", "M", "L", "XL"],
    highlights: ["Square front print", "White tee base", "Soft ribbed collar"],
    palette: {
      base: "#f8f6ee",
      shell: "#ffffff",
      accent: "#111111",
      glow: "#ffcf24",
      text: "#17120a",
    },
    storefrontImage: "/images/products/very-old-picture-shirt.png",
    catalogImages: ["/images/products/very-old-picture-shirt.png"],
  },
  {
    sku: "HX",
    slug: "hoxeless",
    name: "Hoxeless",
    subtitle: "Black tee for typo pessimists",
    price: 1099,
    collection: "Brainrot",
    category: "Statement Tee",
    fit: "Boxy",
    badge: "Hope typo",
    description:
      "A black tee for when optimism gets crossed out before it even finishes loading.",
    story:
      "Bold type, one red strike, and the exact amount of negativity required for a Monday morning.",
    vibe: "Sharp, blunt, and intentionally incorrect.",
    materials: "240 GSM combed cotton",
    leadTime: "Made to order in 4 days",
    sizes: ["S", "M", "L", "XL"],
    highlights: ["Black boxy tee", "Bold chest text", "Red strike detail"],
    palette: {
      base: "#101010",
      shell: "#ffffff",
      accent: "#ef4444",
      glow: "#ffcf24",
      text: "#ffffff",
    },
    storefrontImage: "/images/products/hoxeless-shirt.png",
    catalogImages: ["/images/products/hoxeless-shirt.png"],
  },
  {
    sku: "OPS",
    slug: "one-piece-of-shirt",
    name: "One Piece Of Shirt",
    subtitle: "Anime delusion for forbidden treasure",
    price: 1099,
    collection: "Anime Delusions",
    category: "Anime Meme Tee",
    fit: "Oversized",
    badge: "Grand line incident",
    description:
      "A white anime-meme tee for pirates, punchlines, and extremely questionable treasure maps.",
    story:
      "Manga-panel styling meets toilet humor. It is not subtle, which is exactly why it exists.",
    vibe: "Anime chaos with bathroom-wall confidence.",
    materials: "230 GSM soft cotton",
    leadTime: "Dispatches in 72 hours",
    sizes: ["S", "M", "L", "XL"],
    highlights: ["Manga-style front print", "White tee base", "Oversized fit"],
    palette: {
      base: "#f8f6ee",
      shell: "#ffffff",
      accent: "#111111",
      glow: "#ffcf24",
      text: "#17120a",
    },
    storefrontImage: "/images/products/one-piece-of-shirt.png",
    catalogImages: ["/images/products/one-piece-of-shirt.png"],
  },
  {
    sku: "WS",
    slug: "william-shookspeare",
    name: "William Shookspeare",
    subtitle: "Brainrot tee for literature damage",
    price: 1099,
    collection: "Brainrot",
    category: "Meme Tee",
    fit: "Relaxed",
    badge: "English class ruined",
    description:
      "A white tee for people who paid attention in class only when the joke was visual.",
    story:
      "Four Shakespeare variants, one deeply unnecessary pun, and enough academic nonsense to start a hallway conversation.",
    vibe: "Bookish, cursed, and teacher-approved by accident.",
    materials: "220 GSM soft cotton",
    leadTime: "Dispatches in 48 hours",
    sizes: ["S", "M", "L", "XL"],
    highlights: ["Four-panel meme print", "White tee base", "Relaxed fit"],
    palette: {
      base: "#f8f6ee",
      shell: "#ffffff",
      accent: "#111111",
      glow: "#ff5f7a",
      text: "#17120a",
    },
    storefrontImage: "/images/products/william-shookspeare-shirt.png",
    catalogImages: ["/images/products/william-shookspeare-shirt.png"],
  },
  {
    sku: "TIF",
    slug: "this-is-fine",
    name: "This Is Fine",
    subtitle: "Brainrot tee for crisis management",
    price: 1199,
    collection: "Brainrot",
    category: "Meme Tee",
    fit: "Oversized",
    badge: "Everything fine",
    description:
      "A black tee for people handling disaster with a chair, a hat, and zero urgency.",
    story:
      "Bright fire graphic on a black base, made for anyone who calls a breakdown a learning experience.",
    vibe: "Panic, but make it cute.",
    materials: "240 GSM combed cotton",
    leadTime: "Made to order in 4 days",
    sizes: ["S", "M", "L", "XL"],
    highlights: ["Black oversized tee", "Large cartoon front print", "Heavy cotton feel"],
    palette: {
      base: "#101010",
      shell: "#ffffff",
      accent: "#ffd93d",
      glow: "#f97316",
      text: "#ffffff",
    },
    storefrontImage: "/images/products/this-is-fine-shirt.png",
    catalogImages: ["/images/products/this-is-fine-shirt.png"],
  },
  {
    sku: "HD",
    slug: "hydration-duck",
    name: "Hydration Duck",
    subtitle: "Blue tee for desk survival",
    price: 999,
    collection: "Brainrot",
    category: "Meme Tee",
    fit: "Relaxed",
    badge: "Sip behavior",
    description:
      "A soft blue tee for people whose productivity system is mostly beverages and denial.",
    story:
      "Small front graphic, low-volume chaos, and the exact energy of opening a drink instead of fixing the problem.",
    vibe: "Quietly silly and extremely wearable.",
    materials: "220 GSM soft cotton",
    leadTime: "Dispatches in 48 hours",
    sizes: ["S", "M", "L", "XL"],
    highlights: ["Soft blue tee", "Small front graphic", "Relaxed daily fit"],
    palette: {
      base: "#86b5d8",
      shell: "#ffffff",
      accent: "#ffcf24",
      glow: "#2563eb",
      text: "#17120a",
    },
    storefrontImage: "/images/products/hydration-duck-shirt.png",
    catalogImages: ["/images/products/hydration-duck-shirt.png"],
  },
  {
    sku: "OF",
    slug: "only-fans",
    name: "Only Fans",
    subtitle: "Grey tee for literal audiences",
    price: 999,
    collection: "Brainrot",
    category: "Pun Tee",
    fit: "Relaxed",
    badge: "Literal content",
    description:
      "A grey tee for people who respect wordplay more than they respect context.",
    story:
      "The safest possible interpretation of the phrase, printed with enough fans to remove all doubt.",
    vibe: "Obvious, dumb, and built for double takes.",
    materials: "220 GSM cotton blend",
    leadTime: "Dispatches in 48 hours",
    sizes: ["S", "M", "L", "XL"],
    highlights: ["Grey tee base", "Fan pun graphic", "Relaxed fit"],
    palette: {
      base: "#b9b9b4",
      shell: "#ffffff",
      accent: "#111111",
      glow: "#ffcf24",
      text: "#17120a",
    },
    storefrontImage: "/images/products/only-fans-shirt.png",
    catalogImages: ["/images/products/only-fans-shirt.png"],
  },
];

export const products: Product[] = productSeeds.map((product, index) => ({
  ...product,
  inventory: defaultInventory,
  active: true,
  featured: index < 4,
  storefrontImage: product.storefrontImage ?? null,
  catalogImages: product.catalogImages ?? [],
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
