import React, { useState } from "react";
import { SocialLinkItem, SocialPlatform } from "../../types";
import {
  SOCIAL_PLATFORMS,
  getPlatformIcon,
  formatHref,
} from "../../utils/socialLinks";
import {
  Plus,
  Trash2,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Globe,
  Github,
  Linkedin,
  Tag,
  Link as LinkIcon,
} from "lucide-react";

interface SocialLinksEditorProps {
  socialLinks: SocialLinkItem[];
  onChange: (updated: SocialLinkItem[]) => void;
  // Legacy fallback values for smooth auto-migration
  initialLinkedin?: string;
  initialGithub?: string;
  initialWebsite?: string;
}

export const SocialLinksEditor: React.FC<SocialLinksEditorProps> = ({
  socialLinks = [],
  onChange,
  initialLinkedin,
  initialGithub,
  initialWebsite,
}) => {
  const [selectedPlatformToAdd, setSelectedPlatformToAdd] = useState<SocialPlatform>("portfolio");
  const [showCustomLabelFor, setShowCustomLabelFor] = useState<Record<string, boolean>>({});

  // Active platform keys present
  const presentPlatforms = new Set(socialLinks.map((l) => l.platform));

  const handleAddLink = (platform: SocialPlatform, defaultUrl = "") => {
    const config = SOCIAL_PLATFORMS[platform] || SOCIAL_PLATFORMS.other;
    const newLink: SocialLinkItem = {
      id: `link-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      platform,
      label: config.label,
      url: defaultUrl,
    };
    onChange([...socialLinks, newLink]);
  };

  const handleUpdateLink = (id: string, updates: Partial<SocialLinkItem>) => {
    onChange(
      socialLinks.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handlePlatformChange = (id: string, newPlatform: SocialPlatform) => {
    const config = SOCIAL_PLATFORMS[newPlatform] || SOCIAL_PLATFORMS.other;
    handleUpdateLink(id, {
      platform: newPlatform,
      label: config.label,
    });
  };

  const handleRemoveLink = (id: string) => {
    onChange(socialLinks.filter((item) => item.id !== id));
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= socialLinks.length) return;
    const copy = [...socialLinks];
    const temp = copy[index];
    copy[index] = copy[newIdx];
    copy[newIdx] = temp;
    onChange(copy);
  };

  const toggleCustomLabel = (id: string) => {
    setShowCustomLabelFor((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-3 pt-3 border-t border-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        <div>
          <label className="block text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-sky-400" />
            <span>Liens professionnels & Réseaux sociaux</span>
            {socialLinks.length > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-slate-800 text-sky-300 border border-slate-700">
                {socialLinks.length}
              </span>
            )}
          </label>
          <p className="text-[11px] text-slate-400">
            Ajoutez vos profils LinkedIn, dépôts GitHub, portfolio ou liens pertinents pour votre CV.
          </p>
        </div>

        {/* Quick Add Buttons for top 3 platforms if missing */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {!presentPlatforms.has("linkedin") && (
            <button
              type="button"
              onClick={() => handleAddLink("linkedin", initialLinkedin || "")}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-sky-300 bg-sky-950/50 hover:bg-sky-900/60 border border-sky-500/30 hover:border-sky-400 transition-all shadow-sm"
              title="Ajouter un lien LinkedIn"
            >
              <Linkedin className="w-3 h-3 text-[#0A66C2]" />
              <span>+ LinkedIn</span>
            </button>
          )}

          {!presentPlatforms.has("github") && (
            <button
              type="button"
              onClick={() => handleAddLink("github", initialGithub || "")}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-200 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all shadow-sm"
              title="Ajouter un profil GitHub"
            >
              <Github className="w-3 h-3 text-slate-100" />
              <span>+ GitHub</span>
            </button>
          )}

          {!presentPlatforms.has("portfolio") && (
            <button
              type="button"
              onClick={() => handleAddLink("portfolio", initialWebsite || "")}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-indigo-300 bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-500/30 hover:border-indigo-400 transition-all shadow-sm"
              title="Ajouter un Portfolio en ligne"
            >
              <Globe className="w-3 h-3 text-indigo-400" />
              <span>+ Portfolio</span>
            </button>
          )}
        </div>
      </div>

      {/* List of social links */}
      {socialLinks.length === 0 ? (
        <div className="p-4 rounded-xl border border-dashed border-slate-800 bg-slate-950/50 text-center space-y-2">
          <p className="text-xs text-slate-400">
            Aucun lien ajouté pour l'instant. Cliquez sur un des boutons ci-dessus pour ajouter votre profil.
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleAddLink("linkedin")}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-500/15 text-sky-300 border border-sky-500/30 hover:bg-sky-500/25 transition-all flex items-center gap-1.5"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>Ajouter LinkedIn</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddLink("github")}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-all flex items-center gap-1.5"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Ajouter GitHub</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddLink("portfolio")}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/25 transition-all flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Ajouter Portfolio</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {socialLinks.map((item, index) => {
            const config = SOCIAL_PLATFORMS[item.platform] || SOCIAL_PLATFORMS.other;
            const isCustomLabelVisible =
              showCustomLabelFor[item.id] || (item.label && item.label !== config.label);
            const validHref = formatHref(item.url);

            return (
              <div
                key={item.id}
                className="p-3 bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-xl space-y-2 transition-all shadow-sm group"
              >
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  {/* Platform Selector with Icon */}
                  <div className="flex items-center gap-1.5 sm:w-44 flex-shrink-0">
                    <div className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-sky-400 flex-shrink-0">
                      {getPlatformIcon(item.platform, "w-4 h-4")}
                    </div>
                    <select
                      value={item.platform}
                      onChange={(e) =>
                        handlePlatformChange(item.id, e.target.value as SocialPlatform)
                      }
                      className="w-full px-2 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs font-medium text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer"
                    >
                      {Object.values(SOCIAL_PLATFORMS).map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* URL / Handle input */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={item.url}
                      onChange={(e) => handleUpdateLink(item.id, { url: e.target.value })}
                      placeholder={config.placeholder}
                      className="w-full pl-3 pr-8 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                    {item.url && item.url.trim().length > 0 && (
                      <a
                        href={validHref}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-400 p-1"
                        title="Tester et ouvrir le lien dans un nouvel onglet"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Action controls */}
                  <div className="flex items-center justify-end gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleCustomLabel(item.id)}
                      className={`p-1.5 rounded-lg border text-xs transition-colors ${
                        isCustomLabelVisible
                          ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
                          : "text-slate-400 hover:text-slate-200 bg-slate-950 border-slate-800 hover:border-slate-700"
                      }`}
                      title={
                        isCustomLabelVisible
                          ? "Masquer le libellé personnalisé"
                          : "Définir un texte ou titre personnalisé pour ce lien"
                      }
                    >
                      <Tag className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMove(index, "up")}
                      disabled={index === 0}
                      className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Monter ce lien"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMove(index, "down")}
                      disabled={index === socialLinks.length - 1}
                      className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Descendre ce lien"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveLink(item.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg border border-transparent hover:border-rose-800/40 transition-colors"
                      title="Supprimer ce lien"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Optional Custom Label Row */}
                {isCustomLabelVisible && (
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60 pl-8">
                    <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                      Texte affiché sur le CV :
                    </span>
                    <input
                      type="text"
                      value={item.label || ""}
                      onChange={(e) => handleUpdateLink(item.id, { label: e.target.value })}
                      placeholder={`Par défaut : ${config.label}`}
                      className="flex-1 px-2.5 py-1 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleUpdateLink(item.id, { label: config.label })}
                      className="text-[10px] text-slate-400 hover:text-sky-300 underline"
                    >
                      Réinitialiser
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add another link selector bar */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <div className="flex items-center gap-1.5">
          <select
            value={selectedPlatformToAdd}
            onChange={(e) => setSelectedPlatformToAdd(e.target.value as SocialPlatform)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs font-medium text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            {Object.values(SOCIAL_PLATFORMS).map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => handleAddLink(selectedPlatformToAdd)}
            className="px-3 py-1.5 text-xs text-sky-300 hover:text-white bg-sky-950/40 hover:bg-sky-900/60 border border-sky-500/30 hover:border-sky-400 rounded-lg flex items-center gap-1.5 transition-all font-semibold shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter ce lien</span>
          </button>
        </div>
      </div>
    </div>
  );
};
