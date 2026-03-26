"use client";

import { Monitor, Shield, GitBranch, ChevronDown } from "lucide-react";

interface StatusBarProps {
  environment: string;
  permissions: string;
  branch: string;
}

export function StatusBar({ environment, permissions, branch }: StatusBarProps) {
  return (
    <div className="h-8 flex items-center justify-between px-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 shrink-0 select-none">
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1.5 hover:text-gray-700 transition-colors">
          <Monitor size={12} />
          {environment}
          <ChevronDown size={10} />
        </button>
        <button className="flex items-center gap-1.5 hover:text-gray-700 transition-colors">
          <Shield size={12} />
          {permissions}
          <ChevronDown size={10} />
        </button>
      </div>
      <button className="flex items-center gap-1.5 hover:text-gray-700 transition-colors">
        <GitBranch size={12} />
        {branch}
        <ChevronDown size={10} />
      </button>
    </div>
  );
}
