import React from "react";
import { CVData, CVDesignConfig } from "../../types";
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Terminal, Code2 } from "lucide-react";
import { getUnifiedSocialLinks, getPlatformIcon } from "../../utils/socialLinks";

interface TemplateProps {
  cv: CVData;
  config: CVDesignConfig;
}

export const ModernTechTemplate: React.FC<TemplateProps> = ({ cv, config }) => {
  const { personal, experiences, education, skillCategories, languages, projects, certifications } = cv;
  const primary = config.primaryColor || "#3b82f6";

  return (
    <div className="w-full bg-white text-slate-800 p-8 flex flex-col gap-5 text-sm font-sans min-h-full">
      {/* Top Banner with Dark Header Accent */}
      <header className="bg-slate-900 text-white p-6 rounded-xl relative overflow-hidden">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <Terminal className="w-3.5 h-3.5" />
              <span>~/software-engineer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {personal.firstName} <span style={{ color: primary }}>{personal.lastName}</span>
            </h1>
            {personal.title && (
              <p className="text-sm font-mono text-slate-300 mt-1">
                {personal.title}
              </p>
            )}

            {/* Contact links */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-300 mt-3 font-mono">
              {personal.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" />
                  {personal.email}
                </span>
              )}
              {personal.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {personal.phone}
                </span>
              )}
              {(personal.city || personal.country) && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {[personal.city, personal.country].filter(Boolean).join(", ")}
                </span>
              )}
              {getUnifiedSocialLinks(personal).map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
                  title={link.label}
                >
                  <span className="text-sky-300">{getPlatformIcon(link.platform, "w-3 h-3")}</span>
                  <span>{link.displayText}</span>
                </a>
              ))}
            </div>
          </div>

          {personal.showPhoto && personal.photoUrl && (
            <img
              src={personal.photoUrl}
              alt={`${personal.firstName} ${personal.lastName}`}
              className="w-20 h-20 rounded-xl object-cover border-2 border-slate-700 shadow-md"
            />
          )}
        </div>
      </header>

      {/* Summary */}
      {personal.summary && (
        <section className="text-xs text-slate-600 leading-relaxed border-l-2 pl-3" style={{ borderColor: primary }}>
          <p>{personal.summary}</p>
        </section>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6 flex-1">
        {/* Experiences & Projects */}
        <div className="col-span-8 flex flex-col gap-5">
          {experiences.length > 0 && (
            <section>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2 pb-1 border-b border-slate-200">
                <Code2 className="w-3.5 h-3.5" style={{ color: primary }} />
                <span>Expériences & Systèmes</span>
              </h2>
              <div className="flex flex-col gap-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                        {exp.role}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-500">
                        {exp.startDate} – {exp.isCurrent ? "Présent" : exp.endDate}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                      <span style={{ color: primary }} className="font-semibold">{exp.company}</span>
                      {exp.location && <span className="text-slate-400">({exp.location})</span>}
                    </div>
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="list-disc list-outside ml-3.5 space-y-1 text-xs text-slate-600 leading-relaxed">
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

          {projects.length > 0 && (
            <section>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-2 pb-1 border-b border-slate-200">
                <Terminal className="w-3.5 h-3.5" style={{ color: primary }} />
                <span>Projets Marquants & Open-Source</span>
              </h2>
              <div className="flex flex-col gap-2.5">
                {projects.map((proj) => (
                  <div key={proj.id} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-900">{proj.title}</span>
                      {proj.link && <span className="text-[10px] font-mono text-slate-500">{proj.link}</span>}
                    </div>
                    <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">{proj.description}</p>
                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {proj.techStack.map((tech, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-white border border-slate-200 text-slate-700 rounded text-[10px] font-mono">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar: Skills, Education, Languages */}
        <div className="col-span-4 flex flex-col gap-4">
          {skillCategories.length > 0 && (
            <section>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-slate-200">
                // Stack Technique
              </h2>
              <div className="flex flex-col gap-2.5">
                {skillCategories.map((cat) => (
                  <div key={cat.id}>
                    <div className="text-[10px] font-mono font-semibold uppercase text-slate-500 mb-1">
                      {cat.category}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {cat.skills.map((s) => (
                        <span key={s.id} className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[11px] font-mono text-slate-800">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-slate-200">
                // Formation
              </h2>
              <div className="flex flex-col gap-2 text-xs">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="font-semibold text-slate-900 text-xs">{edu.degree}</div>
                    <div className="text-slate-600 text-[11px] font-medium" style={{ color: primary }}>{edu.institution}</div>
                    <div className="text-slate-400 font-mono text-[10px]">{edu.startDate} – {edu.endDate}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-slate-200">
                // Certifications
              </h2>
              <div className="flex flex-col gap-1.5 text-[11px]">
                {certifications.map((c) => (
                  <div key={c.id}>
                    <div className="font-medium text-slate-800">{c.title}</div>
                    <div className="text-slate-400 text-[10px] font-mono">{c.issuer} • {c.year}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {languages.length > 0 && (
            <section>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-1.5 pb-1 border-b border-slate-200">
                // Langues
              </h2>
              <div className="flex flex-col gap-1 text-xs">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between items-center text-[11px]">
                    <span className="font-medium text-slate-800">{l.language}</span>
                    <span className="text-slate-500 font-mono text-[10px]">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
