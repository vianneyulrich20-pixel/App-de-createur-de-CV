import React from "react";
import { CVData, CVDesignConfig } from "../../types";
import { Mail, Phone, MapPin, Globe, Linkedin, Car, Award, Heart } from "lucide-react";
import { getUnifiedSocialLinks, getPlatformIcon } from "../../utils/socialLinks";

interface TemplateProps {
  cv: CVData;
  config: CVDesignConfig;
}

export const PrestigeExecutiveTemplate: React.FC<TemplateProps> = ({ cv, config }) => {
  const { personal, experiences, education, skillCategories, languages, certifications, interests, volunteer, references } = cv;
  const primary = config.primaryColor || "#1e293b";

  const getPhotoSizeClass = () => {
    switch (personal.photoSize) {
      case "sm":
        return "w-20 h-20";
      case "lg":
        return "w-28 h-28";
      case "md":
      default:
        return "w-24 h-24";
    }
  };

  return (
    <div className="w-full bg-white text-slate-900 p-8 sm:p-10 flex flex-col gap-5 text-sm font-garamond min-h-full leading-relaxed">
      {/* Formal Executive Header */}
      <header className="pb-4 border-b-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-5">
        {personal.showPhoto && personal.photoUrl && (
          <div className="flex-shrink-0">
            <img
              src={personal.photoUrl}
              alt={`${personal.firstName} ${personal.lastName}`}
              className={`${getPhotoSizeClass()} object-cover border border-slate-300 shadow-sm ${
                personal.photoShape === "circle"
                  ? "rounded-full"
                  : personal.photoShape === "rounded"
                  ? "rounded-xl"
                  : "rounded-none"
              } ${personal.photoFilter === "grayscale" ? "grayscale" : ""}`}
            />
          </div>
        )}

        <div className={`flex-1 ${personal.showPhoto && personal.photoUrl ? "text-center sm:text-left" : "text-center"}`}>
          <h1 className="text-3xl font-semibold tracking-wide uppercase text-slate-900 font-classic-heading">
            {personal.firstName} {personal.lastName}
          </h1>
          {personal.title && (
            <p className="text-base italic text-slate-700 mt-0.5 font-serif tracking-wide" style={{ color: primary }}>
              {personal.title}
            </p>
          )}

          <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-2.5 font-sans ${
            personal.showPhoto && personal.photoUrl ? "justify-center sm:justify-start" : "justify-center"
          }`}>
            {(personal.city || personal.country) && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500" />
                {[personal.city, personal.country].filter(Boolean).join(", ")}
              </span>
            )}
            {personal.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-500" />
                {personal.phone}
              </span>
            )}
            {personal.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-500" />
                {personal.email}
              </span>
            )}
            {personal.driverLicense && (
              <span className="flex items-center gap-1">
                <Car className="w-3 h-3 text-slate-500" />
                {personal.driverLicense}
              </span>
            )}
            {getUnifiedSocialLinks(personal).map((link) => (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:underline"
                title={link.label}
              >
                <span className="text-slate-500">{getPlatformIcon(link.platform, "w-3 h-3")}</span>
                <span>{link.displayText}</span>
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* Profile summary */}
      {personal.summary && (
        <section className="text-justify text-slate-700 text-sm italic px-3 py-1 border-l-2" style={{ borderColor: primary }}>
          <p>{personal.summary}</p>
        </section>
      )}

      {/* Experience Section */}
      {experiences.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-800 pb-1 mb-3 font-sans">
            Expérience Professionnelle & Responsabilités
          </h2>
          <div className="flex flex-col gap-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="text-xs">
                <div className="flex justify-between items-baseline">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-slate-900 text-sm">{exp.role}</span>
                    <span className="text-slate-700 italic">| {exp.company}</span>
                    {exp.contractType && (
                      <span className="font-sans text-[10px] px-1 py-0.2 bg-slate-100 rounded text-slate-600">
                        {exp.contractType}
                      </span>
                    )}
                  </div>
                  <span className="text-slate-500 font-sans text-[11px] whitespace-nowrap">
                    {exp.startDate} – {exp.isCurrent ? "Présent" : exp.endDate}
                  </span>
                </div>
                {exp.location && (
                  <div className="text-[11px] text-slate-500 font-sans mb-1">{exp.location}</div>
                )}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc list-inside space-y-0.5 text-slate-700 leading-relaxed marker:text-slate-600 pl-1 mt-1">
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

      {/* Dual Column Bottom Section: Education & Expertise */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-800 pb-1 mb-3 font-sans">
              Formation & Diplômes
            </h2>
            <div className="flex flex-col gap-2.5">
              {education.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <div className="font-bold text-slate-900">{edu.degree}</div>
                  <div className="text-slate-700 italic">{edu.institution} {edu.location ? `(${edu.location})` : ""}</div>
                  <div className="text-slate-500 font-sans text-[11px]">{edu.startDate} – {edu.endDate}</div>
                  {edu.honors && <div className="text-[10px] text-emerald-800 font-sans mt-0.5 font-semibold">{edu.honors}</div>}
                  {edu.description && <p className="text-slate-600 mt-0.5">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Competences & Langues & Interets */}
        <div className="flex flex-col gap-4">
          {skillCategories.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-800 pb-1 mb-2 font-sans">
                Domaines d'Expertise
              </h2>
              <div className="flex flex-col gap-1.5 text-xs">
                {skillCategories.map((cat) => (
                  <div key={cat.id}>
                    <span className="font-bold text-slate-800">{cat.category} : </span>
                    <span className="text-slate-600 font-sans">
                      {cat.skills.map((s) => s.name).join(", ")}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {languages.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-800 pb-1 mb-1 font-sans">
                Langues
              </h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-sans text-slate-700">
                {languages.map((l) => (
                  <span key={l.id}>
                    <strong>{l.language}</strong> ({l.proficiency})
                  </span>
                ))}
              </div>
            </section>
          )}

          {certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-800 pb-1 mb-1 font-sans">
                Accréditations
              </h2>
              <div className="text-xs font-sans text-slate-600 space-y-0.5">
                {certifications.map((c) => (
                  <div key={c.id}>
                    • <strong>{c.title}</strong> — {c.issuer} ({c.year})
                  </div>
                ))}
              </div>
            </section>
          )}

          {interests && interests.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-800 pb-1 mb-1 font-sans">
                Centres d'intérêt
              </h2>
              <div className="text-xs font-sans text-slate-600">
                {interests.join(" • ")}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
