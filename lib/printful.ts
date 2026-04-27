import { createHmac, timingSafeEqual } from "node:crypto";

import { z } from "zod";

import type { CartItemInput } from "@/lib/orders";

const variantMapSchema = z.record(
  z.string(),
  z.union([z.number().int().positive(), z.string().regex(/^\d+$/)]),
);

const webhookSchema = z
  .object({
    type: z.string(),
  })
  .passthrough();

type PrintfulRecipient = {
  name: string;
  email: string;
  phone?: string;
  address1: string;
  address2?: string;
  city?: string;
  state_code?: string;
  country_code: string;
  zip?: string;
};

type PrintfulResponse = {
  code?: number;
  result?: {
    id?: number;
    external_id?: string;
  };
  error?: {
    message?: string;
    reason?: string;
  };
};

function getPrintfulVariantMap() {
  if (!process.env.PRINTFUL_VARIANT_MAP) {
    return null;
  }

  const parsed = JSON.parse(process.env.PRINTFUL_VARIANT_MAP) as unknown;
  const validatedMap = variantMapSchema.parse(parsed);

  return Object.fromEntries(
    Object.entries(validatedMap).map(([key, value]) => [key, Number(value)]),
  );
}

function getPrintfulHeaders() {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${process.env.PRINTFUL_API_TOKEN}`,
    "Content-Type": "application/json",
  };

  if (process.env.PRINTFUL_STORE_ID) {
    headers["X-PF-Store-Id"] = process.env.PRINTFUL_STORE_ID;
  }

  return headers;
}

export function isPrintfulConfigured() {
  return Boolean(process.env.PRINTFUL_API_TOKEN && getPrintfulVariantMap());
}

export async function createPrintfulOrder({
  recipient,
  items,
  orderCode,
}: {
  recipient: PrintfulRecipient;
  items: Array<CartItemInput & { sku: string; price: number }>;
  orderCode: string;
}) {
  if (!process.env.PRINTFUL_API_TOKEN) {
    return {
      status: "skipped",
      reason: "Printful API token is missing.",
    } as const;
  }

  const variantMap = getPrintfulVariantMap();

  if (!variantMap) {
    return {
      status: "skipped",
      reason: "PRINTFUL_VARIANT_MAP is missing.",
    } as const;
  }

  const orderItems = items.map((item) => {
    const variantId = variantMap[`${item.sku}:${item.size}`];

    if (!variantId) {
      throw new Error(
        `Missing Printful variant mapping for ${item.sku}:${item.size}.`,
      );
    }

    return {
      sync_variant_id: variantId,
      quantity: item.quantity,
      retail_price: item.price.toFixed(2),
      external_id: `${orderCode}-${item.sku}-${item.size}`,
    };
  });

  const apiBase = process.env.PRINTFUL_API_BASE ?? "https://api.printful.com";
  const endpoint = new URL("/orders", apiBase);
  endpoint.searchParams.set("confirm", "true");
  endpoint.searchParams.set("update_existing", "true");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: getPrintfulHeaders(),
    body: JSON.stringify({
      external_id: orderCode,
      shipping: "STANDARD",
      recipient,
      items: orderItems,
    }),
  });

  const payload = (await response.json()) as PrintfulResponse;

  if (!response.ok || (payload.code && payload.code >= 400)) {
    throw new Error(
      payload.error?.message ?? "Printful rejected the order creation request.",
    );
  }

  return {
    status: "submitted",
    externalId: payload.result?.external_id ?? orderCode,
    printfulOrderId: payload.result?.id ?? null,
  } as const;
}

export function verifyPrintfulWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
) {
  const secret = process.env.PRINTFUL_WEBHOOK_SECRET;

  if (!secret) {
    return true;
  }

  if (!signatureHeader) {
    return false;
  }

  const expectedSignature = createHmac("sha256", Buffer.from(secret, "hex"))
    .update(rawBody)
    .digest("hex");

  const signature = Buffer.from(signatureHeader, "hex");
  const expected = Buffer.from(expectedSignature, "hex");

  if (signature.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(signature, expected);
}

export function parsePrintfulWebhookPayload(rawBody: string) {
  return webhookSchema.parse(JSON.parse(rawBody));
}
