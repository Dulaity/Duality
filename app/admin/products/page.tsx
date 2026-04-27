import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/products";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ active: "desc" }, { featured: "desc" }, { createdAt: "asc" }],
  });

  return (
    <section className="section-panel p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Products</p>
          <h2 className="font-display text-4xl text-white">
            Catalog control.
          </h2>
        </div>
        <Link href="/admin/products/new" className="button-primary px-5 py-3.5">
          Add product
        </Link>
      </div>

      <div className="admin-table mt-8">
        <div className="admin-table-row admin-table-head admin-product-row">
          <span>Product</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Images</span>
          <span>Status</span>
          <span>Action</span>
        </div>
        {products.map((product) => (
          <div key={product.id} className="admin-table-row admin-product-row">
            <span>
              <strong>{product.name}</strong>
              <small>
                {product.sku} / {product.collection}
              </small>
            </span>
            <span>{formatPrice(product.price)}</span>
            <span>{product.inventory}</span>
            <span>
              {product.storefrontImage ? "Storefront" : "No storefront"} /{" "}
              {product.catalogImages.length} catalog
            </span>
            <span>
              {product.active ? "Live" : "Hidden"}
              {product.featured ? " / Featured" : ""}
            </span>
            <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
          </div>
        ))}
      </div>
    </section>
  );
}
