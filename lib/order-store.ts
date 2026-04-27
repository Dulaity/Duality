import type { OrderPreview } from "@/lib/orders";
import { prisma } from "@/lib/prisma";

type StoredOrderCustomer = {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
};

type UpsertCommerceOrderInput = {
  order: OrderPreview;
  customer: StoredOrderCustomer;
  userId?: string | null;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  status: "captured" | "processing";
  fulfillmentStatus?: string;
};

function buildStoredItems(order: OrderPreview) {
  return order.items.map((item) => {
    return {
      slug: item.slug,
      sku: item.sku,
      name: item.name,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
      lineTotal: item.lineTotal,
    };
  });
}

export async function upsertCommerceOrder({
  order,
  customer,
  userId,
  razorpayOrderId,
  razorpayPaymentId,
  status,
  fulfillmentStatus = "awaiting-webhook",
}: UpsertCommerceOrderInput) {
  const paidAt = status === "captured" ? new Date() : null;
  const items = buildStoredItems(order);

  return prisma.$transaction(async (tx) => {
    const existingOrder = await tx.order.findUnique({
      where: {
        code: order.code,
      },
      select: {
        status: true,
      },
    });
    const shouldDecrementInventory =
      status === "captured" && existingOrder?.status !== "captured";

    const storedOrder = await tx.order.upsert({
      where: {
        code: order.code,
      },
      create: {
        code: order.code,
        userId: userId || null,
        email: customer.email.toLowerCase(),
        customerName: customer.name,
        phone: customer.phone,
        status,
        fulfillmentStatus,
        razorpayOrderId,
        razorpayPaymentId,
        subtotal: order.subtotal,
        shipping: order.shipping,
        tax: order.tax,
        total: order.total,
        totalLabel: order.totalLabel,
        address1: customer.address1,
        address2: customer.address2 || null,
        city: customer.city,
        state: customer.state,
        postalCode: customer.postalCode,
        paidAt,
        items: {
          create: items,
        },
      },
      update: {
        userId: userId || undefined,
        email: customer.email.toLowerCase(),
        customerName: customer.name,
        phone: customer.phone,
        status,
        fulfillmentStatus,
        razorpayOrderId,
        razorpayPaymentId,
        subtotal: order.subtotal,
        shipping: order.shipping,
        tax: order.tax,
        total: order.total,
        totalLabel: order.totalLabel,
        address1: customer.address1,
        address2: customer.address2 || null,
        city: customer.city,
        state: customer.state,
        postalCode: customer.postalCode,
        paidAt: paidAt ?? undefined,
        items: {
          deleteMany: {},
          create: items,
        },
      },
      include: {
        items: true,
      },
    });

    if (shouldDecrementInventory) {
      for (const item of items) {
        await tx.$executeRaw`
          UPDATE "Product"
          SET "inventory" = GREATEST(0, "inventory" - ${item.quantity}),
              "updatedAt" = NOW()
          WHERE "slug" = ${item.slug}
        `;
      }
    }

    return storedOrder;
  });
}

export async function updateOrderFulfillmentStatus(
  code: string,
  fulfillmentStatus: string,
) {
  return prisma.order.update({
    where: {
      code,
    },
    data: {
      fulfillmentStatus,
    },
  });
}
