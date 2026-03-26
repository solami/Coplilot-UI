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
  { icon: Sparkles, color: "#a855f7", bg: "#f5f0ff", text: "Build a classic Snake game in this repo." },
  { icon: FileText, color: "#ef4444", bg: "#fef2f2", text: "Create a one-page $pdf that summarizes this app." },
  { icon: Pencil, color: "#f97316", bg: "#fff7ed", text: "Create a plan to..." },
];

export function WelcomeScreen({ projectName, projects, onSelectProject, onSuggestion }: WelcomeScreenProps) {
  const [showDrop, setShowDrop] = useState(false);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-12 pb-8">
      {/* Logo */}
      <div className="mb-8 text-gray-800">
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
          <path d="M22 18c0 0 9 5 14 14c5-9 14-14 14-14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M16 36c0 0 7-5 20-5c13 0 20 5 20 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M24 48c0 0 4-5 12-5c8 0 12 5 12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="28" cy="35" r="2" fill="currentColor"/>
          <circle cx="44" cy="35" r="2" fill="currentColor"/>
        </svg>
      </div>

      {/* Title */}
      <h1 className="text-[34px] font-semibold text-gray-900 mb-4 tracking-tight">
        始めましょう
      </h1>

      {/* Project selector */}
      <div className="relative mb-20">
        <button
          onClick={() => setShowDrop(!showDrop)}
          className="flex items-center gap-2 text-[20px] text-gray-400 hover:text-gray-600 transition-colors"
        >
          {projectName}
          <ChevronDown size={20} />
        </button>
        {showDrop && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden py-1.5">
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => { onSelectProject(p.id); setShowDrop(false); }}
                className={`w-full text-left px-5 py-2.5 text-[15px] hover:bg-gray-50 transition-colors ${
                  p.name === projectName ? "font-medium text-blue-600" : "text-gray-800"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Explore more */}
      <div className="self-end mr-2 mb-4">
        <button className="text-[14px] text-gray-400 hover:text-gray-600 transition-colors">
          Explore more
        </button>
      </div>

      {/* Suggestion cards */}
      <div className="flex gap-4 w-full max-w-[780px]">
        {suggestions.map((s, i) => {
          const Icon = s.icon;
          return (
            <button
              key={i}
              onClick={() => onSuggestion(s.text)}
              className="flex-1 flex flex-col gap-4 p-5 rounded-2xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-left transition-all bg-white shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                <Icon size={20} style={{ color: s.color }} />
              </div>
              <span className="text-[14px] text-gray-800 leading-relaxed">{s.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
