import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getRankForStripes } from "@/data/ranks";
import type { Operative } from "@/lib/types";

// -----------------------------------------------------------------------
// Supabase-backed data layer. Same five exported functions as before
// (formerly backed by a local JSON file) — nothing in src/app/api needs
// to change to use this version.
//
// Expects these tables to already exist (see README.md for the SQL):
//   operatives(id, operative_number, x_handle, stripes, rank,
//              clearance_level, missions_completed, created_at, updated_at)
//   missions(id, mission_number, title, description, stripe_reward,
//            active, created_at)
//   operative_missions(id, operative_id, mission_id, completed,
//                       completed_at) — unique (operative_id, mission_id)
// -----------------------------------------------------------------------

export function normalizeHandle(raw: string): string {
  return raw.trim().replace(/^@/, "").toLowerCase();
}

// Generates a random, non-sequential-looking 4 digit operative number.
// Retries on the rare unique-constraint collision.
function randomOperativeNumber(): number {
  return Math.floor(1 + Math.random() * 9998); // 1..9999
}

export async function getOrCreateOperative(
  handle: string
): Promise<{ operative: Operative; isNew: boolean }> {
  const key = normalizeHandle(handle);

  const { data: existing, error: selectError } = await supabaseAdmin
    .from("operatives")
    .select("*")
    .eq("x_handle", key)
    .maybeSingle();

  if (selectError) throw new Error(selectError.message);
  if (existing) return { operative: existing as Operative, isNew: false };

  // Try a handful of times in case of a rare operative_number collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    const now = new Date().toISOString();
    const { data: inserted, error: insertError } = await supabaseAdmin
      .from("operatives")
      .insert({
        operative_number: randomOperativeNumber(),
        x_handle: key,
        stripes: 0,
        rank: getRankForStripes(0).name,
        clearance_level: 1,
        missions_completed: 0,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (!insertError) {
      return { operative: inserted as Operative, isNew: true };
    }

    // 23505 = unique_violation. Retry on operative_number clash;
    // otherwise it's likely a x_handle race (someone else just created
    // this operative) — re-fetch and return that instead.
    if (insertError.code === "23505") {
      const { data: raceWinner } = await supabaseAdmin
        .from("operatives")
        .select("*")
        .eq("x_handle", key)
        .maybeSingle();
      if (raceWinner) {
        return { operative: raceWinner as Operative, isNew: false };
      }
      continue; // was an operative_number clash — retry with a new number
    }

    throw new Error(insertError.message);
  }

  throw new Error("Could not create operative after several attempts.");
}

export async function getOperative(handle: string): Promise<Operative | null> {
  const key = normalizeHandle(handle);
  const { data, error } = await supabaseAdmin
    .from("operatives")
    .select("*")
    .eq("x_handle", key)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as Operative) ?? null;
}

export async function hasCompletedMission(
  handle: string,
  missionNumber: string
): Promise<boolean> {
  const key = normalizeHandle(handle);

  const { data, error } = await supabaseAdmin
    .from("operative_missions")
    .select("id, operatives!inner(x_handle), missions!inner(mission_number)")
    .eq("operatives.x_handle", key)
    .eq("missions.mission_number", missionNumber)
    .eq("completed", true)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return Boolean(data);
}

export async function completeMission(
  handle: string,
  missionNumber: string,
  stripeReward: number
): Promise<{ operative: Operative; alreadyCompleted: boolean }> {
  const key = normalizeHandle(handle);

  const { data: operative, error: opError } = await supabaseAdmin
    .from("operatives")
    .select("*")
    .eq("x_handle", key)
    .maybeSingle();

  if (opError) throw new Error(opError.message);
  if (!operative) throw new Error("Operative not found");

  const { data: mission, error: missionError } = await supabaseAdmin
    .from("missions")
    .select("*")
    .eq("mission_number", missionNumber)
    .maybeSingle();

  if (missionError) throw new Error(missionError.message);
  if (!mission) throw new Error("Mission not found");

  const now = new Date().toISOString();

  // The unique constraint on (operative_id, mission_id) is what actually
  // enforces "no farming stripes" at the database level. If this insert
  // hits that constraint, the mission was already completed.
  const { error: linkError } = await supabaseAdmin.from("operative_missions").insert({
    operative_id: operative.id,
    mission_id: mission.id,
    completed: true,
    completed_at: now,
  });

  if (linkError) {
    if (linkError.code === "23505") {
      return { operative: operative as Operative, alreadyCompleted: true };
    }
    throw new Error(linkError.message);
  }

  const newStripes = operative.stripes + stripeReward;
  const { data: updated, error: updateError } = await supabaseAdmin
    .from("operatives")
    .update({
      stripes: newStripes,
      rank: getRankForStripes(newStripes).name,
      missions_completed: operative.missions_completed + 1,
      updated_at: now,
    })
    .eq("id", operative.id)
    .select()
    .single();

  if (updateError) throw new Error(updateError.message);

  return { operative: updated as Operative, alreadyCompleted: false };
}

export async function getWall(limit = 100): Promise<Operative[]> {
  const { data, error } = await supabaseAdmin
    .from("operatives")
    .select("*")
    .order("stripes", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data as Operative[]) ?? [];
}