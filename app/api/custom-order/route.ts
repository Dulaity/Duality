import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const imageDataSchema = z
  .string()
  .trim()
  .refine(
    (value) =>
      value.startsWith("data:image/jpeg;base64,") ||
      value.startsWith("data:image/png;base64,") ||
      value.startsWith("data:image/webp;base64,"),
    "Upload JPG, PNG, or WebP images only.",
  )
  .refine((value) => value.length <= 700_000, "Each image must stay under 500 KB.");

const requestSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().email().max(120),
  group: z.string().trim().min(2).max(120),
  quantity: z.coerce.number().int().min(1).max(5),
  concept: z.string().trim().min(20).max(800),
  images: z.array(imageDataSchema).max(3).optional().default([]),
});

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { error: "Expected application/json" },
      { status: 415 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          "Please provide a valid name, email, group, quantity, and shirt idea.",
      },
      { status: 400 },
    );
  }

  const reference = `IDEA-${Date.now().toString(36).toUpperCase()}-${crypto
    .randomUUID()
    .slice(0, 6)
    .toUpperCase()}`;

  try {
    await prisma.ideaSubmission.create({
      data: {
        reference,
        name: parsed.data.name,
        email: parsed.data.email,
        group: parsed.data.group,
        quantity: parsed.data.quantity,
        concept: parsed.data.concept,
        images: parsed.data.images,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "We could not save your request right now." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    reference,
    message: `We will reply to ${parsed.data.email} with pricing and a mockup direction for ${parsed.data.quantity} shirt${parsed.data.quantity === 1 ? "" : "s"}.`,
  });
}
