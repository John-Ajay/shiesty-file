"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AmbientOverlay } from "@/components/AmbientOverlay";
import { useSession } from "@/lib/useSession";

const SCAN_LINES = [
  "IDENTITY RECEIVED",
  "SEARCHING OPERATIVE DATABASE...",
  "CROSS-REFERENCING INTELLIGENCE...",
  "CHECKING RECORDS...",
  "ANALYZING ACTIVITY...",
  "CLEARANCE REQUESTED...",
];

export default function ScanPage() {
  const router = useRouter();
  const { handle, loaded } = useSession();
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!loaded) return;
    if (!handle) {
      router.replace("/identify");
      return;
    }
    if (startedRef.current) return;
    startedRef.current = true;

    let lineIndex = 0;
    const lineInterval = setInterval(() => {
      lineIndex += 1;
      setVisibleLines(lineIndex);
      if (lineIndex >= SCAN_LINES.length) {
        clearInterval(lineInterval);
      }
    }, 320);

    let pct = 0;
    const progressInterval = setInterval(() => {
      pct += Math.floor(8 + Math.random() * 14);
      if (pct >= 100) {
        pct = 100;
        clearInterval(progressInterval);
        setTimeout(() => setAccepted(true), 300);
      }
      setProgress(pct);
    }, 220);

    return () => {
      clearInterval(lineInterval);
      clearInterval(progressInterval);
    };
  }, [loaded, handle, router]);

  const barLength = 24;
  const filled = Math.round((progress / 100) * barLength);
  const bar = "█".repeat(filled) + "░".repeat(barLength - filled);

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center min-h-screen px-6">
      <AmbientOverlay />
      <div className="relative z-10 w-full max-w-md">
        {!accepted ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm tracking-[0.1em] text-[var(--ink)] mb-2">
              &gt; SEARCHING SHIESTY DATABASE...
            </p>
            {SCAN_LINES.slice(0, visibleLines).map((line, i) => (
              <p
                key={i}
                className="text-xs tracking-[0.1em] text-[var(--ink-dim)] fade-up"
              >
                {line}
              </p>
            ))}
            <p className="mt-3 text-xs tracking-[0.05em] text-[var(--red)]">
              {bar} {progress}%
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-6 fade-up">
            <p className="text-sm tracking-[0.2em] text-[var(--ink)]">
              IDENTITY ACCEPTED
            </p>

            <div className="border border-[var(--line)] w-full px-6 py-5 flex flex-col gap-3">
              <div className="flex justify-between text-xs tracking-[0.1em]">
                <span className="text-[var(--ink-faint)]">OPERATIVE:</span>
                <span className="text-[var(--ink)]">@{handle}</span>
              </div>
              <div className="flex justify-between text-xs tracking-[0.1em]">
                <span className="text-[var(--ink-faint)]">CLEARANCE:</span>
                <span className="text-[var(--red)]">PENDING</span>
              </div>
            </div>

            <p className="text-xs tracking-[0.1em] text-[var(--ink-dim)]">
              &gt; YOU HAVE BEEN CLEARED FOR OPERATION 001.
            </p>

            <button
              onClick={() => router.push("/file")}
              className="inline-flex items-center gap-3 border border-[var(--line)] px-6 py-3 text-xs tracking-[0.2em] text-[var(--ink)] hover:border-[var(--red)] hover:text-white transition-colors"
            >
              <span className="text-[var(--red)]">[</span>
              BEGIN MISSION
              <span className="text-[var(--red)]">]</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
