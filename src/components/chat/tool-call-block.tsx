"use client";

import { useState } from "react";
import {
  ChevronRight,
  FileText,
  Terminal,
  Pencil,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { ToolCall } from "@/types";

interface ToolCallBlockProps {
  toolCall: ToolCall;
}

const toolIcons: Record<string, React.ElementType> = {
  read_file: FileText,
  write_file: Pencil,
  edit_file: Pencil,
  execute_command: Terminal,
};

export function ToolCallBlock({ toolCall }: ToolCallBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = toolIcons[toolCall.name] || Terminal;

  return (
    <div className="my-1">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-[var(--color-bg-hover)] transition-colors text-left"
      >
        <ChevronRight
          size={12}
          className={`text-[var(--color-text-tertiary)] transition-transform ${
            isExpanded ? "rotate-90" : ""
          }`}
        />
        <Icon size={14} className="text-[var(--color-text-secondary)]" />
        <span className="text-sm text-[var(--color-text-secondary)] font-medium">
          {toolCall.name.replace(/_/g, " ")}
        </span>
        <span className="text-sm text-[var(--color-text-tertiary)] font-mono truncate">
          {toolCall.input}
        </span>
        <span className="ml-1">
          {toolCall.status === "running" && (
            <Loader2 size={12} className="text-[var(--color-accent-blue)] animate-spin" />
          )}
          {toolCall.status === "completed" && (
            <CheckCircle2 size={12} className="text-[var(--color-accent-green)]" />
          )}
          {toolCall.status === "error" && (
            <XCircle size={12} className="text-[var(--color-accent-red)]" />
          )}
        </span>
        {toolCall.duration && (
          <span className="text-xs text-[var(--color-text-tertiary)]">
            {toolCall.duration < 1000
              ? `${toolCall.duration}ms`
              : `${(toolCall.duration / 1000).toFixed(1)}s`}
          </span>
        )}
      </button>

      {isExpanded && toolCall.output && (
        <div className="ml-7 px-3 py-2 mt-1 bg-[var(--color-bg-secondary)] rounded-md">
          <pre className="text-xs text-[var(--color-text-secondary)] font-mono whitespace-pre-wrap">
            {toolCall.output}
          </pre>
        </div>
      )}
    </div>
  );
}
