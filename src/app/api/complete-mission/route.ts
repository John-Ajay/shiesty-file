import { NextRequest, NextResponse } from "next/server";
import { completeMission, getOperative } from "@/lib/store";
import { getMission } from "@/data/missions";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const handle = typeof body?.handle === "string" ? body.handle : "";
  const missionNumber = typeof body?.missionNumber === "string" ? body.missionNumber : "";

  if (!handle || !missionNumber) {
    return NextResponse.json({ error: "MALFORMED REQUEST." }, { status: 400 });
  }

  const operative = await getOperative(handle);
  if (!operative) {
    return NextResponse.json({ error: "OPERATIVE NOT FOUND." }, { status: 404 });
  }

  const mission = getMission(missionNumber);
  if (!mission || !mission.active) {
    return NextResponse.json({ error: "MISSION NOT AVAILABLE." }, { status: 404 });
  }

  const result = await completeMission(handle, missionNumber, mission.stripeReward);
  return NextResponse.json(result);
}
