import { promises as fs } from "fs";
import path from "path";
import { getRankForStripes } from "@/data/ranks";
import type { Operative } from "@/lib/types";

// -----------------------------------------------------------------------
// This is a local, file-backed stand-in for the Supabase `operatives` table
// described in the spec. It implements the exact same read/write operations
// the real Supabase-backed API routes would need, so swapping in Supabase
// later is a matter of replacing the functions in this file only — nothing
// in /app/api needs to change shape.
//
// Schema mirrors:
//   operatives(id, operative_number, x_handle, stripes, rank,
//              clearance_level, missions_completed, created_at, updated_at)
//   operative_missions(id, operative_id, mission_id, completed, completed_at)
// -----------------------------------------------------------------------

const DB_PATH = path.join(process.cwd(), ".data", "db.json");

type DB = {
  operatives: Record<string, Operative>; // key: normalized handle
  completedMissions: Record<string, string[]>; // handle -> mission_number[]
  nextOperativeNumber: number;
};

async function ensureDb(): Promise<DB> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(raw) as DB;
  } catch {
    const fresh: DB = {
      operatives: {},
      completedMissions: {},
      nextOperativeNumber: 1,
    };
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(fresh, null, 2));
    return fresh;
  }
}

async function saveDb(db: DB) {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

export function normalizeHandle(raw: string): string {
  return raw.trim().replace(/^@/, "").toLowerCase();
}

function generateOperativeNumber(seq: number): number {
  // Deterministic-looking 4 digit number, not just sequential-looking 0001,0002...
  // to feel more like a real classified record. Still guaranteed unique via seq.
  const base = (seq * 733) % 10000;
  return base === 0 ? seq % 10000 || 1 : base;
}

export async function getOrCreateOperative(handle: string): Promise<{
  operative: Operative;
  isNew: boolean;
}> {
  const key = normalizeHandle(handle);
  const db = await ensureDb();

  const existing = db.operatives[key];
  if (existing) {
    return { operative: existing, isNew: false };
  }

  const seq = db.nextOperativeNumber;
  db.nextOperativeNumber += 1;

  const now = new Date().toISOString();
  const operative: Operative = {
    id: key,
    operative_number: generateOperativeNumber(seq),
    x_handle: key,
    stripes: 0,
    rank: getRankForStripes(0).name,
    clearance_level: 1,
    missions_completed: 0,
    created_at: now,
    updated_at: now,
  };

  db.operatives[key] = operative;
  db.completedMissions[key] = [];
  await saveDb(db);

  return { operative, isNew: true };
}

export async function getOperative(handle: string): Promise<Operative | null> {
  const key = normalizeHandle(handle);
  const db = await ensureDb();
  return db.operatives[key] ?? null;
}

export async function hasCompletedMission(
  handle: string,
  missionNumber: string
): Promise<boolean> {
  const key = normalizeHandle(handle);
  const db = await ensureDb();
  return (db.completedMissions[key] ?? []).includes(missionNumber);
}

export async function completeMission(
  handle: string,
  missionNumber: string,
  stripeReward: number
): Promise<{ operative: Operative; alreadyCompleted: boolean }> {
  const key = normalizeHandle(handle);
  const db = await ensureDb();

  const existing = db.operatives[key];
  if (!existing) {
    throw new Error("Operative not found");
  }

  const completedList = db.completedMissions[key] ?? [];
  if (completedList.includes(missionNumber)) {
    return { operative: existing, alreadyCompleted: true };
  }

  const newStripes = existing.stripes + stripeReward;
  const updated: Operative = {
    ...existing,
    stripes: newStripes,
    rank: getRankForStripes(newStripes).name,
    missions_completed: existing.missions_completed + 1,
    updated_at: new Date().toISOString(),
  };

  db.operatives[key] = updated;
  db.completedMissions[key] = [...completedList, missionNumber];
  await saveDb(db);

  return { operative: updated, alreadyCompleted: false };
}

export async function getWall(limit = 100): Promise<Operative[]> {
  const db = await ensureDb();
  return Object.values(db.operatives)
    .sort((a, b) => b.stripes - a.stripes || (a.created_at < b.created_at ? 1 : -1))
    .slice(0, limit);
}
