import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import {
  checkoutRequestSchema,
  createCheckoutOrderPayload,
  isManualFulfillmentAllowed,
} from "@/lib/commerce";
import { authOptions } from "@/lib/auth";
import { isPrintfulConfigured } from "@/lib/printful";
import {
  createRazorpayOrder,
  getRazorpayKeyId,
  isRazorpayConfigured,
} from "@/lib/razorpay";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "Expected application/json" }, { status: 415 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = checkoutRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please complete the cart and delivery details correctly." },
      { status: 400 },
    );
  }

  try {
    const session = await getServerSession(authOptions);
    const { order, gatewayOrder } = createCheckoutOrderPayload(
      parsed.data.items,
      parsed.data.customer,
      {
        userId: session?.user?.id,
      },
    );
    const paymentReady = isRazorpayConfigured();
    const fulfillmentReady =
      isPrintfulConfigured() || isManualFulfillmentAllowed();

    if (!paymentReady || !fulfillmentReady) {
      return NextResponse.json({
        mode: "unavailable",
        message: "Checkout is temporarily unavailable. Please try again soon.",
        order,
      });
    }

    const razorpayOrder = await createRazorpayOrder(gatewayOrder);

    return NextResponse.json({
      mode: "razorpay",
      message: "Secure checkout is ready.",
      order,
      checkout: {
        key: getRazorpayKeyId(),
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Duality",
        description: `Order ${order.code}`,
        prefill: {
          name: parsed.data.customer.name,
          email: parsed.data.customer.email,
          contact: parsed.data.customer.phone,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to prepare checkout.",
      },
      { status: 400 },
    );
  }
}
