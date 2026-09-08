"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toPng } from "html-to-image";
import { AmbientOverlay } from "@/components/AmbientOverlay";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useSession } from "@/lib/useSession";
import { getRankForStripes } from "@/data/ranks";
import { COPY } from "@/data/copy";
import type { Operative } from "@/lib/types";

export default function SharePage() {
  const router = useRouter();
  const { handle, loaded } = useSession();
  const [operative, setOperative] = useState<Operative | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

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
      });
  }, [loaded, handle, router]);

  async function handleDownload() {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3,
        backgroundColor: "#0a0a0a",
      });
      const link = document.createElement("a");
      link.download = `shiesty-file-${operative?.x_handle ?? "operative"}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setDownloading(false);
    }
  }

  function handleShareX() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      COPY.shareIntentText
    )}`;
    window.open(url, "_blank", "noreferrer");
  }

  if (!operative) {
    return (
      <div className="relative flex flex-1 flex-col items-center justify-center min-h-screen">
        <p className="text-xs tracking-[0.15em] text-[var(--ink-dim)]">&gt; LOADING...</p>
      </div>
    );
  }

  const rank = getRankForStripes(operative.stripes);
  const opNum = String(operative.operative_number).padStart(4, "0");

  return (
    <div className="relative flex flex-col flex-1 min-h-screen">
      <AmbientOverlay />
      <Navigation />
      <main className="relative z-10 flex-1 flex flex-col items-center px-6 py-14">
        <div className="w-full max-w-sm flex flex-col items-center gap-6">
          {/* The actual shareable card - captured via html-to-image */}
          <div
            ref={cardRef}
            className="w-full bg-[#0a0a0a] border-2 border-[var(--ink-faint)] px-7 py-7 relative"
          >
            <div className="absolute top-4 right-4 text-[8px] tracking-[0.15em] text-[var(--ink-faint)] rotate-[6deg] border border-[var(--ink-faint)] px-1.5 py-0.5">
              CLASSIFIED
            </div>

            <p className="font-display text-xs tracking-[0.35em] text-[var(--ink-dim)]">
              PROJECT SHIESTY
            </p>
            <p className="text-[10px] tracking-[0.15em] text-[var(--ink-faint)] mt-1">
              CASE FILE: {COPY.caseFile.replace("CASE FILE ", "")}
            </p>

            <p className="font-display text-2xl tracking-[0.1em] text-[var(--ink)] mt-6">
              OPERATIVE #{opNum}
            </p>
            <p className="text-sm text-[var(--ink-dim)] mt-1">@{operative.x_handle}</p>

            <div className="mt-6 grid grid-cols-2 gap-y-3 text-xs tracking-[0.08em]">
              <div>
                <p className="text-[var(--ink-faint)] text-[10px]">RANK</p>
                <p className="text-[var(--ink)] mt-0.5">{rank.name}</p>
              </div>
              <div>
                <p className="text-[var(--ink-faint)] text-[10px]">STRIPES</p>
                <p className="text-[var(--ink)] mt-0.5">
                  {String(operative.stripes).padStart(2, "0")}
                </p>
              </div>
              <div>
                <p className="text-[var(--ink-faint)] text-[10px]">STATUS</p>
                <p className="text-[var(--red)] mt-0.5">ACTIVE</p>
              </div>
            </div>

            <div className="mt-7 pt-4 border-t border-[var(--ink-faint)] flex items-center justify-between">
              <p className="text-[8px] tracking-[0.15em] text-[var(--ink-faint)]">
                SN-{opNum}-{operative.x_handle.slice(0, 3).toUpperCase()}
              </p>
              <div className="flex gap-[2px]">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="w-[2px] h-4 bg-[var(--ink-faint)]" />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex-1 inline-flex items-center justify-center gap-2 border border-[var(--line)] px-5 py-3 text-xs tracking-[0.15em] text-[var(--ink)] hover:border-[var(--red)] hover:text-white transition-colors disabled:opacity-40"
            >
              [ {downloading ? "SAVING..." : "DOWNLOAD FILE"} ]
            </button>
            <button
              onClick={handleShareX}
              className="flex-1 inline-flex items-center justify-center gap-2 border border-[var(--line)] px-5 py-3 text-xs tracking-[0.15em] text-[var(--ink)] hover:border-[var(--red)] hover:text-white transition-colors"
            >
              [ SHARE ON X ]
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
