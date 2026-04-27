"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { shirtCategories, type Product } from "@/lib/products";

type AdminProduct = Product & {
  id: string;
};

const fitOptions: Product["fit"][] = ["Oversized", "Boxy", "Relaxed"];

function listToText(values: string[]) {
  return values.join("\n");
}

function textToList(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function textValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function numberValue(formData: FormData, key: string) {
  return Number.parseInt(String(formData.get(key) ?? "0"), 10);
}

export function ProductForm({ product }: { product?: AdminProduct }) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const isEditing = Boolean(product);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      sku: textValue(formData, "sku").toUpperCase(),
      slug: textValue(formData, "slug"),
      name: textValue(formData, "name"),
      subtitle: textValue(formData, "subtitle"),
      price: numberValue(formData, "price"),
      collection: textValue(formData, "collection"),
      category: textValue(formData, "category"),
      fit: textValue(formData, "fit"),
      badge: textValue(formData, "badge"),
      description: textValue(formData, "description"),
      story: textValue(formData, "story"),
      vibe: textValue(formData, "vibe"),
      materials: textValue(formData, "materials"),
      leadTime: textValue(formData, "leadTime"),
      sizes: textToList(formData.get("sizes")),
      highlights: textToList(formData.get("highlights")),
      palette: {
        base: textValue(formData, "paletteBase"),
        shell: textValue(formData, "paletteShell"),
        accent: textValue(formData, "paletteAccent"),
        glow: textValue(formData, "paletteGlow"),
        text: textValue(formData, "paletteText"),
      },
      inventory: numberValue(formData, "inventory"),
      active: formData.get("active") === "on",
      featured: formData.get("featured") === "on",
    };

    const response = await fetch(
      isEditing ? `/api/admin/products/${product?.id}` : "/api/admin/products",
      {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );
    const result = await response.json();

    setSaving(false);

    if (!response.ok) {
      setStatus(result.error ?? "Unable to save product.");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  async function handleDelete() {
    if (!product || !window.confirm(`Delete ${product.name}?`)) {
      return;
    }

    setSaving(true);
    const response = await fetch(`/api/admin/products/${product.id}`, {
      method: "DELETE",
    });
    const result = await response.json();
    setSaving(false);

    if (!response.ok) {
      setStatus(result.error ?? "Unable to delete product.");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form className="admin-form" onSubmit={(event) => void handleSubmit(event)}>
      <div className="admin-form-grid">
        <label>
          <span>SKU</span>
          <input name="sku" className="field" defaultValue={product?.sku} required />
        </label>
        <label>
          <span>Slug</span>
          <input name="slug" className="field" defaultValue={product?.slug} required />
        </label>
        <label>
          <span>Name</span>
          <input name="name" className="field" defaultValue={product?.name} required />
        </label>
        <label>
          <span>Subtitle</span>
          <input
            name="subtitle"
            className="field"
            defaultValue={product?.subtitle}
            required
          />
        </label>
        <label>
          <span>Price in INR</span>
          <input
            name="price"
            type="number"
            min="1"
            className="field"
            defaultValue={product?.price ?? 999}
            required
          />
        </label>
        <label>
          <span>Inventory</span>
          <input
            name="inventory"
            type="number"
            min="0"
            className="field"
            defaultValue={product?.inventory ?? 24}
            required
          />
        </label>
        <label>
          <span>Collection</span>
          <select
            name="collection"
            className="field"
            defaultValue={product?.collection ?? "Meme Shirts"}
          >
            {shirtCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Fit</span>
          <select name="fit" className="field" defaultValue={product?.fit ?? "Oversized"}>
            {fitOptions.map((fit) => (
              <option key={fit} value={fit}>
                {fit}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Category</span>
          <input
            name="category"
            className="field"
            defaultValue={product?.category ?? "Graphic Tee"}
            required
          />
        </label>
        <label>
          <span>Badge</span>
          <input name="badge" className="field" defaultValue={product?.badge} required />
        </label>
      </div>

      <label>
        <span>Description</span>
        <textarea
          name="description"
          className="field admin-textarea"
          defaultValue={product?.description}
          required
        />
      </label>
      <label>
        <span>Story</span>
        <textarea
          name="story"
          className="field admin-textarea"
          defaultValue={product?.story}
          required
        />
      </label>

      <div className="admin-form-grid">
        <label>
          <span>Vibe</span>
          <input name="vibe" className="field" defaultValue={product?.vibe} required />
        </label>
        <label>
          <span>Materials</span>
          <input
            name="materials"
            className="field"
            defaultValue={product?.materials}
            required
          />
        </label>
        <label>
          <span>Lead time</span>
          <input
            name="leadTime"
            className="field"
            defaultValue={product?.leadTime ?? "Dispatches in 48 hours"}
            required
          />
        </label>
        <label>
          <span>Sizes</span>
          <textarea
            name="sizes"
            className="field admin-textarea admin-textarea-small"
            defaultValue={listToText(product?.sizes ?? ["S", "M", "L", "XL"])}
            required
          />
        </label>
        <label>
          <span>Highlights</span>
          <textarea
            name="highlights"
            className="field admin-textarea admin-textarea-small"
            defaultValue={listToText(product?.highlights ?? [])}
            required
          />
        </label>
      </div>

      <div className="admin-form-grid">
        <label>
          <span>Base color</span>
          <input
            name="paletteBase"
            className="field"
            defaultValue={product?.palette.base ?? "#fff5b8"}
            required
          />
        </label>
        <label>
          <span>Shell color</span>
          <input
            name="paletteShell"
            className="field"
            defaultValue={product?.palette.shell ?? "#ffffff"}
            required
          />
        </label>
        <label>
          <span>Accent color</span>
          <input
            name="paletteAccent"
            className="field"
            defaultValue={product?.palette.accent ?? "#ffcf24"}
            required
          />
        </label>
        <label>
          <span>Glow color</span>
          <input
            name="paletteGlow"
            className="field"
            defaultValue={product?.palette.glow ?? "#ff5f7a"}
            required
          />
        </label>
        <label>
          <span>Text color</span>
          <input
            name="paletteText"
            className="field"
            defaultValue={product?.palette.text ?? "#16110a"}
            required
          />
        </label>
      </div>

      <div className="admin-switch-row">
        <label className="admin-check">
          <input name="active" type="checkbox" defaultChecked={product?.active ?? true} />
          <span>Visible in store</span>
        </label>
        <label className="admin-check">
          <input name="featured" type="checkbox" defaultChecked={product?.featured ?? false} />
          <span>Feature on home page</span>
        </label>
      </div>

      {status ? <p className="admin-form-status">{status}</p> : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={saving}
          className="button-primary inline-flex items-center justify-center px-5 py-3.5 disabled:opacity-60"
        >
          {saving ? "Saving..." : isEditing ? "Save product" : "Create product"}
        </button>
        {product ? (
          <button
            type="button"
            onClick={() => void handleDelete()}
            disabled={saving}
            className="button-secondary inline-flex items-center justify-center px-5 py-3.5 disabled:opacity-60"
          >
            Delete product
          </button>
        ) : null}
      </div>
    </form>
  );
}
