"use client";

export function HiddenMark({
  onFound,
  found,
  className = "",
}: {
  onFound: () => void;
  found: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onFound}
      aria-label="Suspicious mark"
      disabled={found}
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{
        color: found ? "var(--red)" : "var(--ink-faint)",
        cursor: found ? "default" : "pointer",
      }}
    >
      ▲
    </button>
  );
}
