import React, { useState } from "react";
import {
  Cloud,
  Database,
  Server,
  CheckCircle2,
  Clock,
  Trash2,
  Copy,
  FolderOpen,
  Plus,
  RefreshCw,
  X,
  ExternalLink,
  ShieldCheck,
  Edit2,
  Check,
} from "lucide-react";
import { CloudCVSummary } from "../../services/firebase";
import { CVData, CVDesignConfig } from "../../types";

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  cloudCVs: CloudCVSummary[];
  currentCvId: string;
  isSaving: boolean;
  lastSavedAt: Date | null;
  serverStatus: { status: string; uptime?: number } | null;
  databaseMeta: { projectId: string; databaseId: string };
  onLoadCV: (cvData: CVData, config: CVDesignConfig, cvId: string) => void;
  onCreateNewCV: () => void;
  onDuplicateCV: (cv: CloudCVSummary) => void;
  onDeleteCV: (cvId: string) => void;
  onForceSave: () => void;
  onRenameCV: (cvId: string, newTitle: string) => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  userId,
  cloudCVs,
  currentCvId,
  isSaving,
  lastSavedAt,
  serverStatus,
  databaseMeta,
  onLoadCV,
  onCreateNewCV,
  onDuplicateCV,
  onDeleteCV,
  onForceSave,
  onRenameCV,
}) => {
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState("");
  const [copiedUid, setCopiedUid] = useState(false);

  if (!isOpen) return null;

  const handleStartRename = (cv: CloudCVSummary) => {
    setEditingTitleId(cv.id);
    setTempTitle(cv.title);
  };

  const handleSaveRename = (cvId: string) => {
    if (tempTitle.trim().length > 0) {
      onRenameCV(cvId, tempTitle.trim());
    }
    setEditingTitleId(null);
  };

  const handleCopyUid = () => {
    if (userId) {
      navigator.clipboard.writeText(userId);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shadow-sm">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Base de Données & Serveur Cloud
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Connecté
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Synchronisation persistante en temps réel sur Google Cloud Firestore
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Server & Database Telemetry Panel */}
        <div className="p-4 bg-slate-950/50 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Server status */}
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-400 mt-0.5">
              <Server className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Serveur Express API</span>
                <span className="text-emerald-400 font-mono font-semibold text-[11px]">Port 3000 OK</span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono truncate">
                Host 0.0.0.0 • AI Studio Cloud Run
              </p>
            </div>
          </div>

          {/* Database status */}
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-start gap-3">
            <div className="p-2 rounded-lg bg-sky-950/60 border border-sky-500/30 text-sky-400 mt-0.5">
              <Database className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Google Cloud Firestore</span>
                <span className="text-sky-400 font-mono font-semibold text-[11px]">Temps Réel</span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono truncate" title={databaseMeta.databaseId}>
                DB: {databaseMeta.databaseId.substring(0, 24)}...
              </p>
            </div>
          </div>
        </div>

        {/* Content: List of CVs in Database */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-200">
                Vos CVs enregistrés dans la base
              </h3>
              <span className="px-2 py-0.5 text-xs font-mono font-bold bg-slate-800 text-sky-400 rounded-md border border-slate-700">
                {cloudCVs.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onForceSave}
                disabled={isSaving}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all disabled:opacity-50"
                title="Sauvegarder le CV actuel immédiatement dans Firestore"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${isSaving ? "animate-spin" : ""}`} />
                <span>{isSaving ? "Sauvegarde..." : "Synchroniser maintenant"}</span>
              </button>

              <button
                type="button"
                onClick={onCreateNewCV}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nouveau CV</span>
              </button>
            </div>
          </div>

          {cloudCVs.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 mx-auto flex items-center justify-center text-slate-400">
                <Cloud className="w-6 h-6" />
              </div>
              <p className="text-sm text-slate-300 font-medium">
                Aucun CV n'a encore été enregistré dans la base Firestore.
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Cliquez sur "Synchroniser maintenant" pour enregistrer votre CV actuel dans le Cloud.
              </p>
              <button
                type="button"
                onClick={onForceSave}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold"
              >
                Enregistrer mon CV actuel
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {cloudCVs.map((cv) => {
                const isCurrent = cv.id === currentCvId;
                const isEditingThisTitle = editingTitleId === cv.id;
                const updatedDateStr = new Date(cv.updatedAt).toLocaleString("fr-FR", {
                  dateStyle: "short",
                  timeStyle: "short",
                });

                return (
                  <div
                    key={cv.id}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isCurrent
                        ? "bg-slate-900 border-sky-500/50 shadow-md shadow-sky-950/40 ring-1 ring-sky-500/30"
                        : "bg-slate-950/70 border-slate-800/90 hover:border-slate-700"
                    }`}
                  >
                    {/* CV info */}
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isCurrent
                            ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        <Cloud className="w-4 h-4" />
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        {isEditingThisTitle ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={tempTitle}
                              onChange={(e) => setTempTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveRename(cv.id);
                                if (e.key === "Escape") setEditingTitleId(null);
                              }}
                              className="px-2 py-1 bg-slate-950 border border-sky-500 rounded text-xs text-white focus:outline-none flex-1"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveRename(cv.id)}
                              className="p-1 bg-sky-600 hover:bg-sky-500 text-white rounded"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingTitleId(null)}
                              className="p-1 text-slate-400 hover:text-white rounded"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-white truncate">{cv.title}</h4>
                            {isCurrent && (
                              <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 rounded border border-sky-500/40">
                                Actif
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleStartRename(cv)}
                              className="text-slate-500 hover:text-slate-300 p-0.5"
                              title="Renommer le document"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
                          {cv.personalName && <span>{cv.personalName}</span>}
                          {cv.targetRole && <span>• {cv.targetRole}</span>}
                          <span className="flex items-center gap-1 text-slate-500 font-mono">
                            <Clock className="w-3 h-3" />
                            {updatedDateStr}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      {!isCurrent && (
                        <button
                          type="button"
                          onClick={() => onLoadCV(cv.data, cv.config, cv.id)}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          title="Charger ce CV dans l'éditeur"
                        >
                          <FolderOpen className="w-3.5 h-3.5 text-sky-400" />
                          <span>Ouvrir</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onDuplicateCV(cv)}
                        className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800 rounded-lg hover:border-slate-700"
                        title="Dupliquer ce CV dans la base"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Supprimer définitivement "${cv.title}" de la base Firestore ?`)) {
                            onDeleteCV(cv.id);
                          }
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors border border-transparent hover:border-rose-800/40"
                        title="Supprimer ce CV de la base"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer: User UID & Security Info */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="truncate">
              Identifiant sécurisé Cloud :{" "}
              <code className="font-mono text-slate-300">
                {userId ? `${userId.substring(0, 14)}...` : "Initialisation..."}
              </code>
            </span>
            {userId && (
              <button
                type="button"
                onClick={handleCopyUid}
                className="text-slate-400 hover:text-sky-400 ml-1 text-[11px] underline"
              >
                {copiedUid ? "Copié !" : "Copier"}
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {lastSavedAt && (
              <span className="text-[11px] text-slate-400">
                Dernière synchro : {lastSavedAt.toLocaleTimeString("fr-FR")}
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
