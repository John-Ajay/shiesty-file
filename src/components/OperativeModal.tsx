"use client";

import { useEffect } from "react";
import type { Operative } from "@/lib/types";
import { OperativeFileCard } from "@/components/OperativeFileCard";

export function OperativeModal({
  operative,
  onClose,
}: {
  operative: Operative;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <OperativeFileCard operative={operative} />
        <button
          onClick={onClose}
          className="mt-4 w-full border border-[var(--line)] px-5 py-2.5 text-xs tracking-[0.15em] text-[var(--ink-dim)] hover:border-[var(--red)] hover:text-white transition-colors"
        >
          [ CLOSE FILE ]
        </button>
      </div>
    </div>
  );
}
