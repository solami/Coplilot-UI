"use client";

import { Search, ChevronDown } from "lucide-react";

interface TitleBarProps {
  threadTitle: string;
  agentStatus: string;
}

export function TitleBar({ threadTitle, agentStatus }: TitleBarProps) {
  const isActive = agentStatus !== "Idle";

  return (
    <div className="h-12 flex items-center justify-between px-4 border-b border-gray-200 bg-white select-none shrink-0">
      {/* Left: Traffic lights */}
      <div className="flex items-center gap-2 w-24">
        <div className="w-3 h-3 rounded-full cursor-pointer" style={{ background: "#ff5f57" }} />
        <div className="w-3 h-3 rounded-full cursor-pointer" style={{ background: "#febc2e" }} />
        <div className="w-3 h-3 rounded-full cursor-pointer" style={{ background: "#28c840" }} />
        <button className="ml-2 text-gray-400 hover:text-gray-600">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="12" height="12" rx="2" />
            <line x1="8" y1="2" x2="8" y2="14" />
          </svg>
        </button>
      </div>

      {/* Center */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium text-gray-900">{threadTitle}</span>
        <span className="text-gray-300">&middot;</span>
        <div className="flex items-center gap-1.5">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: isActive ? "#34c759" : "#aeaeb2" }}
          />
          <span className="text-gray-500 text-sm">{agentStatus}</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500">
          <Search size={15} />
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm text-gray-700">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" opacity="0.6">
            <path d="M1.5 2.5A1.5 1.5 0 013 1h4.5a.5.5 0 010 1H3a.5.5 0 00-.5.5v11a.5.5 0 00.5.5h10a.5.5 0 00.5-.5V9a.5.5 0 011 0v4.5A1.5 1.5 0 0113 15H3a1.5 1.5 0 01-1.5-1.5v-11z"/>
            <path d="M14.5 1.5a.5.5 0 00-.5-.5H10a.5.5 0 000 1h2.793L7.146 7.646a.5.5 0 00.708.708L13.5 2.707V5.5a.5.5 0 001 0v-4z"/>
          </svg>
          開く
          <ChevronDown size={12} />
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm text-gray-700">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8" cy="8" r="3" />
            <line x1="8" y1="1" x2="8" y2="5" />
            <line x1="8" y1="11" x2="8" y2="15" />
          </svg>
          コミット
          <ChevronDown size={12} />
        </button>
      </div>
    </div>
  );
}
