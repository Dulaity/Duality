"use client";

import { ImagePlus, Send, X } from "lucide-react";
import { useState, useTransition } from "react";

const maxIdeaImages = 3;
const maxImageBytes = 500 * 1024;

function readImageFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      reject(new Error("Upload JPG, PNG, or WebP images only."));
      return;
    }

    if (file.size > maxImageBytes) {
      reject(new Error("Keep each image under 500 KB."));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that image."));
    reader.readAsDataURL(file);
  });
}

export function CustomDropForm() {
  const [isPending, startTransition] = useTransition();
  const [images, setImages] = useState<string[]>([]);
  const [status, setStatus] = useState<{
    tone: "idle" | "success" | "error";
    message: string;
  }>({
    tone: "idle",
    message: "Send the joke, quantity, references, and basic context.",
  });

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? []);

    if (files.length === 0) {
      return;
    }

    try {
      const availableSlots = Math.max(0, maxIdeaImages - images.length);

      if (availableSlots === 0) {
        setStatus({
          tone: "error",
          message: "Remove a reference image before adding another one.",
        });
        return;
      }

      const uploadedImages = await Promise.all(
        files.slice(0, availableSlots).map(readImageFile),
      );
      setImages((currentImages) =>
        [...currentImages, ...uploadedImages].slice(0, maxIdeaImages),
      );
      setStatus({
        tone: "idle",
        message: "Reference images attached. Send the brief when ready.",
      });
    } catch (error) {
      setStatus({
        tone: "error",
        message: error instanceof Error ? error.message : "Image upload failed.",
      });
    } finally {
      event.currentTarget.value = "";
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const payload = {
        name: formData.get("name"),
        email: formData.get("email"),
        group: formData.get("group"),
        quantity: Number(formData.get("quantity")),
        concept: formData.get("concept"),
        images,
      };

      const response = await fetch("/api/custom-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setStatus({
          tone: "error",
          message: result.error ?? "We could not save your request right now.",
        });
        return;
      }

      setStatus({
        tone: "success",
        message: `${result.reference} saved. ${result.message}`,
      });
      setImages([]);
      form.reset();
    });
  }

  return (
    <form
      className="section-panel p-6 md:p-8"
      onSubmit={(event) => handleSubmit(event)}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="eyebrow">Request form</p>
          <h3 className="font-display text-4xl text-[var(--ink)]">
            Send the joke.
          </h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-[rgba(23,18,10,0.62)]">
            <span>Name</span>
            <input required name="name" className="field" placeholder="Your name" />
          </label>

          <label className="space-y-2 text-sm text-[rgba(23,18,10,0.62)]">
            <span>Email</span>
            <input
              required
              type="email"
              name="email"
              className="field"
              placeholder="you@example.com"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_14rem]">
          <label className="space-y-2 text-sm text-[rgba(23,18,10,0.62)]">
            <span>Group / context</span>
            <input
              required
              name="group"
              className="field"
              placeholder="Team, class, fandom, or inside joke"
            />
          </label>

          <label className="space-y-2 text-sm text-[rgba(23,18,10,0.62)]">
            <span>Quantity</span>
            <input
              required
              name="quantity"
              type="number"
              min="1"
              max="5"
              inputMode="numeric"
              className="field"
              defaultValue="1"
            />
          </label>
        </div>

        <label className="space-y-2 text-sm text-[rgba(23,18,10,0.62)]">
          <span>Brief</span>
          <textarea
            required
            name="concept"
            className="field min-h-36 resize-y"
            placeholder="The joke, the audience, print idea, and how unwearable it should feel."
          />
        </label>

        <section className="idea-upload-panel">
          <div className="space-y-2">
            <p className="eyebrow">References</p>
            <h4 className="font-display text-2xl text-[var(--ink)]">
              Add images if the joke needs context.
            </h4>
            <p className="text-sm leading-7 text-[rgba(23,18,10,0.52)]">
              Optional JPG, PNG, or WebP uploads. Keep each file lightweight.
            </p>
          </div>

          <div className="idea-upload-grid">
            {images.length > 0 ? (
              images.map((image, index) => (
                <div key={`${image.slice(0, 32)}-${index}`} className="idea-upload-item">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt={`Idea reference ${index + 1}`} />
                  <button
                    type="button"
                    aria-label={`Remove reference ${index + 1}`}
                    onClick={() =>
                      setImages((currentImages) =>
                        currentImages.filter((_, imageIndex) => imageIndex !== index),
                      )
                    }
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="idea-upload-empty">No references attached</div>
            )}
          </div>

          <label className="button-secondary inline-flex w-fit cursor-pointer items-center justify-center gap-2 px-4 py-2.5">
            <ImagePlus className="h-4 w-4" />
            Upload references
            <input
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              onChange={(event) => void handleImageUpload(event)}
            />
          </label>
        </section>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <p
            className={`max-w-2xl text-sm leading-8 ${
              status.tone === "error"
                ? "text-[var(--ink)]"
                : status.tone === "success"
                  ? "text-[var(--ink)]"
                  : "text-[rgba(23,18,10,0.48)]"
            }`}
          >
            {status.message}
          </p>

          <button
            type="submit"
            disabled={isPending}
            className="button-primary inline-flex items-center justify-center gap-2 px-5 py-3.5 disabled:cursor-wait disabled:opacity-70"
          >
            <Send className="h-4 w-4" />
            {isPending ? "Sending..." : "Send brief"}
          </button>
        </div>
      </div>
    </form>
  );
}
