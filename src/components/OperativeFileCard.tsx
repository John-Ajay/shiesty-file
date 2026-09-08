import type { Operative } from "@/lib/types";
import { getRankForStripes } from "@/data/ranks";

export function OperativeFileCard({
  operative,
  missionStatus,
}: {
  operative: Operative;
  missionStatus?: string;
}) {
  const rank = getRankForStripes(operative.stripes);
  const opNum = String(operative.operative_number).padStart(4, "0");

  return (
    <div className="relative border border-[var(--line)] bg-[var(--bg-raised)] px-6 py-6 w-full">
      <div className="absolute top-3 right-4 text-[9px] tracking-[0.15em] text-[var(--ink-faint)]">
        CASE NO. 0001
      </div>

      <p className="font-display text-xs tracking-[0.3em] text-[var(--ink-dim)]">
        OPERATIVE FILE
      </p>

      <div className="mt-4 grid grid-cols-2 gap-y-4 gap-x-4 text-xs tracking-[0.08em]">
        <Field label="OPERATIVE ID" value={`#${opNum}`} />
        <Field label="X HANDLE" value={`@${operative.x_handle}`} />
        <Field label="STATUS" value="ACTIVE" accent />
        <Field label="STRIPES" value={String(operative.stripes).padStart(2, "0")} />
        <Field label="RANK" value={rank.name} />
        <Field label="CLEARANCE" value={`LEVEL ${String(operative.clearance_level).padStart(2, "0")}`} />
      </div>

      {missionStatus && (
        <div className="mt-5 pt-4 border-t border-[var(--line)] flex justify-between text-xs tracking-[0.08em]">
          <span className="text-[var(--ink-faint)]">MISSION STATUS</span>
          <span className="text-[var(--ink)]">{missionStatus}</span>
        </div>
      )}

      <div className="mt-5 pt-3 border-t border-[var(--line)] text-[9px] tracking-[0.15em] text-[var(--ink-faint)] leading-relaxed">
        PROJECT SHIESTY <br />
        CLASSIFIED <br />
        PROPERTY OF THE OPERATION
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p className="text-[var(--ink-faint)] text-[10px]">{label}</p>
      <p className={accent ? "text-[var(--red)] mt-0.5" : "text-[var(--ink)] mt-0.5"}>
        {value}
      </p>
    </div>
  );
}
