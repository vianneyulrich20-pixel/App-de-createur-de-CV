import React from "react";
import { CVData, CVDesignConfig } from "../../types";
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Car } from "lucide-react";
import { getUnifiedSocialLinks, getPlatformIcon } from "../../utils/socialLinks";

interface TemplateProps {
  cv: CVData;
  config: CVDesignConfig;
}

export const DenseCompactTemplate: React.FC<TemplateProps> = ({ cv, config }) => {
  const { personal, experiences, education, skillCategories, languages, projects, certifications, interests, volunteer } = cv;
  const primary = config.primaryColor || "#0f766e";

  const getPhotoSizeClass = () => {
    switch (personal.photoSize) {
      case "sm":
        return "w-14 h-14";
      case "lg":
        return "w-20 h-20";
      case "md":
      default:
        return "w-16 h-16";
    }
  };

  return (
    <div className="w-full bg-white text-slate-800 p-6 flex flex-col gap-3 text-xs font-sans min-h-full leading-tight">
      {/* Header Compact */}
      <header className="flex justify-between items-center pb-2.5 border-b-2 gap-4" style={{ borderColor: primary }}>
        <div className="flex items-center gap-3.5">
          {personal.showPhoto && personal.photoUrl && (
            <img
              src={personal.photoUrl}
              alt={`${personal.firstName} ${personal.lastName}`}
              className={`${getPhotoSizeClass()} object-cover border border-slate-300 shadow-xs ${
                personal.photoShape === "circle"
                  ? "rounded-full"
                  : personal.photoShape === "rounded"
                  ? "rounded-lg"
                  : "rounded-none"
              } ${personal.photoFilter === "grayscale" ? "grayscale" : ""}`}
            />
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {personal.firstName} {personal.lastName}
            </h1>
            {personal.title && (
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-700 mt-0.5" style={{ color: primary }}>
                {personal.title}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col text-[11px] text-slate-600 text-right space-y-0.5">
          <div className="flex justify-end items-center gap-2">
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
          </div>
          <div className="flex justify-end items-center gap-2 flex-wrap">
            {(personal.city || personal.country) && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {[personal.city, personal.country].filter(Boolean).join(", ")}
              </span>
            )}
            {personal.driverLicense && (
              <span className="flex items-center gap-1">
                <Car className="w-3 h-3 text-slate-400" />
                {personal.driverLicense}
              </span>
            )}
            {getUnifiedSocialLinks(personal).map((link) => (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-slate-900 transition-colors"
                title={link.label}
              >
                <span className="text-slate-400">{getPlatformIcon(link.platform, "w-3 h-3")}</span>
                <span>{link.displayText}</span>
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* Summary */}
      {personal.summary && (
        <section className="text-[11px] text-slate-700 leading-relaxed bg-slate-50 p-2 rounded border border-slate-100">
          <p>{personal.summary}</p>
        </section>
      )}

      {/* Grid: 2 columns to maximize vertical space utilization */}
      <div className="grid grid-cols-12 gap-5 flex-1">
        {/* Main Column */}
        <div className="col-span-8 flex flex-col gap-3">
          {/* Experiences */}
          {experiences.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b pb-0.5 mb-2" style={{ borderColor: primary }}>
                Expériences Professionnelles
              </h2>
              <div className="flex flex-col gap-2.5">
                {experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-900 text-xs">{exp.role}</span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {exp.startDate} – {exp.isCurrent ? "Présent" : exp.endDate}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-700 font-medium mb-0.5 flex items-center gap-1.5">
                      <span style={{ color: primary }}>{exp.company}</span>
                      {exp.location && <span> • {exp.location}</span>}
                      {exp.contractType && (
                        <span className="text-[9px] px-1 bg-slate-100 rounded text-slate-500 font-mono">
                          {exp.contractType}
                        </span>
                      )}
                    </div>
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="list-disc list-outside ml-3 space-y-0.5 text-[11px] text-slate-600 leading-normal">
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
          {projects && projects.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b pb-0.5 mb-1.5" style={{ borderColor: primary }}>
                Projets Clés
              </h2>
              <div className="flex flex-col gap-1.5 text-[11px]">
                {projects.map((p) => (
                  <div key={p.id}>
                    <span className="font-bold text-slate-900">{p.title}</span> :{" "}
                    <span className="text-slate-600">{p.description}</span>
                    {p.techStack && p.techStack.length > 0 && (
                      <span className="text-slate-500 text-[10px] font-mono"> [{p.techStack.join(", ")}]</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="col-span-4 flex flex-col gap-3">
          {/* Skills */}
          {skillCategories.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b pb-0.5 mb-1.5" style={{ borderColor: primary }}>
                Compétences
              </h2>
              <div className="flex flex-col gap-2 text-[11px]">
                {skillCategories.map((c) => (
                  <div key={c.id}>
                    <span className="font-bold text-slate-800 text-[10px] uppercase block mb-0.5">{c.category}</span>
                    <div className="flex flex-wrap gap-1">
                      {c.skills.map((s) => (
                        <span key={s.id} className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-800 font-medium">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b pb-0.5 mb-1.5" style={{ borderColor: primary }}>
                Formation
              </h2>
              <div className="flex flex-col gap-1.5 text-[11px]">
                {education.map((e) => (
                  <div key={e.id}>
                    <div className="font-bold text-slate-900">{e.degree}</div>
                    <div className="text-slate-600 text-[10px]">{e.institution} • {e.startDate}–{e.endDate}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b pb-0.5 mb-1" style={{ borderColor: primary }}>
                Langues
              </h2>
              <div className="flex flex-col gap-0.5 text-[11px]">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between">
                    <span className="font-medium text-slate-800">{l.language}</span>
                    <span className="text-slate-500 text-[10px]">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b pb-0.5 mb-1" style={{ borderColor: primary }}>
                Certifications
              </h2>
              <div className="flex flex-col gap-1 text-[10px] text-slate-700">
                {certifications.map((c) => (
                  <div key={c.id}>
                    • <strong>{c.title}</strong> ({c.year})
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Interests */}
          {interests && interests.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b pb-0.5 mb-1" style={{ borderColor: primary }}>
                Centres d'intérêt
              </h2>
              <div className="text-[10px] text-slate-600">
                {interests.join(" • ")}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
