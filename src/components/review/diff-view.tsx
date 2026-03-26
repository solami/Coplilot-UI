"use client";

import { motion } from "framer-motion";
import { DiffFile } from "@/types";
import { FileText, FilePlus, FileX } from "lucide-react";

interface DiffViewProps {
  files: DiffFile[];
}

const statusIcons = {
  added: FilePlus,
  modified: FileText,
  deleted: FileX,
};

const statusColors = {
  added: "text-[#3fb950]",
  modified: "text-[#d29922]",
  deleted: "text-[#f85149]",
};

export function DiffView({ files }: DiffViewProps) {
  return (
    <div className="space-y-4">
      {files.map((file, fileIndex) => {
        const Icon = statusIcons[file.status];
        return (
          <motion.div
            key={file.filename}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: fileIndex * 0.1 }}
            className="rounded-lg border border-[#30363d] overflow-hidden"
          >
            {/* File header */}
            <div className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
              <Icon size={14} className={statusColors[file.status]} />
              <span className="text-sm font-mono text-[#e6edf3]">
                {file.filename}
              </span>
              <div className="ml-auto flex items-center gap-2 text-xs">
                <span className="text-[#3fb950]">+{file.additions}</span>
                <span className="text-[#f85149]">-{file.deletions}</span>
              </div>
            </div>

            {/* Hunks */}
            {file.hunks.map((hunk, hunkIndex) => (
              <div key={hunkIndex}>
                <div className="diff-header px-4 py-1 text-xs font-mono text-[#8b949e]">
                  {hunk.header}
                </div>
                <div className="font-mono text-xs">
                  {hunk.lines.map((line, lineIndex) => (
                    <div
                      key={lineIndex}
                      className={`flex ${
                        line.type === "added"
                          ? "diff-added"
                          : line.type === "removed"
                          ? "diff-removed"
                          : ""
                      }`}
                    >
                      <span className="w-12 text-right pr-2 select-none text-[#6e7681] border-r border-[#21262d] shrink-0">
                        {line.oldLineNumber || ""}
                      </span>
                      <span className="w-12 text-right pr-2 select-none text-[#6e7681] border-r border-[#21262d] shrink-0">
                        {line.newLineNumber || ""}
                      </span>
                      <span className="w-6 text-center select-none text-[#6e7681] shrink-0">
                        {line.type === "added"
                          ? "+"
                          : line.type === "removed"
                          ? "-"
                          : " "}
                      </span>
                      <span className="flex-1 px-2 whitespace-pre text-[#e6edf3]">
                        {line.content}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        );
      })}
    </div>
  );
}
