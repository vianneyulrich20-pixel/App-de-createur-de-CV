import React, { useMemo, useState } from "react";
import { checkSpelling, applySpellCorrection, applyAllCorrections, SpellError } from "../../utils/spellChecker";
import { SpellHighlightedText } from "./SpellHighlightedText";
import { CheckCheck, AlertTriangle, Check, Sparkles } from "lucide-react";

interface SpellCheckTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  id?: string;
}

export const SpellCheckTextarea: React.FC<SpellCheckTextareaProps> = ({
  value,
  onChange,
  placeholder,
  rows = 3,
  className = "",
  id,
}) => {
  const [showHelper, setShowHelper] = useState(true);

  // Detect errors continuously
  const errors = useMemo(() => {
    return checkSpelling(value);
  }, [value]);

  const handleApplySingle = (err: SpellError) => {
    const updated = applySpellCorrection(value, err);
    onChange(updated);
  };

  const handleApplyAll = () => {
    const updated = applyAllCorrections(value, errors);
    onChange(updated);
  };

  return (
    <div className="space-y-1.5 w-full">
      {/* Native Textarea with spellcheck enabled */}
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={true}
        lang="fr"
        className={className}
      />

      {/* Interactive Spellcheck Assistant Ribbon when potential errors are detected */}
      {errors.length > 0 && (
        <div className="p-2.5 bg-slate-950/90 border border-rose-900/60 rounded-xl space-y-2 text-xs animate-fade-in shadow-inner">
          <div className="flex items-center justify-between gap-2 border-b border-rose-950/80 pb-1.5">
            <div className="flex items-center gap-1.5 text-rose-400 font-semibold text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>
                {errors.length === 1
                  ? "1 faute potentielle détectée"
                  : `${errors.length} fautes potentielles détectées`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleApplyAll}
                className="px-2.5 py-1 bg-emerald-950/60 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-500/40 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                title="Corriger toutes les erreurs détectées d'un seul coup"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tout corriger ({errors.length})</span>
              </button>
            </div>
          </div>

          {/* Interactive Text Display with Red Wavy Underlines and Hover Suggestions */}
          <div className="p-2 bg-slate-900/90 rounded-lg border border-slate-800 text-slate-200 text-xs leading-relaxed font-sans select-text">
            <SpellHighlightedText
              text={value}
              errors={errors}
              onApplyCorrection={handleApplySingle}
            />
          </div>

          <p className="text-[10px] text-slate-400 flex items-center gap-1 italic">
            <span>💡</span>
            <span>Survolez un mot souligné en rouge pour voir la suggestion, ou cliquez dessus pour corriger instantanément.</span>
          </p>
        </div>
      )}

      {/* Subtle confirmation when clean and non-empty */}
      {errors.length === 0 && value.trim().length > 25 && (
        <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-400/80 px-1">
          <Check className="w-3 h-3 text-emerald-400" />
          <span>Orthographe vérifiée</span>
        </div>
      )}
    </div>
  );
};
