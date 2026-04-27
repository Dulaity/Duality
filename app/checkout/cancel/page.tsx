import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Checkout canceled",
  description: "Return to your Duality cart and continue shopping.",
};

export default function CheckoutCancelPage() {
  return (
    <main className="page-shell py-12 md:py-16">
      <Reveal as="section" className="section-panel p-10 text-center md:p-14">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
          <p className="eyebrow">Checkout paused</p>
          <h1 className="section-title text-white">Your cart is still waiting.</h1>
          <p className="section-copy max-w-xl">
            Nothing was charged. You can return to the cart or keep browsing the line.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/cart"
              className="button-primary inline-flex items-center gap-2 px-5 py-3.5"
            >
              Return to cart
            </Link>
            <Link
              href="/store"
              className="button-secondary inline-flex items-center gap-2 px-5 py-3.5"
            >
              Browse store
            </Link>
          </div>
        </div>
      </Reveal>
    </main>
  );
}
