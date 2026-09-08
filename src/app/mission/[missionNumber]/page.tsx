"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AmbientOverlay } from "@/components/AmbientOverlay";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { HiddenMark } from "@/components/HiddenMark";
import { useSession } from "@/lib/useSession";
import { getMission } from "@/data/missions";
import { getRankForStripes } from "@/data/ranks";
import type { Operative } from "@/lib/types";

export default function MissionPage({
  params,
}: {
  params: Promise<{ missionNumber: string }>;
}) {
  const { missionNumber } = use(params);
  const router = useRouter();
  const { handle, loaded } = useSession();

  const mission = getMission(missionNumber);

  const [found, setFound] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [result, setResult] = useState<{ operative: Operative; alreadyCompleted: boolean } | null>(
    null
  );

  useEffect(() => {
    if (!loaded) return;
    if (!handle) {
      router.replace("/identify");
    }
  }, [loaded, handle, router]);

  async function handleFound() {
    if (found) return;
    setFound(true);
    setGlitch(true);
    setTimeout(() => setGlitch(false), 260);

    if (!handle || !mission) return;
    setCompleting(true);
    try {
      const res = await fetch("/api/complete-mission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle, missionNumber: mission.number }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      }
    } finally {
      setCompleting(false);
    }
  }

  if (!mission) {
    return (
      <div className="relative flex flex-1 flex-col items-center justify-center min-h-screen">
        <p className="text-xs tracking-[0.1em] text-[var(--red)]">MISSION NOT FOUND.</p>
      </div>
    );
  }

  if (result) {
    const rank = getRankForStripes(result.operative.stripes);
    return (
      <div className="relative flex flex-col flex-1 min-h-screen">
        <AmbientOverlay />
        <Navigation />
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-14 text-center">
          <div className="w-full max-w-sm flex flex-col items-center gap-6 fade-up">
            <div>
              <p className="font-display text-xl tracking-[0.2em] text-[var(--ink)]">
                MISSION {mission.number}
              </p>
              <p className="font-display text-2xl tracking-[0.15em] text-[var(--red)] mt-1">
                COMPLETE
              </p>
            </div>

            <div className="stamp-in border-2 border-[var(--red)] px-5 py-2 text-[var(--red)] tracking-[0.2em] text-sm rotate-[-6deg]">
              + {String(mission.stripeReward).padStart(2, "0")} STRIPE
            </div>

            <p className="text-xs tracking-[0.1em] text-[var(--ink-dim)]">
              &gt; YOU&apos;VE EARNED YOUR FIRST STRIPE.
            </p>

            <div className="border border-[var(--line)] px-6 py-4 w-full">
              <p className="text-[10px] tracking-[0.15em] text-[var(--ink-faint)]">
                RANK UNLOCKED
              </p>
              <p className="font-display text-lg tracking-[0.15em] text-[var(--ink)] mt-1">
                {rank.name}
              </p>
              <p className="text-xs text-[var(--ink-dim)] mt-1">&quot;{rank.tagline}&quot;</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={() => router.push("/file")}
                className="flex-1 inline-flex items-center justify-center gap-2 border border-[var(--line)] px-5 py-3 text-xs tracking-[0.15em] text-[var(--ink)] hover:border-[var(--red)] hover:text-white transition-colors"
              >
                [ VIEW FILE ]
              </button>
              <button
                onClick={() => router.push("/share")}
                className="flex-1 inline-flex items-center justify-center gap-2 border border-[var(--line)] px-5 py-3 text-xs tracking-[0.15em] text-[var(--ink)] hover:border-[var(--red)] hover:text-white transition-colors"
              >
                [ GENERATE MY FILE ]
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col flex-1 min-h-screen ${glitch ? "glitch" : ""}`}>
      <AmbientOverlay />
      <Navigation />
      <main className="relative z-10 flex-1 flex flex-col items-center px-6 py-14">
        <div className="w-full max-w-md">
          <p className="font-display text-lg tracking-[0.2em] text-[var(--ink)]">
            {mission.title}
          </p>
          <p className="text-xs tracking-[0.2em] text-[var(--red)] mt-1">
            {mission.codename}
          </p>

          <div className="mt-8 border border-[var(--line)] px-6 py-6 relative">
            {/* classification stamp corner - contains the hidden mark */}
            <div className="absolute top-3 right-3 border border-[var(--ink-faint)] px-2 py-1 text-[8px] tracking-[0.1em] text-[var(--ink-faint)] rotate-[8deg] flex items-center gap-1">
              CLASS
              <HiddenMark onFound={handleFound} found={found} className="text-[10px] leading-none" />
            </div>

            <p className="text-[10px] tracking-[0.15em] text-[var(--ink-faint)]">
              OBJECTIVE:
            </p>
            <p className="text-sm text-[var(--ink)] mt-2">{mission.objective}</p>

            <div className="mt-5 pt-4 border-t border-[var(--line)] flex flex-col gap-2">
              {mission.briefing.map((line, i) => (
                <p key={i} className="text-xs tracking-[0.05em] text-[var(--ink-dim)]">
                  &gt; {line}
                </p>
              ))}
            </div>
          </div>

          {completing && (
            <p className="mt-4 text-center text-xs tracking-[0.1em] text-[var(--ink-dim)]">
              &gt; PROCESSING...
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
