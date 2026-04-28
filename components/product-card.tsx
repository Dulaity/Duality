"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useState } from "react";

import { ProductStage } from "@/components/duality-stage";
import { useCart } from "@/components/cart-provider";
import { MAX_ORDER_QUANTITY } from "@/lib/limits";
import { formatPrice, type Product } from "@/lib/products";

export function ProductCard({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const { addItem, cartCount } = useCart();
  const [size, setSize] = useState(product.sizes[1] ?? product.sizes[0]);
  const [added, setAdded] = useState(false);
  const canAdd = cartCount < MAX_ORDER_QUANTITY && !product.soldOut;

  function handleAddToCart() {
    if (!canAdd) {
      return;
    }

    addItem({
      slug: product.slug,
      size,
      quantity: 1,
    });

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <article className={`product-card${compact ? " product-card-compact" : ""}`}>
      <Link href={`/store/${product.slug}`} className="block">
        <ProductStage product={product} />
      </Link>

      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div className="space-y-3">
          <p className="eyebrow">{product.collection}</p>
          <Link href={`/store/${product.slug}`} className="block">
            <h3 className="font-display text-4xl text-white transition hover:text-white/84">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm uppercase tracking-[0.16em] text-white/32">
            {product.subtitle}
          </p>
          <p className="section-copy max-w-xl">
            {compact ? product.description : product.story}
          </p>
        </div>

        <div className="space-y-1 md:text-right">
          <p className="text-3xl font-semibold text-white">{formatPrice(product.price)}</p>
          <p className="text-xs uppercase tracking-[0.22em] text-white/32">
            {product.soldOut ? "Sold out" : product.fit}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {product.sizes.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setSize(option)}
            className={`filter-chip ${size === option ? "filter-chip-active" : ""}`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!canAdd}
          className="button-primary inline-flex flex-1 items-center justify-center gap-2 px-5 py-3.5 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <ShoppingBag className="h-4 w-4" />
          {product.soldOut
            ? "Sold out"
            : added
              ? "Added"
              : canAdd
                ? "Mentally adding to cart"
                : "Cart full"}
        </button>

        <Link
          href={`/store/${product.slug}`}
          className="button-secondary inline-flex items-center justify-center gap-2 px-5 py-3.5"
        >
          This is so me
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
