"use client";

import { motion } from "framer-motion";
import { ActivityLogEntry } from "@/types";
import { formatTime } from "@/lib/utils";

interface ActivityLogProps {
  entries: ActivityLogEntry[];
}

const typeColors: Record<string, string> = {
  info: "text-[#58a6ff]",
  success: "text-[#3fb950]",
  warning: "text-[#d29922]",
  error: "text-[#f85149]",
};

export function ActivityLog({ entries }: ActivityLogProps) {
  return (
    <div className="px-4 py-3 space-y-1">
      <h4 className="text-xs font-medium text-[#8b949e] uppercase tracking-wider mb-2">
        Activity
      </h4>
      <div className="space-y-0.5 max-h-40 overflow-y-auto">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center gap-2 text-xs py-0.5"
          >
            <span className="text-[#6e7681] font-mono w-12 shrink-0">
              {formatTime(entry.timestamp)}
            </span>
            <span className={`font-medium shrink-0 ${typeColors[entry.type]}`}>
              {entry.action}
            </span>
            <span className="text-[#8b949e] font-mono truncate">
              {entry.detail}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
