/**
 * Copilot SDK Client Manager
 *
 * This module manages the connection to GitHub Copilot CLI via @github/copilot-sdk.
 * In production, it creates a singleton CopilotClient that communicates with
 * the locally installed Copilot CLI via JSON-RPC.
 *
 * When Copilot CLI is not available, it falls back to mock mode.
 */

export interface CopilotSession {
  id: string;
  model: string;
  isConnected: boolean;
}

export interface StreamEvent {
  type: "delta" | "tool_call" | "complete" | "error";
  content?: string;
  toolCall?: {
    name: string;
    input: string;
    status: "running" | "completed" | "error";
    output?: string;
  };
  error?: string;
}

// Check if Copilot CLI/SDK is available
let isCopilotAvailable = false;

async function checkCopilotAvailability(): Promise<boolean> {
  try {
    // Try to dynamically import the SDK
    // In production, @github/copilot-sdk would be installed
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = "@github/copilot-sdk";
    await import(/* webpackIgnore: true */ mod);
    return true;
  } catch {
    return false;
  }
}

// Initialize on module load
checkCopilotAvailability().then((available) => {
  isCopilotAvailable = available;
});

export function getCopilotStatus(): {
  available: boolean;
  mode: "live" | "mock";
} {
  return {
    available: isCopilotAvailable,
    mode: isCopilotAvailable ? "live" : "mock",
  };
}

/**
 * Mock streaming response generator for demo mode.
 * Simulates the behavior of real Copilot CLI responses.
 */
export async function* mockStreamResponse(
  prompt: string
): AsyncGenerator<StreamEvent> {
  // Simulate thinking delay
  await new Promise((r) => setTimeout(r, 500));

  // Emit a tool call
  yield {
    type: "tool_call",
    toolCall: {
      name: "read_file",
      input: "src/app/page.tsx",
      status: "running",
    },
  };

  await new Promise((r) => setTimeout(r, 800));

  yield {
    type: "tool_call",
    toolCall: {
      name: "read_file",
      input: "src/app/page.tsx",
      status: "completed",
      output: "Read 45 lines",
    },
  };

  // Stream text response
  const response = `I've analyzed your request regarding "${prompt}". Here's my approach:\n\n1. First, I'll review the current implementation\n2. Then apply the necessary changes\n3. Finally, verify everything works correctly\n\nLet me proceed with the implementation.`;

  for (let i = 0; i < response.length; i += 3) {
    yield {
      type: "delta",
      content: response.slice(i, i + 3),
    };
    await new Promise((r) => setTimeout(r, 15));
  }

  yield { type: "complete" };
}
