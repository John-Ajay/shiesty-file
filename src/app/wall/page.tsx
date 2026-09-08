"use client";

import { useEffect, useState } from "react";
import { AmbientOverlay } from "@/components/AmbientOverlay";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { OperativeModal } from "@/components/OperativeModal";
import { getRankForStripes } from "@/data/ranks";
import type { Operative } from "@/lib/types";

export default function WallPage() {
  const [operatives, setOperatives] = useState<Operative[] | null>(null);
  const [selected, setSelected] = useState<Operative | null>(null);

  useEffect(() => {
    fetch("/api/wall")
      .then((r) => r.json())
      .then((data) => setOperatives(data.operatives ?? []));
  }, []);

  return (
    <div className="relative flex flex-col flex-1 min-h-screen">
      <AmbientOverlay />
      <Navigation />
      <main className="relative z-10 flex-1 flex flex-col items-center px-6 py-14">
        <div className="w-full max-w-2xl">
          <p className="font-display text-lg tracking-[0.2em] text-[var(--ink)]">
            THE SHIESTY WALL
          </p>
          <p className="text-xs tracking-[0.1em] text-[var(--ink-faint)] mt-1">
            PUBLIC OPERATIVE DATABASE // {operatives ? operatives.length : "—"} RECORDS ON FILE
          </p>

          <div className="mt-8 border border-[var(--line)] divide-y divide-[var(--line)]">
            {operatives === null && (
              <p className="px-5 py-6 text-xs tracking-[0.1em] text-[var(--ink-dim)]">
                &gt; LOADING DATABASE...
              </p>
            )}

            {operatives !== null && operatives.length === 0 && (
              <p className="px-5 py-6 text-xs tracking-[0.1em] text-[var(--ink-dim)]">
                NO RECORDS ON FILE. BE THE FIRST OPERATIVE CLEARED.
              </p>
            )}

            {operatives?.map((op) => {
              const rank = getRankForStripes(op.stripes);
              const opNum = String(op.operative_number).padStart(4, "0");
              return (
                <button
                  key={op.id}
                  onClick={() => setSelected(op)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[var(--bg-raised)] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs tracking-[0.1em] text-[var(--ink-faint)] w-14">
                      #{opNum}
                    </span>
                    <span className="text-sm text-[var(--ink)]">@{op.x_handle}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs tracking-[0.1em]">
                    <span className="text-[var(--ink-dim)]">{rank.name}</span>
                    <span className="text-[var(--red)] w-16 text-right">
                      {String(op.stripes).padStart(2, "0")} STRIPE{op.stripes === 1 ? "" : "S"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />

      {selected && (
        <OperativeModal operative={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
