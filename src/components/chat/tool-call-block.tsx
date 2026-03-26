"use client";

import { useState } from "react";
import { ChevronRight, FileText, Terminal, Pencil, Loader2, CheckCircle2, XCircle } from "lucide-react";
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
  const [expanded, setExpanded] = useState(false);
  const Icon = toolIcons[toolCall.name] || Terminal;

  return (
    <div className="my-1">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 text-left"
      >
        <ChevronRight size={12} className={`text-gray-400 transition-transform ${expanded ? "rotate-90" : ""}`} />
        <Icon size={14} className="text-gray-500" />
        <span className="text-sm text-gray-500 font-medium">{toolCall.name.replace(/_/g, " ")}</span>
        <span className="text-sm text-gray-400 font-mono truncate">{toolCall.input}</span>
        <span className="ml-1">
          {toolCall.status === "running" && <Loader2 size={12} className="text-blue-500 animate-spin" />}
          {toolCall.status === "completed" && <CheckCircle2 size={12} className="text-green-500" />}
          {toolCall.status === "error" && <XCircle size={12} className="text-red-500" />}
        </span>
        {toolCall.duration != null && (
          <span className="text-xs text-gray-400">
            {toolCall.duration < 1000 ? `${toolCall.duration}ms` : `${(toolCall.duration / 1000).toFixed(1)}s`}
          </span>
        )}
      </button>
      {expanded && toolCall.output && (
        <div className="ml-7 px-3 py-2 mt-1 bg-gray-50 rounded-md">
          <pre className="text-xs text-gray-500 font-mono whitespace-pre-wrap">{toolCall.output}</pre>
        </div>
      )}
    </div>
  );
}
