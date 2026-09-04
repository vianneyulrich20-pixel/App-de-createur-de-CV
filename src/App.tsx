import React, { useState, useEffect, useMemo, useRef } from "react";
import { CVData, CVDesignConfig, CVTemplateId } from "./types";
import { SAMPLE_PROFILES } from "./data/sampleProfiles";
import { calculateAtsReport } from "./utils/atsCalculator";
import {
  downloadPdfDirectly,
  exportCvAsVectorPdf,
  printCvNative,
  exportCvAsJson,
  exportCvAsTxt,
} from "./utils/pdfExport";
import { CVRenderer } from "./components/templates/CVRenderer";
import { PersonalInfoForm } from "./components/editor/PersonalInfoForm";
import { ExperienceForm } from "./components/editor/ExperienceForm";
import { EducationForm } from "./components/editor/EducationForm";
import { SkillsForm } from "./components/editor/SkillsForm";
import { LanguagesAndMoreForm } from "./components/editor/LanguagesAndMoreForm";
import { DesignCustomizer } from "./components/editor/DesignCustomizer";
import { AtsScoreWidget } from "./components/ats/AtsScoreWidget";
import { WritingGuideModal } from "./components/advice/WritingGuideModal";
import { SpellCheckAuditModal } from "./components/editor/SpellCheckAuditModal";
import { auditEntireCV } from "./utils/spellChecker";
import {
  ensureAuthenticated,
  saveCVToCloud,
  subscribeToUserCVs,
  deleteCVFromCloud,
  getFirebaseMetadata,
  CloudCVSummary,
} from "./services/firebase";
import { CloudStatusBadge } from "./components/cloud/CloudStatusBadge";
import { CloudSyncModal } from "./components/cloud/CloudSyncModal";

