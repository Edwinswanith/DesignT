"use client";

import { PROMPT_SUGGESTIONS } from "@/constants/prompts";

interface PromptSuggestionsProps {
  onSelect: (prompt: string) => void;
}

export function PromptSuggestions({ onSelect }: PromptSuggestionsProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-[var(--text-primary)]">
        Quick Ideas
      </label>
      <div className="flex flex-wrap gap-2">
        {PROMPT_SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => onSelect(suggestion.prompt)}
            className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)]
              bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-full
              hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]
              transition-all duration-200 active:scale-[0.98]"
          >
            {suggestion.label}
          </button>
        ))}
      </div>
    </div>
  );
}
