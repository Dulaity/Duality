import { connection } from "next/server";

import { HomeExperience } from "@/components/home-experience";
import { getFeaturedStoreProducts } from "@/lib/product-store";

export default async function HomePage() {
  await connection();

  const featuredProducts = await getFeaturedStoreProducts();

  return <HomeExperience featuredProducts={featuredProducts} />;
}
