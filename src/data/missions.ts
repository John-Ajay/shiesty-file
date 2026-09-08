export type Mission = {
  number: string; // "001"
  title: string;
  codename: string;
  objective: string;
  briefing: string[];
  stripeReward: number;
  active: boolean;
};

export const MISSIONS: Mission[] = [
  {
    number: "001",
    title: "MISSION 001",
    codename: "THE LOOKOUT",
    objective: "Find the hidden Shiesty mark.",
    briefing: [
      "Somewhere inside this operation, something doesn't belong.",
      "Find it.",
    ],
    stripeReward: 1,
    active: true,
  },
];

export function getMission(number: string): Mission | undefined {
  return MISSIONS.find((m) => m.number === number);
}
