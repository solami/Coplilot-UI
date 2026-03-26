"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MessageSquare,
  Plus,
  GitPullRequestArrow,
  Terminal,
  Settings,
  Folder,
  Command,
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
}

const commands = [
  { id: "new-thread", label: "New Thread", icon: Plus, shortcut: "N" },
  { id: "chat", label: "Open Chat", icon: MessageSquare, shortcut: "1" },
  { id: "review", label: "Open Review", icon: GitPullRequestArrow, shortcut: "2" },
  { id: "terminal", label: "Toggle Terminal", icon: Terminal, shortcut: "`" },
  { id: "settings", label: "Settings", icon: Settings, shortcut: "," },
  { id: "switch-project", label: "Switch Project", icon: Folder, shortcut: "P" },
];

export function CommandPalette({ isOpen, onClose, onAction }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(query.toLowerCase()) ||
      cmd.id.includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filtered[selectedIndex]) {
          onAction(filtered[selectedIndex].id);
          onClose();
        }
        break;
      case "Escape":
        onClose();
        break;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50"
          >
            <div className="bg-[#1c2128] border border-[#30363d] rounded-xl shadow-2xl overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[#30363d]">
                <Search size={16} className="text-[#6e7681] shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a command..."
                  className="flex-1 bg-transparent text-sm text-[#e6edf3] placeholder-[#6e7681] outline-none"
                />
                <kbd className="px-1.5 py-0.5 rounded bg-[#21262d] text-[10px] text-[#6e7681] font-mono">
                  ESC
                </kbd>
              </div>

              {/* Commands */}
              <div className="max-h-80 overflow-y-auto py-2">
                {filtered.map((cmd, index) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        onAction(cmd.id);
                        onClose();
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        index === selectedIndex
                          ? "bg-[#30363d] text-[#e6edf3]"
                          : "text-[#8b949e] hover:bg-[#21262d]"
                      }`}
                    >
                      <Icon size={16} className="shrink-0" />
                      <span className="flex-1 text-left">{cmd.label}</span>
                      <kbd className="px-1.5 py-0.5 rounded bg-[#21262d] text-[10px] text-[#6e7681] font-mono">
                        <Command size={10} className="inline -mt-0.5" />
                        {cmd.shortcut}
                      </kbd>
                    </button>
                  );
                })}
                {filtered.length === 0 && (
                  <p className="px-4 py-8 text-center text-sm text-[#6e7681]">
                    No commands found
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
