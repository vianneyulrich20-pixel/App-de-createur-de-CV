import React from "react";
import { SpellError } from "../../utils/spellChecker";
import { Check, Sparkles, AlertCircle } from "lucide-react";

interface SpellHighlightedTextProps {
  text: string;
  errors: SpellError[];
  onApplyCorrection: (error: SpellError) => void;
  className?: string;
}

/**
 * Renders text with potential spelling errors underlined in wavy red.
 * Hovering over an underlined word displays a clean tooltip with the suggestion and a click-to-replace action.
 */
export const SpellHighlightedText: React.FC<SpellHighlightedTextProps> = ({
  text,
  errors,
  onApplyCorrection,
  className = "",
}) => {
  if (!text) return null;
  if (!errors || errors.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // Build segments of normal text and error spans
  const segments: React.ReactNode[] = [];
  let lastIndex = 0;

  errors.forEach((err, idx) => {
    // Plain text before this error
    if (err.startIndex > lastIndex) {
      segments.push(
        <span key={`plain-${lastIndex}`}>
          {text.substring(lastIndex, err.startIndex)}
        </span>
      );
    }

    // Error word segment with wavy red underline and hover suggestion tooltip
    segments.push(
      <span
        key={`err-${err.id || idx}`}
        className="relative inline-block mx-0.5 group/spell align-baseline"
      >
        {/* Underlined Word */}
        <span
          tabIndex={0}
          role="button"
          onClick={() => onApplyCorrection(err)}
          onKeyDown={(e) => e.key === "Enter" && onApplyCorrection(err)}
          title={`Suggestion : ${err.suggestion} (cliquez pour appliquer)`}
          className="underline decoration-wavy decoration-rose-500 decoration-2 text-rose-300 bg-rose-500/10 px-1 py-0.5 rounded cursor-pointer font-medium hover:bg-rose-500/25 transition-all outline-none focus:ring-2 focus:ring-rose-500"
        >
          {err.word}
        </span>

        {/* Hover Suggestion Tooltip (pops up on hover of the red-underlined word) */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/spell:flex flex-col items-center z-50 pointer-events-auto filter drop-shadow-xl min-w-[200px]">
          <div className="bg-slate-900 border border-rose-500/40 text-slate-100 text-xs rounded-xl p-2.5 shadow-2xl space-y-1.5 w-full">
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-rose-400" />
                Erreur détectée
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {err.type === "accent" ? "Accentuation" : err.type === "doublon" ? "Répétition" : "Orthographe"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-300 text-xs">
              <span className="line-through text-slate-400 font-mono">{err.word}</span>
              <span className="text-slate-500">→</span>
              <span className="font-bold text-emerald-400 font-mono text-sm">{err.suggestion}</span>
            </div>

            {err.reason && (
              <p className="text-[10px] text-slate-400 leading-tight">
                {err.reason}
              </p>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onApplyCorrection(err);
              }}
              className="w-full mt-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Remplacer par « {err.suggestion} »</span>
            </button>
          </div>
          {/* Tooltip beak arrow */}
          <div className="w-2.5 h-2.5 bg-slate-900 border-r border-b border-rose-500/40 rotate-45 -mt-1.5"></div>
        </div>
      </span>
    );

    lastIndex = err.endIndex;
  });

  // Remaining plain text
  if (lastIndex < text.length) {
    segments.push(
      <span key={`plain-end`}>{text.substring(lastIndex)}</span>
    );
  }

  return <span className={className}>{segments}</span>;
};
