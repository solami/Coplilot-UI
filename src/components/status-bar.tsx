"use client";

import { Monitor, Shield, GitBranch, ChevronDown } from "lucide-react";

interface StatusBarProps {
  environment: string;
  permissions: string;
  branch: string;
}

export function StatusBar({ environment, permissions, branch }: StatusBarProps) {
  return (
    <div className="h-[32px] flex items-center justify-between px-5 border-t border-gray-200/80 bg-[#f9f9f9] text-[13px] text-gray-400 shrink-0 select-none">
      <div className="flex items-center gap-5">
        <button className="flex items-center gap-1.5 hover:text-gray-600 transition-colors">
          <Monitor size={13} />
          {environment}
          <ChevronDown size={11} />
        </button>
        <button className="flex items-center gap-1.5 hover:text-gray-600 transition-colors">
          <Shield size={13} />
          {permissions}
          <ChevronDown size={11} />
        </button>
      </div>
      <button className="flex items-center gap-1.5 hover:text-gray-600 transition-colors">
        <GitBranch size={13} />
        {branch}
        <ChevronDown size={11} />
      </button>
    </div>
  );
}
