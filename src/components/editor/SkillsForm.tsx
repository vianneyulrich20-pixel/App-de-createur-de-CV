import React, { useState } from "react";
import { SkillCategory, SkillItem } from "../../types";
import { Plus, X, Trash2, Tag } from "lucide-react";

interface SkillsFormProps {
  categories: SkillCategory[];
  onChange: (updated: SkillCategory[]) => void;
}

export const SkillsForm: React.FC<SkillsFormProps> = ({ categories, onChange }) => {
  const [newSkillInputs, setNewSkillInputs] = useState<Record<string, string>>({});

  const handleAddCategory = () => {
    const newCat: SkillCategory = {
      id: "sc-" + Date.now(),
      category: "Nouvelle Catégorie",
      skills: [
        { id: "s-" + Date.now(), name: "Compétence 1" },
      ],
    };
    onChange([...categories, newCat]);
  };

  const handleRemoveCategory = (catId: string) => {
    onChange(categories.filter((c) => c.id !== catId));
  };

  const handleUpdateCategoryName = (catId: string, name: string) => {
    onChange(
      categories.map((c) => (c.id === catId ? { ...c, category: name } : c))
    );
  };

  const handleAddSkill = (catId: string) => {
    const inputVal = (newSkillInputs[catId] || "").trim();
    if (!inputVal) return;

    // Support comma separated addition
    const tags = inputVal.split(/[,;]+/).map((s) => s.trim()).filter(Boolean);
    const newItems: SkillItem[] = tags.map((t, idx) => ({
      id: "s-" + Date.now() + "-" + idx,
      name: t,
    }));

    onChange(
      categories.map((c) => {
        if (c.id !== catId) return c;
        return {
          ...c,
          skills: [...c.skills, ...newItems],
        };
      })
    );

    setNewSkillInputs((prev) => ({ ...prev, [catId]: "" }));
  };

  const handleRemoveSkill = (catId: string, skillId: string) => {
    onChange(
      categories.map((c) => {
        if (c.id !== catId) return c;
        return {
          ...c,
          skills: c.skills.filter((s) => s.id !== skillId),
        };
      })
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center pb-2">
        <div>
          <h3 className="text-sm font-bold text-white">Compétences & Domaines d'Expertise</h3>
          <p className="text-xs text-slate-400">
            Regroupez vos compétences par domaine pour que les filtres ATS les identifient instantanément.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddCategory}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter une catégorie</span>
        </button>
      </div>

      <div className="space-y-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1">
                <Tag className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <input
                  type="text"
                  value={cat.category}
                  onChange={(e) => handleUpdateCategoryName(cat.id, e.target.value)}
                  placeholder="Nom de la catégorie (ex. Langages, Outils, Soft Skills)"
                  className="w-full max-w-sm px-2.5 py-1 bg-slate-950 border border-slate-700 rounded text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveCategory(cat.id)}
                className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                title="Supprimer cette catégorie"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Existing Skills Tag Badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {cat.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-2.5 py-1 bg-slate-800 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1.5 group"
                >
                  <span>{skill.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(cat.id, skill.id)}
                    className="text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Quick Add Tag Input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newSkillInputs[cat.id] || ""}
                onChange={(e) =>
                  setNewSkillInputs((prev) => ({ ...prev, [cat.id]: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill(cat.id);
                  }
                }}
                placeholder="Ajouter une compétence (appuyez sur Entrée)"
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(cat.id)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors"
              >
                Ajouter
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
