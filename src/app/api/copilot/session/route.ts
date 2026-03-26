import { NextResponse } from "next/server";
import { createSession, getStatus } from "@/lib/copilot-client";

export async function POST(request: Request) {
  const { model = "gpt-5" } = await request.json();

  try {
    const handle = await createSession(model);
    return NextResponse.json({
      sessionId: `live-${Date.now()}`,
      model,
      mode: "live",
    });
  } catch {
    return NextResponse.json({
      sessionId: `mock-${Date.now()}`,
      model,
      mode: "mock",
      message: "Copilot CLIが接続されていません。デモモードで動作中です。",
    });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  return NextResponse.json({ success: true, sessionId: searchParams.get("sessionId") });
}
