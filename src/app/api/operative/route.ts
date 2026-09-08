import { NextRequest, NextResponse } from "next/server";
import { getOperative } from "@/lib/store";

export async function GET(req: NextRequest) {
  const handle = req.nextUrl.searchParams.get("handle") ?? "";
  if (!handle) {
    return NextResponse.json({ error: "HANDLE REQUIRED." }, { status: 400 });
  }
  const operative = await getOperative(handle);
  if (!operative) {
    return NextResponse.json({ error: "NO RECORD FOUND." }, { status: 404 });
  }
  return NextResponse.json({ operative });
}
