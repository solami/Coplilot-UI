export type ThreadStatus = "running" | "completed" | "error" | "idle";
export type AgentState = "idle" | "thinking" | "executing" | "reading" | "writing" | "error";
export type MessageRole = "user" | "assistant";

export interface Thread {
  id: string;
  title: string;
  status: ThreadStatus;
  model: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  projectId: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  toolCalls?: ToolCall[];
  isStreaming?: boolean;
}

export interface ToolCall {
  id: string;
  name: string;
  status: "running" | "completed" | "error";
  input?: string;
  output?: string;
  duration?: number;
}

export interface Project {
  id: string;
  name: string;
  threads: Thread[];
}
