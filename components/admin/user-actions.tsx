"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function UserActions({
  userId,
  currentRole,
  disabled,
}: {
  userId: string;
  currentRole: "CUSTOMER" | "ADMIN";
  disabled: boolean;
}) {
  const router = useRouter();
  const [role, setRole] = useState(currentRole);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function updateRole(nextRole: "CUSTOMER" | "ADMIN") {
    setRole(nextRole);
    setSaving(true);
    setStatus(null);

    const response = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: nextRole }),
    });
    const result = await response.json();
    setSaving(false);

    if (!response.ok) {
      setRole(currentRole);
      setStatus(result.error ?? "Unable to update role.");
      return;
    }

    router.refresh();
  }

  async function deleteUser() {
    if (!window.confirm("Delete this account?")) {
      return;
    }

    setSaving(true);
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: "DELETE",
    });
    const result = await response.json();
    setSaving(false);

    if (!response.ok) {
      setStatus(result.error ?? "Unable to delete account.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="admin-actions">
      <select
        className="field admin-compact-field"
        value={role}
        disabled={disabled || saving}
        onChange={(event) =>
          void updateRole(event.target.value as "CUSTOMER" | "ADMIN")
        }
      >
        <option value="CUSTOMER">Customer</option>
        <option value="ADMIN">Admin</option>
      </select>
      <button
        type="button"
        className="button-secondary px-4 py-2.5"
        disabled={disabled || saving}
        onClick={() => void deleteUser()}
      >
        Delete
      </button>
      {status ? <small>{status}</small> : null}
    </div>
  );
}
