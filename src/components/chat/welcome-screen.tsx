"use client";

import { useState } from "react";
import { ChevronDown, Sparkles, FileText, Pencil } from "lucide-react";

interface WelcomeScreenProps {
  projectName: string;
  projects: { id: string; name: string }[];
  onSelectProject: (id: string) => void;
  onSuggestion: (text: string) => void;
}

const suggestions = [
  {
    icon: Sparkles,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-50",
    text: "Build a classic Snake game in this repo.",
  },
  {
    icon: FileText,
    iconColor: "text-red-500",
    iconBg: "bg-red-50",
    text: "Create a one-page $pdf that summarizes this app.",
  },
  {
    icon: Pencil,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-50",
    text: "Create a plan to...",
  },
];

export function WelcomeScreen({
  projectName,
  projects,
  onSelectProject,
  onSuggestion,
}: WelcomeScreenProps) {
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8">
      {/* Codex logo */}
      <div className="mb-6">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="text-[var(--color-text-primary)]">
          <path d="M20 16C20 16 28 20 32 28C36 20 44 16 44 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M16 32C16 32 22 28 32 28C42 28 48 32 48 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M22 40C22 40 26 36 32 36C38 36 42 40 42 40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="24" cy="32" r="2" fill="currentColor"/>
          <circle cx="40" cy="32" r="2" fill="currentColor"/>
        </svg>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-semibold text-[var(--color-text-primary)] mb-3">
        始めましょう
      </h1>

      {/* Project selector */}
      <div className="relative mb-12">
        <button
          onClick={() => setShowProjectDropdown(!showProjectDropdown)}
          className="flex items-center gap-1.5 text-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          {projectName}
          <ChevronDown size={18} />
        </button>

        {showProjectDropdown && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-[var(--color-border-default)] rounded-xl shadow-lg z-50 overflow-hidden">
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  onSelectProject(p.id);
                  setShowProjectDropdown(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[var(--color-bg-hover)] transition-colors ${
                  p.name === projectName ? "font-medium text-[var(--color-accent-blue)]" : "text-[var(--color-text-primary)]"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Explore more link */}
      <div className="self-end mr-4 mb-3">
        <button className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
          Explore more
        </button>
      </div>

      {/* Suggestion cards */}
      <div className="flex gap-3 w-full max-w-3xl">
        {suggestions.map((s, i) => {
          const Icon = s.icon;
          return (
            <button
              key={i}
              onClick={() => onSuggestion(s.text)}
              className="flex-1 flex flex-col gap-3 p-4 rounded-xl border border-[var(--color-border-default)] hover:border-[var(--color-border-default)] hover:bg-[var(--color-bg-hover)] text-left transition-colors bg-white"
            >
              <div className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                <Icon size={16} className={s.iconColor} />
              </div>
              <span className="text-sm text-[var(--color-text-primary)] leading-snug">
                {s.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
