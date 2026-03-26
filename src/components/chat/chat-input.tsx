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
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 160) + "px";
  };

  const currentModel = models.find((m) => m.id === selectedModel) || models[0];
  const currentReasoning = reasoningLevels.find((r) => r.id === selectedReasoning) || reasoningLevels[1];

  return (
    <div className="px-6 pb-4 pt-2">
      <div className="max-w-3xl mx-auto">
        {/* Input container */}
        <div className="rounded-2xl border border-[var(--color-border-default)] bg-white shadow-sm">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || "Codex に質問してみましょう。ファイルを追加するには @、コマンドには / を使用します"}
            rows={1}
            className="w-full bg-transparent text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] px-4 pt-3.5 pb-2 resize-none outline-none min-h-[44px] max-h-[160px]"
          />

          {/* Bottom bar */}
          <div className="flex items-center justify-between px-3 pb-2.5">
            <div className="flex items-center gap-1">
              {/* Plus button */}
              <button className="p-1.5 rounded-md hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] transition-colors">
                <Plus size={18} />
              </button>

              {/* Model selector */}
              <div className="relative">
                <button
                  onClick={() => { setShowModels(!showModels); setShowReasoning(false); }}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors"
                >
                  {currentModel.name}
                  <ChevronDown size={12} />
                </button>
                {showModels && (
                  <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-[var(--color-border-default)] rounded-xl shadow-lg z-50 overflow-hidden">
                    {models.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => { onModelChange(model.id); setShowModels(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[var(--color-bg-hover)] transition-colors ${
                          model.id === selectedModel ? "text-[var(--color-accent-blue)] font-medium" : "text-[var(--color-text-primary)]"
                        }`}
                      >
                        {model.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Reasoning level */}
              <div className="relative">
                <button
                  onClick={() => { setShowReasoning(!showReasoning); setShowModels(false); }}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors"
                >
                  {currentReasoning.name}
                  <ChevronDown size={12} />
                </button>
                {showReasoning && (
                  <div className="absolute bottom-full left-0 mb-2 w-32 bg-white border border-[var(--color-border-default)] rounded-xl shadow-lg z-50 overflow-hidden">
                    {reasoningLevels.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => { onReasoningChange(level.id); setShowReasoning(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[var(--color-bg-hover)] transition-colors ${
                          level.id === selectedReasoning ? "text-[var(--color-accent-blue)] font-medium" : "text-[var(--color-text-primary)]"
                        }`}
                      >
                        {level.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Mic button */}
              <button className="p-1.5 rounded-md hover:bg-[var(--color-bg-hover)] text-[var(--color-text-tertiary)] transition-colors">
                <Mic size={18} />
              </button>

              {/* Send button */}
              <button
                onClick={handleSubmit}
                disabled={!value.trim()}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  value.trim()
                    ? "bg-[var(--color-text-primary)] text-white"
                    : "bg-[var(--color-bg-hover)] text-[var(--color-text-tertiary)]"
                }`}
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
