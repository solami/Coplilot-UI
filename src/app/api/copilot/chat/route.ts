import { getClient } from "@/lib/copilot-client";
import { approveAll } from "@github/copilot-sdk";

export async function POST(request: Request) {
  const { prompt, model = "gpt-5" } = await request.json();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: Record<string, unknown>) => {
        try { controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`)); } catch { /* closed */ }
      };

      try {
        const client = await getClient();
        const session = await client.createSession({
          model,
          onPermissionRequest: approveAll,
        });

        session.on("assistant.message_delta", (event) => {
          const delta = (event as { data?: { deltaContent?: string } }).data?.deltaContent;
          if (delta) send({ type: "delta", content: delta });
        });

        session.on("tool.execution_start", (event) => {
          const d = (event as { data?: { toolName?: string; input?: string } }).data;
          send({ type: "tool_call", toolCall: { name: d?.toolName, input: d?.input, status: "running" } });
        });

        session.on("tool.execution_complete", (event) => {
          const d = (event as { data?: { toolName?: string; output?: string; duration?: number } }).data;
          send({ type: "tool_call", toolCall: { name: d?.toolName, output: d?.output, status: "completed", duration: d?.duration } });
        });

        session.on("assistant.message", () => {
          send({ type: "complete" });
        });

        session.on("session.idle", () => {
          send({ type: "done" });
          try { controller.close(); } catch { /* already closed */ }
        });

        session.on("session.error", (event) => {
          send({ type: "error", error: String((event as { data?: { message?: string } }).data?.message) });
        });

        await session.send({ prompt });
      } catch (error) {
        // Fallback to mock if Copilot CLI unavailable
        send({ type: "info", message: `Copilot CLI未接続: ${String(error).slice(0, 100)}` });

        await new Promise((r) => setTimeout(r, 300));
        send({ type: "tool_call", toolCall: { name: "read_file", input: "src/app/page.tsx", status: "running" } });
        await new Promise((r) => setTimeout(r, 600));
        send({ type: "tool_call", toolCall: { name: "read_file", input: "src/app/page.tsx", status: "completed", output: "Read 45 lines" } });

        const response = `ご質問を確認しました。Copilot CLIが接続されていないため、デモモードで応答しています。

実際にCopilot CLIを接続するには:
1. \`npm install -g @github/copilot-cli\` でCLIをインストール
2. \`copilot auth login\` で認証
3. アプリを再起動

接続後は、ファイルの読み書き、コマンド実行、コード生成などの機能がフルに使えるようになります。`;

        for (let i = 0; i < response.length; i += 3) {
          send({ type: "delta", content: response.slice(i, i + 3) });
          await new Promise((r) => setTimeout(r, 15));
        }
        send({ type: "done" });
        try { controller.close(); } catch { /* already closed */ }
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
  });
}
