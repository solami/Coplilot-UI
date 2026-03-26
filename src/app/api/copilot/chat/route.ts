import { mockStreamResponse } from "@/lib/copilot-client";

// POST /api/copilot/chat - Send a message and stream response via SSE
export async function POST(request: Request) {
  const body = await request.json();
  const { prompt } = body;

  // Create a readable stream for SSE
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Use mock streaming for now
        // In production, this would use the real Copilot SDK:
        //   session.on("assistant.message_delta", (event) => { ... })
        //   session.on("tool.call", (event) => { ... })
        //   await session.send({ prompt });

        for await (const event of mockStreamResponse(prompt)) {
          const data = JSON.stringify(event);
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        }
      } catch (error) {
        const errorEvent = JSON.stringify({
          type: "error",
          error: String(error),
        });
        controller.enqueue(encoder.encode(`data: ${errorEvent}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
