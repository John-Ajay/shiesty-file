export type Rank = {
  threshold: number;
  name: string;
  tagline: string;
  code: string; // short classification code shown on file
};

// Ordered ascending by threshold. Add/edit ranks here only.
export const RANKS: Rank[] = [
  { threshold: 0, name: "UNCLASSIFIED", tagline: "No record on file.", code: "LVL.00" },
  { threshold: 1, name: "LOOKOUT", tagline: "You see what others miss.", code: "LVL.01" },
  { threshold: 3, name: "RUNNER", tagline: "Moves before questions are asked.", code: "LVL.02" },
  { threshold: 5, name: "HUSTLER", tagline: "Makes something from nothing.", code: "LVL.03" },
  { threshold: 10, name: "FIXER", tagline: "Cleans up what others can't.", code: "LVL.04" },
  { threshold: 25, name: "BOSS", tagline: "The operation answers to them.", code: "LVL.05" },
];

export function getRankForStripes(stripes: number): Rank {
  let current = RANKS[0];
  for (const r of RANKS) {
    if (stripes >= r.threshold) current = r;
  }
  return current;
}

export function getNextRank(stripes: number): Rank | null {
  const next = RANKS.find((r) => r.threshold > stripes);
  return next ?? null;
}
