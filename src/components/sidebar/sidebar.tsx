"use client";

import { SquarePen, Clock, Grid2x2, Settings, FolderClosed, ChevronRight } from "lucide-react";
import { Project } from "@/types";
import { formatRelativeTime } from "@/lib/utils";

interface SidebarProps {
  projects: Project[];
  activeThreadId: string | null;
  onSelectThread: (id: string) => void;
  onNewThread: () => void;
  onSettings: () => void;
}

export function Sidebar({
  projects,
  activeThreadId,
  onSelectThread,
  onNewThread,
  onSettings,
}: SidebarProps) {
  return (
    <div className="w-[340px] h-full border-r border-[var(--color-border-default)] bg-[var(--color-bg-sidebar)] flex flex-col shrink-0 select-none">
      {/* Top actions */}
      <div className="px-4 pt-12 pb-2 space-y-0.5">
        <button
          onClick={onNewThread}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
        >
          <SquarePen size={16} className="text-[var(--color-text-secondary)]" />
          新しいスレッド
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors">
          <Clock size={16} className="text-[var(--color-text-secondary)]" />
          オートメーション
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors">
          <Grid2x2 size={16} className="text-[var(--color-text-secondary)]" />
          スキル
        </button>
      </div>

      {/* Threads header */}
      <div className="flex items-center justify-between px-6 pt-4 pb-1">
        <span className="text-xs text-[var(--color-text-tertiary)] font-medium">
          スレッド
        </span>
        <div className="flex items-center gap-1">
          <button className="p-1 rounded hover:bg-[var(--color-bg-hover)] text-[var(--color-text-tertiary)]">
            <ChevronRight size={14} />
          </button>
          <button className="p-1 rounded hover:bg-[var(--color-bg-hover)] text-[var(--color-text-tertiary)]">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="2" y1="4" x2="14" y2="4" />
              <line x1="2" y1="8" x2="14" y2="8" />
              <line x1="2" y1="12" x2="14" y2="12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Thread list grouped by project */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {projects.map((project) => (
          <div key={project.id} className="mb-1">
            {/* Project header */}
            <div className="flex items-center gap-2 px-3 py-2">
              <FolderClosed size={14} className="text-[var(--color-text-secondary)]" />
              <span className="text-sm text-[var(--color-text-primary)] font-medium">
                {project.name}
              </span>
            </div>

            {/* Project threads */}
            {project.threads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => onSelectThread(thread.id)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 ml-5 rounded-lg text-left transition-colors ${
                  activeThreadId === thread.id
                    ? "bg-[var(--color-bg-active)]"
                    : "hover:bg-[var(--color-bg-hover)]"
                }`}
              >
                <span className="text-sm text-[var(--color-text-primary)] truncate">
                  {thread.title}
                </span>
                <span className="text-xs text-[var(--color-text-tertiary)] whitespace-nowrap shrink-0">
                  {formatRelativeTime(thread.updatedAt)}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom settings */}
      <div className="border-t border-[var(--color-border-default)] px-4 py-2">
        <button
          onClick={onSettings}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
        >
          <Settings size={16} className="text-[var(--color-text-secondary)]" />
          設定
        </button>
      </div>
    </div>
  );
}
