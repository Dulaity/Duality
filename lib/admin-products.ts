import type { z } from "zod";

import type { adminProductSchema } from "@/lib/validations/admin";

export function toProductMutationData(
  product: z.infer<typeof adminProductSchema>,
) {
  return {
    sku: product.sku,
    slug: product.slug,
    name: product.name,
    subtitle: product.subtitle,
    price: product.price,
    collection: product.collection,
    category: product.category,
    fit: product.fit,
    badge: product.badge,
    description: product.description,
    story: product.story,
    vibe: product.vibe,
    materials: product.materials,
    leadTime: product.leadTime,
    sizes: product.sizes,
    highlights: product.highlights,
    paletteBase: product.palette.base,
    paletteShell: product.palette.shell,
    paletteAccent: product.palette.accent,
    paletteGlow: product.palette.glow,
    paletteText: product.palette.text,
    storefrontImage: product.storefrontImage || null,
    catalogImages: product.catalogImages.filter(Boolean),
    inventory: product.inventory,
    active: product.active,
    featured: product.featured,
  };
}
