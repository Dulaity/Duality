import type { OrderPreview } from "@/lib/orders";
import { getProductBySlug } from "@/lib/products";
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
    const product = getProductBySlug(item.slug);

    if (!product) {
      throw new Error(`Unknown product in order history: ${item.slug}`);
    }

    return {
      slug: item.slug,
      sku: product.sku,
      name: item.name,
      size: item.size,
      quantity: item.quantity,
      price: product.price,
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

  return prisma.order.upsert({
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
