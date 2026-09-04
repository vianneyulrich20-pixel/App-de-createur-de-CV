import React from "react";
import { Cloud, Check, Loader2, Database } from "lucide-react";

interface CloudStatusBadgeProps {
  isSaving: boolean;
  lastSavedAt: Date | null;
  cloudCount: number;
  onClick: () => void;
}

export const CloudStatusBadge: React.FC<CloudStatusBadgeProps> = ({
  isSaving,
  lastSavedAt,
  cloudCount,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-xs group"
      title="Statut de connexion Serveur & Base de données Firestore. Cliquez pour gérer vos CVs."
    >
      <div className="relative flex items-center justify-center">
        {isSaving ? (
          <Loader2 className="w-3.5 h-3.5 text-sky-400 animate-spin" />
        ) : (
          <>
            <Database className="w-3.5 h-3.5 text-sky-400" />
            <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
          </>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-[11px]">
        <span className="text-slate-300 font-semibold group-hover:text-sky-300 transition-colors">
          {isSaving ? "Synchronisation..." : "Cloud Firestore"}
        </span>
        {cloudCount > 0 && (
          <span className="px-1.5 py-0.2 bg-slate-800 text-sky-400 font-mono text-[10px] font-bold rounded">
            {cloudCount}
          </span>
        )}
      </div>
    </button>
  );
};
