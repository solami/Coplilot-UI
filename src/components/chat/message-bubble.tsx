"use client";

import { motion } from "framer-motion";
import { User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Message } from "@/types";
import { CodeBlock } from "./code-block";
import { ToolCallBlock } from "./tool-call-block";
import { formatTime } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  index: number;
}

export function MessageBubble({ message, index }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 ${
          isUser
            ? "bg-[#58a6ff]/20 text-[#58a6ff]"
            : "bg-[#bc8cff]/20 text-[#bc8cff]"
        }`}
      >
        {isUser ? <User size={14} /> : <Bot size={14} />}
      </div>

      {/* Content */}
      <div className={`flex-1 min-w-0 ${isUser ? "text-right" : ""}`}>
        {/* Header */}
        <div
          className={`flex items-center gap-2 mb-1 ${
            isUser ? "justify-end" : ""
          }`}
        >
          <span className="text-xs font-medium text-[#8b949e]">
            {isUser ? "You" : "Copilot"}
          </span>
          <span className="text-[10px] text-[#6e7681]">
            {formatTime(message.timestamp)}
          </span>
        </div>

        {/* Tool calls (before content for assistant) */}
        {!isUser && message.toolCalls && (
          <div className="mb-2">
            {message.toolCalls.map((tc) => (
              <ToolCallBlock key={tc.id} toolCall={tc} />
            ))}
          </div>
        )}

        {/* Message content */}
        <div
          className={`inline-block text-left rounded-lg px-4 py-3 max-w-full ${
            isUser
              ? "bg-[#58a6ff]/10 border border-[#58a6ff]/20"
              : "bg-[#161b22] border border-[#21262d]"
          }`}
        >
          <div className="prose prose-invert prose-sm max-w-none text-[#e6edf3] text-sm leading-relaxed">
            <ReactMarkdown
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const codeString = String(children).replace(/\n$/, "");

                  if (match) {
                    return (
                      <CodeBlock code={codeString} language={match[1]} />
                    );
                  }
                  return (
                    <code
                      className="px-1.5 py-0.5 rounded bg-[#21262d] text-[#f0883e] font-mono text-xs"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                p({ children }) {
                  return <p className="mb-2 last:mb-0">{children}</p>;
                },
                ol({ children }) {
                  return (
                    <ol className="list-decimal list-inside mb-2 space-y-1">
                      {children}
                    </ol>
                  );
                },
                ul({ children }) {
                  return (
                    <ul className="list-disc list-inside mb-2 space-y-1">
                      {children}
                    </ul>
                  );
                },
                strong({ children }) {
                  return (
                    <strong className="font-semibold text-[#e6edf3]">
                      {children}
                    </strong>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
            {message.isStreaming && <span className="typing-cursor" />}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
