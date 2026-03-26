"use client";

import {
  MessageSquare,
  GitPullRequestArrow,
  Terminal,
  Settings,
} from "lucide-react";
import { ViewMode } from "@/types";

interface NavItemsProps {
  activeView: ViewMode;
  onSelectView: (view: ViewMode) => void;
}

const navItems: { id: ViewMode; label: string; icon: React.ElementType; badge?: number }[] = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "review", label: "Review", icon: GitPullRequestArrow, badge: 1 },
  { id: "terminal", label: "Terminal", icon: Terminal },
  { id: "settings", label: "Settings", icon: Settings },
];

export function NavItems({ activeView, onSelectView }: NavItemsProps) {
  return (
    <div className="px-3 py-2 border-b border-[#21262d]">
      <div className="flex gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`relative flex-1 flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-md text-xs transition-colors ${
                isActive
                  ? "bg-[#30363d] text-[#e6edf3]"
                  : "text-[#8b949e] hover:bg-[#21262d] hover:text-[#e6edf3]"
              }`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center rounded-full bg-[#58a6ff] text-[10px] text-white font-medium">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
