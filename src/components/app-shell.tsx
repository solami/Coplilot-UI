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
  const abortRef = useRef<AbortController | null>(null);

  const activeThread = projects.flatMap((p) => p.threads).find((t) => t.id === activeThreadId);
  const messages = activeThread?.messages || [];
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const updateThread = useCallback((threadId: string, updater: (t: Thread) => Thread) => {
    setProjects((prev) =>
      prev.map((p) => ({ ...p, threads: p.threads.map((t) => (t.id === threadId ? updater(t) : t)) }))
    );
  }, []);

  const handleSelectThread = useCallback((threadId: string) => {
    setActiveThreadId(threadId);
    for (const p of projects) {
      if (p.threads.some((t) => t.id === threadId)) { setActiveProjectId(p.id); break; }
    }
  }, [projects]);

  const handleNewThread = useCallback(() => {
    const id = generateId();
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProjectId
          ? { ...p, threads: [{ id, title: "新しいスレッド", status: "idle" as const, model: selectedModel, projectId: activeProjectId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), messages: [] }, ...p.threads] }
          : p
      )
    );
    setActiveThreadId(id);
  }, [selectedModel, activeProjectId]);

  const handleSend = useCallback(
    async (content: string) => {
      abortRef.current?.abort();
      const abort = new AbortController();
      abortRef.current = abort;

      let tid = activeThreadId;
      const userMsg: Message = { id: generateId(), role: "user", content, timestamp: new Date().toISOString() };

      if (!tid) {
        tid = generateId();
        setProjects((prev) =>
          prev.map((p) => (p.id === activeProjectId ? { ...p, threads: [{ id: tid!, title: content.slice(0, 40) + (content.length > 40 ? "..." : ""), status: "running" as const, model: selectedModel, projectId: activeProjectId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), messages: [userMsg] }, ...p.threads] } : p))
        );
        setActiveThreadId(tid);
      } else {
        updateThread(tid, (t) => ({ ...t, messages: [...t.messages, userMsg], status: "running", updatedAt: new Date().toISOString() }));
      }

      const threadId = tid;
      setAgentStatus("Thinking...");
      const assistantId = generateId();
      updateThread(threadId, (t) => ({ ...t, messages: [...t.messages, { id: assistantId, role: "assistant" as const, content: "", timestamp: new Date().toISOString(), isStreaming: true, toolCalls: [] }] }));

      try {
        const res = await fetch("/api/copilot/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: content, model: selectedModel }), signal: abort.signal });
        const reader = res.body?.getReader();
        if (!reader) throw new Error("No reader");
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const event = JSON.parse(line.slice(6));
              if (event.type === "delta") {
                updateThread(threadId, (t) => ({ ...t, messages: t.messages.map((m) => m.id === assistantId ? { ...m, content: m.content + event.content } : m) }));
                setAgentStatus("Writing...");
              } else if (event.type === "tool_call") {
                setAgentStatus(event.toolCall.status === "running" ? "Executing..." : "Writing...");
                updateThread(threadId, (t) => ({ ...t, messages: t.messages.map((m) => {
                  if (m.id !== assistantId) return m;
                  const existing = m.toolCalls?.find((tc) => tc.name === event.toolCall.name && tc.status === "running");
                  if (existing && event.toolCall.status !== "running") {
                    return { ...m, toolCalls: m.toolCalls?.map((tc) => (tc.id === existing.id ? { ...tc, ...event.toolCall } : tc)) };
                  }
                  return { ...m, toolCalls: [...(m.toolCalls || []), { id: generateId(), name: event.toolCall.name, status: event.toolCall.status, input: event.toolCall.input, output: event.toolCall.output, duration: event.toolCall.duration }] };
                }) }));
              } else if (event.type === "done" || event.type === "complete") {
                updateThread(threadId, (t) => ({ ...t, status: "completed", messages: t.messages.map((m) => (m.id === assistantId ? { ...m, isStreaming: false } : m)) }));
                setAgentStatus("Idle");
              }
            } catch { /* skip */ }
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          updateThread(threadId, (t) => ({ ...t, status: "error", messages: t.messages.map((m) => m.id === assistantId ? { ...m, content: m.content || "エラーが発生しました。", isStreaming: false } : m) }));
        }
        setAgentStatus("Idle");
      }
    },
    [activeThreadId, activeProjectId, selectedModel, updateThread]
  );

  return (
    <div className="h-screen w-screen flex items-center justify-center p-1" style={{ background: "#dedede" }}>
      <div className="w-full h-full rounded-xl overflow-hidden flex flex-col bg-white" style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)" }}>
        <TitleBar threadTitle={activeThread?.title || "新しいスレッド"} agentStatus={agentStatus} />
        <div className="flex-1 flex min-h-0">
          <Sidebar projects={projects} activeThreadId={activeThreadId} onSelectThread={handleSelectThread} onNewThread={handleNewThread} onSettings={() => {}} />
          <ChatPanel messages={messages} selectedModel={selectedModel} selectedReasoning={selectedReasoning} activeProjectName={activeProject.name} projects={projects} onSend={handleSend} onModelChange={setSelectedModel} onReasoningChange={setSelectedReasoning} onSelectProject={(id) => { setActiveProjectId(id); setActiveThreadId(null); }} />
        </div>
        <StatusBar environment="ローカル環境" permissions="デフォルト権限" branch="main" />
      </div>
    </div>
  );
}
