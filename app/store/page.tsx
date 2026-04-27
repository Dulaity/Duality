import type { Metadata } from "next";
import { connection } from "next/server";

import { StoreExperience } from "@/components/store-experience";
import { getStoreProducts } from "@/lib/product-store";

export const metadata: Metadata = {
  title: "Store",
  description:
    "Browse Duality meme shirts, sports merch, anime merch, and unwearable joke tees.",
};

export default async function StorePage() {
  await connection();

  const products = await getStoreProducts();

  return <StoreExperience products={products} />;
}
