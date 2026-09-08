"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TypeLine } from "@/components/TypeLine";
import { AmbientOverlay } from "@/components/AmbientOverlay";

export default function LandingPage() {
  const [showAccessing, setShowAccessing] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowAccessing(true), 900);
    return () => clearTimeout(t1);
  }, []);

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center min-h-screen px-6 crt-flicker">
      <AmbientOverlay />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
        <p className="font-display text-lg tracking-[0.35em] text-[var(--ink)] fade-up">
          PROJECT SHIESTY
        </p>
        <p
          className="mt-2 text-xs tracking-[0.25em] text-[var(--ink-dim)] fade-up"
          style={{ animationDelay: "150ms" }}
        >
          CASE FILE #0001
        </p>
        <p
          className="mt-1 text-xs tracking-[0.25em] text-[var(--red)] fade-up"
          style={{ animationDelay: "250ms" }}
        >
          STATUS: ACTIVE
        </p>

        <div className="mt-10 h-6 text-sm tracking-[0.15em] text-[var(--ink-dim)]">
          {showAccessing && (
            <TypeLine text="> ACCESSING OPERATION..." speed={28} onDone={() => setShowButton(true)} />
          )}
        </div>

        <div
          className={`mt-10 transition-all duration-700 ${
            showButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          <Link
            href="/identify"
            className="group inline-flex items-center gap-3 border border-[var(--line)] px-6 py-3 text-xs tracking-[0.2em] text-[var(--ink)] hover:border-[var(--red)] hover:text-white transition-colors"
          >
            <span className="text-[var(--red)]">[</span>
            ENTER THE OPERATION
            <span className="text-[var(--red)]">]</span>
          </Link>
        </div>
      </div>

      <p className="absolute bottom-6 text-[10px] tracking-[0.2em] text-[var(--ink-faint)]">
        CLASSIFIED // UNAUTHORIZED ACCESS PROHIBITED
      </p>
    </div>
  );
}
