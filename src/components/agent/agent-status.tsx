"use client";

import { motion } from "framer-motion";
import { AgentState } from "@/types";

interface AgentStatusProps {
  state: AgentState;
  detail?: string;
}

const stateConfig: Record<AgentState, { color: string; bg: string; label: string }> = {
  idle: { color: "text-[#6e7681]", bg: "bg-[#6e7681]/10", label: "Idle" },
  thinking: { color: "text-[#d29922]", bg: "bg-[#d29922]/10", label: "Thinking" },
  executing: { color: "text-[#58a6ff]", bg: "bg-[#58a6ff]/10", label: "Executing" },
  reading: { color: "text-[#bc8cff]", bg: "bg-[#bc8cff]/10", label: "Reading" },
  writing: { color: "text-[#3fb950]", bg: "bg-[#3fb950]/10", label: "Writing" },
  error: { color: "text-[#f85149]", bg: "bg-[#f85149]/10", label: "Error" },
};

export function AgentStatus({ state, detail }: AgentStatusProps) {
  const config = stateConfig[state];

  if (state === "idle") return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className={`mx-6 mt-2 flex items-center gap-2 px-3 py-2 rounded-lg ${config.bg} border border-current/10`}
    >
      <div className={`w-2 h-2 rounded-full ${config.color.replace("text-", "bg-")} animate-pulse-dot`} />
      <span className={`text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
      {detail && (
        <span className="text-xs text-[#8b949e] font-mono truncate">
          {detail}
        </span>
      )}
    </motion.div>
  );
}
