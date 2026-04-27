import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import { ProductDetail } from "@/components/product-detail";
import {
  getStoreProductBySlug,
  getStoreProducts,
} from "@/lib/product-store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getStoreProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found",
    };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();

  const { slug } = await params;
  const product = await getStoreProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const products = await getStoreProducts();
  const relatedProducts = products
    .filter((item) => item.slug !== product.slug)
    .slice(0, 2);

  return <ProductDetail product={product} relatedProducts={relatedProducts} />;
}
