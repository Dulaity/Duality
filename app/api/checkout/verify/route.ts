import { NextResponse } from "next/server";
import { z } from "zod";

import {
  decodeCartToken,
  extractCheckoutNotes,
  isOrderAmountValid,
} from "@/lib/commerce";
import { buildOrderPreview } from "@/lib/orders";
import {
  fetchRazorpayOrder,
  fetchRazorpayPayment,
  isRazorpayConfigured,
  verifyRazorpayPaymentSignature,
} from "@/lib/razorpay";

const verificationSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isRazorpayConfigured()) {
    return NextResponse.json(
      { error: "Razorpay is not configured." },
      { status: 500 },
    );
  }

  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "Expected application/json" }, { status: 415 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = verificationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Payment verification payload is incomplete." },
      { status: 400 },
    );
  }

  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } =
    parsed.data;

  if (
    !verifyRazorpayPaymentSignature({
      orderId,
      paymentId,
      signature,
    })
  ) {
    return NextResponse.json(
      { error: "Payment signature verification failed." },
      { status: 400 },
    );
  }

  try {
    const [order, payment] = await Promise.all([
      fetchRazorpayOrder(orderId),
      fetchRazorpayPayment(paymentId),
    ]);

    if (payment.order_id !== order.id) {
      return NextResponse.json(
        { error: "Payment does not belong to this order." },
        { status: 400 },
      );
    }

    const notes = extractCheckoutNotes(order.notes);
    const items = decodeCartToken(notes.cartToken);
    const trustedOrder = buildOrderPreview(items, notes.orderCode);

    if (
      !isOrderAmountValid(order.amount, trustedOrder.total) ||
      !isOrderAmountValid(payment.amount, trustedOrder.total)
    ) {
      return NextResponse.json(
        { error: "Paid amount does not match the trusted server total." },
        { status: 400 },
      );
    }

    const status =
      payment.status === "captured" || order.status === "paid"
        ? "captured"
        : "processing";

    return NextResponse.json(
      {
        ok: true,
        status,
        order: {
          code: trustedOrder.code,
          totalLabel: trustedOrder.totalLabel,
        },
        message:
          status === "captured"
            ? "Payment verified successfully."
            : "Payment received and awaiting final confirmation.",
      },
      { status: status === "captured" ? 200 : 202 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to verify the payment.",
      },
      { status: 400 },
    );
  }
}
