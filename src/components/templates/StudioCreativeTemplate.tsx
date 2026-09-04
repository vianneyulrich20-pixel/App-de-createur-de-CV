import React from "react";
import { CVData, CVDesignConfig } from "../../types";
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";
import { getUnifiedSocialLinks, getPlatformIcon } from "../../utils/socialLinks";

interface TemplateProps {
  cv: CVData;
  config: CVDesignConfig;
}

export const StudioCreativeTemplate: React.FC<TemplateProps> = ({ cv, config }) => {
  const { personal, experiences, education, skillCategories, languages, projects } = cv;
  const primary = config.primaryColor || "#4f46e5";

  return (
    <div className="w-full bg-white text-slate-800 flex min-h-full font-outfit">
      {/* Left Colored Brand Sidebar */}
      <aside className="w-1/3 bg-slate-900 text-white p-7 flex flex-col justify-between gap-6">
        <div>
          {/* Photo */}
          {personal.showPhoto && personal.photoUrl && (
            <div className="mb-5">
              <img
                src={personal.photoUrl}
                alt={`${personal.firstName} ${personal.lastName}`}
                className={`w-28 h-28 object-cover border-2 shadow-lg ${
                  personal.photoShape === "circle"
                    ? "rounded-full"
                    : personal.photoShape === "rounded"
                    ? "rounded-2xl"
                    : "rounded-none"
                }`}
                style={{ borderColor: primary }}
              />
            </div>
          )}

          <div className="mb-6">
            <h1 className="text-2xl font-extrabold tracking-tight text-white leading-tight">
              {personal.firstName}
              <br />
              <span style={{ color: primary }}>{personal.lastName}</span>
            </h1>
            {personal.title && (
              <p className="text-xs font-medium text-slate-400 mt-2 uppercase tracking-widest">
                {personal.title}
              </p>
            )}
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-2.5 text-xs text-slate-300 pb-6 border-b border-slate-800">
            {personal.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{personal.email}</span>
              </div>
            )}
            {personal.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{personal.phone}</span>
              </div>
            )}
            {(personal.city || personal.country) && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{[personal.city, personal.country].filter(Boolean).join(", ")}</span>
              </div>
            )}
            {getUnifiedSocialLinks(personal).map((link) => (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
                title={link.label}
              >
                <span className="text-slate-400 flex-shrink-0">{getPlatformIcon(link.platform, "w-3.5 h-3.5")}</span>
                <span className="truncate">{link.displayText}</span>
              </a>
            ))}
          </div>

          {/* Skills on Sidebar */}
          {skillCategories.length > 0 && (
            <div className="mt-6 flex flex-col gap-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Compétences
              </h2>
              {skillCategories.map((c) => (
                <div key={c.id}>
                  <p className="text-[11px] font-semibold text-slate-400 mb-1.5">{c.category}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.skills.map((s) => (
                      <span key={s.id} className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-200 border border-slate-700">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Languages on Sidebar bottom */}
        {languages.length > 0 && (
          <div className="pt-4 border-t border-slate-800 text-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Langues
            </h2>
            <div className="flex flex-col gap-1">
              {languages.map((l) => (
                <div key={l.id} className="flex justify-between text-slate-300">
                  <span>{l.language}</span>
                  <span className="text-slate-500 text-[11px]">{l.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Right Content Area */}
      <main className="w-2/3 p-8 flex flex-col gap-6">
        {/* Bio */}
        {personal.summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b-2" style={{ borderColor: primary }}>
              Profil Créatif & Vision
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {personal.summary}
            </p>
          </section>
        )}

        {/* Experiences */}
        {experiences.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 pb-1 border-b-2" style={{ borderColor: primary }}>
              Expériences Clés
            </h2>
            <div className="flex flex-col gap-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-sm">{exp.role}</span>
                    <span className="text-slate-400 font-medium text-[11px]">
                      {exp.startDate} – {exp.isCurrent ? "Présent" : exp.endDate}
                    </span>
                  </div>
                  <div className="font-semibold mb-1" style={{ color: primary }}>
                    {exp.company} {exp.location ? `• ${exp.location}` : ""}
                  </div>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-outside ml-3.5 space-y-1 text-slate-600 leading-relaxed">
                      {exp.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 pb-1 border-b-2" style={{ borderColor: primary }}>
              Portfolio & Réalisations
            </h2>
            <div className="flex flex-col gap-3">
              {projects.map((p) => (
                <div key={p.id} className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex justify-between items-center font-bold text-slate-900">
                    <span>{p.title}</span>
                    {p.date && <span className="text-slate-400 text-[11px] font-normal">{p.date}</span>}
                  </div>
                  <p className="text-slate-600 mt-1">{p.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b-2" style={{ borderColor: primary }}>
              Formation
            </h2>
            <div className="flex flex-col gap-2 text-xs">
              {education.map((e) => (
                <div key={e.id}>
                  <div className="font-bold text-slate-900">{e.degree}</div>
                  <div className="text-slate-600 font-medium">{e.institution} • {e.startDate} – {e.endDate}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
