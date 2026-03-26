"use client";

import { motion } from "framer-motion";
import {
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Circle,
} from "lucide-react";
import { Thread, ThreadStatus } from "@/types";
import { formatRelativeTime } from "@/lib/utils";

interface ThreadListProps {
  threads: Thread[];
  activeThreadId: string | null;
  onSelectThread: (id: string) => void;
  onNewThread: () => void;
}

const statusConfig: Record<
  ThreadStatus,
  { icon: React.ElementType; color: string }
> = {
  running: { icon: Loader2, color: "text-[#58a6ff]" },
  completed: { icon: CheckCircle2, color: "text-[#3fb950]" },
  reviewing: { icon: Eye, color: "text-[#d29922]" },
  error: { icon: AlertCircle, color: "text-[#f85149]" },
  idle: { icon: Circle, color: "text-[#6e7681]" },
};

export function ThreadList({
  threads,
  activeThreadId,
  onSelectThread,
  onNewThread,
}: ThreadListProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-xs font-medium text-[#8b949e] uppercase tracking-wider">
          Threads
        </span>
        <button
          onClick={onNewThread}
          className="p-1 rounded-md hover:bg-[#30363d] text-[#8b949e] hover:text-[#e6edf3] transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Thread items */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
        {threads.map((thread) => {
          const isActive = thread.id === activeThreadId;
          const config = statusConfig[thread.status];
          const StatusIcon = config.icon;

          return (
            <motion.button
              key={thread.id}
              onClick={() => onSelectThread(thread.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-[#30363d]"
                  : "hover:bg-[#21262d]"
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-2">
                <StatusIcon
                  size={14}
                  className={`${config.color} mt-0.5 shrink-0 ${
                    thread.status === "running" ? "animate-spin" : ""
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-[#e6edf3] truncate">
                    {thread.title}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-[#6e7681] font-mono">
                      {thread.model}
                    </span>
                    <span className="text-[10px] text-[#6e7681]">
                      {formatRelativeTime(thread.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
