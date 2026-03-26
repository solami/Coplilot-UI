"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, Paperclip, ChevronDown, StopCircle } from "lucide-react";
import { models } from "@/lib/mock-data";

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  isStreaming?: boolean;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export function ChatInput({
  onSend,
  onStop,
  isStreaming,
  selectedModel,
  onModelChange,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [showModels, setShowModels] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    if (!value.trim() || isStreaming) return;
    onSend(value.trim());
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, isStreaming, onSend]);

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
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
  };

  const currentModel = models.find((m) => m.id === selectedModel) || models[0];

  return (
    <div className="border-t border-[#30363d] bg-[#0d1117] p-4">
      <div className="relative max-w-4xl mx-auto">
        <div className="rounded-xl border border-[#30363d] bg-[#161b22] focus-within:border-[#58a6ff]/50 transition-colors">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask Copilot anything..."
            rows={1}
            className="w-full bg-transparent text-sm text-[#e6edf3] placeholder-[#6e7681] px-4 pt-3 pb-2 resize-none outline-none min-h-[44px] max-h-[200px]"
          />

          {/* Bottom bar */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-[#21262d]">
            <div className="flex items-center gap-2">
              {/* Model selector */}
              <div className="relative">
                <button
                  onClick={() => setShowModels(!showModels)}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d] transition-colors font-mono"
                >
                  {currentModel.name}
                  <ChevronDown size={10} />
                </button>
                {showModels && (
                  <div className="absolute bottom-full left-0 mb-2 w-56 bg-[#1c2128] border border-[#30363d] rounded-lg shadow-xl z-50 overflow-hidden">
                    {models.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          onModelChange(model.id);
                          setShowModels(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-[#30363d] transition-colors ${
                          model.id === selectedModel
                            ? "text-[#58a6ff]"
                            : "text-[#e6edf3]"
                        }`}
                      >
                        <span>{model.name}</span>
                        <span className="text-[#6e7681]">{model.provider}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Attach button */}
              <button className="p-1 rounded-md text-[#6e7681] hover:text-[#8b949e] hover:bg-[#21262d] transition-colors">
                <Paperclip size={14} />
              </button>
            </div>

            {/* Send / Stop */}
            {isStreaming ? (
              <motion.button
                onClick={onStop}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f85149]/10 text-[#f85149] hover:bg-[#f85149]/20 text-xs font-medium transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <StopCircle size={14} />
                Stop
              </motion.button>
            ) : (
              <motion.button
                onClick={handleSubmit}
                disabled={!value.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#58a6ff] text-white text-xs font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#58a6ff]/90 transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <Send size={14} />
                Send
              </motion.button>
            )}
          </div>
        </div>

        <p className="text-center text-[10px] text-[#6e7681] mt-2">
          Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
