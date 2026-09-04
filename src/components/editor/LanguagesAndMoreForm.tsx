import React, { useState } from "react";
import {
  LanguageItem,
  CertificationItem,
  ProjectItem,
  LanguageProficiency,
  VolunteerItem,
  ReferenceItem,
} from "../../types";
import {
  Plus,
  Trash2,
  Globe2,
  Award,
  FolderKanban,
  Heart,
  Users,
  UserCheck,
  Tag,
} from "lucide-react";
import { SpellCheckInput } from "./SpellCheckInput";
import { SpellCheckTextarea } from "./SpellCheckTextarea";

interface LanguagesAndMoreProps {
  languages: LanguageItem[];
  certifications: CertificationItem[];
  projects: ProjectItem[];
  interests?: string[];
  volunteer?: VolunteerItem[];
  references?: ReferenceItem[];
  onUpdateLanguages: (langs: LanguageItem[]) => void;
  onUpdateCertifications: (certs: CertificationItem[]) => void;
  onUpdateProjects: (projs: ProjectItem[]) => void;
  onUpdateInterests?: (interests: string[]) => void;
  onUpdateVolunteer?: (volunteer: VolunteerItem[]) => void;
  onUpdateReferences?: (refs: ReferenceItem[]) => void;
}

const PROFICIENCY_OPTIONS: LanguageProficiency[] = [
  "Langue maternelle",
  "C2 - Bilingue",
  "C1 - Avancé",
  "B2 - Intermédiaire supérieur",
  "B1 - Intermédiaire",
  "A2 - Élémentaire",
  "A1 - Débutant",
];

