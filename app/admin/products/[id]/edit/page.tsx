import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/product-form";
import { mapProductRecord } from "@/lib/product-store";
import { prisma } from "@/lib/prisma";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <section className="section-panel p-6 md:p-8">
      <Link href="/admin/products" className="button-secondary px-4 py-2.5">
        Back to products
      </Link>
      <div className="mt-8 space-y-3">
        <p className="eyebrow">Edit product</p>
        <h2 className="font-display text-4xl text-white">{product.name}</h2>
      </div>
      <div className="mt-8">
        <ProductForm product={{ id: product.id, ...mapProductRecord(product) }} />
      </div>
    </section>
  );
}
