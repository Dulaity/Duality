import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Product } from "@/lib/products";

const stickerLabels = [
  "Brainrot",
  "Anime Delusions",
  "Sports Trauma",
  "Contrasting Designs",
];

function productStyle(product: Product) {
  return {
    "--card-base": product.palette.base,
    "--card-accent": product.palette.accent,
    "--card-glow": product.palette.glow,
  } as CSSProperties;
}

export function MemeDropWall({ products }: { products: Product[] }) {
  const showcaseProducts = products.slice(0, 4);

  return (
    <aside className="meme-drop-wall" aria-label="Featured meme shirt drop">
      <div className="meme-drop-marquee" aria-hidden="true">
        <span>If you get it, you get it</span>
        <span>Wearable internet culture</span>
        <span>Fashion with lore</span>
      </div>

      <div className="meme-drop-track">
        {showcaseProducts.length > 0 ? (
          showcaseProducts.map((product, index) => (
            <Link
              key={product.slug}
              href={`/store/${product.slug}`}
              className={`meme-shirt-card meme-shirt-card-${index}`}
              style={productStyle(product)}
            >
              <div className="meme-card-tag">
                <span>{product.collection}</span>
                <ArrowUpRight className="h-4 w-4" />
              </div>

              <div className="meme-shirt-frame">
                {product.storefrontImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.storefrontImage} alt={product.name} />
                ) : (
                  <div className="meme-shirt-fallback">
                    <span>{product.sku}</span>
                  </div>
                )}
              </div>

              <div className="meme-card-copy">
                <strong>{product.name}</strong>
                <small>{product.badge}</small>
              </div>
            </Link>
          ))
        ) : (
          <div className="meme-shirt-card meme-shirt-empty">
            <div className="meme-shirt-frame">
              <div className="meme-shirt-fallback">
                <span>Duality</span>
              </div>
            </div>
            <div className="meme-card-copy">
              <strong>Next drop loading</strong>
              <small>Fresh chaos soon</small>
            </div>
          </div>
        )}
      </div>

      <div className="meme-sticker-rack" aria-hidden="true">
        {stickerLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </aside>
  );
}
