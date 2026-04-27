import { z } from "zod";

import { MAX_ORDER_QUANTITY } from "@/lib/limits";
import {
  buildOrderPreviewFromCatalog,
  type CartItemInput,
} from "@/lib/orders";
import { getStoreProductBySku, getStoreProductsBySlugs } from "@/lib/product-store";

export const cartItemSchema = z.object({
  slug: z.string().min(1).max(120),
  size: z.string().min(1).max(8),
  quantity: z.number().int().min(1).max(MAX_ORDER_QUANTITY),
});

export const checkoutCustomerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().email().max(120),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{10,20}$/, "Please enter a valid phone number."),
  address1: z.string().trim().min(4).max(120),
  address2: z.string().trim().max(120).optional().default(""),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  postalCode: z
    .string()
    .trim()
    .regex(/^[1-9][0-9]{5}$/, "Please enter a valid 6-digit PIN code."),
});

export type CheckoutCustomerInput = z.infer<typeof checkoutCustomerSchema>;

export const checkoutRequestSchema = z.object({
  items: z
    .array(cartItemSchema)
    .min(1)
    .max(MAX_ORDER_QUANTITY)
    .superRefine((items, context) => {
      const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);

      if (totalUnits > MAX_ORDER_QUANTITY) {
        context.addIssue({
          code: "custom",
          message: `A single order can include up to ${MAX_ORDER_QUANTITY} tees.`,
        });
      }
    }),
  customer: checkoutCustomerSchema,
});

export function toGatewayAmount(amount: number) {
  return amount * 100;
}

export function encodeCartToken(
  items: Array<CartItemInput & { sku: string }>,
) {
  return items
    .map((item) => {
      return `${item.sku}:${item.size}:${item.quantity}`;
    })
    .join("|");
}

export async function decodeCartToken(token: string): Promise<CartItemInput[]> {
  const decodedItems = token
    .split("|")
    .filter(Boolean)
    .map(async (part) => {
      const [sku, size, quantityValue] = part.split(":");
      const product = await getStoreProductBySku(sku ?? "");
      const quantity = Number.parseInt(quantityValue ?? "", 10);

      if (!product || !size || !Number.isInteger(quantity)) {
        throw new Error("Invalid cart token");
      }

      if (!product.sizes.includes(size)) {
        throw new Error(`Invalid size in cart token for ${product.name}`);
      }

      return {
        slug: product.slug,
        size,
        quantity,
      };
    });

  const resolvedItems = await Promise.all(decodedItems);

  checkoutRequestSchema.pick({ items: true }).parse({ items: resolvedItems });

  return resolvedItems;
}

const checkoutNotesSchema = z.object({
  order_code: z.string().min(1),
  cart_token: z.string().min(1),
  user_id: z.string().optional().default(""),
  customer_name: z.string().min(1),
  customer_email: z.string().email(),
  customer_phone: z.string().min(1),
  address1: z.string().min(1),
  address2: z.string().optional().default(""),
  city: z.string().min(1),
  state: z.string().min(1),
  postal_code: z.string().regex(/^[1-9][0-9]{5}$/),
});

export function extractCheckoutNotes(notes: Record<string, unknown>) {
  const parsed = checkoutNotesSchema.parse(notes);

  return {
    orderCode: parsed.order_code,
    cartToken: parsed.cart_token,
    userId: parsed.user_id || null,
    customer: {
      name: parsed.customer_name,
      email: parsed.customer_email,
      phone: parsed.customer_phone,
      address1: parsed.address1,
      address2: parsed.address2,
      city: parsed.city,
      state: parsed.state,
      postalCode: parsed.postal_code,
    },
  };
}

export async function createCheckoutOrderPayload(
  items: CartItemInput[],
  customer: CheckoutCustomerInput,
  options: {
    userId?: string | null;
  } = {},
) {
  const products = await getStoreProductsBySlugs(items.map((item) => item.slug));
  const order = buildOrderPreviewFromCatalog(items, products, undefined, {
    allowDefaultFallback: false,
  });
  const cartToken = encodeCartToken(order.items);

  return {
    order,
    gatewayOrder: {
      amount: toGatewayAmount(order.total),
      currency: "INR" as const,
      receipt: order.code,
      notes: {
        order_code: order.code,
        cart_token: cartToken,
        user_id: options.userId ?? "",
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        address1: customer.address1,
        address2: customer.address2 || "",
        city: customer.city,
        state: customer.state,
        postal_code: customer.postalCode,
      },
    },
  };
}

export function isManualFulfillmentAllowed() {
  return process.env.ALLOW_MANUAL_FULFILLMENT === "true";
}

export function isOrderAmountValid(totalAmount: number, totalLabelAmount: number) {
  return totalAmount === toGatewayAmount(totalLabelAmount);
}
