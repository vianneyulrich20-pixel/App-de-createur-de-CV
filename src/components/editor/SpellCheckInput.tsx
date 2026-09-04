import React, { useMemo } from "react";
import { checkSpelling, applySpellCorrection, applyAllCorrections, SpellError } from "../../utils/spellChecker";
import { SpellHighlightedText } from "./SpellHighlightedText";
import { AlertTriangle, CheckCheck } from "lucide-react";

interface SpellCheckInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  type?: string;
}

export const SpellCheckInput: React.FC<SpellCheckInputProps> = ({
  value,
  onChange,
  placeholder,
  className = "",
  id,
  type = "text",
}) => {
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
    <div className="space-y-1 w-full">
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          spellCheck={true}
          lang="fr"
          className={`${className} ${
            errors.length > 0 ? "border-rose-500/70 focus:border-rose-400" : ""
          }`}
        />
        {errors.length > 0 && (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span className="text-[10px] font-bold text-rose-400">
              {errors.length} {errors.length > 1 ? "fautes" : "faute"}
            </span>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div className="p-2 bg-slate-950/90 border border-rose-900/60 rounded-lg text-xs space-y-1 animate-fade-in shadow-inner">
          <div className="flex items-center justify-between gap-1 text-[10px] text-rose-400 font-medium">
            <span className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              Suggestion au survol :
            </span>
            <button
              type="button"
              onClick={handleApplyAll}
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <CheckCheck className="w-3 h-3" />
              <span>Corriger</span>
            </button>
          </div>
          <div className="text-slate-200 text-xs">
            <SpellHighlightedText
              text={value}
              errors={errors}
              onApplyCorrection={handleApplySingle}
            />
          </div>
        </div>
      )}
    </div>
  );
};
