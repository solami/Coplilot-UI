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
  { icon: Sparkles, color: "#a855f7", bg: "#faf5ff", text: "Build a classic Snake game in this repo." },
  { icon: FileText, color: "#ef4444", bg: "#fef2f2", text: "Create a one-page $pdf that summarizes this app." },
  { icon: Pencil, color: "#f97316", bg: "#fff7ed", text: "Create a plan to..." },
];

export function WelcomeScreen({ projectName, projects, onSelectProject, onSuggestion }: WelcomeScreenProps) {
  const [showDrop, setShowDrop] = useState(false);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8">
      {/* Logo */}
      <div className="mb-6 text-gray-900">
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <path d="M18 14c0 0 7 4 10 12c3-8 10-12 10-12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M14 28c0 0 5-4 14-4c9 0 14 4 14 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M20 38c0 0 3-4 8-4c5 0 8 4 8 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="22" cy="28" r="1.5" fill="currentColor"/>
          <circle cx="34" cy="28" r="1.5" fill="currentColor"/>
        </svg>
      </div>

      <h1 className="text-3xl font-semibold text-gray-900 mb-3">始めましょう</h1>

      {/* Project selector */}
      <div className="relative mb-16">
        <button
          onClick={() => setShowDrop(!showDrop)}
          className="flex items-center gap-1.5 text-lg text-gray-500 hover:text-gray-700 transition-colors"
        >
          {projectName}
          <ChevronDown size={18} />
        </button>
        {showDrop && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden py-1">
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => { onSelectProject(p.id); setShowDrop(false); }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  p.name === projectName ? "font-medium text-blue-600" : "text-gray-900"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Explore more */}
      <div className="self-end mr-4 mb-3">
        <button className="text-sm text-gray-500 hover:text-gray-700">Explore more</button>
      </div>

      {/* Suggestion cards */}
      <div className="flex gap-3 w-full max-w-3xl">
        {suggestions.map((s, i) => {
          const Icon = s.icon;
          return (
            <button
              key={i}
              onClick={() => onSuggestion(s.text)}
              className="flex-1 flex flex-col gap-3 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-left transition-colors bg-white"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: s.bg }}>
                <Icon size={16} style={{ color: s.color }} />
              </div>
              <span className="text-sm text-gray-900 leading-snug">{s.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
