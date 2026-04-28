"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { shirtCategories, type Product } from "@/lib/products";

type AdminProduct = Product & {
  id: string;
};

type TemplateValues = {
  label: string;
  values: Record<string, string | number>;
  sizes: string[];
  highlights: string[];
  palette: Product["palette"];
};

const fitOptions: Product["fit"][] = ["Oversized", "Boxy", "Relaxed"];
const maxImageBytes = 500 * 1024;

const productTemplates: TemplateValues[] = [
  {
    label: "Brainrot",
    values: {
      sku: "BRAIN-01",
      slug: "new-brainrot-shirt",
      name: "Group Chat Artifact",
      subtitle: "Brainrot tee for unserious people",
      price: 999,
      collection: "Brainrot",
      category: "Graphic Tee",
      fit: "Oversized",
      badge: "Fresh meme energy",
      description:
        "A loud tee built around one clean joke, made for the kind of people who screenshot chaos for later.",
      story:
        "Use this template for everyday brainrot with a simple front hit, bigger back graphic, and a joke that reads instantly.",
      vibe: "Goofy, shareable, and slightly unhinged.",
      materials: "220 GSM soft cotton",
      leadTime: "Dispatches in 48 hours",
      inventory: 24,
    },
    sizes: ["S", "M", "L", "XL"],
    highlights: ["Big front print", "Oversized street fit", "Soft ribbed collar"],
    palette: {
      base: "#fff5b8",
      shell: "#ffffff",
      accent: "#ffcf24",
      glow: "#ff5f7a",
      text: "#16110a",
    },
  },
  {
    label: "Sports Trauma",
    values: {
      sku: "SPORT-01",
      slug: "new-sports-trauma",
      name: "Sideline Menace",
      subtitle: "Sports trauma for loud match days",
      price: 1099,
      collection: "Sports Trauma",
      category: "Fan Tee",
      fit: "Relaxed",
      badge: "Match-day approved",
      description:
        "A sporty tee for fans who treat every match like a personal emergency and every replay like evidence.",
      story:
        "Use this template for sport jokes, fan culture, fake jerseys, match-day banter, and team-order drops.",
      vibe: "Competitive, loud, and intentionally unserious.",
      materials: "Dry-touch cotton blend",
      leadTime: "Dispatches in 48 hours",
      inventory: 24,
    },
    sizes: ["S", "M", "L", "XL"],
    highlights: ["Sporty number print", "Relaxed match-day fit", "Breathable finish"],
    palette: {
      base: "#ffdf3b",
      shell: "#ffffff",
      accent: "#1d4ed8",
      glow: "#ff5f7a",
      text: "#121212",
    },
  },
  {
    label: "Anime Delusions",
    values: {
      sku: "ANIME-01",
      slug: "new-anime-delusion",
      name: "Side Quest Disaster",
      subtitle: "Anime delusion for dramatic arcs",
      price: 1099,
      collection: "Anime Delusions",
      category: "Graphic Tee",
      fit: "Boxy",
      badge: "Arc ruined",
      description:
        "A manga-panel inspired tee for people who narrate minor problems like season finales.",
      story:
        "Use this template for anime jokes, manga layouts, dramatic one-liners, and character-arc themed graphics.",
      vibe: "Dramatic, self-aware, and one frame away from disaster.",
      materials: "230 GSM enzyme-washed cotton",
      leadTime: "Dispatches in 72 hours",
      inventory: 24,
    },
    sizes: ["S", "M", "L", "XL"],
    highlights: ["Manga-panel layout", "Front and back print", "Smooth washed finish"],
    palette: {
      base: "#fff4b1",
      shell: "#ffffff",
      accent: "#7c3aed",
      glow: "#ff5f7a",
      text: "#141414",
    },
  },
  {
    label: "Contrasting T-Shirt Designs",
    values: {
      sku: "CONTRAST-01",
      slug: "new-contrasting-shirt",
      name: "Opposite Moodboard",
      subtitle: "Contrasting tee for mixed signals",
      price: 1199,
      collection: "Contrasting T-Shirt Designs",
      category: "Graphic Tee",
      fit: "Oversized",
      badge: "Two moods",
      description:
        "A high-contrast tee for designs that deliberately clash: split layouts, opposite ideas, and visual jokes.",
      story:
        "Use this template for black-white, split-tone, mirrored, or opposite-concept shirts that still fit the internet-culture tone.",
      vibe: "Sharp, graphic, and intentionally conflicted.",
      materials: "230 GSM soft cotton",
      leadTime: "Dispatches in 72 hours",
      inventory: 24,
    },
    sizes: ["S", "M", "L", "XL"],
    highlights: ["Split graphic layout", "Oversized contrast fit", "High-impact print"],
    palette: {
      base: "#ffffff",
      shell: "#111111",
      accent: "#ffd93d",
      glow: "#2563eb",
      text: "#17120a",
    },
  },
];

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

