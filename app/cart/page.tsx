import type { Metadata } from "next";
import { connection } from "next/server";

import { CartExperience } from "@/components/cart-experience";
import { getStoreProducts } from "@/lib/product-store";

export const metadata: Metadata = {
  title: "Cart",
  description:
    "Review your Duality cart, add delivery details, and complete your order securely.",
};

export default async function CartPage() {
  await connection();

  const products = await getStoreProducts();

  return <CartExperience products={products} />;
}
