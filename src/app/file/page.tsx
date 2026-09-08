"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AmbientOverlay } from "@/components/AmbientOverlay";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { OperativeFileCard } from "@/components/OperativeFileCard";
import { useSession } from "@/lib/useSession";
import type { Operative } from "@/lib/types";
import { MISSIONS } from "@/data/missions";

export default function FilePage() {
  const router = useRouter();
  const { handle, loaded } = useSession();
  const [operative, setOperative] = useState<Operative | null>(null);
  const [loadingOp, setLoadingOp] = useState(true);

  useEffect(() => {
    if (!loaded) return;
    if (!handle) {
      router.replace("/identify");
      return;
    }
    fetch(`/api/operative?handle=${encodeURIComponent(handle)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.operative) setOperative(data.operative);
        setLoadingOp(false);
      })
      .catch(() => setLoadingOp(false));
  }, [loaded, handle, router]);

  if (!loaded || loadingOp) {
    return (
      <div className="relative flex flex-1 flex-col items-center justify-center min-h-screen">
        <AmbientOverlay />
        <p className="text-xs tracking-[0.15em] text-[var(--ink-dim)]">
          &gt; LOADING FILE...
        </p>
      </div>
    );
  }

  if (!operative) return null;

  const nextMission = MISSIONS.find((m) => m.active);
  const hasStripes = operative.stripes > 0;

  return (
    <div className="relative flex flex-col flex-1 min-h-screen">
      <AmbientOverlay />
      <Navigation />
      <main className="relative z-10 flex-1 flex flex-col items-center px-6 py-14">
        <div className="w-full max-w-sm fade-up">
          <OperativeFileCard operative={operative} />

          {nextMission && (
            <div className="mt-6 flex flex-col items-center gap-3">
              <p className="text-xs tracking-[0.1em] text-[var(--ink-dim)]">
                MISSION AVAILABLE: {nextMission.number}
              </p>
              <Link
                href="/mission/001"
                className="inline-flex items-center gap-3 border border-[var(--line)] px-6 py-3 text-xs tracking-[0.2em] text-[var(--ink)] hover:border-[var(--red)] hover:text-white transition-colors"
              >
                <span className="text-[var(--red)]">[</span>
                {hasStripes ? "REVISIT FILE" : "ACCEPT MISSION"}
                <span className="text-[var(--red)]">]</span>
              </Link>
            </div>
          )}

          {hasStripes && (
            <div className="mt-4 flex justify-center">
              <Link
                href="/wall"
                className="text-xs tracking-[0.1em] text-[var(--ink-faint)] hover:text-[var(--ink-dim)] transition-colors"
              >
                VIEW SHIESTY WALL →
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
