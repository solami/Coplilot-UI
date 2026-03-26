"use client";

interface TitleBarProps {
  threadTitle: string;
  agentStatus: string;
  onOpenInEditor?: () => void;
  onCommit?: () => void;
}

export function TitleBar({
  threadTitle,
  agentStatus,
  onOpenInEditor,
  onCommit,
}: TitleBarProps) {
  return (
    <div className="h-12 flex items-center justify-between px-4 border-b border-[var(--color-border-default)] bg-[var(--color-bg-primary)] select-none shrink-0 drag-region">
      {/* Left: Traffic lights */}
      <div className="flex items-center gap-2 w-[80px]">
        <div className="w-3 h-3 rounded-full bg-[var(--color-traffic-red)] cursor-pointer hover:brightness-90 transition-all" />
        <div className="w-3 h-3 rounded-full bg-[var(--color-traffic-yellow)] cursor-pointer hover:brightness-90 transition-all" />
        <div className="w-3 h-3 rounded-full bg-[var(--color-traffic-green)] cursor-pointer hover:brightness-90 transition-all" />
        {/* Window control icon */}
        <button className="ml-1 p-0.5 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="12" height="12" rx="2" />
            <line x1="8" y1="2" x2="8" y2="14" />
          </svg>
        </button>
      </div>

      {/* Center: Thread title + status */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium text-[var(--color-text-primary)]">{threadTitle}</span>
        {agentStatus && (
          <>
            <span className="text-[var(--color-text-tertiary)]">·</span>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${agentStatus === "Idle" ? "bg-[var(--color-text-tertiary)]" : "bg-[var(--color-accent-green)]"}`} />
              <span className="text-[var(--color-text-secondary)] text-sm">{agentStatus}</span>
            </div>
          </>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button className="p-1.5 rounded-md hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="7" cy="7" r="4.5" />
            <line x1="10.5" y1="10.5" x2="14" y2="14" />
          </svg>
        </button>

        {/* Open in editor */}
        <button
          onClick={onOpenInEditor}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--color-border-default)] hover:bg-[var(--color-bg-hover)] text-sm transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M1.5 2.5A1.5 1.5 0 013 1h4.5a.5.5 0 010 1H3a.5.5 0 00-.5.5v11a.5.5 0 00.5.5h10a.5.5 0 00.5-.5V9a.5.5 0 011 0v4.5A1.5 1.5 0 0113 15H3a1.5 1.5 0 01-1.5-1.5v-11z"/>
            <path d="M14.5 1.5a.5.5 0 00-.5-.5H10a.5.5 0 000 1h2.793L7.146 7.646a.5.5 0 00.708.708L13.5 2.707V5.5a.5.5 0 001 0v-4z"/>
          </svg>
          開く
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 4l2 2 2-2" />
          </svg>
        </button>

        {/* Commit */}
        <button
          onClick={onCommit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--color-border-default)] hover:bg-[var(--color-bg-hover)] text-sm transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8" cy="8" r="3" />
            <line x1="8" y1="1" x2="8" y2="5" />
            <line x1="8" y1="11" x2="8" y2="15" />
          </svg>
          コミット
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 4l2 2 2-2" />
          </svg>
        </button>

        {/* Extra action icons */}
        <button className="p-1.5 rounded-md hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 4h12M2 8h12M2 12h12" />
          </svg>
        </button>
        <button className="p-1.5 rounded-md hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 2v12M12 2v12M1 8h14" />
          </svg>
        </button>
        <button className="p-1.5 rounded-md hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8" cy="8" r="6" />
            <path d="M8 5v3l2 1" />
          </svg>
        </button>
      </div>
    </div>
  );
}
