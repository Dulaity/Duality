import type { Metadata } from "next";

import { CartExperience } from "@/components/cart-experience";

export const metadata: Metadata = {
  title: "Cart",
  description:
    "Review your Duality cart, add delivery details, and complete your order securely.",
};

export default function CartPage() {
  return <CartExperience />;
}
