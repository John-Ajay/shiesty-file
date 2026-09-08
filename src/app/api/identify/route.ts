import { NextRequest, NextResponse } from "next/server";
import { getOrCreateOperative } from "@/lib/store";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const handle = typeof body?.handle === "string" ? body.handle.trim() : "";

  if (!handle) {
    return NextResponse.json(
      { error: "IDENTITY REQUIRED. FIELD CANNOT BE EMPTY." },
      { status: 400 }
    );
  }

  if (handle.length > 15 || !/^@?[A-Za-z0-9_]{1,15}$/.test(handle)) {
    return NextResponse.json(
      { error: "INVALID FORMAT. HANDLE NOT RECOGNIZED." },
      { status: 400 }
    );
  }

  const { operative, isNew } = await getOrCreateOperative(handle);
  return NextResponse.json({ operative, isNew });
}
