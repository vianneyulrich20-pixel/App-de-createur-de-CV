import React from "react";
import { CVData, CVDesignConfig } from "../../types";
import { ModernNordicTemplate } from "./ModernNordicTemplate";
import { PrestigeExecutiveTemplate } from "./PrestigeExecutiveTemplate";
import { ModernTechTemplate } from "./ModernTechTemplate";
import { StudioCreativeTemplate } from "./StudioCreativeTemplate";
import { OxfordClassicTemplate } from "./OxfordClassicTemplate";
import { DenseCompactTemplate } from "./DenseCompactTemplate";

interface CVRendererProps {
  cv: CVData;
  config: CVDesignConfig;
  targetId?: string;
}

export const CVRenderer: React.FC<CVRendererProps> = ({ cv, config, targetId = "cv-preview-sheet" }) => {
  const getFontClass = () => {
    switch (config.fontFamily) {
      case "serif":
        return "font-garamond";
      case "display":
        return "font-outfit";
      case "mono":
        return "font-mono-code";
      case "sans":
      default:
        return "font-sans";
    }
  };

  const getFontSizeClass = () => {
    switch (config.fontSize) {
      case "sm":
        return "text-[13px]";
      case "lg":
        return "text-[15px]";
      case "base":
      default:
        return "text-[14px]";
    }
  };

  const renderTemplate = () => {
    switch (config.templateId) {
      case "prestige-executive":
        return <PrestigeExecutiveTemplate cv={cv} config={config} />;
      case "modern-tech":
        return <ModernTechTemplate cv={cv} config={config} />;
      case "studio-creative":
        return <StudioCreativeTemplate cv={cv} config={config} />;
      case "oxford-classic":
        return <OxfordClassicTemplate cv={cv} config={config} />;
      case "dense-compact":
        return <DenseCompactTemplate cv={cv} config={config} />;
      case "nordic-modern":
      default:
        return <ModernNordicTemplate cv={cv} config={config} />;
    }
  };

  return (
    <div
      id={targetId}
      className={`cv-a4-sheet bg-white text-slate-900 shadow-2xl transition-all duration-200 overflow-hidden relative ${getFontClass()} ${getFontSizeClass()}`}
      style={{
        width: "210mm",
        minHeight: "297mm",
        boxSizing: "border-box",
      }}
    >
      {renderTemplate()}
    </div>
  );
};
