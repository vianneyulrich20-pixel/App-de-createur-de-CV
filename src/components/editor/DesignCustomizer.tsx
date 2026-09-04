import React from "react";
import { CVDesignConfig, CVTemplateId, FontFamilyOption, FontSizeScale } from "../../types";
import { Palette, Type, LayoutTemplate } from "lucide-react";

interface DesignCustomizerProps {
  config: CVDesignConfig;
  onChange: (updated: CVDesignConfig) => void;
}

const TEMPLATES: { id: CVTemplateId; name: string; tag: string; description: string }[] = [
  {
    id: "nordic-modern",
    name: "Moderne Épuré",
    tag: "Recommandé",
    description: "Structure équilibrée 2 colonnes avec badges nets. Polyvalent et très apprécié des recruteurs.",
  },
  {
    id: "prestige-executive",
    name: "Prestige Exécutif",
    tag: "Direction",
    description: "Élégance corporate et typographie sérif haut de gamme. Idéal pour cadres, consultants et dirigeants.",
  },
  {
    id: "modern-tech",
    name: "Silicon Tech",
    tag: "Ingénierie",
    description: "Bannière moderne, tags monospaces et mise en avant de la stack technique et des projets.",
  },
  {
    id: "studio-creative",
    name: "Studio Créatif",
    tag: "Design",
    description: "Sidebar latérale contrastée et mise en page asymétrique pour profils créatifs et marketing.",
  },
  {
    id: "oxford-classic",
    name: "Oxford Classique",
    tag: "Finance & Droit",
    description: "Colonne unique intemporelle, lignes sobres et conformité ATS maximale.",
  },
  {
    id: "dense-compact",
    name: "Compact 1-Page",
    tag: "100% 1 Page",
    description: "Densité optimisée pour faire tenir l'ensemble des informations sur une seule feuille A4.",
  },
];

const COLOR_PRESETS = [
  { name: "Bleu Azur", hex: "#0284c7" },
  { name: "Indigo Royal", hex: "#4f46e5" },
  { name: "Émeraude Moderne", hex: "#0f766e" },
  { name: "Ardoise Charcoal", hex: "#1e293b" },
  { name: "Bordeaux Noble", hex: "#881337" },
  { name: "Ambre Chaud", hex: "#b45309" },
  { name: "Noir Minimaliste", hex: "#09090b" },
];

export const DesignCustomizer: React.FC<DesignCustomizerProps> = ({ config, onChange }) => {
  const handleUpdate = (field: keyof CVDesignConfig, value: any) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* 1. Template Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-1">
          <LayoutTemplate className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Modèles de CV Professionnels</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TEMPLATES.map((tmpl) => {
            const isSelected = config.templateId === tmpl.id;
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => handleUpdate("templateId", tmpl.id)}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-indigo-950/40 border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.15)] ring-1 ring-sky-500/60"
                    : "bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-slate-100">{tmpl.name}</span>
                    <span
                      className={`text-[9px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded border ${
                        isSelected
                          ? "bg-sky-500/20 border-sky-500/40 text-sky-300"
                          : "bg-slate-950 border-slate-800 text-slate-400"
                      }`}
                    >
                      {tmpl.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{tmpl.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Color Palette */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2 pb-1">
          <Palette className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Couleur d'Accent Professionnelle</h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {COLOR_PRESETS.map((col) => (
            <button
              key={col.hex}
              type="button"
              onClick={() => handleUpdate("primaryColor", col.hex)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                config.primaryColor === col.hex
                  ? "ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-110"
                  : "hover:scale-105 opacity-85 hover:opacity-100"
              }`}
              style={{ backgroundColor: col.hex }}
              title={col.name}
            >
              {config.primaryColor === col.hex && (
                <span className="w-2.5 h-2.5 bg-white rounded-full shadow"></span>
              )}
            </button>
          ))}

          {/* Custom color input */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <input
              type="color"
              value={config.primaryColor}
              onChange={(e) => handleUpdate("primaryColor", e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              title="Choisir une couleur sur-mesure"
            />
            <span className="text-xs font-mono text-slate-400 uppercase">
              {config.primaryColor}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Typography & Size Calibration */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2 pb-1">
          <Type className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Typographie & Densité de Page</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Famille de Police
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "sans", label: "Sans-Serif", sub: "Plus Jakarta" },
                { id: "serif", label: "Serif", sub: "EB Garamond" },
                { id: "display", label: "Display", sub: "Outfit Modern" },
                { id: "mono", label: "Monospace", sub: "Space Code" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleUpdate("fontFamily", f.id as FontFamilyOption)}
                  className={`p-2 rounded-lg text-left text-xs border transition-all ${
                    config.fontFamily === f.id
                      ? "bg-indigo-600 text-white border-indigo-500 font-semibold"
                      : "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <div className="font-medium">{f.label}</div>
                  <div className="text-[10px] opacity-70">{f.sub}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Taille de Texte (Ajustement 1 Page)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "sm", label: "Compacte", hint: "Idéal 1 page" },
                { id: "base", label: "Normale", hint: "Standard" },
                { id: "lg", label: "Aérée", hint: "Confort" },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleUpdate("fontSize", s.id as FontSizeScale)}
                  className={`p-2 rounded-lg text-center text-xs border transition-all ${
                    config.fontSize === s.id
                      ? "bg-indigo-600 text-white border-indigo-500 font-semibold"
                      : "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <div>{s.label}</div>
                  <div className="text-[10px] opacity-70">{s.hint}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
