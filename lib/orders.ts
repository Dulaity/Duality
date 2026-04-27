import { MAX_ORDER_QUANTITY } from "@/lib/limits";
import {
  formatPrice,
  getProductBySlug,
  products,
  type Product,
} from "@/lib/products";

export type CartItemInput = {
  slug: string;
  quantity: number;
  size: string;
};

export type OrderPreview = {
  code: string;
  eta: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  totalLabel: string;
  items: Array<
    CartItemInput & {
      sku: string;
      name: string;
      price: number;
      lineTotal: number;
      lineTotalLabel: string;
    }
  >;
};

export function generateOrderCode() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const nonce = globalThis.crypto.randomUUID().slice(0, 4).toUpperCase();

  return `DLY-${timestamp}-${nonce}`;
}

export function buildOrderPreview(
  items: CartItemInput[],
  code = generateOrderCode(),
): OrderPreview {
  return buildOrderPreviewFromCatalog(items, products, code);
}

export function buildOrderPreviewFromCatalog(
  items: CartItemInput[],
  catalog: Product[],
  code = generateOrderCode(),
  options: {
    allowDefaultFallback?: boolean;
  } = {},
): OrderPreview {
  const normalizedItems = items.map((item) => {
    const product =
      catalog.find((catalogProduct) => catalogProduct.slug === item.slug) ??
      (options.allowDefaultFallback === false
        ? undefined
        : getProductBySlug(item.slug));

    if (!product) {
      throw new Error(`Unknown product: ${item.slug}`);
    }

    if (!product.sizes.includes(item.size)) {
      throw new Error(`Invalid size selected for ${product.name}`);
    }

    const quantity = Math.max(
      1,
      Math.min(MAX_ORDER_QUANTITY, Math.trunc(item.quantity)),
    );
    const lineTotal = product.price * quantity;

    return {
      ...item,
      sku: product.sku,
      quantity,
      name: product.name,
      price: product.price,
      lineTotal,
      lineTotalLabel: formatPrice(lineTotal),
    };
  });

  const totalUnits = normalizedItems.reduce((sum, item) => sum + item.quantity, 0);

  if (totalUnits > MAX_ORDER_QUANTITY) {
    throw new Error(`A single order can include up to ${MAX_ORDER_QUANTITY} tees.`);
  }

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = subtotal >= 2500 ? 0 : 149;
  const tax = Math.round(subtotal * 0.12);
  const total = subtotal + shipping + tax;

  return {
    code,
    eta: "5-7 working days",
    subtotal,
    shipping,
    tax,
    total,
    totalLabel: formatPrice(total),
    items: normalizedItems,
  };
}
