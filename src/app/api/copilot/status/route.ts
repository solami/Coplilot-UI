import { NextResponse } from "next/server";
import { getStatus } from "@/lib/copilot-client";

export async function GET() {
  const status = getStatus();
  return NextResponse.json({
    ...status,
    timestamp: new Date().toISOString(),
    setupGuide: !status.available
      ? {
          message: "Copilot CLIが検出されません。以下の手順でセットアップしてください：",
          steps: [
            "npm install -g @github/copilot-cli",
            "copilot auth login",
            "アプリを再起動",
          ],
        }
      : undefined,
  });
}
