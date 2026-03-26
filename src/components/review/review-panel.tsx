"use client";

import { DiffFile } from "@/types";
import { DiffView } from "./diff-view";
import { ReviewActions } from "./review-actions";

interface ReviewPanelProps {
  files: DiffFile[];
  onApprove: () => void;
  onReject: () => void;
  onComment: () => void;
}

export function ReviewPanel({ files, onApprove, onReject, onComment }: ReviewPanelProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="px-6 py-3 border-b border-[#30363d] bg-[#161b22]">
        <h2 className="text-sm font-medium text-[#e6edf3]">
          Review Changes
        </h2>
        <p className="text-xs text-[#8b949e] mt-0.5">
          Optimize database queries - {files.length} files changed
        </p>
      </div>

      {/* Diff content */}
      <div className="flex-1 overflow-y-auto p-6">
        <DiffView files={files} />
      </div>

      {/* Actions */}
      <ReviewActions
        onApprove={onApprove}
        onReject={onReject}
        onComment={onComment}
      />
    </div>
  );
}
