import { z } from "zod";

import { shirtCategories } from "@/lib/products";

const hexColorSchema = z
  .string()
  .trim()
  .regex(/^#[0-9a-f]{6}$/i, "Use a valid hex color like #ffdf3b.");

const nonEmptyListSchema = z
  .array(z.string().trim().min(1).max(40))
  .min(1)
  .max(12);

export const adminProductSchema = z.object({
  sku: z.string().trim().min(2).max(12).regex(/^[A-Z0-9-]+$/),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().trim().min(2).max(80),
  subtitle: z.string().trim().min(2).max(120),
  price: z.number().int().min(1).max(50000),
  collection: z.enum(shirtCategories),
  category: z.string().trim().min(2).max(60),
  fit: z.enum(["Oversized", "Boxy", "Relaxed"]),
  badge: z.string().trim().min(2).max(80),
  description: z.string().trim().min(10).max(600),
  story: z.string().trim().min(10).max(600),
  vibe: z.string().trim().min(4).max(180),
  materials: z.string().trim().min(4).max(120),
  leadTime: z.string().trim().min(4).max(120),
  sizes: nonEmptyListSchema,
  highlights: nonEmptyListSchema,
  palette: z.object({
    base: hexColorSchema,
    shell: hexColorSchema,
    accent: hexColorSchema,
    glow: hexColorSchema,
    text: hexColorSchema,
  }),
  inventory: z.number().int().min(0).max(100000),
  active: z.boolean(),
  featured: z.boolean(),
});

export const adminOrderUpdateSchema = z.object({
  status: z.enum(["processing", "captured", "cancelled", "refunded"]),
  fulfillmentStatus: z
    .string()
    .trim()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

export const adminUserUpdateSchema = z.object({
  role: z.enum(["CUSTOMER", "ADMIN"]),
});
