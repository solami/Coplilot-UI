import { Project, Thread, Message, ToolCall } from "@/types";

function tc(id: string, name: string, status: "running" | "completed" | "error", input?: string, output?: string, duration?: number): ToolCall {
  return { id, name, status, input, output, duration };
}

function msg(id: string, role: "user" | "assistant", content: string, timestamp: string, toolCalls?: ToolCall[], isStreaming?: boolean): Message {
  return { id, role, content, timestamp, toolCalls, isStreaming };
}

const threadCmux1: Thread = {
  id: "t-cmux-1",
  title: "悪意コード調査を徹底する」}ERR...",
  status: "completed",
  model: "カスタム",
  projectId: "cmux",
  createdAt: new Date(Date.now() - 21 * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - 21 * 86400000).toISOString(),
  messages: [
    msg("m1", "user", "悪意のあるコードがないか徹底的に調査してください", new Date(Date.now() - 21 * 86400000).toISOString()),
    msg("m2", "assistant", "コードベースを調査します。セキュリティ上の問題がないか確認します。", new Date(Date.now() - 21 * 86400000).toISOString(), [
      tc("tc1", "read_file", "completed", "src/main.ts", "Read 120 lines", 95),
      tc("tc2", "execute_command", "completed", "npm audit", "found 0 vulnerabilities", 2400),
    ]),
  ],
};

const threadCopilotCli1: Thread = {
  id: "t-copilot-1",
  title: "聞いてもいい？",
  status: "completed",
  model: "カスタム",
  projectId: "copilot-cli",
  createdAt: new Date(Date.now() - 21 * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - 21 * 86400000).toISOString(),
  messages: [
    msg("m3", "user", "聞いてもいい？", new Date(Date.now() - 21 * 86400000).toISOString()),
    msg("m4", "assistant", "もちろんです！何でもお聞きください。", new Date(Date.now() - 21 * 86400000).toISOString()),
  ],
};

const threadCopilotCli2: Thread = {
  id: "t-copilot-2",
  title: "Find headlessオプション",
  status: "completed",
  model: "カスタム",
  projectId: "copilot-cli",
  createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  messages: [],
};

const threadOpencode: Thread = {
  id: "t-opencode-1",
  title: "解説コーディングエージェント機...",
  status: "completed",
  model: "カスタム",
  projectId: "opencode",
  createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  messages: [],
};

const threadNeodev1: Thread = {
  id: "t-neodev-1",
  title: "Copilotのacpがうまくいってい...",
  status: "completed",
  model: "カスタム",
  projectId: "neodev",
  createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  messages: [],
};

const threadNeodev2: Thread = {
  id: "t-neodev-2",
  title: "プロンプトについて教えてくださ...",
  status: "completed",
  model: "カスタム",
  projectId: "neodev",
  createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  messages: [],
};

const threadNeodev3: Thread = {
  id: "t-neodev-3",
  title: "- copilot cli起動するディレクト...",
  status: "completed",
  model: "カスタム",
  projectId: "neodev",
  createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  messages: [],
};

const threadNeodev4: Thread = {
  id: "t-neodev-4",
  title: "GitLab",
  status: "completed",
  model: "カスタム",
  projectId: "neodev",
  createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  messages: [],
};

const threadNeodev5: Thread = {
  id: "t-neodev-5",
  title: "- orchestrator.go のパイプライ...",
  status: "completed",
  model: "カスタム",
  projectId: "neodev",
  createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  messages: [],
};

const threadNeodev6: Thread = {
  id: "t-neodev-6",
  title: "バックログのU004とU005は機...",
  status: "completed",
  model: "カスタム",
  projectId: "neodev",
  createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  messages: [],
};

const threadNeodev7: Thread = {
  id: "t-neodev-7",
  title: "GitHub Copilotに対して連携して...",
  status: "completed",
  model: "カスタム",
  projectId: "neodev",
  createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  messages: [],
};

export const mockProjects: Project[] = [
  {
    id: "cmux",
    name: "cmux",
    threads: [threadCmux1],
  },
  {
    id: "glab10",
    name: "glab10",
    threads: [],
  },
  {
    id: "copilot-cli",
    name: "copilot-cli",
    threads: [threadCopilotCli1, threadCopilotCli2],
  },
  {
    id: "opencode",
    name: "opencode",
    threads: [threadOpencode],
  },
  {
    id: "neodev",
    name: "neodev",
    threads: [
      threadNeodev1,
      threadNeodev2,
      threadNeodev3,
      threadNeodev4,
      threadNeodev5,
      threadNeodev6,
      threadNeodev7,
    ],
  },
];

export const models = [
  { id: "custom", name: "カスタム" },
  { id: "gpt-5", name: "GPT-5" },
  { id: "gpt-5.2-codex", name: "GPT-5.2 Codex" },
  { id: "claude-opus-4.6", name: "Claude Opus 4.6" },
  { id: "claude-sonnet-4.6", name: "Claude Sonnet 4.6" },
];

export const reasoningLevels = [
  { id: "low", name: "低" },
  { id: "medium", name: "中" },
  { id: "high", name: "高" },
];

export const suggestionCards = [
  {
    id: "s1",
    icon: "sparkles",
    title: "Build a classic Snake game in this repo.",
  },
  {
    id: "s2",
    icon: "pdf",
    title: "Create a one-page $pdf that summarizes this app.",
  },
  {
    id: "s3",
    icon: "pencil",
    title: "Create a plan to...",
  },
];
