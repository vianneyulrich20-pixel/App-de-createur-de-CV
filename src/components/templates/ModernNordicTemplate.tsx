import React from "react";
import { CVData, CVDesignConfig } from "../../types";
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Car, Calendar, Heart, Award } from "lucide-react";
import { getUnifiedSocialLinks, getPlatformIcon } from "../../utils/socialLinks";

interface TemplateProps {
  cv: CVData;
  config: CVDesignConfig;
}

export const ModernNordicTemplate: React.FC<TemplateProps> = ({ cv, config }) => {
  const { personal, experiences, education, skillCategories, languages, projects, certifications, interests, volunteer, references } = cv;
  const primary = config.primaryColor || "#0284c7";

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

  const isLeftSidebar = config.sidebarPosition === "left";

  const mainContent = (
    <div className="col-span-8 flex flex-col gap-6">
      {/* Experiences */}
      {experiences.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 pb-1 border-b border-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }}></span>
            Expériences Professionnelles
          </h2>
          <div className="flex flex-col gap-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="relative pl-3 border-l-2 border-slate-100">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-slate-900 text-sm">
                    {exp.role}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                    {exp.startDate} – {exp.isCurrent ? "Présent" : exp.endDate}
                  </span>
                </div>
                <div className="text-xs text-slate-600 font-medium mb-1.5 flex flex-wrap items-center gap-2">
                  <span style={{ color: primary }}>{exp.company}</span>
                  {exp.location && <span>• {exp.location}</span>}
                  {exp.contractType && (
                    <span className="px-1.5 py-0.2 rounded bg-slate-100 text-[10px] text-slate-600 border border-slate-200">
                      {exp.contractType}
                    </span>
                  )}
                </div>
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 leading-relaxed marker:text-slate-400">
                    {exp.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
                {exp.techStack && exp.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {exp.techStack.map((tech, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-slate-50 text-slate-600 rounded text-[10px] font-mono border border-slate-200">
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

      {/* Key Projects */}
      {projects && projects.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 pb-1 border-b border-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }}></span>
            Réalisations & Projets
          </h2>
          <div className="flex flex-col gap-3">
            {projects.map((proj) => (
              <div key={proj.id} className="text-xs bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{proj.title}</span>
                  {proj.date && <span className="text-slate-400">{proj.date}</span>}
                </div>
                <p className="text-slate-600 mt-1 leading-relaxed">{proj.description}</p>
                {proj.techStack && proj.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {proj.techStack.map((tech, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-white text-slate-600 rounded text-[10px] font-mono border border-slate-200">
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

      {/* Volunteer / Engagement */}
      {volunteer && volunteer.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }}></span>
            Engagement Associatif & Bénévolat
          </h2>
          <div className="space-y-2 text-xs">
            {volunteer.map((v) => (
              <div key={v.id}>
                <div className="flex justify-between items-baseline font-medium text-slate-800">
                  <span>{v.role} – {v.organization}</span>
                  <span className="text-[11px] text-slate-400">{v.period}</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5">{v.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  const sidebarContent = (
    <div className="col-span-4 flex flex-col gap-6">
      {/* Skills */}
      {skillCategories.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 pb-1 border-b border-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }}></span>
            Compétences
          </h2>
          <div className="flex flex-col gap-3">
            {skillCategories.map((cat) => (
              <div key={cat.id}>
                <h3 className="text-[11px] font-semibold uppercase text-slate-500 mb-1.5">
                  {cat.category}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-2 py-0.5 rounded text-xs font-medium text-slate-700 bg-slate-100"
                    >
                      {skill.name}
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 pb-1 border-b border-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }}></span>
            Formation & Diplômes
          </h2>
          <div className="flex flex-col gap-3">
            {education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="font-semibold text-slate-900">{edu.degree}</div>
                <div className="text-slate-600 font-medium" style={{ color: primary }}>{edu.institution}</div>
                <div className="text-slate-400 text-[11px]">{edu.startDate} – {edu.endDate} {edu.location ? `• ${edu.location}` : ""}</div>
                {edu.honors && <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">{edu.honors}</span>}
                {edu.description && <p className="text-slate-500 mt-1 text-[11px]">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 pb-1 border-b border-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }}></span>
            Langues
          </h2>
          <div className="flex flex-col gap-1.5 text-xs">
            {languages.map((l) => (
              <div key={l.id} className="flex justify-between items-center py-0.5 border-b border-slate-50">
                <span className="font-medium text-slate-800">{l.language}</span>
                <span className="text-slate-500 text-[11px]">{l.proficiency}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }}></span>
            Certifications
          </h2>
          <div className="flex flex-col gap-2 text-xs">
            {certifications.map((c) => (
              <div key={c.id}>
                <div className="font-medium text-slate-900">{c.title}</div>
                <div className="text-slate-500 text-[11px]">{c.issuer} ({c.year})</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Interests / Loisirs */}
      {interests && interests.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }}></span>
            Centres d'intérêt
          </h2>
          <div className="flex flex-wrap gap-1.5 text-xs">
            {interests.map((interest, i) => (
              <span key={i} className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-slate-700 text-[11px]">
                {interest}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* References */}
      {references && references.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }}></span>
            Références
          </h2>
          <div className="space-y-1.5 text-xs">
            {references.map((r) => (
              <div key={r.id}>
                <div className="font-semibold text-slate-800">{r.name}</div>
                <div className="text-slate-500 text-[11px]">{r.role} - {r.company}</div>
                <div className="text-slate-400 text-[10px]">{r.contact}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  return (
    <div className="w-full bg-white text-slate-800 p-8 sm:p-10 flex flex-col gap-6 text-sm font-sans min-h-full leading-normal">
      {/* Header Nordic: Clean, Spacious, Typography-forward */}
      <header className="flex justify-between items-start gap-6 pb-6 border-b border-slate-200">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            {personal.firstName} <span className="font-light">{personal.lastName}</span>
          </h1>
          {personal.title && (
            <p className="text-base sm:text-lg font-medium mt-1 tracking-tight" style={{ color: primary }}>
              {personal.title}
            </p>
          )}

          {/* Contact Details Bar */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 mt-4">
            {personal.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{personal.email}</span>
              </div>
            )}
            {personal.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{personal.phone}</span>
              </div>
            )}
            {(personal.city || personal.country) && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{[personal.city, personal.country].filter(Boolean).join(", ")}</span>
              </div>
            )}
            {personal.driverLicense && (
              <div className="flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-slate-400" />
                <span>{personal.driverLicense}</span>
              </div>
            )}
            {getUnifiedSocialLinks(personal).map((link) => (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
                title={link.label}
              >
                <span className="text-slate-400">{getPlatformIcon(link.platform, "w-3.5 h-3.5")}</span>
                <span>{link.displayText}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Profile Photo */}
        {personal.showPhoto && personal.photoUrl && (
          <div className="flex-shrink-0">
            <img
              src={personal.photoUrl}
              alt={`${personal.firstName} ${personal.lastName}`}
              className={`${getPhotoSizeClass()} object-cover shadow-sm border-2 ${
                personal.photoShape === "circle"
                  ? "rounded-full"
                  : personal.photoShape === "rounded"
                  ? "rounded-xl"
                  : "rounded-none"
              } ${personal.photoFilter === "grayscale" ? "grayscale" : ""}`}
              style={{ borderColor: primary }}
            />
          </div>
        )}
      </header>

      {/* Summary */}
      {personal.summary && (
        <section className="text-slate-600 leading-relaxed text-xs sm:text-sm bg-slate-50 p-4 rounded-lg border-l-4" style={{ borderColor: primary }}>
          <p>{personal.summary}</p>
        </section>
      )}

      {/* Two Columns Grid (Reversible based on sidebarPosition) */}
      <div className="grid grid-cols-12 gap-8 flex-1">
        {isLeftSidebar ? (
          <>
            {sidebarContent}
            {mainContent}
          </>
        ) : (
          <>
            {mainContent}
            {sidebarContent}
          </>
        )}
      </div>
    </div>
  );
};
