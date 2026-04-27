import { NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().email().max(120),
  group: z.string().trim().min(2).max(120),
  volume: z.enum(["25-50", "50-100", "100-250", "250+"]),
  concept: z.string().trim().min(20).max(800),
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
          "Please provide a valid name, email, group, order volume, and shirt idea.",
      },
      { status: 400 },
    );
  }

  const reference = `DROP-${Date.now().toString().slice(-6)}`;

  return NextResponse.json({
    ok: true,
    reference,
    message: `We would reply to ${parsed.data.email} with pricing and a mockup direction for ${parsed.data.volume} pieces.`,
  });
}