function setFormValue(form: HTMLFormElement, name: string, value: string | number) {
  const field = form.elements.namedItem(name);

  if (
    field instanceof HTMLInputElement ||
    field instanceof HTMLTextAreaElement ||
    field instanceof HTMLSelectElement
  ) {
    field.value = String(value);
  }
}

function readImageFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      reject(new Error("Upload a JPG, PNG, or WebP image."));
      return;
    }

    if (file.size > maxImageBytes) {
      reject(new Error("Keep each image under 500 KB."));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read image."));
    reader.readAsDataURL(file);
  });
}

export function ProductForm({ product }: { product?: AdminProduct }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [storefrontImage, setStorefrontImage] = useState(product?.storefrontImage ?? "");
  const [catalogImages, setCatalogImages] = useState(product?.catalogImages ?? []);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const isEditing = Boolean(product);

  function applyTemplate(template: TemplateValues) {
    const form = formRef.current;

    if (!form) {
      return;
    }

    Object.entries(template.values).forEach(([key, value]) => {
      setFormValue(form, key, value);
    });

    setFormValue(form, "sizes", listToText(template.sizes));
    setFormValue(form, "highlights", listToText(template.highlights));
    setFormValue(form, "paletteBase", template.palette.base);
    setFormValue(form, "paletteShell", template.palette.shell);
    setFormValue(form, "paletteAccent", template.palette.accent);
    setFormValue(form, "paletteGlow", template.palette.glow);
    setFormValue(form, "paletteText", template.palette.text);
  }

  async function handleStorefrontUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];

    if (!file) {
      return;
    }

    try {
      setStatus(null);
      setStorefrontImage(await readImageFile(file));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      event.currentTarget.value = "";
    }
  }

  async function handleCatalogUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? []);

    if (files.length === 0) {
      return;
    }

    try {
      setStatus(null);
      const availableSlots = Math.max(0, 5 - catalogImages.length);
      const images = await Promise.all(files.slice(0, availableSlots).map(readImageFile));
      setCatalogImages((currentImages) => [...currentImages, ...images].slice(0, 5));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      event.currentTarget.value = "";
    }
  }

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
      storefrontImage,
      catalogImages,
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
    <form
      ref={formRef}
      className="admin-form"
      onSubmit={(event) => void handleSubmit(event)}
    >
      <section className="admin-template-panel">
        <div>
          <p className="eyebrow">Templates</p>
          <h3 className="font-display text-3xl text-white">Start faster.</h3>
        </div>
        <div className="admin-template-grid">
          {productTemplates.map((template) => (
            <button
              key={template.label}
              type="button"
              className="button-secondary px-4 py-2.5"
              onClick={() => applyTemplate(template)}
            >
              {template.label}
            </button>
          ))}
        </div>
      </section>

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
            defaultValue={product?.collection ?? "Brainrot"}
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

      <section className="admin-image-panel">
        <div className="space-y-2">
          <p className="eyebrow">Images</p>
          <h3 className="font-display text-3xl text-white">Storefront and catalog.</h3>
          <p className="text-sm leading-7 text-white/52">
            Upload JPG, PNG, or WebP images under 500 KB. Storefront image appears on product cards; catalog images appear on the product detail page.
          </p>
        </div>

        <div className="admin-image-grid">
          <div className="admin-image-uploader">
            <div className="admin-image-preview">
              {storefrontImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={storefrontImage} alt="Storefront product preview" />
              ) : (
                <span>Storefront image</span>
              )}
            </div>
            <label className="button-secondary inline-flex cursor-pointer justify-center px-4 py-2.5">
              Upload storefront image
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(event) => void handleStorefrontUpload(event)}
              />
            </label>
            <input
              className="field"
              value={storefrontImage}
              onChange={(event) => setStorefrontImage(event.target.value)}
              placeholder="Or paste image URL"
            />
            {storefrontImage ? (
              <button
                type="button"
                className="button-secondary px-4 py-2.5"
                onClick={() => setStorefrontImage("")}
              >
                Remove storefront image
              </button>
            ) : null}
          </div>

          <div className="admin-image-uploader">
            <div className="admin-gallery-preview">
              {catalogImages.length > 0 ? (
                catalogImages.map((image, index) => (
                  <div key={`${image.slice(0, 32)}-${index}`} className="admin-gallery-item">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt={`Catalog product preview ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() =>
                        setCatalogImages((currentImages) =>
                          currentImages.filter((_, imageIndex) => imageIndex !== index),
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <span>Catalog images</span>
              )}
            </div>
            <label className="button-secondary inline-flex cursor-pointer justify-center px-4 py-2.5">
              Upload catalog images
              <input
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(event) => void handleCatalogUpload(event)}
              />
            </label>
            <textarea
              className="field admin-textarea admin-textarea-small"
              value={catalogImages.join("\n")}
              onChange={(event) => setCatalogImages(textToList(event.target.value).slice(0, 5))}
              placeholder="Or paste image URLs, one per line"
            />
          </div>
        </div>
      </section>

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
