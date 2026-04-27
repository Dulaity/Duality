import { createHmac, timingSafeEqual } from "node:crypto";
import { Buffer } from "node:buffer";

import { z } from "zod";

const orderResponseSchema = z.object({
  id: z.string().min(1),
  entity: z.string(),
  amount: z.number().int().nonnegative(),
  amount_due: z.number().int().nonnegative(),
  amount_paid: z.number().int().nonnegative(),
  currency: z.string().min(1),
  receipt: z.string().nullable(),
  status: z.enum(["created", "attempted", "paid"]),
  attempts: z.number().int().nonnegative(),
  notes: z.record(z.string(), z.unknown()).default({}),
  created_at: z.number().int().nonnegative(),
});

const paymentResponseSchema = z.object({
  id: z.string().min(1),
  entity: z.string(),
  amount: z.number().int().nonnegative(),
  currency: z.string().min(1),
  status: z.enum(["created", "authorized", "captured", "refunded", "failed"]),
  order_id: z.string().nullable(),
  captured: z.boolean().optional(),
  email: z.string().nullable().optional(),
  contact: z.string().nullable().optional(),
  notes: z.record(z.string(), z.unknown()).default({}),
});

const webhookSchema = z
  .object({
    event: z.string().min(1),
    payload: z
      .object({
        payment: z
          .object({
            entity: paymentResponseSchema,
          })
          .optional(),
      })
      .optional(),
  })
  .passthrough();

type CreateRazorpayOrderInput = {
  amount: number;
  currency: "INR";
  receipt: string;
  notes: Record<string, string>;
};

function getRazorpayApiBase() {
  return process.env.RAZORPAY_API_BASE ?? "https://api.razorpay.com/v1";
}

function getRazorpayCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured.");
  }

  return { keyId, keySecret };
}

function getRazorpayAuthorizationHeader() {
  const { keyId, keySecret } = getRazorpayCredentials();
  const token = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  return `Basic ${token}`;
}

async function parseRazorpayResponse<T>(
  response: Response,
  schema: z.ZodType<T>,
  fallbackMessage: string,
) {
  const payload = (await response.json()) as unknown;

  if (!response.ok) {
    const message =
      payload &&
      typeof payload === "object" &&
      "error" in payload &&
      typeof payload.error === "object" &&
      payload.error &&
      "description" in payload.error &&
      typeof payload.error.description === "string"
        ? payload.error.description
        : fallbackMessage;

    throw new Error(message);
  }

  return schema.parse(payload);
}

export function isRazorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export function getRazorpayKeyId() {
  const keyId = process.env.RAZORPAY_KEY_ID;

  if (!keyId) {
    throw new Error("Razorpay key ID is not configured.");
  }

  return keyId;
}

export async function createRazorpayOrder(input: CreateRazorpayOrderInput) {
  const response = await fetch(`${getRazorpayApiBase()}/orders`, {
    method: "POST",
    headers: {
      Authorization: getRazorpayAuthorizationHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return parseRazorpayResponse(
    response,
    orderResponseSchema,
    "Unable to create the Razorpay order.",
  );
}

export async function fetchRazorpayOrder(orderId: string) {
  const response = await fetch(`${getRazorpayApiBase()}/orders/${orderId}`, {
    headers: {
      Authorization: getRazorpayAuthorizationHeader(),
    },
  });

  return parseRazorpayResponse(
    response,
    orderResponseSchema,
    "Unable to fetch the Razorpay order.",
  );
}

export async function fetchRazorpayPayment(paymentId: string) {
  const response = await fetch(`${getRazorpayApiBase()}/payments/${paymentId}`, {
    headers: {
      Authorization: getRazorpayAuthorizationHeader(),
    },
  });

  return parseRazorpayResponse(
    response,
    paymentResponseSchema,
    "Unable to fetch the Razorpay payment.",
  );
}

export function verifyRazorpayPaymentSignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}) {
  const { keySecret } = getRazorpayCredentials();
  const expectedSignature = createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const received = Buffer.from(signature, "hex");
  const expected = Buffer.from(expectedSignature, "hex");

  if (received.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(received, expected);
}

export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return false;
  }

  if (!signatureHeader) {
    return false;
  }

  const expectedSignature = createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  const received = Buffer.from(signatureHeader, "hex");
  const expected = Buffer.from(expectedSignature, "hex");

  if (received.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(received, expected);
}

export function parseRazorpayWebhookPayload(rawBody: string) {
  return webhookSchema.parse(JSON.parse(rawBody));
}
