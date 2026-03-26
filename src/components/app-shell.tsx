"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { TitleBar } from "./title-bar";
import { Sidebar } from "./sidebar/sidebar";
import { ChatPanel } from "./chat/chat-panel";
import { ReviewPanel } from "./review/review-panel";
import { TerminalPanel } from "./terminal/terminal-panel";
import { CommandPalette } from "./command-palette";
import { AgentStatus } from "./agent/agent-status";
import { ActivityLog } from "./agent/activity-log";
import {
  mockThreads,
  mockProjects,
  mockDiffFiles,
  mockActivityLog,
} from "@/lib/mock-data";
import { AgentState, Message, ViewMode, Thread } from "@/types";
import { generateId } from "@/lib/utils";

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [activeView, setActiveView] = useState<ViewMode>("chat");
  const [activeThreadId, setActiveThreadId] = useState<string>("t1");
  const [activeProject, setActiveProject] = useState("copilot-ui");
  const [agentState, setAgentState] = useState<AgentState>("executing");
  const [selectedModel, setSelectedModel] = useState("gpt-5");
  const [threads, setThreads] = useState<Thread[]>(mockThreads);
  const [isStreaming, setIsStreaming] = useState(false);

  const activeThread = threads.find((t) => t.id === activeThreadId);
  const messages = activeThread?.messages || [];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "`") {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setSidebarOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Simulate agent state changes
  useEffect(() => {
    const states: AgentState[] = [
      "thinking",
      "reading",
      "executing",
      "writing",
      "thinking",
      "idle",
    ];
    let i = 0;
    const interval = setInterval(() => {
      setAgentState(states[i % states.length]);
      i++;
      if (i >= states.length) clearInterval(interval);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = useCallback(
    (content: string) => {
      // Add user message
      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content,
        timestamp: new Date().toISOString(),
      };

      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThreadId
            ? { ...t, messages: [...t.messages, userMessage] }
            : t
        )
      );

      // Simulate streaming response
      setIsStreaming(true);
      setAgentState("thinking");

      setTimeout(() => {
        setAgentState("reading");

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

        setThreads((prev) =>
          prev.map((t) =>
            t.id === activeThreadId
              ? { ...t, messages: [...t.messages, assistantMessage] }
              : t
          )
        );

        // Simulate tool completion
        setTimeout(() => {
          setAgentState("executing");
          setThreads((prev) =>
            prev.map((t) =>
              t.id === activeThreadId
                ? {
                    ...t,
                    messages: t.messages.map((m) =>
                      m.id === assistantMessage.id
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
                  }
                : t
            )
          );

          // Simulate text streaming
          const responseText = `I've analyzed your request. Here's what I found:\n\nThe current implementation uses a standard approach, but I can suggest some improvements:\n\n1. **Performance optimization** - We can memoize the expensive computations\n2. **Code quality** - Adding proper TypeScript types will improve maintainability\n3. **Testing** - I'll add unit tests for the critical paths\n\nLet me implement these changes now.\n\n\`\`\`typescript\n// Optimized implementation\nexport function processData(input: DataInput): Result {\n  const cached = useMemo(() => {\n    return computeExpensive(input);\n  }, [input.key]);\n\n  return { data: cached, status: 'ok' };\n}\n\`\`\`\n\nI've made the changes and all tests are passing.`;

          let charIndex = 0;
          const streamInterval = setInterval(() => {
            charIndex += 3;
            if (charIndex >= responseText.length) {
              charIndex = responseText.length;
              clearInterval(streamInterval);
              setIsStreaming(false);
              setAgentState("idle");
            }
            const currentContent = responseText.substring(0, charIndex);
            const stillStreaming = charIndex < responseText.length;

            setThreads((prev) =>
              prev.map((t) =>
                t.id === activeThreadId
                  ? {
                      ...t,
                      messages: t.messages.map((m) =>
                        m.id === assistantMessage.id
                          ? {
                              ...m,
                              content: currentContent,
                              isStreaming: stillStreaming,
                            }
                          : m
                      ),
                    }
                  : t
              )
            );
          }, 20);
        }, 1500);
      }, 800);
    },
    [activeThreadId]
  );

  const handleStop = useCallback(() => {
    setIsStreaming(false);
    setAgentState("idle");
  }, []);

  const handleNewThread = useCallback(() => {
    const newThread: Thread = {
      id: generateId(),
      title: "New conversation",
      status: "idle",
      model: selectedModel,
      project: activeProject,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
    setActiveView("chat");
  }, [selectedModel, activeProject]);

  const handleCommandAction = useCallback(
    (action: string) => {
      switch (action) {
        case "new-thread":
          handleNewThread();
          break;
        case "chat":
          setActiveView("chat");
          break;
        case "review":
          setActiveView("review");
          break;
        case "terminal":
          setTerminalOpen((prev) => !prev);
          break;
        case "settings":
          setActiveView("settings");
          break;
      }
    },
    [handleNewThread]
  );

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#0a0e14] via-[#0d1117] to-[#0f1923] p-2">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full h-full max-w-[1800px] rounded-xl border border-[#30363d] shadow-2xl overflow-hidden flex flex-col bg-[#0d1117]"
      >
        {/* Title bar */}
        <TitleBar
          projectName={activeProject}
          agentState={agentState}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onToggleTerminal={() => setTerminalOpen(!terminalOpen)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />

        {/* Main content area */}
        <div className="flex-1 flex min-h-0">
          {/* Sidebar */}
          <Sidebar
            isOpen={sidebarOpen}
            threads={threads}
            projects={mockProjects}
            activeThreadId={activeThreadId}
            activeProject={activeProject}
            activeView={activeView}
            onSelectThread={setActiveThreadId}
            onSelectProject={setActiveProject}
            onSelectView={setActiveView}
            onNewThread={handleNewThread}
          />

          {/* Main panel */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Agent status bar */}
            <AgentStatus state={agentState} detail={agentState === "reading" ? "src/app/page.tsx" : agentState === "executing" ? "npm run build" : undefined} />

            {/* Content view */}
            {activeView === "chat" && (
              <ChatPanel
                messages={messages}
                isStreaming={isStreaming}
                selectedModel={selectedModel}
                onSend={handleSend}
                onStop={handleStop}
                onModelChange={setSelectedModel}
              />
            )}

            {activeView === "review" && (
              <ReviewPanel
                files={mockDiffFiles}
                onApprove={() => alert("Changes approved!")}
                onReject={() => alert("Changes rejected.")}
                onComment={() => alert("Comment added.")}
              />
            )}

            {activeView === "terminal" && (
              <div className="flex-1 flex flex-col">
                <TerminalPanel isOpen={true} onClose={() => setActiveView("chat")} />
              </div>
            )}

            {activeView === "settings" && (
              <div className="flex-1 flex items-center justify-center text-[#8b949e]">
                <div className="text-center">
                  <h2 className="text-lg font-medium text-[#e6edf3] mb-2">Settings</h2>
                  <p className="text-sm">Configuration and preferences coming soon.</p>
                </div>
              </div>
            )}

            {/* Activity log (shown at bottom of chat view) */}
            {activeView === "chat" && agentState !== "idle" && (
              <ActivityLog entries={mockActivityLog} />
            )}

            {/* Terminal panel (when toggled separately) */}
            {activeView !== "terminal" && (
              <TerminalPanel
                isOpen={terminalOpen}
                onClose={() => setTerminalOpen(false)}
              />
            )}
          </div>
        </div>

        {/* Command palette */}
        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          onAction={handleCommandAction}
        />
      </motion.div>
    </div>
  );
}
