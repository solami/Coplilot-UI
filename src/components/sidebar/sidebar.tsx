"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ThreadList } from "./thread-list";
import { ProjectSwitcher } from "./project-switcher";
import { NavItems } from "./nav-items";
import { Thread, Project, ViewMode } from "@/types";

interface SidebarProps {
  isOpen: boolean;
  threads: Thread[];
  projects: Project[];
  activeThreadId: string | null;
  activeProject: string;
  activeView: ViewMode;
  onSelectThread: (id: string) => void;
  onSelectProject: (id: string) => void;
  onSelectView: (view: ViewMode) => void;
  onNewThread: () => void;
}

export function Sidebar({
  isOpen,
  threads,
  projects,
  activeThreadId,
  activeProject,
  activeView,
  onSelectThread,
  onSelectProject,
  onSelectView,
  onNewThread,
}: SidebarProps) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="h-full border-r border-[#30363d] bg-[#161b22] flex flex-col overflow-hidden shrink-0"
        >
          {/* Project switcher */}
          <ProjectSwitcher
            projects={projects}
            activeProject={activeProject}
            onSelectProject={onSelectProject}
          />

          {/* Navigation */}
          <NavItems activeView={activeView} onSelectView={onSelectView} />

          {/* Thread list */}
          <ThreadList
            threads={threads.filter((t) => t.project === activeProject || activeProject === "all")}
            activeThreadId={activeThreadId}
            onSelectThread={onSelectThread}
            onNewThread={onNewThread}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
