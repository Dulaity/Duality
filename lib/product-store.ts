import type { Product as ProductRecord } from "@/prisma/generated/prisma/client";

import { defaultInventory, products as defaultProducts, type Product } from "@/lib/products";
import { prisma } from "@/lib/prisma";

type ProductWriteInput = Omit<Product, "soldOut">;

export function mapProductRecord(product: ProductRecord): Product {
  return {
    sku: product.sku,
    slug: product.slug,
    name: product.name,
    subtitle: product.subtitle,
    price: product.price,
    collection: product.collection as Product["collection"],
    category: product.category,
    fit: product.fit as Product["fit"],
    badge: product.badge,
    description: product.description,
    story: product.story,
    vibe: product.vibe,
    materials: product.materials,
    leadTime: product.leadTime,
    sizes: product.sizes,
    highlights: product.highlights,
    palette: {
      base: product.paletteBase,
      shell: product.paletteShell,
      accent: product.paletteAccent,
      glow: product.paletteGlow,
      text: product.paletteText,
    },
    storefrontImage: product.storefrontImage,
    catalogImages: product.catalogImages,
    inventory: product.inventory,
    active: product.active,
    featured: product.featured,
    soldOut: product.inventory <= 0,
  };
}

function productToWriteData(product: ProductWriteInput) {
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
    storefrontImage: product.storefrontImage,
    catalogImages: product.catalogImages,
    inventory: product.inventory,
    active: product.active,
    featured: product.featured,
  };
}

async function shouldUseDefaultCatalog() {
  const productCount = await prisma.product.count();

  return productCount === 0;
}

export async function seedDefaultProducts() {
  for (const product of defaultProducts) {
    await prisma.product.upsert({
      where: {
        slug: product.slug,
      },
      create: productToWriteData({
        ...product,
        inventory: product.inventory || defaultInventory,
      }),
      update: {
        featured: product.featured,
      },
    });
  }
}

export async function getStoreProducts({
  includeInactive = false,
}: {
  includeInactive?: boolean;
} = {}) {
  const records = await prisma.product.findMany({
    where: includeInactive ? undefined : { active: true },
    orderBy: [{ featured: "desc" }, { createdAt: "asc" }],
  });

  if (records.length === 0 && (await shouldUseDefaultCatalog())) {
    return includeInactive
      ? defaultProducts
      : defaultProducts.filter((product) => product.active);
  }

  return records.map(mapProductRecord);
}

export async function getFeaturedStoreProducts(limit = 4) {
  const records = await prisma.product.findMany({
    where: {
      active: true,
      featured: true,
    },
    orderBy: [{ createdAt: "asc" }],
    take: limit,
  });

  if (records.length === 0 && (await shouldUseDefaultCatalog())) {
    return defaultProducts.filter((product) => product.featured).slice(0, limit);
  }

  return records.map(mapProductRecord);
}

export async function getStoreProductBySlug(slug: string, includeInactive = false) {
  const record = await prisma.product.findUnique({
    where: {
      slug,
    },
  });

  if (record && (includeInactive || record.active)) {
    return mapProductRecord(record);
  }

  if (await shouldUseDefaultCatalog()) {
    return defaultProducts.find((product) => product.slug === slug) ?? null;
  }

  return null;
}

export async function getStoreProductBySku(sku: string, includeInactive = false) {
  const record = await prisma.product.findUnique({
    where: {
      sku,
    },
  });

  if (record && (includeInactive || record.active)) {
    return mapProductRecord(record);
  }

  if (await shouldUseDefaultCatalog()) {
    return defaultProducts.find((product) => product.sku === sku) ?? null;
  }

  return null;
}

export async function getStoreProductsBySlugs(slugs: string[]) {
  const uniqueSlugs = [...new Set(slugs)];
  const records = await prisma.product.findMany({
    where: {
      slug: {
        in: uniqueSlugs,
      },
      active: true,
    },
  });

  if (records.length === 0 && (await shouldUseDefaultCatalog())) {
    return defaultProducts.filter((product) => uniqueSlugs.includes(product.slug));
  }

  return records.map(mapProductRecord);
}

export async function decrementProductInventory(
  items: Array<{ slug: string; quantity: number }>,
) {
  for (const item of items) {
    await prisma.$executeRaw`
      UPDATE "Product"
      SET "inventory" = GREATEST(0, "inventory" - ${item.quantity}),
          "updatedAt" = NOW()
      WHERE "slug" = ${item.slug}
    `;
  }
}
