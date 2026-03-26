/**
 * Copilot SDK Client - Real connection to GitHub Copilot CLI
 *
 * Uses @github/copilot-sdk to communicate with the locally installed
 * Copilot CLI via JSON-RPC.
 */

import { CopilotClient, approveAll } from "@github/copilot-sdk";

// Singleton client
let client: InstanceType<typeof CopilotClient> | null = null;
let clientStarted = false;
let clientError: string | null = null;

export async function getClient(): Promise<InstanceType<typeof CopilotClient>> {
  if (client && clientStarted) return client;

  try {
    client = new CopilotClient();
    await client.start();
    clientStarted = true;
    clientError = null;
    return client;
  } catch (err) {
    clientError = String(err);
    throw new Error(`Copilot CLI connection failed: ${err}`);
  }
}

export interface SessionHandle {
  session: Awaited<ReturnType<InstanceType<typeof CopilotClient>["createSession"]>>;
}

export async function createSession(model = "gpt-5"): Promise<SessionHandle> {
  const cl = await getClient();
  const session = await cl.createSession({
    model,
    onPermissionRequest: approveAll,
  });
  return { session };
}

export function getStatus(): { available: boolean; error: string | null } {
  return {
    available: clientStarted && !clientError,
    error: clientError,
  };
}
