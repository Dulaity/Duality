"use client";

import Link from "next/link";
import { useEffect, useEffectEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { useCart } from "@/components/cart-provider";

export function CheckoutSuccess({
  orderCode,
  status,
}: {
  orderCode?: string;
  status?: string;
}) {
  const { clearCart } = useCart();
  const clearCartOnVisit = useEffectEvent(() => {
    clearCart();
  });

  useEffect(() => {
    clearCartOnVisit();
  }, []);

  const isProcessing = status === "processing";

  return (
    <main className="page-shell py-12 md:py-16">
      <Reveal as="section" className="section-panel p-10 text-center md:p-14">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
          <CheckCircle2 className="h-14 w-14 text-white" />
          <p className="eyebrow">
            {isProcessing ? "Payment received" : "Order confirmed"}
          </p>
          <h1 className="section-title text-white">
            {isProcessing ? "Final confirmation in progress." : "Your order is in."}
          </h1>
          <p className="section-copy max-w-xl">
            {isProcessing
              ? orderCode
                ? `Order ${orderCode} has been received and is waiting for final payment confirmation.`
                : "Your payment has been received and is waiting for final confirmation."
              : orderCode
                ? `Order ${orderCode} was paid successfully and is moving to fulfillment.`
                : "Your payment was captured successfully and the order is moving to fulfillment."}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/store"
              className="button-primary inline-flex items-center gap-2 px-5 py-3.5"
            >
              Keep shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="button-secondary inline-flex items-center gap-2 px-5 py-3.5"
            >
              Back home
            </Link>
          </div>
        </div>
      </Reveal>
    </main>
  );
}
