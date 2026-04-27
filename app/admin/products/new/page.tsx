import Link from "next/link";

import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <section className="section-panel p-6 md:p-8">
      <Link href="/admin/products" className="button-secondary px-4 py-2.5">
        Back to products
      </Link>
      <div className="mt-8 space-y-3">
        <p className="eyebrow">New product</p>
        <h2 className="font-display text-4xl text-white">
          Add a shirt.
        </h2>
      </div>
      <div className="mt-8">
        <ProductForm />
      </div>
    </section>
  );
}
