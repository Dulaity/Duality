"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const ideaStatuses = ["new", "reviewing", "quoted", "accepted", "rejected"];

export function IdeaSubmissionActions({
  submissionId,
  status,
}: {
  submissionId: string;
  status: string;
}) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(status);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    setMessage(null);

    const response = await fetch(`/api/admin/ideas/${submissionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: currentStatus,
      }),
    });
    const result = await response.json();
    setSaving(false);

    if (!response.ok) {
      setMessage(result.error ?? "Unable to update submission.");
      return;
    }

    setMessage("Saved");
    router.refresh();
  }

  return (
    <div className="admin-actions">
      <select
        className="field admin-compact-field"
        value={currentStatus}
        disabled={saving}
        onChange={(event) => setCurrentStatus(event.target.value)}
      >
        {ideaStatuses.map((option) => (
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
