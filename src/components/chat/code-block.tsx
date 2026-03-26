"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = "typescript" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-[#30363d] overflow-hidden my-3">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#161b22] border-b border-[#30363d]">
        <span className="text-xs text-[#8b949e] font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#30363d] transition-colors"
        >
          {copied ? (
            <>
              <Check size={12} className="text-[#3fb950]" />
              <span className="text-[#3fb950]">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <SyntaxHighlighter
        language={language}
        style={atomOneDark}
        showLineNumbers
        customStyle={{
          margin: 0,
          padding: "1rem",
          background: "#0d1117",
          fontSize: "13px",
          lineHeight: "1.5",
        }}
        lineNumberStyle={{
          color: "#6e7681",
          fontSize: "12px",
          paddingRight: "1rem",
          minWidth: "2.5em",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
