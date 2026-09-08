import { NextResponse } from "next/server";
import { getWall } from "@/lib/store";

export async function GET() {
  const operatives = await getWall(200);
  return NextResponse.json({ operatives });
}