import {
  Download,
  Printer,
  Sparkles,
  BookOpen,
  FileText,
  Palette,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Globe2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Check,
  Eye,
  Edit3,
  UploadCloud,
  FileDown,
  FileCheck2,
  ChevronDown,
  FileType,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const STORAGE_KEY_DATA = "curriculum_cv_data_v1";
const STORAGE_KEY_CONFIG = "curriculum_cv_config_v1";

const DEFAULT_CONFIG: CVDesignConfig = {
  templateId: "nordic-modern",
  primaryColor: "#0284c7",
  secondaryColor: "#0f172a",
  accentColor: "#38bdf8",
  fontFamily: "sans",
  fontSize: "base",
  spacing: "normal",
  showDividers: true,
  showIcons: true,
  twoColumnLayout: true,
  sidebarPosition: "right",
  activeSectionOrder: ["personal", "experiences", "projects", "education", "skills", "languages", "certifications"],
};

export default function App() {
  // Initialize CV Data with localStorage or default sample
  const [cvData, setCvData] = useState<CVData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DATA);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return SAMPLE_PROFILES.tech;
  });

  // Initialize Config with localStorage or default
  const [designConfig, setDesignConfig] = useState<CVDesignConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_CONFIG;
  });

  // Editor states
  const [mainTab, setMainTab] = useState<"content" | "design">("content");
  const [contentSection, setContentSection] = useState<"personal" | "experience" | "education" | "skills" | "more">("personal");
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSpellAuditOpen, setIsSpellAuditOpen] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [isPdfDropdownOpen, setIsPdfDropdownOpen] = useState(false);
  const [pdfToast, setPdfToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(0.85);
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");

  // Cloud Firestore & Server integration states
  const [currentCvId, setCurrentCvId] = useState<string>(() => cvData.id || "cv-default-1");
  const [userId, setUserId] = useState<string | null>(null);
  const [cloudCVs, setCloudCVs] = useState<CloudCVSummary[]>([]);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [isSavingToCloud, setIsSavingToCloud] = useState(false);
  const [lastCloudSavedAt, setLastCloudSavedAt] = useState<Date | null>(null);
  const [serverStatus, setServerStatus] = useState<{ status: string; uptime?: number } | null>(null);
  const databaseMeta = useMemo(() => getFirebaseMetadata(), []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Authenticate user anonymously and subscribe to Firestore CVs
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let isMounted = true;

    ensureAuthenticated()
      .then((user) => {
        if (!isMounted) return;
        setUserId(user.uid);
        unsubscribe = subscribeToUserCVs(
          user.uid,
          (cvs) => {
            if (isMounted) setCloudCVs(cvs);
          },
          (err) => console.error("Firestore listener error:", err)
        );
      })
      .catch((err) => console.error("Firebase auth initialization error:", err));

    // Check backend Express server status
    fetch("/api/database/status")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setServerStatus({ status: data.serverStatus || "online", uptime: data.uptime });
        }
      })
      .catch((err) => console.warn("Backend server check:", err));

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Debounced auto-save to Firestore Database
  useEffect(() => {
    if (!userId) return;

    const timer = setTimeout(async () => {
      setIsSavingToCloud(true);
      try {
        const res = await saveCVToCloud(userId, currentCvId, cvData, designConfig);
        if (res.success) {
          setLastCloudSavedAt(new Date());
        }
      } catch (err) {
        console.error("Erreur auto-save Firestore:", err);
      } finally {
        setIsSavingToCloud(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [cvData, designConfig, userId, currentCvId]);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(cvData));
    } catch (e) {
      console.error(e);
    }
  }, [cvData]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(designConfig));
    } catch (e) {
      console.error(e);
    }
  }, [designConfig]);

  // Real-time ATS report
  const atsReport = useMemo(() => calculateAtsReport(cvData), [cvData]);

  // Real-time spellcheck audit of entire CV
  const spellAudit = useMemo(() => auditEntireCV(cvData, setCvData), [cvData]);

  // Load sample profile
  const handleLoadSample = (profileKey: string) => {
    const sample = SAMPLE_PROFILES[profileKey];
    if (sample) {
      setCvData({
        ...sample,
        id: "cv-" + Date.now(),
        lastModified: Date.now(),
      });
      if (profileKey === "tech") {
        setDesignConfig((prev) => ({ ...prev, templateId: "modern-tech", primaryColor: "#3b82f6" }));
      } else if (profileKey === "marketing") {
        setDesignConfig((prev) => ({ ...prev, templateId: "nordic-modern", primaryColor: "#0284c7" }));
      } else if (profileKey === "product") {
        setDesignConfig((prev) => ({ ...prev, templateId: "prestige-executive", primaryColor: "#1e293b", fontFamily: "serif" }));
      }
    }
  };

  // PDF Export with dual-engine reliability and user feedback
  const handleDownloadPdf = async (preferVector = false) => {
    setIsDownloadingPdf(true);
    setPdfSuccess(false);
    setIsPdfDropdownOpen(false);

    try {
      if (preferVector) {
        const res = exportCvAsVectorPdf(cvData, designConfig, {
          fileName: `CV_${cvData.personal.firstName}_${cvData.personal.lastName}.pdf`,
        });
        if (res.success) {
          setPdfSuccess(true);
          setPdfToast({ message: "PDF Vectoriel ATS téléchargé avec succès !", type: "success" });
          setTimeout(() => setPdfSuccess(false), 3500);
          setTimeout(() => setPdfToast(null), 4000);
        } else {
          setPdfToast({ message: res.error || "Erreur de génération PDF", type: "error" });
        }
        return;
      }

      // Try High-Definition A4 capture (with image inlining & oklch color conversion)
      const res = await downloadPdfDirectly("cv-preview-sheet", cvData, {
        fileName: `CV_${cvData.personal.firstName}_${cvData.personal.lastName}.pdf`,
      });

      if (res.success) {
        setPdfSuccess(true);
        const msg =
          res.method === "vector"
            ? "PDF Vectoriel téléchargé avec succès !"
            : "PDF Haute Définition A4 téléchargé avec succès !";
        setPdfToast({ message: msg, type: "success" });
        setTimeout(() => setPdfSuccess(false), 3500);
        setTimeout(() => setPdfToast(null), 4000);
      } else {
        // Fallback to Vector PDF
        const vecRes = exportCvAsVectorPdf(cvData, designConfig, {
          fileName: `CV_${cvData.personal.firstName}_${cvData.personal.lastName}.pdf`,
        });
        if (vecRes.success) {
          setPdfSuccess(true);
          setPdfToast({ message: "PDF Vectoriel téléchargé avec succès !", type: "success" });
          setTimeout(() => setPdfSuccess(false), 3500);
          setTimeout(() => setPdfToast(null), 4000);
        } else {
          setPdfToast({
            message: "Erreur d'exportation. Utilisez 'Imprimer A4' pour enregistrer en PDF.",
            type: "error",
          });
        }
      }
    } catch (err: any) {
      console.error("Erreur PDF:", err);
      try {
        exportCvAsVectorPdf(cvData, designConfig);
        setPdfSuccess(true);
        setPdfToast({ message: "PDF Vectoriel de secours téléchargé !", type: "success" });
        setTimeout(() => setPdfSuccess(false), 3500);
      } catch (e) {
        setPdfToast({
          message: "Veuillez utiliser l'option 'Imprimer A4' de votre navigateur pour créer le PDF.",
          type: "error",
        });
      }
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Import JSON backup
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.personal) {
            setCvData(parsed);
          }
        } catch (err) {
          alert("Fichier JSON invalide.");
        }
      };
      reader.readAsText(file);
    }
  };

  // Insert Action Verb from Guide
  const handleInsertVerb = (verb: string) => {
    // Add verb to first highlight of first experience as inspiration
    if (cvData.experiences.length > 0) {
      const firstExp = cvData.experiences[0];
      const copy = [...firstExp.highlights];
      copy[0] = `${verb} ` + (copy[0] ? copy[0].replace(/^[A-ZÀ-ÿa-z]+\s/, "") : "de nouveaux processus...");
      setCvData({
        ...cvData,
        experiences: cvData.experiences.map((e, i) => (i === 0 ? { ...e, highlights: copy } : e)),
      });
    }
  };

  // Cloud Database Actions
  const handleLoadCV = (data: CVData, config: CVDesignConfig, cvId: string) => {
    setCvData(data);
    setDesignConfig(config);
    setCurrentCvId(cvId);
    setIsCloudModalOpen(false);
  };

  const handleCreateNewCV = async () => {
    const newId = "cv-" + Date.now();
    const newCv: CVData = {
      ...SAMPLE_PROFILES.tech,
      id: newId,
      personal: {
        ...SAMPLE_PROFILES.tech.personal,
        firstName: "Nouveau",
        lastName: "Candidat",
        title: "Titre du poste visé",
        summary: "Accroche professionnelle percutante...",
      },
      lastModified: Date.now(),
    };
    setCvData(newCv);
    setCurrentCvId(newId);
    if (userId) {
      setIsSavingToCloud(true);
      await saveCVToCloud(userId, newId, newCv, designConfig, "Nouveau CV");
      setIsSavingToCloud(false);
      setLastCloudSavedAt(new Date());
    }
  };

  const handleDuplicateCV = async (cvSummary: CloudCVSummary) => {
    if (!userId) return;
    const duplicatedId = "cv-" + Date.now();
    const duplicatedData: CVData = {
      ...cvSummary.data,
      id: duplicatedId,
      lastModified: Date.now(),
    };
    setIsSavingToCloud(true);
    await saveCVToCloud(
      userId,
      duplicatedId,
      duplicatedData,
      cvSummary.config,
      `Copie de ${cvSummary.title}`
    );
    setIsSavingToCloud(false);
  };

  const handleDeleteCV = async (cvId: string) => {
    await deleteCVFromCloud(cvId);
    if (cvId === currentCvId) {
      const remaining = cloudCVs.filter((c) => c.id !== cvId);
      if (remaining.length > 0) {
        handleLoadCV(remaining[0].data, remaining[0].config, remaining[0].id);
      }
    }
  };

  const handleForceSave = async () => {
    if (!userId) return;
    setIsSavingToCloud(true);
    try {
      await saveCVToCloud(userId, currentCvId, cvData, designConfig);
      setLastCloudSavedAt(new Date());
    } finally {
      setIsSavingToCloud(false);
    }
  };

  const handleRenameCV = async (cvId: string, newTitle: string) => {
    if (!userId) return;
    const target = cloudCVs.find((c) => c.id === cvId);
    if (target) {
      await saveCVToCloud(userId, cvId, target.data, target.config, newTitle);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* 1. TOP HEADER BAR - Geometric Balance Precision */}
      <header className="h-16 border-b border-slate-800/90 bg-slate-900/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0 no-print">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 via-sky-600 to-indigo-700 p-px shadow-[0_0_12px_rgba(56,189,248,0.25)] flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center font-mono font-black text-sky-400 text-base">
              J
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base tracking-tight text-white font-outfit">
                The lord JESUS CV creator
              </span>
              <span className="text-[9px] font-mono uppercase font-bold tracking-widest px-2 py-0.5 rounded border border-sky-500/30 bg-sky-500/10 text-sky-400">
                Pro
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block font-medium">
              Créateur de CV Haute Performance & Normes Recruteurs
            </p>
          </div>
        </div>

        {/* Center: Sample Profiles & Guide Button */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-lg p-1 text-xs">
            <span className="text-slate-400 px-2 font-medium">Exemples :</span>
            <button
              onClick={() => handleLoadSample("tech")}
              className="px-2.5 py-1 rounded-md hover:bg-slate-800 text-slate-200 transition-colors font-medium"
            >
              Tech / DevOps
            </button>
            <button
              onClick={() => handleLoadSample("marketing")}
              className="px-2.5 py-1 rounded-md hover:bg-slate-800 text-slate-200 transition-colors font-medium"
            >
              Marketing
            </button>
            <button
              onClick={() => handleLoadSample("product")}
              className="px-2.5 py-1 rounded-md hover:bg-slate-800 text-slate-200 transition-colors font-medium"
            >
              Product Manager
            </button>
          </div>

          <button
            onClick={() => setIsGuideOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/40 text-indigo-300 border border-indigo-500/30 flex items-center gap-2 text-xs font-semibold transition-all shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Guide & Verbes</span>
          </button>

          <button
            onClick={() => setIsSpellAuditOpen(true)}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all shadow-sm ${
              spellAudit.totalErrors > 0
                ? "bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40"
                : "bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60"
            }`}
            title="Audit et détection des fautes d'orthographe sur tout le CV"
          >
            <FileCheck2
              className={`w-3.5 h-3.5 ${
                spellAudit.totalErrors > 0 ? "text-rose-400" : "text-emerald-400"
              }`}
            />
            <span>Orthographe</span>
            {spellAudit.totalErrors > 0 ? (
              <span className="px-1.5 py-0.5 bg-rose-500 text-white rounded-full text-[10px] font-bold leading-none animate-pulse">
                {spellAudit.totalErrors}
              </span>
            ) : (
              <span className="text-[10px] text-emerald-400 font-bold">✓</span>
            )}
          </button>
        </div>

        {/* Right Actions: PDF Download & Print */}
        <div className="flex items-center gap-2">
          {/* Mobile view switch button */}
          <div className="flex md:hidden bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-xs">
            <button
              onClick={() => setMobileView("editor")}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1 ${
                mobileView === "editor" ? "bg-indigo-600 text-white" : "text-slate-400"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Éditer</span>
            </button>
            <button
              onClick={() => setMobileView("preview")}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1 ${
                mobileView === "preview" ? "bg-indigo-600 text-white" : "text-slate-400"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Aperçu</span>
            </button>
          </div>

          {/* Native Print button */}
          <button
            type="button"
            onClick={printCvNative}
            className="p-2 sm:px-3 sm:py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg border border-slate-700/80 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Imprimer ou enregistrer en PDF via votre navigateur"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Imprimer A4</span>
          </button>

          {/* Instant PDF Download with Options Dropdown */}
          <div className="relative flex items-center shadow-[0_4px_14px_rgba(14,165,233,0.3)] rounded-lg">
            <button
              type="button"
              id="btn-download-pdf-primary"
              onClick={() => handleDownloadPdf(false)}
              disabled={isDownloadingPdf}
              className="px-3.5 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-l-lg text-xs font-bold flex items-center gap-2 border border-r-0 border-sky-400/20 transition-all disabled:opacity-60"
              title="Télécharger directement le CV au format PDF A4"
            >
              {pdfSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300 animate-pulse" />
                  <span>Téléchargé !</span>
                </>
              ) : (
                <>
                  <Download className={`w-4 h-4 ${isDownloadingPdf ? "animate-bounce" : ""}`} />
                  <span>{isDownloadingPdf ? "Exportation..." : "Télécharger PDF"}</span>
                </>
              )}
            </button>

            <button
              type="button"
              id="btn-download-pdf-dropdown"
              onClick={() => setIsPdfDropdownOpen(!isPdfDropdownOpen)}
              disabled={isDownloadingPdf}
              className="px-2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-r-lg border border-l-0 border-indigo-400/30 text-xs transition-colors flex items-center justify-center disabled:opacity-60"
              title="Autres formats & options d'exportation"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Dropdown menu */}
            {isPdfDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsPdfDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 w-64 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl z-50 py-1.5 text-xs">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Formats d'exportation
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDownloadPdf(false)}
                    className="w-full px-3 py-2 text-left text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2.5 transition-colors"
                  >
                    <Download className="w-4 h-4 text-sky-400 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">PDF Haute Définition A4</div>
                      <div className="text-[10px] text-slate-400">Rendu visuel exact & haute qualité</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadPdf(true)}
                    className="w-full px-3 py-2 text-left text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2.5 transition-colors"
                  >
                    <FileType className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">PDF Vectoriel ATS</div>
                      <div className="text-[10px] text-slate-400">Texte 100% sélectionnable & léger</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsPdfDropdownOpen(false);
                      printCvNative();
                    }}
                    className="w-full px-3 py-2 text-left text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2.5 transition-colors border-t border-slate-800"
                  >
                    <Printer className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">Imprimer en PDF</div>
                      <div className="text-[10px] text-slate-400">Via la boîte d'impression navigateur</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsPdfDropdownOpen(false);
                      exportCvAsTxt(cvData);
                    }}
                    className="w-full px-3 py-2 text-left text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2.5 transition-colors border-t border-slate-800"
                  >
                    <FileText className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">Fichier texte ATS (.txt)</div>
                      <div className="text-[10px] text-slate-400">Pour formulaires de recrutement</div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE - Geometric Split Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* LEFT COLUMN: Editor & Settings */}
        <div
          className={`w-full md:w-[500px] lg:w-[540px] xl:w-[580px] flex-shrink-0 border-r border-slate-800 flex flex-col bg-slate-950/90 overflow-hidden no-print ${
            mobileView === "preview" ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Main Tabs (Contenu vs Design) */}
          <div className="px-5 py-2.5 border-b border-slate-800/90 flex items-center justify-between gap-3 bg-slate-900/80">
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800/80 gap-1">
              <button
                onClick={() => setMainTab("content")}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  mainTab === "content"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Contenu du CV</span>
              </button>

              <button
                onClick={() => setMainTab("design")}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  mainTab === "design"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Modèle & Design</span>
              </button>
            </div>

            {/* Mobile guide button trigger */}
            <button
              onClick={() => setIsGuideOpen(true)}
              className="lg:hidden p-1.5 text-indigo-400 hover:bg-slate-800 rounded-lg"
              title="Guide de rédaction"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          </div>

          {/* Sub-Tabs for Content Sections */}
          {mainTab === "content" && (
            <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-950/60 flex gap-1.5 overflow-x-auto text-xs">
              {[
                { id: "personal", label: "Profil", icon: User },
                { id: "experience", label: "Expériences", icon: Briefcase },
                { id: "education", label: "Formation", icon: GraduationCap },
                { id: "skills", label: "Compétences", icon: Wrench },
                { id: "more", label: "Langues & Projets", icon: Globe2 },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = contentSection === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setContentSection(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      isSelected
                        ? "bg-slate-900 text-sky-400 font-semibold border border-sky-500/30 shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Form Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {mainTab === "content" ? (
              <>
                {contentSection === "personal" && (
                  <PersonalInfoForm
                    data={cvData.personal}
                    onChange={(updated) => setCvData({ ...cvData, personal: updated })}
                  />
                )}

                {contentSection === "experience" && (
                  <ExperienceForm
                    experiences={cvData.experiences}
                    onChange={(updated) => setCvData({ ...cvData, experiences: updated })}
                    onOpenGuideModal={() => setIsGuideOpen(true)}
                  />
                )}

                {contentSection === "education" && (
                  <EducationForm
                    education={cvData.education}
                    onChange={(updated) => setCvData({ ...cvData, education: updated })}
                  />
                )}

                {contentSection === "skills" && (
                  <SkillsForm
                    categories={cvData.skillCategories}
                    onChange={(updated) => setCvData({ ...cvData, skillCategories: updated })}
                  />
                )}

                {contentSection === "more" && (
                  <LanguagesAndMoreForm
                    languages={cvData.languages}
                    certifications={cvData.certifications}
                    projects={cvData.projects}
                    interests={cvData.interests || []}
                    volunteer={cvData.volunteer || []}
                    references={cvData.references || []}
                    onUpdateLanguages={(l) => setCvData({ ...cvData, languages: l })}
                    onUpdateCertifications={(c) => setCvData({ ...cvData, certifications: c })}
                    onUpdateProjects={(p) => setCvData({ ...cvData, projects: p })}
                    onUpdateInterests={(i) => setCvData({ ...cvData, interests: i })}
                    onUpdateVolunteer={(v) => setCvData({ ...cvData, volunteer: v })}
                    onUpdateReferences={(r) => setCvData({ ...cvData, references: r })}
                  />
                )}
              </>
            ) : (
              <DesignCustomizer
                config={designConfig}
                onChange={(updated) => setDesignConfig(updated)}
              />
            )}

            {/* Real-Time ATS Score Diagnostic Widget */}
            <div className="pt-2">
              <AtsScoreWidget
                report={atsReport}
                cv={cvData}
                onNavigateToSection={(sec) => {
                  setMainTab("content");
                  setContentSection(sec as any);
                }}
              />
            </div>

            {/* Data Management Footer */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => exportCvAsJson(cvData)}
                  className="hover:text-slate-200 flex items-center gap-1"
                  title="Télécharger une copie de sauvegarde JSON"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Sauvegarder JSON</span>
                </button>
                <span>•</span>
                <label className="hover:text-slate-200 flex items-center gap-1 cursor-pointer">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Restaurer</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImportJson}
                    className="hidden"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (confirm("Réinitialiser avec le profil type ?")) {
                    handleLoadSample("tech");
                  }
                }}
                className="hover:text-rose-400 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Réinitialiser</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time A4 Document Preview - Geometric Drafting Table */}
        <div
          className={`flex-1 bg-slate-950 bg-geometric-grid flex flex-col overflow-hidden relative ${
            mobileView === "editor" ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Canvas Toolbar (Zoom, Format A4 indicator) */}
          <div className="h-11 px-5 border-b border-slate-800/90 bg-slate-900/90 backdrop-blur-sm flex items-center justify-between text-xs text-slate-400 no-print">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block ring-4 ring-emerald-500/10 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
                <span className="font-semibold text-slate-200">Format Standard : A4 Portrait</span>
              </div>
              <span className="hidden lg:inline text-[11px] text-slate-500 font-mono">
                210 × 297 mm • Vecteur Haute Résolution
              </span>
            </div>

            {/* Zoom controls */}
            <div className="flex items-center gap-1.5 bg-slate-950/90 border border-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => setZoomScale((prev) => Math.max(0.5, prev - 0.1))}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                title="Dézoomer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-xs w-12 text-center text-sky-400 font-semibold select-none">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={() => setZoomScale((prev) => Math.min(1.2, prev + 0.1))}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                title="Zoomer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomScale(0.85)}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors border-l border-slate-800 ml-0.5 pl-1.5"
                title="Ajuster à la taille optimale"
              >
                <Maximize2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Interactive Document Stage with architectural drafting drop-shadow */}
          <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start print-container">
            <div
              style={{
                transform: `scale(${zoomScale})`,
                transformOrigin: "top center",
                transition: "transform 0.15s ease-out",
              }}
              className="transition-all duration-150 drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
            >
              <CVRenderer cv={cvData} config={designConfig} targetId="cv-preview-sheet" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. WRITING ADVICE & RECRUITMENT GUIDE MODAL */}
      <WritingGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onInsertVerb={handleInsertVerb}
      />

      {/* 4. SPELLCHECK AUDIT MODAL */}
      <SpellCheckAuditModal
        isOpen={isSpellAuditOpen}
        onClose={() => setIsSpellAuditOpen(false)}
        cvData={cvData}
        onUpdateCV={setCvData}
      />

      {/* 5. FLOATING PDF STATUS NOTIFICATION */}
      {pdfToast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md transition-all ${
            pdfToast.type === "success"
              ? "bg-slate-900/95 border-emerald-500/40 text-emerald-300"
              : pdfToast.type === "error"
              ? "bg-rose-950/95 border-rose-500/40 text-rose-200"
              : "bg-slate-900/95 border-sky-500/40 text-sky-300"
          }`}
        >
          {pdfToast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          )}
          <div className="text-xs font-semibold">{pdfToast.message}</div>
          <button
            type="button"
            onClick={() => setPdfToast(null)}
            className="text-slate-400 hover:text-white ml-2 text-xs font-bold p-1"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
