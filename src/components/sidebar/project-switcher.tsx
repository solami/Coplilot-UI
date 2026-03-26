"use client";

import { useState } from "react";
import { ChevronDown, Folder } from "lucide-react";
import { Project } from "@/types";

interface ProjectSwitcherProps {
  projects: Project[];
  activeProject: string;
  onSelectProject: (id: string) => void;
}

export function ProjectSwitcher({
  projects,
  activeProject,
  onSelectProject,
}: ProjectSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const current = projects.find((p) => p.name === activeProject) || projects[0];

  return (
    <div className="relative px-3 py-3 border-b border-[#21262d]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[#21262d] transition-colors"
      >
        <Folder size={14} className="text-[#58a6ff] shrink-0" />
        <span className="text-sm font-medium text-[#e6edf3] truncate">
          {current?.name || "Select Project"}
        </span>
        <ChevronDown
          size={14}
          className={`ml-auto text-[#8b949e] transition-transform shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-3 right-3 top-full mt-1 bg-[#1c2128] border border-[#30363d] rounded-lg shadow-xl z-50 overflow-hidden">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => {
                onSelectProject(project.name);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[#30363d] transition-colors ${
                project.name === activeProject
                  ? "text-[#58a6ff] bg-[#58a6ff]/10"
                  : "text-[#e6edf3]"
              }`}
            >
              <Folder size={14} className="shrink-0" />
              <span className="truncate">{project.name}</span>
              <span className="ml-auto text-xs text-[#6e7681] truncate">
                {project.path}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
