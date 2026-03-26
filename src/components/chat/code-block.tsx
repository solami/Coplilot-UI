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
    <div className="rounded-lg border border-gray-200 overflow-hidden my-3">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-700" style={{ background: "#2d2d2d" }}>
        <span className="text-xs font-mono" style={{ color: "#999" }}>{language}</span>
        <button onClick={handleCopy} className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs" style={{ color: "#999" }}>
          {copied ? <><Check size={12} style={{ color: "#4ade80" }} /><span style={{ color: "#4ade80" }}>Copied</span></> : <><Copy size={12} /><span>Copy</span></>}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={atomOneDark}
        showLineNumbers
        customStyle={{ margin: 0, padding: "1rem", background: "#1e1e1e", fontSize: "13px", lineHeight: "1.6" }}
        lineNumberStyle={{ color: "#555", fontSize: "12px", paddingRight: "1rem", minWidth: "2.5em" }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
