"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Minimize2 } from "lucide-react";

interface TerminalPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function TerminalContent() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [lines] = useState<string[]>([
    "\x1b[32m$\x1b[0m cd ~/projects/copilot-ui",
    "\x1b[32m$\x1b[0m npm run dev",
    "",
    "  \x1b[36m▲ Next.js 16.2.1\x1b[0m",
    "  - Local:        \x1b[36mhttp://localhost:3000\x1b[0m",
    "  - Environments:  .env.local",
    "",
    " \x1b[32m✓\x1b[0m Ready in 1.8s",
    "",
    "\x1b[32m$\x1b[0m npm test",
    "",
    " PASS  src/__tests__/auth.test.ts",
    "  \x1b[32m✓\x1b[0m should authenticate with GitHub OAuth (42ms)",
    "  \x1b[32m✓\x1b[0m should handle session management (18ms)",
    "  \x1b[32m✓\x1b[0m should redirect unauthenticated users (12ms)",
    "",
    " Test Suites: \x1b[32m1 passed\x1b[0m, 1 total",
    " Tests:       \x1b[32m3 passed\x1b[0m, 3 total",
    " Time:        0.84 s",
    "",
    "\x1b[32m$\x1b[0m \x1b[5m▊\x1b[0m",
  ]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div
      ref={terminalRef}
      className="flex-1 overflow-y-auto p-4 font-mono text-sm leading-relaxed"
    >
      {lines.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap">
          {parseAnsiLine(line)}
        </div>
      ))}
    </div>
  );
}

function parseAnsiLine(line: string): React.ReactNode {
  // Simple ANSI parser for demo
  const parts: React.ReactNode[] = [];
  let remaining = line;
  let key = 0;

  const colorMap: Record<string, string> = {
    "32": "text-[#3fb950]",
    "36": "text-[#58a6ff]",
    "33": "text-[#d29922]",
    "31": "text-[#f85149]",
    "35": "text-[#bc8cff]",
    "5": "", // blink - skip
    "0": "",
  };

  while (remaining.length > 0) {
    const match = remaining.match(/\x1b\[(\d+)m/);
    if (!match) {
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }

    const beforeEscape = remaining.substring(0, match.index);
    if (beforeEscape) {
      parts.push(<span key={key++}>{beforeEscape}</span>);
    }

    const code = match[1];
    remaining = remaining.substring((match.index || 0) + match[0].length);

    if (code === "0") continue;
    if (code === "5") continue;

    const endMatch = remaining.match(/\x1b\[0?m/);
    if (endMatch) {
      const coloredText = remaining.substring(0, endMatch.index);
      const className = colorMap[code] || "";
      parts.push(
        <span key={key++} className={className}>
          {coloredText}
        </span>
      );
      remaining = remaining.substring(
        (endMatch.index || 0) + endMatch[0].length
      );
    } else {
      const className = colorMap[code] || "";
      parts.push(
        <span key={key++} className={className}>
          {remaining}
        </span>
      );
      remaining = "";
    }
  }

  return <>{parts}</>;
}

export function TerminalPanel({ isOpen, onClose }: TerminalPanelProps) {
  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: isMaximized ? "60%" : 250 }}
          exit={{ height: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="border-t border-[#30363d] bg-[#0d1117] flex flex-col overflow-hidden"
        >
          {/* Terminal header */}
          <div className="flex items-center justify-between px-4 py-1.5 bg-[#161b22] border-b border-[#21262d] shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#3fb950]" />
              <span className="text-xs text-[#8b949e] font-mono">
                Terminal
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-1 rounded hover:bg-[#30363d] text-[#6e7681] hover:text-[#8b949e] transition-colors"
              >
                {isMaximized ? (
                  <Minimize2 size={12} />
                ) : (
                  <Maximize2 size={12} />
                )}
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-[#30363d] text-[#6e7681] hover:text-[#8b949e] transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          </div>

          <TerminalContent />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
