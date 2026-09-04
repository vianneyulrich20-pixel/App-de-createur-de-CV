import React, { useState } from "react";
import {
  ACTION_VERB_CATEGORIES,
  GOLDEN_RULES,
  TOP_PITFALLS,
  SECTOR_TIPS,
} from "../../data/writingAdvice";
import {
  BookOpen,
  X,
  Copy,
  Check,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Briefcase,
  Layers,
  ChevronRight,
} from "lucide-react";

interface WritingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertVerb?: (verb: string) => void;
}

export const WritingGuideModal: React.FC<WritingGuideModalProps> = ({
  isOpen,
  onClose,
  onInsertVerb,
}) => {
  const [activeTab, setActiveTab] = useState<"rules" | "verbs" | "pitfalls" | "sectors" | "checklist">("rules");
  const [copiedVerb, setCopiedVerb] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(ACTION_VERB_CATEGORIES[0].category);
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({
    cl1: true,
    cl2: true,
    cl3: false,
    cl4: false,
    cl5: false,
    cl6: false,
  });

  if (!isOpen) return null;

  const handleCopyVerb = (verb: string) => {
    navigator.clipboard.writeText(verb);
    setCopiedVerb(verb);
    if (onInsertVerb) {
      onInsertVerb(verb);
    }
    setTimeout(() => setCopiedVerb(null), 2000);
  };

  const toggleChecklist = (key: string) => {
    setChecklistState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in no-print">
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl w-full max-w-4xl h-[88vh] flex flex-col shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Guide & Conseils de Rédaction d'Élite
                <span className="text-[9px] font-mono uppercase font-bold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                  Normes Recruteurs 2026
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Secrets d'experts RH pour maximiser votre impact, franchir les filtres ATS et décrocher des entretiens.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-800 bg-slate-950/60 flex gap-2 overflow-x-auto py-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab("rules")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "rules"
                ? "bg-sky-600 text-white shadow-sm font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Méthode XYZ & Règles d'Or
          </button>

          <button
            onClick={() => setActiveTab("verbs")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "verbs"
                ? "bg-sky-600 text-white shadow-sm font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Verbes d'Action ({ACTION_VERB_CATEGORIES.reduce((a, c) => a + c.verbs.length, 0)})
          </button>

          <button
            onClick={() => setActiveTab("pitfalls")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "pitfalls"
                ? "bg-sky-600 text-white shadow-sm font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Pièges & Clichés à Bannir
          </button>

          <button
            onClick={() => setActiveTab("sectors")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "sectors"
                ? "bg-sky-600 text-white shadow-sm font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Conseils par Métier
          </button>

          <button
            onClick={() => setActiveTab("checklist")}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "checklist"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Checklist Pré-Envoi
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/40">
          {/* TAB 1: Golden Rules & Google XYZ */}
          {activeTab === "rules" && (
            <div className="space-y-6">
              {/* Highlight Banner Google XYZ */}
              <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-950/70 to-slate-900 border border-indigo-500/30">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      La Règle d'Or Universelle : Formule XYZ de Google
                    </h3>
                    <p className="text-xs text-indigo-200 mt-1">
                      Conçue par Laszlo Bock (ex-VP RH de Google), cette formule transforme une simple description de tâches en une preuve irréfutable de performance.
                    </p>
                    <div className="mt-3 p-3 bg-slate-900/90 rounded-lg border border-slate-700/60 font-mono text-xs text-emerald-400">
                      Accompli [X], mesuré par [Y], en faisant [Z].
                    </div>
                  </div>
                </div>
              </div>

              {/* Cards for each golden rule */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {GOLDEN_RULES.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h4 className="font-bold text-sm text-slate-100">{rule.title}</h4>
                        <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20">
                          {rule.subtitle}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-3">
                        {rule.detailedText}
                      </p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-slate-800/80 text-[11px]">
                      <div className="p-2 rounded bg-rose-950/30 border border-rose-800/30 text-rose-300">
                        <span className="font-semibold text-rose-400">À éviter :</span> {rule.badExample}
                      </div>
                      <div className="p-2 rounded bg-emerald-950/30 border border-emerald-800/30 text-emerald-300">
                        <span className="font-semibold text-emerald-400">Recommandé :</span> {rule.goodExample}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Action Verbs Catalog */}
          {activeTab === "verbs" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Verbes d'Action Percutants en Français
                  </h3>
                  <p className="text-xs text-slate-400">
                    Commencez chaque point de vos expériences par un verbe fort au présent ou participe passé. Cliquez sur un verbe pour le copier ou l'insérer !
                  </p>
                </div>
                {copiedVerb && (
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-lg flex items-center gap-1.5 animate-fade-in">
                    <Check className="w-3.5 h-3.5" />
                    « {copiedVerb} » copié dans le presse-papier !
                  </span>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2">
                {ACTION_VERB_CATEGORIES.map((cat) => (
                  <button
                    key={cat.category}
                    onClick={() => setSelectedCategory(cat.category)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedCategory === cat.category
                        ? "bg-indigo-600 text-white shadow"
                        : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {cat.category}
                  </button>
                ))}
              </div>

              {/* Active Category Display */}
              {(() => {
                const current = ACTION_VERB_CATEGORIES.find((c) => c.category === selectedCategory);
                if (!current) return null;
                return (
                  <div className="p-5 bg-slate-900/90 rounded-xl border border-slate-800">
                    <div className="mb-4">
                      <h4 className="text-sm font-bold text-indigo-300">{current.category}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{current.description}</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                      {current.verbs.map((verb) => (
                        <button
                          key={verb}
                          onClick={() => handleCopyVerb(verb)}
                          className="group p-2.5 bg-slate-800/80 hover:bg-indigo-600 hover:text-white rounded-lg border border-slate-700/60 hover:border-indigo-500 transition-all text-xs font-medium text-left flex items-center justify-between"
                        >
                          <span>{verb}</span>
                          <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 3: Pitfalls & Cliches */}
          {activeTab === "pitfalls" && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-200">
                <strong>Attention :</strong> 52% des recruteurs éliminent une candidature dès la première erreur identifiée (fautes, clichés, manque de preuves). Voici les pièges à neutraliser immédiatement.
              </div>

              <div className="space-y-3">
                {TOP_PITFALLS.map((pitfall) => (
                  <div
                    key={pitfall.id}
                    className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        {pitfall.title}
                      </h4>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          pitfall.frequency === "Critique"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {pitfall.frequency}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">
                      <strong className="text-slate-300">Conséquence :</strong> {pitfall.impact}
                    </p>

                    <div className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                      <strong className="text-emerald-400">Solution recommandée :</strong> {pitfall.howToFix}
                    </div>

                    {pitfall.bannedWords && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] text-slate-400 font-medium">Mots à remplacer :</span>
                        {pitfall.bannedWords.map((w) => (
                          <span
                            key={w}
                            className="line-through px-1.5 py-0.5 bg-rose-950/40 text-rose-300 border border-rose-800/40 rounded text-[10px]"
                          >
                            {w}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Sector Tips */}
          {activeTab === "sectors" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SECTOR_TIPS.map((tip) => (
                <div
                  key={tip.sector}
                  className="p-5 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-bold text-sm text-white mb-2 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-indigo-400" />
                      {tip.sector}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {tip.keyAdvice}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Modèle conseillé :</span>
                    <span className="font-mono text-indigo-300 bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-800/50">
                      {tip.recommendedTemplate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: Checklist Pre-Envoi */}
          {activeTab === "checklist" && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800">
                <h3 className="text-sm font-bold text-white mb-1">
                  Checklist Ultime Avant Candidature
                </h3>
                <p className="text-xs text-slate-400">
                  Cochez chaque étape pour vous assurer d'un CV sans défaut.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { id: "cl1", label: "Titre de poste clair et parfaitement aligné avec l'annonce" },
                  { id: "cl2", label: "Au moins 2 à 4 métriques chiffrées (% de croissance, budget, gains de temps)" },
                  { id: "cl3", label: "Aucun adjectif creux ('motivé', 'dynamique') non justifié par une preuve" },
                  { id: "cl4", label: "Email professionnel et lien LinkedIn vérifié" },
                  { id: "cl5", label: "Relecture orthographique complète (zéro coquille sur les participes passés)" },
                  { id: "cl6", label: "Fichier nommé proprement : 'CV_Prenom_Nom_Poste.pdf'" },
                ].map((item) => (
                  <label
                    key={item.id}
                    onClick={() => toggleChecklist(item.id)}
                    className="p-3.5 bg-slate-900/60 hover:bg-slate-800/70 rounded-xl border border-slate-800 flex items-center gap-3 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checklistState[item.id] || false}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-800"
                    />
                    <span
                      className={`text-xs ${
                        checklistState[item.id]
                          ? "line-through text-slate-500"
                          : "text-slate-200 font-medium"
                      }`}
                    >
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900 flex justify-between items-center text-xs">
          <span className="text-slate-400">
            Astuce : Utilisez le bouton « Améliorer avec l'IA » dans chaque expérience pour formuler en XYZ.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow transition-colors"
          >
            Fermer le Guide
          </button>
        </div>
      </div>
    </div>
  );
};
