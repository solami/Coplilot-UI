"use client";

import { Message, Project } from "@/types";
import { WelcomeScreen } from "./welcome-screen";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";

interface ChatPanelProps {
  messages: Message[];
  selectedModel: string;
  selectedReasoning: string;
  activeProjectName: string;
  projects: Project[];
  onSend: (message: string) => void;
  onModelChange: (model: string) => void;
  onReasoningChange: (level: string) => void;
  onSelectProject: (id: string) => void;
}

export function ChatPanel({
  messages,
  selectedModel,
  selectedReasoning,
  activeProjectName,
  projects,
  onSend,
  onModelChange,
  onReasoningChange,
  onSelectProject,
}: ChatPanelProps) {
  const showWelcome = messages.length === 0;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--color-bg-primary)]">
      {showWelcome ? (
        <WelcomeScreen
          projectName={activeProjectName}
          projects={projects.map((p) => ({ id: p.id, name: p.name }))}
          onSelectProject={onSelectProject}
          onSuggestion={onSend}
        />
      ) : (
        <MessageList messages={messages} />
      )}

      <ChatInput
        onSend={onSend}
        selectedModel={selectedModel}
        selectedReasoning={selectedReasoning}
        onModelChange={onModelChange}
        onReasoningChange={onReasoningChange}
      />
    </div>
  );
}
