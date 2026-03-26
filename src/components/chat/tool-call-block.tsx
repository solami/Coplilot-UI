"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    <div className="my-1.5">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#161b22] border border-[#21262d] hover:border-[#30363d] transition-colors text-left"
      >
        <ChevronRight
          size={12}
          className={`text-[#6e7681] transition-transform shrink-0 ${
            isExpanded ? "rotate-90" : ""
          }`}
        />
        <Icon size={14} className="text-[#8b949e] shrink-0" />
        <span className="text-xs text-[#8b949e] font-medium">
          {toolCall.name.replace(/_/g, " ")}
        </span>
        <span className="text-xs text-[#6e7681] font-mono truncate">
          {toolCall.input}
        </span>
        <span className="ml-auto shrink-0">
          {toolCall.status === "running" && (
            <Loader2 size={12} className="text-[#58a6ff] animate-spin" />
          )}
          {toolCall.status === "completed" && (
            <CheckCircle2 size={12} className="text-[#3fb950]" />
          )}
          {toolCall.status === "error" && (
            <XCircle size={12} className="text-[#f85149]" />
          )}
        </span>
        {toolCall.duration && (
          <span className="text-[10px] text-[#6e7681] shrink-0">
            {toolCall.duration < 1000
              ? `${toolCall.duration}ms`
              : `${(toolCall.duration / 1000).toFixed(1)}s`}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isExpanded && toolCall.output && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="mx-3 px-3 py-2 bg-[#0d1117] border-x border-b border-[#21262d] rounded-b-md">
              <pre className="text-xs text-[#8b949e] font-mono whitespace-pre-wrap">
                {toolCall.output}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
