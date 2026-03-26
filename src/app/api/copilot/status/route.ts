import { NextResponse } from "next/server";
import { getCopilotStatus } from "@/lib/copilot-client";

// GET /api/copilot/status - Check Copilot CLI connection status
export async function GET() {
  const status = getCopilotStatus();

  return NextResponse.json({
    ...status,
    timestamp: new Date().toISOString(),
    setupGuide: !status.available
      ? {
          message: "Copilot CLI is not detected. To enable full functionality:",
          steps: [
            "Install Copilot CLI: npm install -g @github/copilot-cli",
            "Authenticate: copilot auth login",
            "Install the SDK: npm install @github/copilot-sdk",
            "Set GITHUB_TOKEN in your .env.local file",
          ],
        }
      : undefined,
  });
}
