"use client";

import { Search, ChevronDown, ExternalLink, GitCommitHorizontal, LayoutGrid, PanelRight, Clock } from "lucide-react";

interface TitleBarProps {
  threadTitle: string;
  agentStatus: string;
}

export function TitleBar({ threadTitle, agentStatus }: TitleBarProps) {
  const isActive = agentStatus !== "Idle";

  return (
    <div className="h-[52px] flex items-center justify-between px-5 border-b border-gray-200/80 bg-white select-none shrink-0">
      {/* Left: Traffic lights */}
      <div className="flex items-center gap-[9px] w-28">
        <div className="w-[14px] h-[14px] rounded-full cursor-pointer hover:brightness-90 transition" style={{ background: "#ff5f57" }} />
        <div className="w-[14px] h-[14px] rounded-full cursor-pointer hover:brightness-90 transition" style={{ background: "#febc2e" }} />
        <div className="w-[14px] h-[14px] rounded-full cursor-pointer hover:brightness-90 transition" style={{ background: "#28c840" }} />
        <button className="ml-3 text-gray-300 hover:text-gray-500 transition-colors">
          <PanelRight size={16} />
        </button>
      </div>

      {/* Center: Thread title + agent status */}
      <div className="flex items-center gap-2.5">
        <span className="text-[15px] font-medium text-gray-900">{threadTitle}</span>
        <span className="text-gray-300 text-sm">&middot;</span>
        <div className="flex items-center gap-[6px]">
          <div
            className="w-[7px] h-[7px] rounded-full"
            style={{ background: isActive ? "#34c759" : "#c7c7cc" }}
          />
          <span className="text-[14px] text-gray-400">{agentStatus}</span>
        </div>
      </div>

      {/* Right: Action buttons */}
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
          <Search size={16} />
        </button>

        <div className="flex items-center gap-1.5 ml-1">
          <button className="flex items-center gap-2 h-[34px] px-3.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-[14px] text-gray-600 transition-colors">
            <ExternalLink size={14} />
            開く
            <ChevronDown size={13} className="text-gray-400 -ml-0.5" />
          </button>

          <button className="flex items-center gap-2 h-[34px] px-3.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-[14px] text-gray-600 transition-colors">
            <GitCommitHorizontal size={14} />
            コミット
            <ChevronDown size={13} className="text-gray-400 -ml-0.5" />
          </button>
        </div>

        <div className="flex items-center gap-0.5 ml-1">
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <LayoutGrid size={16} />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <PanelRight size={16} />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <Clock size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
