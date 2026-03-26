"use client";

import { Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Message } from "@/types";
import { CodeBlock } from "./code-block";
import { ToolCallBlock } from "./tool-call-block";
import { formatTime } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="px-16 py-4">
        <div className="text-sm text-gray-900 leading-relaxed">{message.content}</div>
      </div>
    );
  }

  return (
    <div className="px-8 py-4">
      <div className="flex gap-3">
        <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
          <Bot size={14} className="text-gray-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900">Copilot</span>
            <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
          </div>

          {message.toolCalls && message.toolCalls.length > 0 && (
            <div className="mb-2">
              {message.toolCalls.map((tc) => (
                <ToolCallBlock key={tc.id} toolCall={tc} />
              ))}
            </div>
          )}

          <div className="text-sm text-gray-900 leading-relaxed">
            <ReactMarkdown
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const codeStr = String(children).replace(/\n$/, "");
                  if (match) return <CodeBlock code={codeStr} language={match[1]} />;
                  return (
                    <code className="px-1.5 py-0.5 rounded bg-gray-100 text-red-600 text-xs font-mono border border-gray-200" {...props}>
                      {children}
                    </code>
                  );
                },
                p({ children }) { return <p className="mb-3 last:mb-0">{children}</p>; },
                ol({ children }) { return <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>; },
                ul({ children }) { return <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>; },
                strong({ children }) { return <strong className="font-semibold">{children}</strong>; },
              }}
            >
              {message.content}
            </ReactMarkdown>
            {message.isStreaming && <span className="typing-cursor" />}
          </div>
        </div>
      </div>
    </div>
  );
}
