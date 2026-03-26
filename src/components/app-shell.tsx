"use client";

import { useState, useCallback, useRef } from "react";
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
  const [agentStatus, setAgentStatus] = useState("Idle");
  const streamTimers = useRef<ReturnType<typeof setInterval>[]>([]);

  // Find active thread across all projects
  const activeThread = projects
    .flatMap((p) => p.threads)
    .find((t) => t.id === activeThreadId);
  const messages = activeThread?.messages || [];
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const handleSelectThread = useCallback((threadId: string) => {
    setActiveThreadId(threadId);
    for (const p of projects) {
      if (p.threads.some((t) => t.id === threadId)) {
        setActiveProjectId(p.id);
        break;
      }
    }
  }, [projects]);

  const handleNewThread = useCallback(() => {
    const id = generateId();
    const newThread: Thread = {
      id,
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
    setActiveThreadId(id);
  }, [selectedModel, activeProjectId]);

  // Helper: update a thread's messages using functional state update
  const updateThread = useCallback((threadId: string, updater: (t: Thread) => Thread) => {
    setProjects((prev) =>
      prev.map((p) => ({
        ...p,
        threads: p.threads.map((t) => (t.id === threadId ? updater(t) : t)),
      }))
    );
  }, []);

  const handleSend = useCallback(
    (content: string) => {
      // Clear any previous stream timers
      streamTimers.current.forEach(clearInterval);
      streamTimers.current = [];

      // Determine thread - create if needed
      let targetThreadId = activeThreadId;

      if (!targetThreadId) {
        targetThreadId = generateId();
        const newThread: Thread = {
          id: targetThreadId,
          title: content.slice(0, 40) + (content.length > 40 ? "..." : ""),
          status: "running",
          model: selectedModel,
          projectId: activeProjectId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [],
        };
        // Create thread with the user message already included
        const userMessage: Message = {
          id: generateId(),
          role: "user",
          content,
          timestamp: new Date().toISOString(),
        };
        newThread.messages = [userMessage];

        setProjects((prev) =>
          prev.map((p) =>
            p.id === activeProjectId
              ? { ...p, threads: [newThread, ...p.threads] }
              : p
          )
        );
        setActiveThreadId(targetThreadId);
      } else {
        // Add user message to existing thread
        const userMessage: Message = {
          id: generateId(),
          role: "user",
          content,
          timestamp: new Date().toISOString(),
        };
        updateThread(targetThreadId, (t) => ({
          ...t,
          messages: [...t.messages, userMessage],
          updatedAt: new Date().toISOString(),
          status: "running",
        }));
      }

      const tid = targetThreadId;
      setAgentStatus("Thinking...");

      // Phase 1: Add assistant message with tool call (after short delay)
      const assistantMsgId = generateId();
      setTimeout(() => {
        setAgentStatus("Reading...");
        const assistantMessage: Message = {
          id: assistantMsgId,
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
        updateThread(tid, (t) => ({
          ...t,
          messages: [...t.messages, assistantMessage],
        }));

        // Phase 2: Complete tool call
        setTimeout(() => {
          setAgentStatus("Writing...");
          updateThread(tid, (t) => ({
            ...t,
            messages: t.messages.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    toolCalls: m.toolCalls?.map((tc) => ({
                      ...tc,
                      status: "completed" as const,
                      output: "Read 45 lines from src/app/page.tsx",
                      duration: 120,
                    })),
                  }
                : m
            ),
          }));

          // Phase 3: Stream text response
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
          const interval = setInterval(() => {
            charIndex += 4;
            const done = charIndex >= responseText.length;
            if (done) {
              charIndex = responseText.length;
              clearInterval(interval);
              setAgentStatus("Idle");
              updateThread(tid, (t) => ({
                ...t,
                status: "completed",
              }));
            }

            updateThread(tid, (t) => ({
              ...t,
              messages: t.messages.map((m) =>
                m.id === assistantMsgId
                  ? {
                      ...m,
                      content: responseText.substring(0, charIndex),
                      isStreaming: !done,
                    }
                  : m
              ),
            }));
          }, 25);
          streamTimers.current.push(interval);
        }, 1000);
      }, 500);
    },
    [activeThreadId, activeProjectId, selectedModel, updateThread]
  );

  const threadTitle = activeThread?.title || "新しいスレッド";

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#e8e8e8] p-1">
      <div className="w-full h-full max-w-[1800px] rounded-xl border border-[#c8c8c8] shadow-xl overflow-hidden flex flex-col bg-[var(--color-bg-primary)]">
        <TitleBar
          threadTitle={threadTitle}
          agentStatus={agentStatus}
        />

        <div className="flex-1 flex min-h-0">
          <Sidebar
            projects={projects}
            activeThreadId={activeThreadId}
            onSelectThread={handleSelectThread}
            onNewThread={handleNewThread}
            onSettings={() => {}}
          />

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

        <StatusBar
          environment="ローカル環境"
          permissions="デフォルト権限"
          branch="main"
        />
      </div>
    </div>
  );
}
