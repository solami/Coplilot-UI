"use client";

import { SquarePen, Clock, Grid2x2, Settings, FolderClosed, ArrowRightLeft, ListFilter } from "lucide-react";
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
    <div className="h-full border-r border-gray-200/80 bg-[#f9f9f9] flex flex-col shrink-0 select-none" style={{ width: 350, minWidth: 350 }}>

      {/* Top nav actions */}
      <div className="px-5 pt-14 pb-3 space-y-1">
        <button
          onClick={onNewThread}
          className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[15px] text-gray-800 hover:bg-black/[0.04] active:bg-black/[0.07] transition-colors"
        >
          <SquarePen size={18} className="text-gray-400" />
          新しいスレッド
        </button>
        <button className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[15px] text-gray-800 hover:bg-black/[0.04] active:bg-black/[0.07] transition-colors">
          <Clock size={18} className="text-gray-400" />
          オートメーション
        </button>
        <button className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[15px] text-gray-800 hover:bg-black/[0.04] active:bg-black/[0.07] transition-colors">
          <Grid2x2 size={18} className="text-gray-400" />
          スキル
        </button>
      </div>

      {/* Threads header */}
      <div className="flex items-center justify-between px-7 pt-5 pb-2">
        <span className="text-[13px] text-gray-400 font-medium tracking-wide">スレッド</span>
        <div className="flex items-center gap-0.5">
          <button className="p-1.5 rounded-lg hover:bg-black/[0.04] text-gray-400 transition-colors">
            <ArrowRightLeft size={15} />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-black/[0.04] text-gray-400 transition-colors">
            <ListFilter size={15} />
          </button>
        </div>
      </div>

      {/* Thread list by project */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {projects.map((project) => (
          <div key={project.id} className="mb-2">
            {/* Project folder */}
            <div className="flex items-center gap-2.5 px-3 py-2">
              <FolderClosed size={16} className="text-gray-400 shrink-0" />
              <span className="text-[15px] text-gray-800 font-medium">{project.name}</span>
            </div>

            {/* Threads under project */}
            {project.threads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => onSelectThread(thread.id)}
                className={`w-full flex items-center justify-between gap-3 pl-10 pr-3 py-2 rounded-xl text-left transition-colors ${
                  activeThreadId === thread.id
                    ? "bg-black/[0.06]"
                    : "hover:bg-black/[0.03]"
                }`}
              >
                <span className="text-[14px] text-gray-700 truncate leading-snug">
                  {thread.title}
                </span>
                <span className="text-[13px] text-gray-400 whitespace-nowrap shrink-0 tabular-nums">
                  {relTime(thread.updatedAt)}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom: Settings */}
      <div className="border-t border-gray-200/80 px-5 py-3">
        <button
          onClick={onSettings}
          className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[15px] text-gray-800 hover:bg-black/[0.04] active:bg-black/[0.07] transition-colors"
        >
          <Settings size={18} className="text-gray-400" />
          設定
        </button>
      </div>
    </div>
  );
}
