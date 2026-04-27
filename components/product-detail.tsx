"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import { useState } from "react";

import { ProductStage } from "@/components/duality-stage";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { useCart } from "@/components/cart-provider";
import { MAX_ORDER_QUANTITY } from "@/lib/limits";
import { formatPrice, type Product } from "@/lib/products";

export function ProductDetail({
  product,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: Product[];
}) {
  const { addItem, cartCount } = useCart();
  const [size, setSize] = useState(product.sizes[1] ?? product.sizes[0]);
  const [added, setAdded] = useState(false);
  const canAdd = cartCount < MAX_ORDER_QUANTITY && !product.soldOut;
  const catalogImages = product.catalogImages.filter(Boolean);

  function handleAdd() {
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
    <main className="page-shell flex flex-col gap-16 pb-20 pt-8 md:gap-20 md:pb-24 md:pt-10">
      <Reveal>
        <Link
          href="/store"
          className="button-secondary inline-flex w-fit items-center gap-2 px-4 py-2.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to store
        </Link>
      </Reveal>

      <section className="detail-grid">
        <Reveal className="md:sticky md:top-28">
          <ProductStage product={product} large />
          {catalogImages.length > 0 ? (
            <div className="product-gallery mt-8">
              {catalogImages.map((image, index) => (
                <div key={`${image.slice(0, 32)}-${index}`} className="product-gallery-frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt={`${product.name} catalog view ${index + 1}`} />
                </div>
              ))}
            </div>
          ) : null}
        </Reveal>

        <Reveal className="space-y-10" delay={80}>
          <div className="space-y-5 border-b border-white/8 pb-8">
            <p className="eyebrow">{product.collection}</p>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <h1 className="section-title max-w-3xl text-white">{product.name}</h1>
                <p className="text-sm uppercase tracking-[0.16em] text-white/32">
                  {product.subtitle}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-semibold text-white">
                  {formatPrice(product.price)}
                </p>
                <p className="text-xs uppercase tracking-[0.22em] text-white/32">
                  {product.category}
                </p>
              </div>
            </div>
            <p className="section-copy max-w-2xl">{product.description}</p>
          </div>

          <div className="pill-list">
            {product.highlights.map((highlight) => (
              <span key={highlight}>{highlight}</span>
            ))}
          </div>

          <div className="info-rows">
            <div className="info-row">
              <span className="text-white/34">Fabric</span>
              <span className="max-w-[20rem] text-right">{product.materials}</span>
            </div>
            <div className="info-row">
              <span className="text-white/34">Fit</span>
              <span className="max-w-[20rem] text-right">{product.fit}</span>
            </div>
            <div className="info-row">
              <span className="text-white/34">Dispatch</span>
              <span className="max-w-[20rem] text-right">{product.leadTime}</span>
            </div>
            <div className="info-row">
              <span className="text-white/34">Stock</span>
              <span className="max-w-[20rem] text-right">
                {product.soldOut ? "Sold out" : "Available"}
              </span>
            </div>
            <div className="info-row">
              <span className="text-white/34">Vibe</span>
              <span className="max-w-[20rem] text-right">{product.vibe}</span>
            </div>
          </div>

          <div className="space-y-4 border-t border-white/8 pt-8">
            <p className="eyebrow">Select size</p>
            <div className="mobile-scroll">
              <div className="flex w-max gap-2">
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
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAdd}
                disabled={!canAdd}
                className="button-primary inline-flex flex-1 items-center justify-center gap-2 px-5 py-3.5 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <ShoppingBag className="h-4 w-4" />
                {product.soldOut
                  ? "Sold out"
                  : added
                    ? "Added"
                    : canAdd
                      ? "Add to cart"
                      : "Cart full"}
              </button>

              <Link
                href="/cart"
                className="button-secondary inline-flex items-center justify-center gap-2 px-5 py-3.5"
              >
                Go to cart
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <Reveal
        as="section"
        className="space-y-10 border-t border-white/8 pt-14 md:pt-16"
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="eyebrow">Related</p>
            <h2 className="section-title text-white">More from the line.</h2>
          </div>

          <Link
            href="/store"
            className="button-secondary inline-flex items-center justify-center gap-2 px-5 py-3.5"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-16 xl:grid-cols-2">
          {relatedProducts.map((relatedProduct, index) => (
            <Reveal key={relatedProduct.slug} delay={index * 70}>
              <ProductCard product={relatedProduct} compact />
            </Reveal>
          ))}
        </div>
      </Reveal>
    </main>
  );
}
