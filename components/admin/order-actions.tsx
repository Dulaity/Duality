"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const orderStatuses = ["processing", "captured", "cancelled", "refunded"];
const fulfillmentStatuses = [
  "awaiting-webhook",
  "payment-processing",
  "manual-review",
  "submitting",
  "submitted",
  "skipped",
  "packed",
  "shipped",
  "delivered",
];

export function OrderActions({
  orderId,
  status,
  fulfillmentStatus,
}: {
  orderId: string;
  status: string;
  fulfillmentStatus: string;
}) {
  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState(status);
  const [fulfillment, setFulfillment] = useState(fulfillmentStatus);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    setMessage(null);

    const response = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: orderStatus,
        fulfillmentStatus: fulfillment,
      }),
    });
    const result = await response.json();
    setSaving(false);

    if (!response.ok) {
      setMessage(result.error ?? "Unable to update order.");
      return;
    }

    setMessage("Saved");
    router.refresh();
  }

  return (
    <div className="admin-actions">
      <select
        className="field admin-compact-field"
        value={orderStatus}
        disabled={saving}
        onChange={(event) => setOrderStatus(event.target.value)}
      >
        {orderStatuses.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <select
        className="field admin-compact-field"
        value={fulfillment}
        disabled={saving}
        onChange={(event) => setFulfillment(event.target.value)}
      >
        {fulfillmentStatuses.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="button-primary px-4 py-2.5"
        disabled={saving}
        onClick={() => void save()}
      >
        Save
      </button>
      {message ? <small>{message}</small> : null}
    </div>
  );
}