export const LanguagesAndMoreForm: React.FC<LanguagesAndMoreProps> = ({
  languages,
  certifications,
  projects,
  interests = [],
  volunteer = [],
  references = [],
  onUpdateLanguages,
  onUpdateCertifications,
  onUpdateProjects,
  onUpdateInterests,
  onUpdateVolunteer,
  onUpdateReferences,
}) => {
  const [newInterestInput, setNewInterestInput] = useState("");

  // Languages
  const handleAddLanguage = () => {
    onUpdateLanguages([
      ...languages,
      { id: "lang-" + Date.now(), language: "Anglais", proficiency: "B2 - Intermédiaire supérieur" },
    ]);
  };
  const handleRemoveLanguage = (id: string) => {
    onUpdateLanguages(languages.filter((l) => l.id !== id));
  };
  const handleUpdateLanguage = (id: string, field: keyof LanguageItem, val: any) => {
    onUpdateLanguages(languages.map((l) => (l.id === id ? { ...l, [field]: val } : l)));
  };

  // Certifications
  const handleAddCert = () => {
    onUpdateCertifications([
      ...certifications,
      { id: "cert-" + Date.now(), title: "Certification Professionnelle", issuer: "Organisme", year: "2024" },
    ]);
  };
  const handleRemoveCert = (id: string) => {
    onUpdateCertifications(certifications.filter((c) => c.id !== id));
  };
  const handleUpdateCert = (id: string, field: keyof CertificationItem, val: any) => {
    onUpdateCertifications(certifications.map((c) => (c.id === id ? { ...c, [field]: val } : c)));
  };

  // Projects
  const handleAddProject = () => {
    onUpdateProjects([
      ...projects,
      {
        id: "proj-" + Date.now(),
        title: "Nom du projet ou réalisation clé",
        description: "Description concise des défis techniques, du rôle et des résultats concrets obtenus.",
        techStack: ["React", "TypeScript", "Node.js"],
      },
    ]);
  };
  const handleRemoveProject = (id: string) => {
    onUpdateProjects(projects.filter((p) => p.id !== id));
  };
  const handleUpdateProject = (id: string, field: keyof ProjectItem, val: any) => {
    onUpdateProjects(projects.map((p) => (p.id === id ? { ...p, [field]: val } : p)));
  };

  // Interests
  const handleAddInterest = () => {
    if (!newInterestInput.trim()) return;
    if (onUpdateInterests) {
      onUpdateInterests([...interests, newInterestInput.trim()]);
      setNewInterestInput("");
    }
  };
  const handleRemoveInterest = (index: number) => {
    if (onUpdateInterests) {
      onUpdateInterests(interests.filter((_, i) => i !== index));
    }
  };

  // Volunteer
  const handleAddVolunteer = () => {
    if (onUpdateVolunteer) {
      onUpdateVolunteer([
        ...volunteer,
        {
          id: "vol-" + Date.now(),
          organization: "Association ou ONG",
          role: "Bénévole / Responsable",
          period: "2023 - Présent",
          description: "Missions accomplies, accompagnement ou gestion d'événements.",
        },
      ]);
    }
  };
  const handleUpdateVolunteer = (id: string, field: keyof VolunteerItem, val: any) => {
    if (onUpdateVolunteer) {
      onUpdateVolunteer(volunteer.map((v) => (v.id === id ? { ...v, [field]: val } : v)));
    }
  };
  const handleRemoveVolunteer = (id: string) => {
    if (onUpdateVolunteer) {
      onUpdateVolunteer(volunteer.filter((v) => v.id !== id));
    }
  };

  // References
  const handleAddReference = () => {
    if (onUpdateReferences) {
      onUpdateReferences([
        ...references,
        {
          id: "ref-" + Date.now(),
          name: "Prénom Nom",
          company: "Nom de l'entreprise",
          role: "Directeur Technique / Manager",
          contact: "Disponible sur demande ou email/téléphone",
        },
      ]);
    }
  };
  const handleUpdateReference = (id: string, field: keyof ReferenceItem, val: any) => {
    if (onUpdateReferences) {
      onUpdateReferences(references.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
    }
  };
  const handleRemoveReference = (id: string) => {
    if (onUpdateReferences) {
      onUpdateReferences(references.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Languages Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center pb-1">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white">Langues Maîtrisées</h3>
          </div>
          <button
            type="button"
            onClick={handleAddLanguage}
            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter une langue</span>
          </button>
        </div>

        <div className="space-y-2">
          {languages.map((l) => (
            <div
              key={l.id}
              className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-3"
            >
              <input
                type="text"
                value={l.language}
                onChange={(e) => handleUpdateLanguage(l.id, "language", e.target.value)}
                placeholder="ex. Français, Anglais, Espagnol"
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />

              <select
                value={l.proficiency}
                onChange={(e) =>
                  handleUpdateLanguage(l.id, "proficiency", e.target.value as LanguageProficiency)
                }
                className="w-48 px-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              >
                {PROFICIENCY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => handleRemoveLanguage(l.id)}
                className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                title="Supprimer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Certifications Section */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <div className="flex justify-between items-center pb-1">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Certifications & Diplômes Pro</h3>
          </div>
          <button
            type="button"
            onClick={handleAddCert}
            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter une certif</span>
          </button>
        </div>

        <div className="space-y-2">
          {certifications.map((c) => (
            <div
              key={c.id}
              className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-2 items-center"
            >
              <input
                type="text"
                value={c.title}
                onChange={(e) => handleUpdateCert(c.id, "title", e.target.value)}
                placeholder="Titre de la certif (ex. AWS Solutions Architect)"
                className="px-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
              <input
                type="text"
                value={c.issuer}
                onChange={(e) => handleUpdateCert(c.id, "issuer", e.target.value)}
                placeholder="Organisme (Amazon, Google, Scrum Alliance)"
                className="px-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={c.year}
                  onChange={(e) => handleUpdateCert(c.id, "year", e.target.value)}
                  placeholder="Année (ex. 2024)"
                  className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCert(c.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Projects Section */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <div className="flex justify-between items-center pb-1">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Projets Marquants & Réalisations</h3>
          </div>
          <button
            type="button"
            onClick={handleAddProject}
            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter un projet</span>
          </button>
        </div>

        <div className="space-y-3">
          {projects.map((p) => (
            <div
              key={p.id}
              className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2.5"
            >
              <div className="flex justify-between items-center gap-2">
                <div className="flex-1">
                  <SpellCheckInput
                    value={p.title}
                    onChange={(val) => handleUpdateProject(p.id, "title", val)}
                    placeholder="Titre du projet"
                    className="w-full px-3 py-1 bg-slate-950 border border-slate-700/80 rounded-lg text-xs font-semibold text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveProject(p.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <SpellCheckTextarea
                rows={2}
                value={p.description}
                onChange={(val) => handleUpdateProject(p.id, "description", val)}
                placeholder="Description concise du projet, défi relevé et résultats chiffrés..."
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-sky-500 leading-relaxed"
              />

              <div>
                <input
                  type="text"
                  value={(p.techStack || []).join(", ")}
                  onChange={(e) =>
                    handleUpdateProject(
                      p.id,
                      "techStack",
                      e.target.value.split(/[,;]+/).map((t) => t.trim()).filter(Boolean)
                    )
                  }
                  placeholder="Technologies séparées par des virgules (ex. React, Python, Docker)"
                  className="w-full px-3 py-1 bg-slate-950 border border-slate-700/80 rounded-lg text-xs font-mono text-sky-300 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Centres d'intérêt / Loisirs (Interests) */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <div className="flex justify-between items-center pb-1">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white">Centres d'intérêt & Passions</h3>
          </div>
          <span className="text-[11px] text-slate-400">Révèle votre personnalité</span>
        </div>

        {/* Tag pills */}
        <div className="flex flex-wrap gap-2 mb-2">
          {interests.map((interest, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
            >
              <span>{interest}</span>
              <button
                type="button"
                onClick={() => handleRemoveInterest(idx)}
                className="text-slate-400 hover:text-rose-400"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Add tag form */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newInterestInput}
            onChange={(e) => setNewInterestInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddInterest())}
            placeholder="ex. Photographie argentique, Semi-marathon, Échecs..."
            className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
          <button
            type="button"
            onClick={handleAddInterest}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
          >
            Ajouter
          </button>
        </div>
      </div>

      {/* 5. Volunteer & Bénévolat */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <div className="flex justify-between items-center pb-1">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-bold text-white">Engagement Associatif & Bénévolat</h3>
          </div>
          <button
            type="button"
            onClick={handleAddVolunteer}
            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter une mission</span>
          </button>
        </div>

        <div className="space-y-3">
          {volunteer.map((v) => (
            <div
              key={v.id}
              className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2"
            >
              <div className="flex justify-between items-center gap-2">
                <input
                  type="text"
                  value={v.role}
                  onChange={(e) => handleUpdateVolunteer(v.id, "role", e.target.value)}
                  placeholder="Rôle / Responsabilité (ex. Trésorier, Bénévole)"
                  className="flex-1 px-3 py-1 bg-slate-950 border border-slate-700/80 rounded-lg text-xs font-semibold text-slate-100 focus:outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveVolunteer(v.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={v.organization}
                  onChange={(e) => handleUpdateVolunteer(v.id, "organization", e.target.value)}
                  placeholder="Association ou Club"
                  className="px-3 py-1 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                />
                <input
                  type="text"
                  value={v.period}
                  onChange={(e) => handleUpdateVolunteer(v.id, "period", e.target.value)}
                  placeholder="Période (2022 - Présent)"
                  className="px-3 py-1 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <input
                type="text"
                value={v.description || ""}
                onChange={(e) => handleUpdateVolunteer(v.id, "description", e.target.value)}
                placeholder="Impact ou mission accomplie"
                className="w-full px-3 py-1 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-sky-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 6. References Professionnelles */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <div className="flex justify-between items-center pb-1">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Références Professionnelles</h3>
          </div>
          <button
            type="button"
            onClick={handleAddReference}
            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter une référence</span>
          </button>
        </div>

        <div className="space-y-3">
          {references.map((r) => (
            <div
              key={r.id}
              className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-2 items-center"
            >
              <input
                type="text"
                value={r.name}
                onChange={(e) => handleUpdateReference(r.id, "name", e.target.value)}
                placeholder="Nom du référent"
                className="px-3 py-1 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
              <input
                type="text"
                value={r.company}
                onChange={(e) => handleUpdateReference(r.id, "company", e.target.value)}
                placeholder="Poste & Entreprise"
                className="px-3 py-1 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={r.contact}
                  onChange={(e) => handleUpdateReference(r.id, "contact", e.target.value)}
                  placeholder="Email / Tel ou 'Sur demande'"
                  className="flex-1 px-3 py-1 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveReference(r.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
