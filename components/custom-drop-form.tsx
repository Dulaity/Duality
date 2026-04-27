"use client";

import { Send } from "lucide-react";
import { useState, useTransition } from "react";

const volumeOptions = ["25-50", "50-100", "100-250", "250+"];

export function CustomDropForm() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{
    tone: "idle" | "success" | "error";
    message: string;
  }>({
    tone: "idle",
    message: "Send the joke, quantity, and basic context.",
  });

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const payload = {
        name: formData.get("name"),
        email: formData.get("email"),
        group: formData.get("group"),
        volume: formData.get("volume"),
        concept: formData.get("concept"),
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
    });
  }

  return (
    <form action={handleSubmit} className="section-panel p-6 md:p-8">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="eyebrow">Request form</p>
          <h3 className="font-display text-4xl text-white">
            Send the joke.
          </h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-white/62">
            <span>Name</span>
            <input required name="name" className="field" placeholder="Your name" />
          </label>

          <label className="space-y-2 text-sm text-white/62">
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
          <label className="space-y-2 text-sm text-white/62">
            <span>Group / context</span>
            <input
              required
              name="group"
              className="field"
              placeholder="Team, class, fandom, or inside joke"
            />
          </label>

          <label className="space-y-2 text-sm text-white/62">
            <span>Quantity</span>
            <select name="volume" className="field" defaultValue={volumeOptions[1]}>
              {volumeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="space-y-2 text-sm text-white/62">
          <span>Brief</span>
          <textarea
            required
            name="concept"
            className="field min-h-36 resize-y"
            placeholder="The joke, the audience, print idea, and how unwearable it should feel."
          />
        </label>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <p
            className={`max-w-2xl text-sm leading-8 ${
              status.tone === "error"
                ? "text-white"
                : status.tone === "success"
                  ? "text-white"
                  : "text-white/48"
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
