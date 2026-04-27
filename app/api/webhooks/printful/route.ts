import { NextResponse } from "next/server";

import {
  parsePrintfulWebhookPayload,
  verifyPrintfulWebhookSignature,
} from "@/lib/printful";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-pf-webhook-signature");

  if (!verifyPrintfulWebhookSignature(rawBody, signature)) {
    return NextResponse.json(
      { error: "Invalid Printful webhook signature." },
      { status: 400 },
    );
  }

  try {
    const payload = parsePrintfulWebhookPayload(rawBody);

    return NextResponse.json({
      received: true,
      type: payload.type,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid Printful webhook payload." },
      { status: 400 },
    );
  }
}
