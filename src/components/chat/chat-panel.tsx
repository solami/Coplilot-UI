"use client";

import { Message } from "@/types";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";

interface ChatPanelProps {
  messages: Message[];
  isStreaming: boolean;
  selectedModel: string;
  onSend: (message: string) => void;
  onStop: () => void;
  onModelChange: (model: string) => void;
}

export function ChatPanel({
  messages,
  isStreaming,
  selectedModel,
  onSend,
  onStop,
  onModelChange,
}: ChatPanelProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <MessageList messages={messages} />
      <ChatInput
        onSend={onSend}
        onStop={onStop}
        isStreaming={isStreaming}
        selectedModel={selectedModel}
        onModelChange={onModelChange}
      />
    </div>
  );
}
