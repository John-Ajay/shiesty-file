"use client";

import { useEffect, useState } from "react";

export function TypeLine({
  text,
  speed = 18,
  delay = 0,
  onDone,
  className = "",
  showCursorAfter = false,
}: {
  text: string;
  speed?: number;
  delay?: number;
  onDone?: () => void;
  className?: string;
  showCursorAfter?: boolean;
}) {
  const [shown, setShown] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (shown.length >= text.length) {
      onDone?.();
      return;
    }
    const t = setTimeout(() => {
      setShown(text.slice(0, shown.length + 1));
    }, speed);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, started, text, speed]);

  const done = shown.length >= text.length;

  return (
    <span className={className}>
      {shown}
      {(!done || showCursorAfter) && (
        <span className="cursor-blink inline-block w-[0.55em] h-[1em] bg-current ml-0.5 translate-y-[0.1em]" />
      )}
    </span>
  );
}
