import React, { useState } from "react";
import { ExperienceItem } from "../../types";
import {
  Plus,
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  Lightbulb,
  Zap,
  Users,
  Feather,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { SpellCheckInput } from "./SpellCheckInput";
import { SpellCheckTextarea } from "./SpellCheckTextarea";

interface ToneSuggestion {
  id: string;
  label: string;
  tag: string;
  text: string;
  impact: string;
  actionVerb?: string;
}

interface ToneOptimizationResult {
  expId: string;
  hlIndex: number;
  originalText: string;
  originalAnalysis: string;
  suggestions: ToneSuggestion[];
  advice?: string;
}

interface ExperienceFormProps {
  experiences: ExperienceItem[];
  onChange: (updated: ExperienceItem[]) => void;
  onOpenGuideModal?: () => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({
  experiences,
  onChange,
  onOpenGuideModal,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(experiences[0]?.id || null);
  const [optimizingIndex, setOptimizingIndex] = useState<{ expId: string; hlIndex: number } | null>(null);
  const [toneResult, setToneResult] = useState<ToneOptimizationResult | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isGeneratingNewHighlight, setIsGeneratingNewHighlight] = useState<string | null>(null);

  const handleAddExperience = () => {
    const newId = "exp-" + Date.now();
    const newExp: ExperienceItem = {
      id: newId,
      role: "Nouveau poste",
      company: "Entreprise",
      location: "Paris, France",
      startDate: "2023-01",
      endDate: "Présent",
      isCurrent: true,
      highlights: [
        "Pilotage de projets stratégiques ayant généré +15% de rentabilité en 6 mois.",
      ],
    };
    onChange([newExp, ...experiences]);
    setExpandedId(newId);
  };

  const handleRemoveExperience = (id: string) => {
    onChange(experiences.filter((e) => e.id !== id));
  };

  const handleUpdateExp = (id: string, field: keyof ExperienceItem, value: any) => {
    onChange(
      experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  const handleAddHighlight = (expId: string, initialText?: string) => {
    onChange(
      experiences.map((exp) => {
        if (exp.id !== expId) return exp;
        return {
          ...exp,
          highlights: [
            ...(exp.highlights || []),
            initialText || "Action percutante mesurée par un résultat chiffré (+X%).",
          ],
        };
      })
    );
  };

  const handleUpdateHighlight = (expId: string, index: number, value: string) => {
    onChange(
      experiences.map((exp) => {
        if (exp.id !== expId) return exp;
        const copy = [...exp.highlights];
        copy[index] = value;
        return { ...exp, highlights: copy };
      })
    );
  };

  const handleRemoveHighlight = (expId: string, index: number) => {
    onChange(
      experiences.map((exp) => {
        if (exp.id !== expId) return exp;
        const copy = exp.highlights.filter((_, i) => i !== index);
        return { ...exp, highlights: copy };
      })
    );
    if (toneResult?.expId === expId && toneResult?.hlIndex === index) {
      setToneResult(null);
    }
  };

  // Optimize Tone with AI
  const handleOptimizeTone = async (exp: ExperienceItem, hlIndex: number) => {
    const text = exp.highlights[hlIndex] || "";
    setOptimizingIndex({ expId: exp.id, hlIndex });

    try {
      const res = await fetch("/api/ai/optimize-tone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim().length > 0 ? text : `Missions et responsabilités clés pour le poste de ${exp.role || 'Professionnel'} chez ${exp.company || 'l\'entreprise'}.`,
          role: exp.role,
          company: exp.company,
        }),
      });

      const data = await res.json();
      if (data.suggestions && Array.isArray(data.suggestions)) {
        setToneResult({
          expId: exp.id,
          hlIndex,
          originalText: text,
          originalAnalysis: data.originalAnalysis || "Ton initial analysé et optimisé pour maximiser l'impact auprès des recruteurs.",
          suggestions: data.suggestions,
          advice: data.advice || "Privilégiez les verbes d'action au passé composé ou sous forme substantive et terminez par un résultat quantifiable.",
        });
      }
    } catch (err) {
      console.error("Erreur optimisation ton:", err);
    } finally {
      setOptimizingIndex(null);
    }
  };

  const applyToneSuggestion = (expId: string, hlIndex: number, newText: string) => {
    handleUpdateHighlight(expId, hlIndex, newText);
    setToneResult(null);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Add a brand new AI suggested high-impact accomplishment
  const handleGenerateAiAccomplishment = async (exp: ExperienceItem) => {
    setIsGeneratingNewHighlight(exp.id);
    try {
      const res = await fetch("/api/ai/optimize-tone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `Accomplissement type et réalisation d'envergure pour ${exp.role || 'Professionnel'} chez ${exp.company || 'Entreprise'}.`,
          role: exp.role,
          company: exp.company,
        }),
      });
      const data = await res.json();
      if (data.suggestions && data.suggestions[0]?.text) {
        handleAddHighlight(exp.id, data.suggestions[0].text);
      } else {
        handleAddHighlight(exp.id, `Optimisation des processus et pilotage des livrables clés pour ${exp.role}, avec +20% d'efficacité mesurée.`);
      }
    } catch {
      handleAddHighlight(exp.id, `Pilotage opérationnel de projets stratégiques pour ${exp.role}, avec +20% d'impact mesuré.`);
    } finally {
      setIsGeneratingNewHighlight(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Add Button & Recruitment Tip Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2">
        <div>
          <h3 className="text-sm font-bold text-white">Parcours & Expériences Professionnelles</h3>
          <p className="text-xs text-slate-400">
            Formulez vos accomplissements avec la méthode XYZ (Action + Résultat chiffré).
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddExperience}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une expérience</span>
        </button>
      </div>

      {/* Accordion List of Experiences */}
      {experiences.length === 0 ? (
        <div className="p-8 text-center bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
          <p className="text-xs text-slate-400 mb-3">Aucune expérience enregistrée.</p>
          <button
            type="button"
            onClick={handleAddExperience}
            className="px-3 py-1.5 bg-slate-800 text-slate-200 text-xs rounded-lg hover:bg-slate-700"
          >
            Ajouter ma première expérience
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {experiences.map((exp) => {
            const isExpanded = expandedId === exp.id;
            return (
              <div
                key={exp.id}
                className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden transition-all"
              >
                {/* Accordion header */}
                <div
                  className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0"></span>
                    <div className="truncate">
                      <span className="font-semibold text-sm text-slate-100">{exp.role || "Titre du poste"}</span>
                      <span className="text-xs text-slate-400 ml-2 font-medium">
                        @ {exp.company || "Entreprise"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[11px] text-slate-400">
                      {exp.startDate} – {exp.isCurrent ? "Présent" : exp.endDate}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveExperience(exp.id);
                      }}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Supprimer cette expérience"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Form Details */}
                {isExpanded && (
                  <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Intitulé du poste
                        </label>
                        <SpellCheckInput
                          value={exp.role}
                          onChange={(val) => handleUpdateExp(exp.id, "role", val)}
                          placeholder="ex. Lead Développeur React"
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Entreprise / Organisation
                        </label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleUpdateExp(exp.id, "company", e.target.value)}
                          placeholder="ex. Google, LVMH, Doctolib"
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Lieu / Localisation
                        </label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => handleUpdateExp(exp.id, "location", e.target.value)}
                          placeholder="ex. Paris (Télétravail)"
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Date début
                          </label>
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={(e) => handleUpdateExp(exp.id, "startDate", e.target.value)}
                            placeholder="ex. 2021-03 ou Mars 2021"
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div className="flex-1">
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Date fin
                          </label>
                          <input
                            type="text"
                            disabled={exp.isCurrent}
                            value={exp.isCurrent ? "Présent" : exp.endDate}
                            onChange={(e) => handleUpdateExp(exp.id, "endDate", e.target.value)}
                            placeholder="ex. 2023-12"
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Checkbox Current */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exp.isCurrent}
                          onChange={(e) => {
                            handleUpdateExp(exp.id, "isCurrent", e.target.checked);
                            if (e.target.checked) handleUpdateExp(exp.id, "endDate", "Présent");
                          }}
                          className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-800"
                        />
                        <span>Poste actuellement occupé</span>
                      </label>

                      {onOpenGuideModal && (
                        <button
                          type="button"
                          onClick={onOpenGuideModal}
                          className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                        >
                          <Lightbulb className="w-3 h-3" />
                          <span>Voir les verbes d'action</span>
                        </button>
                      )}
                    </div>

                    {/* Bullet points accomplishments */}
                    <div className="space-y-3 pt-3 border-t border-slate-800">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5">
                        <label className="block text-xs font-semibold text-slate-200">
                          Réalisations & Accomplissements (Descriptions d'expériences)
                        </label>
                        <span className="text-[11px] text-slate-400">
                          Utilisez <strong className="text-sky-300 font-semibold">'Optimiser avec l'IA'</strong> pour un ton percutant
                        </span>
                      </div>

                      <div className="space-y-3">
                        {(exp.highlights || []).map((hl, hlIdx) => {
                          const isOptimizing =
                            optimizingIndex?.expId === exp.id && optimizingIndex?.hlIndex === hlIdx;
                          const showToneBox =
                            toneResult?.expId === exp.id && toneResult?.hlIndex === hlIdx;

                          return (
                            <div
                              key={hlIdx}
                              className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl space-y-2.5 transition-all hover:border-slate-700/90"
                            >
                              <div className="flex items-start gap-2.5">
                                <span className="text-sky-400 font-bold text-xs mt-2 select-none">•</span>
                                <div className="flex-1">
                                  <SpellCheckTextarea
                                    rows={2}
                                    value={hl}
                                    onChange={(val) => handleUpdateHighlight(exp.id, hlIdx, val)}
                                    placeholder="Formule Google XYZ : Accompli [X] mesuré par [Y] en faisant [Z]..."
                                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-sky-500 leading-relaxed shadow-inner"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveHighlight(exp.id, hlIdx)}
                                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors mt-0.5"
                                  title="Supprimer cette puce"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Actions Bar with explicit 'Optimiser avec l'IA' button */}
                              <div className="flex flex-wrap items-center justify-between gap-2 pl-4 pt-0.5">
                                <button
                                  type="button"
                                  onClick={() => handleOptimizeTone(exp, hlIdx)}
                                  disabled={isOptimizing}
                                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-sky-300 hover:text-white bg-gradient-to-r from-sky-500/15 via-indigo-500/15 to-purple-500/15 hover:from-sky-500/25 hover:via-indigo-500/25 hover:to-purple-500/25 border border-sky-500/35 hover:border-sky-400/60 shadow-sm transition-all group disabled:opacity-50"
                                  title="Optimiser avec l'IA : Réécrit le texte avec un ton percutant et des verbes d'action"
                                >
                                  <Sparkles
                                    className={`w-3.5 h-3.5 text-sky-400 group-hover:rotate-12 transition-transform ${
                                      isOptimizing ? "animate-spin" : ""
                                    }`}
                                  />
                                  <span>{isOptimizing ? "Analyse du ton..." : "Optimiser avec l'IA"}</span>
                                </button>

                                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                  <span className="hidden sm:inline">Méthode Google XYZ</span>
                                  <span>•</span>
                                  <span>{hl.trim().length} car.</span>
                                </div>
                              </div>

                              {/* AI Tone Optimization & Rewriting Box */}
                              {showToneBox && toneResult && (
                                <div className="mt-2.5 p-3.5 bg-slate-950 border border-sky-500/40 rounded-xl space-y-3 shadow-xl">
                                  {/* Header */}
                                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
                                    <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
                                      <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
                                      <span>Suggestions de ton par l'IA • Réécriture percutante</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => setToneResult(null)}
                                      className="text-slate-400 hover:text-slate-200 text-xs px-2 py-0.5 rounded hover:bg-slate-800"
                                    >
                                      ✕ Fermer
                                    </button>
                                  </div>

                                  {/* Diagnostic */}
                                  <div className="p-2.5 bg-sky-950/30 border border-sky-500/20 rounded-lg text-[11px] text-sky-200/90 leading-relaxed flex items-start gap-2">
                                    <Lightbulb className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                      <span className="font-semibold text-sky-300">Diagnostic : </span>
                                      {toneResult.originalAnalysis}
                                    </div>
                                  </div>

                                  {/* Tone suggestions */}
                                  <div className="space-y-2.5">
                                    {toneResult.suggestions.map((sug) => {
                                      const isPunchy = sug.id === "punchy";
                                      const isLeadership = sug.id === "leadership";

                                      return (
                                        <div
                                          key={sug.id}
                                          className={`p-3 rounded-lg border transition-all ${
                                            isPunchy
                                              ? "bg-slate-900/90 border-sky-500/40 hover:border-sky-400/60"
                                              : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                                          }`}
                                        >
                                          {/* Tone Title & Badges */}
                                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-100">
                                              {isPunchy ? (
                                                <Zap className="w-3.5 h-3.5 text-amber-400" />
                                              ) : isLeadership ? (
                                                <Users className="w-3.5 h-3.5 text-indigo-400" />
                                              ) : (
                                                <Feather className="w-3.5 h-3.5 text-sky-400" />
                                              )}
                                              <span>{sug.label}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                              {sug.actionVerb && (
                                                <span className="px-2 py-0.5 bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 rounded text-[10px] font-semibold">
                                                  {sug.actionVerb}
                                                </span>
                                              )}
                                              <span
                                                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                                  isPunchy
                                                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                                    : "bg-slate-800 text-slate-300 border border-slate-700"
                                                }`}
                                              >
                                                {sug.tag}
                                              </span>
                                            </div>
                                          </div>

                                          {/* Rewritten Text */}
                                          <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/90 text-xs text-slate-100 font-medium leading-relaxed select-all">
                                            {sug.text}
                                          </div>

                                          {/* Impact Description & Actions */}
                                          <div className="flex flex-wrap items-center justify-between gap-2 mt-2.5 pt-2 border-t border-slate-800/60">
                                            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                                              <Zap className="w-3 h-3 text-amber-400 flex-shrink-0" />
                                              <span>{sug.impact}</span>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                              <button
                                                type="button"
                                                onClick={() => handleCopy(sug.id, sug.text)}
                                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                                                title="Copier le texte"
                                              >
                                                {copiedId === sug.id ? (
                                                  <>
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                                    <span>Copié !</span>
                                                  </>
                                                ) : (
                                                  <>
                                                    <Copy className="w-3 h-3" />
                                                    <span>Copier</span>
                                                  </>
                                                )}
                                              </button>

                                              <button
                                                type="button"
                                                onClick={() =>
                                                  applyToneSuggestion(exp.id, hlIdx, sug.text)
                                                }
                                                className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
                                              >
                                                <Check className="w-3.5 h-3.5" />
                                                <span>Remplacer par cette version</span>
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Advice */}
                                  {toneResult.advice && (
                                    <div className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800 flex items-center gap-1.5">
                                      <Lightbulb className="w-3 h-3 text-amber-400 flex-shrink-0" />
                                      <span>{toneResult.advice}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Add Bullet & AI Suggestion Buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleAddHighlight(exp.id)}
                          className="px-3 py-1.5 text-xs text-sky-400 hover:text-sky-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors font-medium"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Ajouter une puce</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleGenerateAiAccomplishment(exp)}
                          disabled={isGeneratingNewHighlight === exp.id}
                          className="px-3 py-1.5 text-xs text-indigo-300 hover:text-white bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/30 rounded-lg flex items-center gap-1.5 transition-all font-medium disabled:opacity-50"
                        >
                          <Sparkles
                            className={`w-3.5 h-3.5 text-indigo-400 ${
                              isGeneratingNewHighlight === exp.id ? "animate-spin" : ""
                            }`}
                          />
                          <span>
                            {isGeneratingNewHighlight === exp.id
                              ? "Génération..."
                              : "Suggérer un accomplissement avec l'IA"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
