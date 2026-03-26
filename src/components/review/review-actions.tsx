"use client";

import { CheckCircle, XCircle, MessageSquare } from "lucide-react";

interface ReviewActionsProps {
  onApprove: () => void;
  onReject: () => void;
  onComment: () => void;
}

export function ReviewActions({ onApprove, onReject, onComment }: ReviewActionsProps) {
  return (
    <div className="flex items-center gap-3 px-6 py-3 border-t border-[#30363d] bg-[#0d1117]">
      <button
        onClick={onApprove}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3fb950]/10 border border-[#3fb950]/20 text-[#3fb950] hover:bg-[#3fb950]/20 text-sm font-medium transition-colors"
      >
        <CheckCircle size={16} />
        Approve
      </button>
      <button
        onClick={onReject}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f85149]/10 border border-[#f85149]/20 text-[#f85149] hover:bg-[#f85149]/20 text-sm font-medium transition-colors"
      >
        <XCircle size={16} />
        Request Changes
      </button>
      <button
        onClick={onComment}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#30363d] border border-[#30363d] text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#30363d]/80 text-sm font-medium transition-colors"
      >
        <MessageSquare size={16} />
        Comment
      </button>

      <div className="ml-auto text-xs text-[#6e7681]">
        2 files changed, 20 additions, 8 deletions
      </div>
    </div>
  );
}
