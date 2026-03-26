import { NextResponse } from "next/server";
import { getCopilotStatus } from "@/lib/copilot-client";

// POST /api/copilot/session - Create a new session
export async function POST(request: Request) {
  const body = await request.json();
  const { model = "gpt-5" } = body;

  const status = getCopilotStatus();

  // In mock mode, return a simulated session
  if (status.mode === "mock") {
    return NextResponse.json({
      sessionId: `mock-${Date.now()}`,
      model,
      mode: "mock",
      message: "Running in demo mode. Install Copilot CLI for full functionality.",
    });
  }

  // In live mode, we'd create a real CopilotClient session
  // const client = new CopilotClient();
  // const session = await client.createSession({ model });
  return NextResponse.json({
    sessionId: `live-${Date.now()}`,
    model,
    mode: "live",
  });
}

// DELETE /api/copilot/session - End a session
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  return NextResponse.json({
    success: true,
    sessionId,
  });
}
