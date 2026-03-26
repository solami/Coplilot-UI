"use client";

import { motion } from "framer-motion";
import {
  Settings,
  Terminal,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
} from "lucide-react";
import { AgentState } from "@/types";

interface TitleBarProps {
  projectName: string;
  agentState: AgentState;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onToggleTerminal: () => void;
  onOpenCommandPalette: () => void;
}

const agentStateConfig: Record<AgentState, { color: string; label: string }> = {
  idle: { color: "bg-[#6e7681]", label: "Idle" },
  thinking: { color: "bg-[#d29922]", label: "Thinking..." },
  executing: { color: "bg-[#58a6ff]", label: "Executing" },
  reading: { color: "bg-[#bc8cff]", label: "Reading" },
  writing: { color: "bg-[#3fb950]", label: "Writing" },
  error: { color: "bg-[#f85149]", label: "Error" },
};

export function TitleBar({
  projectName,
  agentState,
  sidebarOpen,
  onToggleSidebar,
  onToggleTerminal,
  onOpenCommandPalette,
}: TitleBarProps) {
  const stateConfig = agentStateConfig[agentState];

  return (
    <div className="h-12 flex items-center justify-between px-4 border-b border-[#30363d] bg-[#161b22]/90 backdrop-blur-xl select-none shrink-0">
      {/* Left: Traffic lights + sidebar toggle */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 mr-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 cursor-pointer transition-all" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 cursor-pointer transition-all" />
          <div className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-110 cursor-pointer transition-all" />
        </div>

        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md hover:bg-[#30363d] text-[#8b949e] hover:text-[#e6edf3] transition-colors"
        >
          {sidebarOpen ? (
            <PanelLeftClose size={16} />
          ) : (
            <PanelLeftOpen size={16} />
          )}
        </button>
      </div>

      {/* Center: Project name + agent status */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-[#e6edf3]">
          {projectName}
        </span>
        <motion.div
          className="flex items-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={agentState}
        >
          <div
            className={`w-2 h-2 rounded-full ${stateConfig.color} ${
              agentState !== "idle" && agentState !== "error"
                ? "animate-pulse-dot"
                : ""
            }`}
          />
          <span className="text-xs text-[#8b949e]">{stateConfig.label}</span>
        </motion.div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-[#30363d] text-[#8b949e] hover:text-[#e6edf3] transition-colors text-xs"
        >
          <Search size={14} />
          <kbd className="px-1 py-0.5 rounded bg-[#21262d] text-[10px] font-mono">
            {"\u2318"}K
          </kbd>
        </button>
        <button
          onClick={onToggleTerminal}
          className="p-1.5 rounded-md hover:bg-[#30363d] text-[#8b949e] hover:text-[#e6edf3] transition-colors"
        >
          <Terminal size={16} />
        </button>
        <button className="p-1.5 rounded-md hover:bg-[#30363d] text-[#8b949e] hover:text-[#e6edf3] transition-colors">
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
}
