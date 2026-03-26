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
}

export function ChatInput({
  onSend,
  selectedModel,
  selectedReasoning,
  onModelChange,
  onReasoningChange,
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
    ta.style.height = Math.min(ta.scrollHeight, 180) + "px";
  };

  const curModel = models.find((m) => m.id === selectedModel) || models[0];
  const curReasoning = reasoningLevels.find((r) => r.id === selectedReasoning) || reasoningLevels[1];

  return (
    <div className="px-8 pb-5 pt-3">
      <div className="max-w-[780px] mx-auto">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Codex に質問してみましょう。ファイルを追加するには @、コマンドには / を使用します"
            rows={1}
            className="w-full bg-transparent text-[15px] text-gray-900 placeholder-gray-400 px-5 pt-4 pb-2 resize-none outline-none leading-relaxed"
            style={{ minHeight: 52, maxHeight: 180 }}
          />

          {/* Bottom bar */}
          <div className="flex items-center justify-between px-4 pb-3">
            <div className="flex items-center gap-0.5">
              {/* Plus */}
              <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                <Plus size={20} />
              </button>

              {/* Model selector */}
              <div className="relative">
                <button
                  onClick={() => { setShowModels(!showModels); setShowReasoning(false); }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[14px] text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  {curModel.name}
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
                {showModels && (
                  <div className="absolute bottom-full left-0 mb-2 w-52 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 py-1.5">
                    {models.map((m) => (
                      <button key={m.id} onClick={() => { onModelChange(m.id); setShowModels(false); }}
                        className={`w-full text-left px-5 py-2.5 text-[14px] hover:bg-gray-50 transition-colors ${
                          m.id === selectedModel ? "text-blue-600 font-medium" : "text-gray-800"
                        }`}>
                        {m.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Reasoning level */}
              <div className="relative">
                <button
                  onClick={() => { setShowReasoning(!showReasoning); setShowModels(false); }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[14px] text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  {curReasoning.name}
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
                {showReasoning && (
                  <div className="absolute bottom-full left-0 mb-2 w-36 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 py-1.5">
                    {reasoningLevels.map((l) => (
                      <button key={l.id} onClick={() => { onReasoningChange(l.id); setShowReasoning(false); }}
                        className={`w-full text-left px-5 py-2.5 text-[14px] hover:bg-gray-50 transition-colors ${
                          l.id === selectedReasoning ? "text-blue-600 font-medium" : "text-gray-800"
                        }`}>
                        {l.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Mic */}
              <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-300 transition-colors">
                <Mic size={20} />
              </button>

              {/* Send */}
              <button
                onClick={handleSubmit}
                disabled={!value.trim()}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: value.trim() ? "#1a1a1a" : "#e5e5ea",
                  color: value.trim() ? "#fff" : "#aeaeb2",
                }}
              >
                <ArrowUp size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
