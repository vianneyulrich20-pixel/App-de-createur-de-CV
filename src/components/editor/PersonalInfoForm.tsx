import React, { useState, useRef, useMemo } from "react";
import { PersonalInfo, PhotoShape, PhotoSize, PhotoFilter, SocialLinkItem } from "../../types";
import { Sparkles, Upload, User, Trash2, Check, Sliders, ShieldCheck } from "lucide-react";
import { optimizeAvatarImage } from "../../utils/imageOptimizer";
import { SpellCheckInput } from "./SpellCheckInput";
import { SpellCheckTextarea } from "./SpellCheckTextarea";
import { SocialLinksEditor } from "./SocialLinksEditor";

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (updated: PersonalInfo) => void;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ data, onChange }) => {
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summarySuggestions, setSummarySuggestions] = useState<string[]>([]);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derive dynamic social links with seamless fallback to legacy fields
  const currentSocialLinks = useMemo<SocialLinkItem[]>(() => {
    if (data.socialLinks && data.socialLinks.length > 0) {
      return data.socialLinks;
    }
    const list: SocialLinkItem[] = [];
    if (data.linkedin && data.linkedin.trim()) {
      list.push({
        id: "link-linkedin-init",
        platform: "linkedin",
        label: "LinkedIn",
        url: data.linkedin.trim(),
      });
    }
    if (data.github && data.github.trim()) {
      list.push({
        id: "link-github-init",
        platform: "github",
        label: "GitHub",
        url: data.github.trim(),
      });
    }
    if (data.website && data.website.trim()) {
      list.push({
        id: "link-portfolio-init",
        platform: "portfolio",
        label: "Portfolio",
        url: data.website.trim(),
      });
    }
    return list;
  }, [data.socialLinks, data.linkedin, data.github, data.website]);

  const handleSocialLinksChange = (updatedLinks: SocialLinkItem[]) => {
    const firstLinkedin = updatedLinks.find((l) => l.platform === "linkedin")?.url || "";
    const firstGithub = updatedLinks.find((l) => l.platform === "github")?.url || "";
    const firstPortfolioOrWeb =
      updatedLinks.find((l) => l.platform === "portfolio" || l.platform === "website")?.url || "";

    onChange({
      ...data,
      socialLinks: updatedLinks,
      linkedin: firstLinkedin,
      github: firstGithub,
      website: firstPortfolioOrWeb,
    });
  };

  const handleChange = (field: keyof PersonalInfo, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setPhotoError("Veuillez sélectionner un fichier image (JPG, PNG, WEBP).");
      return;
    }

    setIsProcessingPhoto(true);
    setPhotoError(null);

    try {
      const optimizedUrl = await optimizeAvatarImage(file, {
        maxWidth: 480,
        maxHeight: 480,
        quality: 0.9,
        grayscale: data.photoFilter === "grayscale",
      });

      // Atomic single update to prevent stale state wipeout
      onChange({
        ...data,
        photoUrl: optimizedUrl,
        showPhoto: true,
      });
    } catch (err: any) {
      console.error("Erreur optimisation photo:", err);
      setPhotoError(err.message || "Impossible de charger cette image.");
    } finally {
      setIsProcessingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemovePhoto = () => {
    onChange({
      ...data,
      photoUrl: "",
      showPhoto: false,
    });
    setPhotoError(null);
  };

  const handleToggleFilter = async (filter: PhotoFilter) => {
    handleChange("photoFilter", filter);
  };

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const res = await fetch("/api/ai/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: data.title || "Professionnel Qualifié",
          yearsOfExperience: "Confirmé / Senior",
          topSkills: "Leadership, Résolution de problèmes, Impact opérationnel et stratégique",
        }),
      });
      const result = await res.json();
      if (result.summaries && result.summaries.length > 0) {
        const texts = result.summaries.map((s: any) => (typeof s === "string" ? s : s.text));
        setSummarySuggestions(texts);
      }
    } catch (err) {
      // Fallback templates if offline or serverless
      setSummarySuggestions([
        `Professionnel expérimenté et orienté résultats avec plus de 6 ans d'expertise en tant que ${data.title || "spécialiste"}. Reconnu pour ma capacité à concevoir et piloter des projets stratégiques majeurs, optimiser les processus et fédérer les équipes autour d'objectifs ambitieux.`,
        `Spécialiste passionné en ${data.title || "ingénierie et management"}, alliant rigueur méthodologique et esprit d'innovation. Habitué aux environnements exigeants, j'ai notamment contribué à l'accroissement de la performance opérationnelle et à l'accélération des cycles de livraison.`,
        `Profil polyvalent et autonome, fort d'une solide expérience dans le domaine de ${data.title || "l'expertise métier"}. Doté d'une excellente vision stratégique et d'un sens aigu du détail, j'accompagne la croissance des organisations grâce à des solutions robustes et pérennes.`
      ]);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const getPhotoSizeClass = () => {
    switch (data.photoSize) {
      case "sm":
        return "w-16 h-16";
      case "lg":
        return "w-24 h-24";
      case "md":
      default:
        return "w-20 h-20";
    }
  };

  const getPhotoShapeClass = () => {
    switch (data.photoShape) {
      case "circle":
        return "rounded-full";
      case "rounded":
        return "rounded-2xl";
      case "square":
      default:
        return "rounded-none";
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Profile Photo Management Studio */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`p-4 sm:p-5 rounded-xl border transition-all ${
          isDragging
            ? "border-sky-400 bg-sky-950/40 ring-2 ring-sky-400/30"
            : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Avatar Preview */}
          <div className="relative group flex-shrink-0">
            {data.photoUrl && data.showPhoto ? (
              <img
                src={data.photoUrl}
                alt="Photo de profil"
                className={`${getPhotoSizeClass()} ${getPhotoShapeClass()} object-cover border-2 border-sky-500 shadow-md ${
                  data.photoFilter === "grayscale" ? "grayscale" : ""
                }`}
              />
            ) : (
              <div
                className={`${getPhotoSizeClass()} ${getPhotoShapeClass()} bg-slate-950 border border-slate-700 flex flex-col items-center justify-center text-slate-500`}
              >
                <User className="w-8 h-8 opacity-60" />
                <span className="text-[9px] uppercase tracking-wider mt-0.5 opacity-60 font-mono">
                  {data.showPhoto ? "Sans photo" : "Masquée"}
                </span>
              </div>
            )}

            {data.photoUrl && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute -top-1.5 -right-1.5 p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full shadow-lg transition-transform hover:scale-110"
                title="Supprimer la photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Photo Actions & Controls */}
          <div className="flex-1 text-center sm:text-left space-y-3 w-full">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <input
                ref={fileInputRef}
                type="file"
                id="cv-photo-file-input"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingPhoto}
                className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 active:scale-95 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isProcessingPhoto ? "Optimisation..." : "Charger ma photo"}</span>
              </button>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors">
                <input
                  type="checkbox"
                  checked={data.showPhoto}
                  onChange={(e) => handleChange("showPhoto", e.target.checked)}
                  className="rounded text-sky-500 focus:ring-sky-500 border-slate-700 bg-slate-900"
                />
                <span className="select-none font-medium">Afficher sur le CV</span>
              </label>

              {data.photoUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1.5 rounded hover:bg-rose-950/30 transition-colors"
                >
                  Supprimer
                </button>
              )}
            </div>

            {photoError && (
              <p className="text-xs text-rose-400 font-medium">{photoError}</p>
            )}

            {/* Customization Options when photo is active */}
            {data.showPhoto && (
              <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                {/* Shapes */}
                <div>
                  <span className="text-slate-400 block mb-1 font-medium">Forme :</span>
                  <div className="flex bg-slate-950 p-0.5 rounded-md border border-slate-800">
                    {(["circle", "rounded", "square"] as PhotoShape[]).map((shape) => (
                      <button
                        key={shape}
                        type="button"
                        onClick={() => handleChange("photoShape", shape)}
                        className={`flex-1 py-1 rounded text-center transition-all ${
                          data.photoShape === shape
                            ? "bg-sky-600 text-white font-semibold shadow-xs"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {shape === "circle" ? "Ronde" : shape === "rounded" ? "Arrondie" : "Carrée"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <span className="text-slate-400 block mb-1 font-medium">Taille :</span>
                  <div className="flex bg-slate-950 p-0.5 rounded-md border border-slate-800">
                    {(["sm", "md", "lg"] as PhotoSize[]).map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleChange("photoSize", sz)}
                        className={`flex-1 py-1 rounded text-center transition-all ${
                          (data.photoSize || "md") === sz
                            ? "bg-sky-600 text-white font-semibold shadow-xs"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {sz === "sm" ? "Petite" : sz === "md" ? "Moyenne" : "Grande"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filters */}
                <div>
                  <span className="text-slate-400 block mb-1 font-medium">Style :</span>
                  <div className="flex bg-slate-950 p-0.5 rounded-md border border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleToggleFilter("none")}
                      className={`flex-1 py-1 rounded text-center transition-all ${
                        (data.photoFilter || "none") === "none"
                          ? "bg-sky-600 text-white font-semibold shadow-xs"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Couleur
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleFilter("grayscale")}
                      className={`flex-1 py-1 rounded text-center transition-all ${
                        data.photoFilter === "grayscale"
                          ? "bg-sky-600 text-white font-semibold shadow-xs"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      N&B Chic
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Coordonnées & Identité Professionnelle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Prénom <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={data.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            placeholder="ex. Alexandre"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Nom de famille <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={data.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            placeholder="ex. Dubois"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Titre professionnel ciblé <span className="text-rose-400">*</span>
          </label>
          <SpellCheckInput
            value={data.title}
            onChange={(val) => handleChange("title", val)}
            placeholder="ex. Lead Développeur Full-Stack & Cloud Architecture"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
          <span className="text-[11px] text-slate-400 mt-1 block">
            Ce titre est lu en premier par le recruteur (règle des 6 secondes). Alignez-le précisément avec l'intitulé de l'offre.
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Email professionnel <span className="text-rose-400">*</span>
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="alexandre.dubois@email.com"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Numéro de téléphone <span className="text-rose-400">*</span>
          </label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+33 6 12 34 56 78"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Ville / Région
          </label>
          <input
            type="text"
            value={data.city}
            onChange={(e) => handleChange("city", e.target.value)}
            placeholder="Paris, France"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Code Postal & Pays
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={data.postalCode || ""}
              onChange={(e) => handleChange("postalCode", e.target.value)}
              placeholder="75008"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
            <input
              type="text"
              value={data.country}
              onChange={(e) => handleChange("country", e.target.value)}
              placeholder="France"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Extended options found in leading CV builders */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Permis de conduire / Mobilité
          </label>
          <input
            type="text"
            value={data.driverLicense || ""}
            onChange={(e) => handleChange("driverLicense", e.target.value)}
            placeholder="Permis B (Véhiculé)"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Âge / Nationalité (Optionnel)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={data.birthDate || ""}
              onChange={(e) => handleChange("birthDate", e.target.value)}
              placeholder="ex. 30 ans"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
            <input
              type="text"
              value={data.nationality || ""}
              onChange={(e) => handleChange("nationality", e.target.value)}
              placeholder="Française"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

      </div>

      {/* Dynamic Social Networks & Professional Links (LinkedIn, GitHub, Portfolio...) */}
      <SocialLinksEditor
        socialLinks={currentSocialLinks}
        onChange={handleSocialLinksChange}
        initialLinkedin={data.linkedin}
        initialGithub={data.github}
        initialWebsite={data.website}
      />

      {/* 3. Accroche / Profil Professionnel */}
      <div className="space-y-2 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-300">
            Accroche / Profil Professionnel (30 à 60 mots recommandés)
          </label>
          <button
            type="button"
            onClick={handleGenerateSummary}
            disabled={isGeneratingSummary}
            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-950/50 border border-sky-500/30 hover:bg-sky-900/40 transition-all disabled:opacity-50 font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGeneratingSummary ? "Génération..." : "Générer / Suggérer un pitch"}</span>
          </button>
        </div>

        <SpellCheckTextarea
          rows={4}
          value={data.summary}
          onChange={(val) => handleChange("summary", val)}
          placeholder="ex. Ingénieur logiciel senior avec 7 ans d'expérience dans la conception d'architectures distribuées et la conduite d'équipes agiles. Spécialiste cloud et performance opérationnelle, ayant permis de réduire les coûts d'infrastructure de 35% tout en garantissant un uptime de 99.98%."
          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 leading-relaxed font-sans"
        />

        {/* AI Pitch Suggestions */}
        {summarySuggestions.length > 0 && (
          <div className="p-3.5 bg-sky-950/30 border border-sky-500/30 rounded-xl space-y-2 animate-fade-in">
            <span className="text-xs font-semibold text-sky-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Propositions rédigées pour votre poste : Cliquez pour adopter
            </span>
            <div className="space-y-2">
              {summarySuggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChange("summary", s)}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-900/90 hover:bg-sky-950/60 border border-slate-800 hover:border-sky-500/50 text-xs text-slate-300 hover:text-white transition-all leading-relaxed"
                >
                  <p className="line-clamp-3">{s}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
