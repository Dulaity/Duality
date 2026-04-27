import { NextResponse } from "next/server";

import {
  decodeCartToken,
  extractCheckoutNotes,
  isManualFulfillmentAllowed,
  isOrderAmountValid,
} from "@/lib/commerce";
import { buildOrderPreview } from "@/lib/orders";
import {
  updateOrderFulfillmentStatus,
  upsertCommerceOrder,
} from "@/lib/order-store";
import { createPrintfulOrder, isPrintfulConfigured } from "@/lib/printful";
import {
  fetchRazorpayOrder,
  fetchRazorpayPayment,
  parseRazorpayWebhookPayload,
  verifyRazorpayWebhookSignature,
} from "@/lib/razorpay";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!verifyRazorpayWebhookSignature(rawBody, signature)) {
    return NextResponse.json(
      { error: "Invalid Razorpay webhook signature." },
      { status: 400 },
    );
  }

  try {
    const payload = parseRazorpayWebhookPayload(rawBody);

    if (payload.event !== "payment.captured") {
      return NextResponse.json({ received: true, ignored: true });
    }

    const paymentId = payload.payload?.payment?.entity.id;
    const orderId = payload.payload?.payment?.entity.order_id;

    if (!paymentId || !orderId) {
      return NextResponse.json(
        { error: "Webhook payload is missing payment identifiers." },
        { status: 400 },
      );
    }

    const [payment, order] = await Promise.all([
      fetchRazorpayPayment(paymentId),
      fetchRazorpayOrder(orderId),
    ]);

    const notes = extractCheckoutNotes(order.notes);
    const items = decodeCartToken(notes.cartToken);
    const trustedOrder = buildOrderPreview(items, notes.orderCode);

    if (
      payment.order_id !== order.id ||
      !isOrderAmountValid(order.amount, trustedOrder.total) ||
      !isOrderAmountValid(payment.amount, trustedOrder.total)
    ) {
      return NextResponse.json(
        { error: "Trusted order validation failed." },
        { status: 400 },
      );
    }

    if (!isPrintfulConfigured()) {
      const fulfillmentStatus = isManualFulfillmentAllowed()
        ? "manual-review"
        : "skipped";

      await upsertCommerceOrder({
        order: trustedOrder,
        customer: notes.customer,
        userId: notes.userId,
        razorpayOrderId: order.id,
        razorpayPaymentId: payment.id,
        status: "captured",
        fulfillmentStatus,
      });

      return NextResponse.json({
        received: true,
        fulfillment: isManualFulfillmentAllowed()
          ? {
              status: "manual-review",
              orderCode: trustedOrder.code,
            }
          : {
              status: "skipped",
              reason: "Printful is not configured.",
            },
      });
    }

    await upsertCommerceOrder({
      order: trustedOrder,
      customer: notes.customer,
      userId: notes.userId,
      razorpayOrderId: order.id,
      razorpayPaymentId: payment.id,
      status: "captured",
      fulfillmentStatus: "submitting",
    });

    const fulfillment = await createPrintfulOrder({
      orderCode: trustedOrder.code,
      items: trustedOrder.items.map(({ slug, quantity, size }) => ({
        slug,
        quantity,
        size,
      })),
      recipient: {
        name: notes.customer.name,
        email: notes.customer.email,
        phone: notes.customer.phone,
        address1: notes.customer.address1,
        address2: notes.customer.address2 || undefined,
        city: notes.customer.city,
        state_code: notes.customer.state,
        country_code: "IN",
        zip: notes.customer.postalCode,
      },
    });

    await updateOrderFulfillmentStatus(trustedOrder.code, fulfillment.status);

    return NextResponse.json({
      received: true,
      orderCode: trustedOrder.code,
      fulfillment,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to process Razorpay webhook.",
      },
      { status: 400 },
    );
  }
}
