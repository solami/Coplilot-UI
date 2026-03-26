"use client";

import { SquarePen, Clock, Grid2x2, Settings, FolderClosed } from "lucide-react";
import { Project } from "@/types";

interface SidebarProps {
  projects: Project[];
  activeThreadId: string | null;
  onSelectThread: (id: string) => void;
  onNewThread: () => void;
  onSettings: () => void;
}

function relTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d >= 30) return `${Math.floor(d / 30)}か月`;
  if (d >= 7) return `${Math.floor(d / 7)}週間`;
  if (d >= 1) return `${d}日`;
  if (h >= 1) return `${h}時間`;
  if (m >= 1) return `${m}分`;
  return "今";
}

export function Sidebar({
  projects,
  activeThreadId,
  onSelectThread,
  onNewThread,
  onSettings,
}: SidebarProps) {
  return (
    <div
      style={{ width: 340, minWidth: 340 }}
      className="h-full border-r border-gray-200 bg-gray-50 flex flex-col shrink-0 select-none"
    >
      {/* Top actions */}
      <div className="px-4 pt-12 pb-2 space-y-0.5">
        <button
          onClick={onNewThread}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-900 hover:bg-gray-200/70 transition-colors"
        >
          <SquarePen size={16} className="text-gray-500" />
          新しいスレッド
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-900 hover:bg-gray-200/70 transition-colors">
          <Clock size={16} className="text-gray-500" />
          オートメーション
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-900 hover:bg-gray-200/70 transition-colors">
          <Grid2x2 size={16} className="text-gray-500" />
          スキル
        </button>
      </div>

      {/* Threads header */}
      <div className="flex items-center justify-between px-6 pt-4 pb-1">
        <span className="text-xs text-gray-400 font-medium">スレッド</span>
        <div className="flex items-center gap-1">
          <button className="p-1 rounded hover:bg-gray-200/70 text-gray-400">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 6h8M4 10h8"/></svg>
          </button>
          <button className="p-1 rounded hover:bg-gray-200/70 text-gray-400">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="2" y1="4" x2="14" y2="4"/><line x1="2" y1="8" x2="14" y2="8"/><line x1="2" y1="12" x2="14" y2="12"/></svg>
          </button>
        </div>
      </div>

      {/* Thread list */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {projects.map((project) => (
          <div key={project.id} className="mb-1">
            <div className="flex items-center gap-2 px-3 py-2">
              <FolderClosed size={14} className="text-gray-500" />
              <span className="text-sm text-gray-900 font-medium">{project.name}</span>
            </div>
            {project.threads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => onSelectThread(thread.id)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 ml-5 rounded-lg text-left transition-colors ${
                  activeThreadId === thread.id ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
                style={{ maxWidth: "calc(100% - 20px)" }}
              >
                <span className="text-sm text-gray-900 truncate">{thread.title}</span>
                <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                  {relTime(thread.updatedAt)}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Settings */}
      <div className="border-t border-gray-200 px-4 py-2">
        <button
          onClick={onSettings}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-900 hover:bg-gray-200/70 transition-colors"
        >
          <Settings size={16} className="text-gray-500" />
          設定
        </button>
      </div>
    </div>
  );
}
