import React from "react";
import { CVData, CVDesignConfig } from "../../types";
import { getUnifiedSocialLinks } from "../../utils/socialLinks";

interface TemplateProps {
  cv: CVData;
  config: CVDesignConfig;
}

export const OxfordClassicTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const { personal, experiences, education, skillCategories, languages, certifications, interests, volunteer } = cv;

  const getPhotoSizeClass = () => {
    switch (personal.photoSize) {
      case "sm":
        return "w-16 h-16";
      case "lg":
        return "w-24 h-24";
      case "md":
      default:
        return "w-20 h-20";
    }
  };

  return (
    <div className="w-full bg-white text-slate-900 p-8 sm:p-10 flex flex-col gap-5 text-sm font-serif min-h-full leading-normal">
      {/* Centered Traditional Header */}
      <header className="pb-3 border-b-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
        {personal.showPhoto && personal.photoUrl && (
          <div className="flex-shrink-0">
            <img
              src={personal.photoUrl}
              alt={`${personal.firstName} ${personal.lastName}`}
              className={`${getPhotoSizeClass()} object-cover border border-slate-400 shadow-xs ${
                personal.photoShape === "circle"
                  ? "rounded-full"
                  : personal.photoShape === "rounded"
                  ? "rounded-lg"
                  : "rounded-none"
              } ${personal.photoFilter === "grayscale" ? "grayscale" : ""}`}
            />
          </div>
        )}

        <div className={`flex-1 ${personal.showPhoto && personal.photoUrl ? "text-center sm:text-left" : "text-center"}`}>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wider uppercase text-slate-900">
            {personal.firstName} {personal.lastName}
          </h1>
          {personal.title && (
            <p className="text-sm italic text-slate-800 mt-0.5 font-serif">
              {personal.title}
            </p>
          )}

          <div className={`flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-700 mt-2 font-sans ${
            personal.showPhoto && personal.photoUrl ? "justify-center sm:justify-start" : "justify-center"
          }`}>
            {[
              personal.email ? { key: "email", text: personal.email, href: `mailto:${personal.email}`, title: "Email" } : null,
              personal.phone ? { key: "phone", text: personal.phone, href: `tel:${personal.phone}`, title: "Téléphone" } : null,
              (personal.city || personal.country)
                ? { key: "loc", text: [personal.city, personal.country].filter(Boolean).join(", "), href: undefined, title: "Localisation" }
                : null,
              personal.driverLicense ? { key: "lic", text: personal.driverLicense, href: undefined, title: "Permis" } : null,
              ...getUnifiedSocialLinks(personal).map((l) => ({
                key: l.id,
                text: l.displayText,
                href: l.href,
                title: l.label,
              })),
            ]
              .filter(Boolean)
              .map((item, idx) => (
                <React.Fragment key={item!.key || idx}>
                  {idx > 0 && <span>•</span>}
                  {item!.href ? (
                    <a
                      href={item!.href}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-slate-950 hover:underline transition-colors"
                      title={item!.title || item!.text}
                    >
                      {item!.text}
                    </a>
                  ) : (
                    <span>{item!.text}</span>
                  )}
                </React.Fragment>
              ))}
          </div>
        </div>
      </header>

      {/* Summary */}
      {personal.summary && (
        <section className="text-xs text-justify text-slate-800 leading-relaxed font-serif italic">
          <p>{personal.summary}</p>
        </section>
      )}

      {/* Experience Section */}
      {experiences.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-800 pb-0.5 mb-2.5 font-sans">
            Expérience Professionnelle
          </h2>
          <div className="flex flex-col gap-3.5">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-slate-900 text-sm">{exp.role}</span>
                    {exp.contractType && (
                      <span className="text-[10px] font-sans px-1 bg-slate-100 rounded text-slate-600">
                        {exp.contractType}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-sans text-slate-600">
                    {exp.startDate} – {exp.isCurrent ? "Présent" : exp.endDate}
                  </span>
                </div>
                <div className="text-xs italic text-slate-700 mb-1">
                  {exp.company} {exp.location ? `— ${exp.location}` : ""}
                </div>
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-slate-800 leading-relaxed font-serif">
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

      {/* Education */}
      {education.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-800 pb-0.5 mb-2 font-sans">
            Formation & Diplômes
          </h2>
          <div className="flex flex-col gap-2.5">
            {education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">{edu.degree}</span>
                  <span className="font-sans text-slate-600 text-[11px]">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="italic text-slate-700">{edu.institution} {edu.location ? `(${edu.location})` : ""}</div>
                {edu.description && <p className="text-slate-600 mt-0.5">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Langues */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-800 pb-0.5 mb-2 font-sans">
          Compétences & Langues
        </h2>
        <div className="flex flex-col gap-1.5 text-xs">
          {skillCategories.map((cat) => (
            <div key={cat.id}>
              <span className="font-bold text-slate-900">{cat.category} : </span>
              <span className="text-slate-800 font-sans">
                {cat.skills.map((s) => s.name).join(", ")}
              </span>
            </div>
          ))}
          {languages.length > 0 && (
            <div className="mt-1">
              <span className="font-bold text-slate-900">Langues : </span>
              <span className="text-slate-800 font-sans">
                {languages.map((l) => `${l.language} (${l.proficiency})`).join(" • ")}
              </span>
            </div>
          )}
          {certifications.length > 0 && (
            <div className="mt-1">
              <span className="font-bold text-slate-900">Certifications : </span>
              <span className="text-slate-800 font-sans">
                {certifications.map((c) => `${c.title} (${c.issuer}, ${c.year})`).join(" • ")}
              </span>
            </div>
          )}
          {interests && interests.length > 0 && (
            <div className="mt-1">
              <span className="font-bold text-slate-900">Centres d'intérêt : </span>
              <span className="text-slate-800 font-sans">
                {interests.join(" • ")}
              </span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
