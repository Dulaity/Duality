import type { Product } from "@/lib/products";

function splitWords(name: string) {
  const words = name.replaceAll("/", " ").split(" ").filter(Boolean);

  return {
    left: words[0] ?? name,
    right: words[1] ?? words[0] ?? "Duality",
  };
}

export function DualityStage({
  label,
  meta,
  title,
  footer,
  image,
  large = false,
  className,
}: {
  label: string;
  meta: string;
  title: string;
  footer?: string;
  image?: string | null;
  large?: boolean;
  className?: string;
}) {
  const words = splitWords(title);

  return (
    <div
      className={`stage-panel${large ? " stage-panel-large" : ""}${image ? " stage-panel-with-image" : ""}${className ? ` ${className}` : ""}`}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={title} className="stage-image" />
      ) : null}
      <div className="stage-copy">
        <div className="stage-top">
          <span>{label}</span>
          <span>{meta}</span>
        </div>

        <div className="stage-bottom">
          <div className="stage-title-stack">
            <span className="stage-word">{words.left}</span>
            <span className="stage-word stage-word-light">{words.right}</span>
          </div>
          {footer ? <p className="stage-footer">{footer}</p> : null}
        </div>
      </div>
    </div>
  );
}

export function ProductStage({
  product,
  large = false,
  className,
}: {
  product: Product;
  large?: boolean;
  className?: string;
}) {
  return (
    <DualityStage
      label={`/${product.sku}`}
      meta={large ? product.collection : product.fit}
      title={product.name}
      footer={large ? product.badge : product.subtitle}
      image={product.storefrontImage}
      large={large}
      className={className}
    />
  );
}
