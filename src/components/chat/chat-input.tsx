"use client";

import { useState, useRef, useCallback } from "react";
import { Plus, ChevronDown, Mic, ArrowUp } from "lucide-react";
import { models, reasoningLevels } from "@/lib/mock-data";

interface ChatInputProps {
  onSend: (message: string) => void;
  selectedModel: string;
  selectedReasoning: string;
  onModelChange: (model: string) => void;
  onReasoningChange: (level: string) => void;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  selectedModel,
  selectedReasoning,
  onModelChange,
  onReasoningChange,
  placeholder,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [showModels, setShowModels] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, [value, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  };

  const curModel = models.find((m) => m.id === selectedModel) || models[0];
  const curReasoning = reasoningLevels.find((r) => r.id === selectedReasoning) || reasoningLevels[1];

  return (
    <div className="px-6 pb-4 pt-2">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || "Codex に質問してみましょう。ファイルを追加するには @、コマンドには / を使用します"}
            rows={1}
            className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 px-4 pt-3.5 pb-2 resize-none outline-none"
            style={{ minHeight: 44, maxHeight: 160 }}
          />
          <div className="flex items-center justify-between px-3 pb-2.5">
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500">
                <Plus size={18} />
              </button>

              {/* Model */}
              <div className="relative">
                <button
                  onClick={() => { setShowModels(!showModels); setShowReasoning(false); }}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-sm text-gray-500 hover:bg-gray-100"
                >
                  {curModel.name} <ChevronDown size={12} />
                </button>
                {showModels && (
                  <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1">
                    {models.map((m) => (
                      <button key={m.id} onClick={() => { onModelChange(m.id); setShowModels(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${m.id === selectedModel ? "text-blue-600 font-medium" : "text-gray-900"}`}>
                        {m.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Reasoning */}
              <div className="relative">
                <button
                  onClick={() => { setShowReasoning(!showReasoning); setShowModels(false); }}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-sm text-gray-500 hover:bg-gray-100"
                >
                  {curReasoning.name} <ChevronDown size={12} />
                </button>
                {showReasoning && (
                  <div className="absolute bottom-full left-0 mb-2 w-32 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1">
                    {reasoningLevels.map((l) => (
                      <button key={l.id} onClick={() => { onReasoningChange(l.id); setShowReasoning(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${l.id === selectedReasoning ? "text-blue-600 font-medium" : "text-gray-900"}`}>
                        {l.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400">
                <Mic size={18} />
              </button>
              <button
                onClick={handleSubmit}
                disabled={!value.trim()}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{
                  background: value.trim() ? "#1a1a1a" : "#e5e5ea",
                  color: value.trim() ? "#fff" : "#aeaeb2",
                }}
              >
                <ArrowUp size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
