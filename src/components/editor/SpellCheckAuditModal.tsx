import React, { useMemo } from "react";
import { CVData } from "../../types";
import { auditEntireCV, SpellError } from "../../utils/spellChecker";
import { SpellHighlightedText } from "./SpellHighlightedText";
import {
  X,
  CheckCheck,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  ArrowRight,
} from "lucide-react";

interface SpellCheckAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvData: CVData;
  onUpdateCV: (updater: (prev: CVData) => CVData) => void;
}

export const SpellCheckAuditModal: React.FC<SpellCheckAuditModalProps> = ({
  isOpen,
  onClose,
  cvData,
  onUpdateCV,
}) => {
  const audit = useMemo(() => {
    return auditEntireCV(cvData, onUpdateCV);
  }, [cvData, onUpdateCV]);

  if (!isOpen) return null;

  const handleFixAllOnEntireCV = () => {
    // Sequentially apply all corrections across all audited items
    audit.items.forEach((item) => {
      // Sort errors descending by index
      const sorted = [...item.errors].sort((a, b) => b.startIndex - a.startIndex);
      let newText = item.currentText;
      for (const err of sorted) {
        newText =
          newText.substring(0, err.startIndex) +
          err.suggestion +
          newText.substring(err.endIndex);
      }
      item.onApplyCorrection(newText);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Vérification Orthographique & Normes CV</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    audit.totalErrors === 0
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  }`}
                >
                  {audit.totalErrors === 0
                    ? "0 erreur"
                    : `${audit.totalErrors} faute${audit.totalErrors > 1 ? "s" : ""}`}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                80% des recruteurs éliminent les candidatures comportant des fautes d'orthographe
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {audit.totalErrors === 0 ? (
            <div className="p-8 text-center space-y-3 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-emerald-300">
                Félicitations ! Aucune faute détectée
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Votre CV ne contient aucune faute d'orthographe ou d'accentuation courante dans vos textes rédigés. Votre document renvoie une image professionnelle et soignée.
              </p>
            </div>
          ) : (
            <>
              {/* Alert banner with batch fix button */}
              <div className="p-3.5 bg-rose-950/30 border border-rose-500/30 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="text-xs text-rose-200">
                    {audit.totalErrors} correction{audit.totalErrors > 1 ? "s" : ""} suggérée{audit.totalErrors > 1 ? "s" : ""} sur votre CV.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleFixAllOnEntireCV}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shrink-0"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Tout corriger d'un clic</span>
                </button>
              </div>

              {/* List of sections with errors */}
              <div className="space-y-3">
                {audit.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-sky-400">
                          {item.section}
                        </span>
                        <span className="text-xs font-semibold text-slate-200">
                          {item.fieldLabel}
                        </span>
                      </div>
                      <span className="text-[11px] text-rose-400 font-medium">
                        {item.errors.length} faute{item.errors.length > 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Sentence with red wavy underlines and hover suggestions */}
                    <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans">
                      <SpellHighlightedText
                        text={item.currentText}
                        errors={item.errors}
                        onApplyCorrection={(err) => {
                          const updated =
                            item.currentText.substring(0, err.startIndex) +
                            err.suggestion +
                            item.currentText.substring(err.endIndex);
                          item.onApplyCorrection(updated);
                        }}
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-400">Suggestions :</span>
                      {item.errors.map((err, errIdx) => (
                        <button
                          key={errIdx}
                          type="button"
                          onClick={() => {
                            const updated =
                              item.currentText.substring(0, err.startIndex) +
                              err.suggestion +
                              item.currentText.substring(err.endIndex);
                            item.onApplyCorrection(updated);
                          }}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1.5 transition-colors border border-slate-700"
                        >
                          <span className="line-through text-rose-400">{err.word}</span>
                          <span className="text-slate-500">→</span>
                          <span className="text-emerald-400 font-semibold">{err.suggestion}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Conseil : Survolez n'importe quel mot souligné pour afficher sa correction.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
