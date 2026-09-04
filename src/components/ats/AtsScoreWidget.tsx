import React, { useState } from "react";
import { AtsReport, CVData } from "../../types";
import { ShieldCheck, AlertCircle, CheckCircle, Sparkles, ChevronRight, BarChart3 } from "lucide-react";

interface AtsScoreWidgetProps {
  report: AtsReport;
  cv: CVData;
  onNavigateToSection?: (section: string) => void;
}

export const AtsScoreWidget: React.FC<AtsScoreWidgetProps> = ({
  report,
  cv,
  onNavigateToSection,
}) => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [aiAuditResult, setAiAuditResult] = useState<any>(null);

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-400 border-emerald-500 bg-emerald-500/10";
    if (score >= 70) return "text-indigo-400 border-indigo-500 bg-indigo-500/10";
    if (score >= 50) return "text-amber-400 border-amber-500 bg-amber-500/10";
    return "text-rose-400 border-rose-500 bg-rose-500/10";
  };

  const handleFullAiAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await fetch("/api/ai/review-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvData: cv,
          targetJobDescription: cv.personal.title,
        }),
      });
      const data = await res.json();
      setAiAuditResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="p-4 bg-slate-900/95 border border-slate-800 rounded-xl space-y-4 shadow-xl">
      {/* Top Bar: Score, Grade & Metrics */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Circular Score Badge */}
          <div
            className={`w-12 h-12 rounded-lg border flex flex-col items-center justify-center font-bold shadow-inner ${getScoreColor(
              report.score
            )}`}
          >
            <span className="text-base font-mono leading-none font-black">{report.score}</span>
            <span className="text-[8px] font-mono uppercase tracking-widest opacity-80 mt-0.5">ATS</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-100">Score de Performance ATS</h4>
              <span
                className={`text-[9px] font-mono uppercase tracking-wider font-bold px-1.5 py-0.5 rounded border ${
                  report.grade === "A"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : report.grade === "B"
                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                    : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                }`}
              >
                Niveau {report.grade}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {report.score >= 85
                ? "Excellent : Profil optimisé pour les logiciels de recrutement."
                : report.score >= 70
                ? "Très bon : Quelques métriques supplémentaires pour atteindre l'excellence."
                : "À optimiser : Suivez les recommandations ci-dessous pour booster vos retours."}
            </p>
          </div>
        </div>

        {/* Action Button: AI Diagnosis */}
        <button
          type="button"
          onClick={handleFullAiAudit}
          disabled={isAuditing}
          className="hidden sm:flex text-xs text-sky-400 hover:text-sky-300 items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-950/40 border border-sky-500/30 hover:bg-sky-900/40 transition-all disabled:opacity-50 font-medium"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isAuditing ? "animate-spin" : ""}`} />
          <span>{isAuditing ? "Audit en cours..." : "Audit Approfondi IA"}</span>
        </button>
      </div>

      {/* Quick Metrics Counter Badges */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800 text-[11px]">
        <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 flex flex-col items-center text-center">
          <span className="font-bold font-mono text-sm text-slate-200">{report.metricsCount}</span>
          <span className="text-[10px] text-slate-400 mt-0.5">Chiffres clés (XYZ)</span>
        </div>

        <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 flex flex-col items-center text-center">
          <span className="font-bold font-mono text-sm text-slate-200">{report.actionVerbsCount}</span>
          <span className="text-[10px] text-slate-400 mt-0.5">Verbes d'action</span>
        </div>

        <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 flex flex-col items-center text-center">
          <span className="font-bold font-mono text-sm text-slate-200">{report.wordCount}</span>
          <span className="text-[10px] text-slate-400 mt-0.5">Mots au total</span>
        </div>
      </div>

      {/* Actionable Suggestions (Top 2-3) */}
      {report.suggestions && report.suggestions.length > 0 && (
        <div className="space-y-1.5 pt-1">
          {report.suggestions.slice(0, 3).map((sug) => (
            <div
              key={sug.id}
              onClick={() => sug.section && onNavigateToSection && onNavigateToSection(sug.section)}
              className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 flex items-start justify-between gap-2 cursor-pointer transition-colors"
            >
              <div className="flex items-start gap-2">
                {sug.type === "critical" ? (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">{sug.title}</span>
                  <span className="text-[11px] text-slate-400 leading-tight">{sug.message}</span>
                </div>
              </div>

              {sug.section && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-1" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* AI Deep Audit Output Modal/Dropdown */}
      {aiAuditResult && (
        <div className="p-3.5 bg-indigo-950/40 border border-indigo-500/40 rounded-xl space-y-2 text-xs animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="font-bold text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Diagnostic Expert ATS par l'IA
            </span>
            <button
              onClick={() => setAiAuditResult(null)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1 text-slate-300">
            {aiAuditResult.summaryRating && (
              <p className="font-semibold text-white">Appréciation : {aiAuditResult.summaryRating}</p>
            )}
            {aiAuditResult.strengths && (
              <p className="text-emerald-300">
                <strong>Forces :</strong> {aiAuditResult.strengths.join(" • ")}
              </p>
            )}
            {aiAuditResult.criticalImprovements && (
              <p className="text-amber-300">
                <strong>Améliorations cibles :</strong> {aiAuditResult.criticalImprovements.join(" • ")}
              </p>
            )}
            {aiAuditResult.atsAdvice && (
              <p className="italic text-slate-300 mt-1">« {aiAuditResult.atsAdvice} »</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
