export type ThreadStatus = "running" | "completed" | "reviewing" | "error" | "idle";
export type AgentState = "idle" | "thinking" | "executing" | "reading" | "writing" | "error";
export type MessageRole = "user" | "assistant";
export type ViewMode = "chat" | "review" | "terminal" | "settings";

export interface Thread {
  id: string;
  title: string;
  status: ThreadStatus;
  model: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  project: string;
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

export interface DiffFile {
  filename: string;
  status: "added" | "modified" | "deleted";
  additions: number;
  deletions: number;
  hunks: DiffHunk[];
}

export interface DiffHunk {
  header: string;
  lines: DiffLine[];
}

export interface DiffLine {
  type: "added" | "removed" | "context";
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export interface Project {
  id: string;
  name: string;
  path: string;
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  action: string;
  detail: string;
  type: "info" | "success" | "warning" | "error";
}
