"use client";

import { Monitor, Shield, GitBranch, ChevronDown } from "lucide-react";

interface StatusBarProps {
  environment: string;
  permissions: string;
  branch: string;
}

export function StatusBar({ environment, permissions, branch }: StatusBarProps) {
  return (
    <div className="h-8 flex items-center justify-between px-4 border-t border-[var(--color-border-default)] bg-[var(--color-bg-secondary)] text-xs text-[var(--color-text-secondary)] shrink-0 select-none">
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1.5 hover:text-[var(--color-text-primary)] transition-colors">
          <Monitor size={12} />
          {environment}
          <ChevronDown size={10} />
        </button>
        <button className="flex items-center gap-1.5 hover:text-[var(--color-text-primary)] transition-colors">
          <Shield size={12} />
          {permissions}
          <ChevronDown size={10} />
        </button>
      </div>
      <button className="flex items-center gap-1.5 hover:text-[var(--color-text-primary)] transition-colors">
        <GitBranch size={12} />
        {branch}
        <ChevronDown size={10} />
      </button>
    </div>
  );
}
