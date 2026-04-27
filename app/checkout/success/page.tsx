import type { Metadata } from "next";

import { CheckoutSuccess } from "@/components/checkout-success";

export const metadata: Metadata = {
  title: "Order confirmed",
  description: "Your Duality payment was received and the order has been queued.",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order_code?: string; status?: string }>;
}) {
  const { order_code: orderCode, status } = await searchParams;

  return <CheckoutSuccess orderCode={orderCode} status={status} />;
}
