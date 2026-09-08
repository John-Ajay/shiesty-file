"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AmbientOverlay } from "@/components/AmbientOverlay";
import { useSession } from "@/lib/useSession";

export default function IdentifyPage() {
  const router = useRouter();
  const { setHandle } = useSession();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = value.trim();
    if (!trimmed) {
      setError("IDENTITY REQUIRED. FIELD CANNOT BE EMPTY.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/identify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "ACCESS DENIED.");
        setSubmitting(false);
        return;
      }
      setHandle(data.operative.x_handle);
      router.push("/scan");
    } catch {
      setError("CONNECTION LOST. TRY AGAIN.");
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center min-h-screen px-6">
      <AmbientOverlay />
      <div className="relative z-10 w-full max-w-sm">
        <p className="font-display text-sm tracking-[0.25em] text-[var(--ink)] text-center">
          SHIESTY INTELLIGENCE SYSTEM
        </p>
        <p className="mt-6 text-sm tracking-[0.1em] text-[var(--ink-dim)] text-center">
          &gt; IDENTIFY YOURSELF.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="@yourhandle"
            className="w-full bg-transparent border border-[var(--line)] px-4 py-3 text-center text-sm tracking-[0.1em] text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:border-[var(--red)] outline-none transition-colors"
            disabled={submitting}
          />

          {error && (
            <p className="text-center text-xs tracking-[0.1em] text-[var(--red)]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-3 border border-[var(--line)] px-6 py-3 text-xs tracking-[0.2em] text-[var(--ink)] hover:border-[var(--red)] hover:text-white transition-colors disabled:opacity-40"
          >
            <span className="text-[var(--red)]">[</span>
            {submitting ? "VERIFYING..." : "VERIFY IDENTITY"}
            <span className="text-[var(--red)]">]</span>
          </button>
        </form>
      </div>
    </div>
  );
}
