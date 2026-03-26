"use client";

import { Pause, Play, Square, CheckCircle } from "lucide-react";
import { AgentState } from "@/types";

interface AgentControlsProps {
  state: AgentState;
  onPause?: () => void;
  onResume?: () => void;
  onStop?: () => void;
  onApprove?: () => void;
}

export function AgentControls({
  state,
  onPause,
  onResume,
  onStop,
  onApprove,
}: AgentControlsProps) {
  if (state === "idle") return null;

  return (
    <div className="flex items-center gap-2 px-6 py-2 border-t border-[#21262d]">
      {state !== "error" && (
        <>
          <button
            onClick={onPause}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#21262d] text-[#8b949e] hover:text-[#e6edf3] text-xs transition-colors"
          >
            <Pause size={12} />
            Pause
          </button>
          <button
            onClick={onStop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#f85149]/10 text-[#f85149] hover:bg-[#f85149]/20 text-xs transition-colors"
          >
            <Square size={12} />
            Stop
          </button>
        </>
      )}
      {onApprove && (
        <button
          onClick={onApprove}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#3fb950]/10 text-[#3fb950] hover:bg-[#3fb950]/20 text-xs transition-colors ml-auto"
        >
          <CheckCircle size={12} />
          Approve
        </button>
      )}
    </div>
  );
}
