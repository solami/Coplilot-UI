"use client";

import { useState, useCallback } from "react";
import { TitleBar } from "./title-bar";
import { Sidebar } from "./sidebar/sidebar";
import { ChatPanel } from "./chat/chat-panel";
import { StatusBar } from "./status-bar";
import { mockProjects } from "@/lib/mock-data";
import { Message, Project, Thread } from "@/types";
import { generateId } from "@/lib/utils";

export function AppShell() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [activeProjectId, setActiveProjectId] = useState("cmux");
  const [selectedModel, setSelectedModel] = useState("custom");
  const [selectedReasoning, setSelectedReasoning] = useState("medium");

  // Find active thread across all projects
  const activeThread = projects
    .flatMap((p) => p.threads)
    .find((t) => t.id === activeThreadId);
  const messages = activeThread?.messages || [];

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const handleSelectThread = useCallback((threadId: string) => {
    setActiveThreadId(threadId);
    // Also set the project for this thread
    for (const p of projects) {
      if (p.threads.some((t) => t.id === threadId)) {
        setActiveProjectId(p.id);
        break;
      }
    }
  }, [projects]);

  const handleNewThread = useCallback(() => {
    const newThread: Thread = {
      id: generateId(),
      title: "新しいスレッド",
      status: "idle",
      model: selectedModel,
      projectId: activeProjectId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProjectId
          ? { ...p, threads: [newThread, ...p.threads] }
          : p
      )
    );
    setActiveThreadId(newThread.id);
  }, [selectedModel, activeProjectId]);

  const handleSend = useCallback(
    (content: string) => {
      let threadId = activeThreadId;

      // If no active thread, create one
      if (!threadId) {
        const newThread: Thread = {
          id: generateId(),
          title: content.slice(0, 40) + (content.length > 40 ? "..." : ""),
          status: "running",
          model: selectedModel,
          projectId: activeProjectId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [],
        };
        threadId = newThread.id;
        setProjects((prev) =>
          prev.map((p) =>
            p.id === activeProjectId
              ? { ...p, threads: [newThread, ...p.threads] }
              : p
          )
        );
        setActiveThreadId(threadId);
      }

      const finalThreadId = threadId;

      // Add user message
      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content,
        timestamp: new Date().toISOString(),
      };

      const addMessageToThread = (msg: Message) => {
        setProjects((prev) =>
          prev.map((p) => ({
            ...p,
            threads: p.threads.map((t) =>
              t.id === finalThreadId
                ? { ...t, messages: [...t.messages, msg], updatedAt: new Date().toISOString() }
                : t
            ),
          }))
        );
      };

      const updateLastMessage = (updater: (m: Message) => Message) => {
        setProjects((prev) =>
          prev.map((p) => ({
            ...p,
            threads: p.threads.map((t) => {
              if (t.id !== finalThreadId) return t;
              const msgs = [...t.messages];
              if (msgs.length > 0) {
                msgs[msgs.length - 1] = updater(msgs[msgs.length - 1]);
              }
              return { ...t, messages: msgs };
            }),
          }))
        );
      };

      addMessageToThread(userMessage);

      // Simulate assistant response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: generateId(),
          role: "assistant",
          content: "",
          timestamp: new Date().toISOString(),
          isStreaming: true,
          toolCalls: [
            {
              id: generateId(),
              name: "read_file",
              status: "running",
              input: "src/app/page.tsx",
            },
          ],
        };

        addMessageToThread(assistantMessage);

        // Tool completion
        setTimeout(() => {
          updateLastMessage((m) => ({
            ...m,
            toolCalls: m.toolCalls?.map((tc) => ({
              ...tc,
              status: "completed" as const,
              output: "Read 45 lines from src/app/page.tsx",
              duration: 120,
            })),
          }));

          // Stream text
          const responseText = `ご質問を確認しました。以下の手順で対応します：

1. **プロジェクト構造の確認** - 現在のファイル構成を分析します
2. **必要な変更の特定** - 影響範囲を調査します
3. **実装** - コードの変更を行います

\`\`\`typescript
// Implementation example
export function processRequest(input: string): Result {
  const validated = validateInput(input);
  return {
    data: transform(validated),
    status: 'success'
  };
}
\`\`\`

変更を適用しました。テストも全て通過しています。`;

          let charIndex = 0;
          const streamInterval = setInterval(() => {
            charIndex += 4;
            if (charIndex >= responseText.length) {
              charIndex = responseText.length;
              clearInterval(streamInterval);
            }
            const currentContent = responseText.substring(0, charIndex);
            const stillStreaming = charIndex < responseText.length;

            updateLastMessage((m) => ({
              ...m,
              content: currentContent,
              isStreaming: stillStreaming,
            }));
          }, 20);
        }, 1200);
      }, 600);
    },
    [activeThreadId, activeProjectId, selectedModel]
  );

  const threadTitle = activeThread?.title || "新しいスレッド";

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#e8e8e8] p-1">
      <div className="w-full h-full max-w-[1800px] rounded-xl border border-[#c8c8c8] shadow-xl overflow-hidden flex flex-col bg-[var(--color-bg-primary)]">
        {/* Title bar */}
        <TitleBar
          threadTitle={threadTitle}
          agentStatus="Idle"
        />

        {/* Main content */}
        <div className="flex-1 flex min-h-0">
          {/* Sidebar */}
          <Sidebar
            projects={projects}
            activeThreadId={activeThreadId}
            onSelectThread={handleSelectThread}
            onNewThread={handleNewThread}
            onSettings={() => {}}
          />

          {/* Chat area */}
          <ChatPanel
            messages={messages}
            selectedModel={selectedModel}
            selectedReasoning={selectedReasoning}
            activeProjectName={activeProject.name}
            projects={projects}
            onSend={handleSend}
            onModelChange={setSelectedModel}
            onReasoningChange={setSelectedReasoning}
            onSelectProject={(id) => {
              setActiveProjectId(id);
              setActiveThreadId(null);
            }}
          />
        </div>

        {/* Status bar */}
        <StatusBar
          environment="ローカル環境"
          permissions="デフォルト権限"
          branch="main"
        />
      </div>
    </div>
  );
}
