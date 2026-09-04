import React from "react";
import { EducationItem } from "../../types";
import { Plus, Trash2, GraduationCap } from "lucide-react";
import { SpellCheckInput } from "./SpellCheckInput";
import { SpellCheckTextarea } from "./SpellCheckTextarea";

interface EducationFormProps {
  education: EducationItem[];
  onChange: (updated: EducationItem[]) => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({ education, onChange }) => {
  const handleAdd = () => {
    const newItem: EducationItem = {
      id: "edu-" + Date.now(),
      degree: "Diplôme / Titre obtenu",
      field: "Spécialité / Domaine d'étude",
      institution: "Université ou École",
      location: "Paris",
      startDate: "2018",
      endDate: "2021",
      description: "Mentions, projets académiques marquants ou spécialisation.",
    };
    onChange([...education, newItem]);
  };

  const handleRemove = (id: string) => {
    onChange(education.filter((e) => e.id !== id));
  };

  const handleUpdate = (id: string, field: keyof EducationItem, value: any) => {
    onChange(education.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center pb-2">
        <div>
          <h3 className="text-sm font-bold text-white">Formation & Diplômes</h3>
          <p className="text-xs text-slate-400">
            Diplômes reconnus, grandes écoles, universités ou bootcamps certifiés.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter un diplôme</span>
        </button>
      </div>

      {education.length === 0 ? (
        <div className="p-6 text-center bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
          <p className="text-xs text-slate-400 mb-2">Aucune formation ajoutée.</p>
          <button
            type="button"
            onClick={handleAdd}
            className="text-xs text-indigo-400 hover:underline"
          >
            Ajouter mon diplôme le plus récent
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2 text-indigo-400">
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-xs font-semibold text-slate-200">Diplôme</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(edu.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                  title="Supprimer cette formation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Intitulé du diplôme
                  </label>
                  <SpellCheckInput
                    value={edu.degree}
                    onChange={(val) => handleUpdate(edu.id, "degree", val)}
                    placeholder="ex. Master 2 Management & Data"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Établissement / École
                  </label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => handleUpdate(edu.id, "institution", e.target.value)}
                    placeholder="ex. Université Panthéon-Sorbonne"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Ville ou Pays
                  </label>
                  <input
                    type="text"
                    value={edu.location}
                    onChange={(e) => handleUpdate(edu.id, "location", e.target.value)}
                    placeholder="ex. Paris, France"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Année début
                    </label>
                    <input
                      type="text"
                      value={edu.startDate}
                      onChange={(e) => handleUpdate(edu.id, "startDate", e.target.value)}
                      placeholder="2019"
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Année fin
                    </label>
                    <input
                      type="text"
                      value={edu.endDate}
                      onChange={(e) => handleUpdate(edu.id, "endDate", e.target.value)}
                      placeholder="2021"
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Détails ou distinctions (Optionnel)
                  </label>
                  <SpellCheckTextarea
                    rows={2}
                    value={edu.description || ""}
                    onChange={(val) => handleUpdate(edu.id, "description", val)}
                    placeholder="ex. Mention Très Bien • Major de promotion"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
