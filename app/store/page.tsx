import type { Metadata } from "next";
import { connection } from "next/server";

import { StoreExperience } from "@/components/store-experience";
import { getStoreProducts } from "@/lib/product-store";

export const metadata: Metadata = {
  title: "Store",
  description:
    "Browse Duality brainrot, sports trauma, anime delusions, and niche internet culture tees.",
};

export default async function StorePage() {
  await connection();

  const products = await getStoreProducts();

  return <StoreExperience products={products} />;
}
