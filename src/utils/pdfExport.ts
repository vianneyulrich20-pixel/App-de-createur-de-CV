import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { CVData, CVDesignConfig } from "../types";
import { getUnifiedSocialLinks } from "./socialLinks";

export interface PdfExportOptions {
  fileName?: string;
  quality?: number;
}

/**
 * Mathematical conversion of OKLCH to sRGB [rgb(r, g, b) or rgba(r, g, b, a)]
 * Necessary because html2canvas 1.4.1 does not support modern CSS oklch() color spaces from Tailwind v4.
 */
export function oklchToRgb(l: number, c: number, h: number, alpha?: number): string {
  const rad = (h * Math.PI) / 180;
  const a = c * Math.cos(rad);
  const b = c * Math.sin(rad);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  const r = +4.0767434770 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const bl = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

  const transfer = (x: number) => {
    const clamped = Math.max(0, Math.min(1, x));
    return clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  };

  const R = Math.round(transfer(r) * 255);
  const G = Math.round(transfer(g) * 255);
  const B = Math.round(transfer(bl) * 255);

  if (alpha !== undefined && alpha < 1) {
    return `rgba(${R}, ${G}, ${B}, ${alpha})`;
  }
  return `rgb(${R}, ${G}, ${B})`;
}

/**
 * Parses any oklch() color string into a standard rgb/rgba string.
 */
export function parseAndConvertOklch(str: string): string {
  if (!str || !str.includes("oklch")) return str;
  return str.replace(/oklch\(([^)]+)\)/g, (_match, inner) => {
    const parts = inner.trim().split(/\s*[\/\s]\s*/);
    if (parts.length < 3) return "rgb(30, 41, 59)";
    const l = parseFloat(parts[0]);
    const c = parseFloat(parts[1]);
    const h = parseFloat(parts[2]);
    const alpha = parts[3] !== undefined ? parseFloat(parts[3]) : 1;
    return oklchToRgb(l, c, h, alpha);
  });
}

let sharedCanvasCtx: CanvasRenderingContext2D | null = null;

/**
 * Resolves any modern CSS color (oklch, color-mix, lab) to standard hex or rgb.
 */
export function resolveCssColor(colorStr: string): string {
  if (!colorStr) return "";
  if (!colorStr.includes("oklch") && !colorStr.includes("color(") && !colorStr.includes("lab(")) {
    return colorStr;
  }
  try {
    if (!sharedCanvasCtx && typeof document !== "undefined") {
      const c = document.createElement("canvas");
      c.width = 1;
      c.height = 1;
      sharedCanvasCtx = c.getContext("2d");
    }
    if (sharedCanvasCtx) {
      sharedCanvasCtx.fillStyle = colorStr;
      const res = sharedCanvasCtx.fillStyle;
      if (res && !res.includes("oklch")) {
        return res;
      }
    }
  } catch (e) {
    // fallback
  }
  return parseAndConvertOklch(colorStr);
}

/**
 * Inlines all remote images as base64 data URLs to prevent canvas tainting.
 */
async function inlineImagesAsBase64(container: HTMLElement): Promise<void> {
  const images = Array.from(container.querySelectorAll("img"));
  await Promise.all(
    images.map(async (img) => {
      const src = img.src;
      if (!src || src.startsWith("data:")) return;

      try {
        let response = await fetch(src, { mode: "cors" }).catch(() => null);

        if (!response || !response.ok) {
          response = await fetch(`/api/image-proxy?url=${encodeURIComponent(src)}`).catch(() => null);
        }

        if (response && response.ok) {
          const blob = await response.blob();
          const reader = new FileReader();
          await new Promise<void>((resolve) => {
            reader.onloadend = () => {
              if (reader.result && typeof reader.result === "string") {
                img.src = reader.result;
                img.crossOrigin = "anonymous";
              }
              resolve();
            };
            reader.onerror = () => resolve();
            reader.readAsDataURL(blob);
          });
        }
      } catch (err) {
        console.warn("Impossible de convertir l'image distante en data URL:", src, err);
      }
    })
  );
}

/**
 * Sanitizes all styles and colors in the cloned DOM tree for html2canvas compatibility.
 */
function sanitizeClonedDom(clonedDoc: Document, clonedElement: HTMLElement) {
  // 1. Sanitize all <style> elements in head
  const styleTags = Array.from(clonedDoc.querySelectorAll("style"));
  for (const style of styleTags) {
    if (style.textContent && style.textContent.includes("oklch")) {
      style.textContent = parseAndConvertOklch(style.textContent);
    }
  }

  // 2. Sanitize inline colors of elements
  const allElements = [clonedElement, ...Array.from(clonedElement.querySelectorAll("*"))] as HTMLElement[];
  const colorProperties = [
    "color",
    "backgroundColor",
    "borderColor",
    "borderTopColor",
    "borderBottomColor",
    "borderLeftColor",
    "borderRightColor",
    "outlineColor",
    "fill",
    "stroke",
  ] as const;

  for (const el of allElements) {
    const computed = window.getComputedStyle(el);
    for (const prop of colorProperties) {
      const currentVal = (el.style as any)[prop] || (computed as any)[prop];
      if (
        currentVal &&
        (currentVal.includes("oklch") || currentVal.includes("color(") || currentVal.includes("lab("))
      ) {
        (el.style as any)[prop] = resolveCssColor(currentVal);
      }
    }
  }
}

/**
 * High-reliability PDF exporter.
 * Employs image inlining, OKLCH color normalization for html2canvas compatibility,
 * unscaled isolation container, and fallback to vector jsPDF.
 */
export async function downloadPdfDirectly(
  elementId: string,
  cvData: CVData,
  options: PdfExportOptions = {}
): Promise<{ success: boolean; error?: string; method?: "canvas" | "vector" }> {
  let sourceElement = document.getElementById(elementId);

  // If source element is not found, try fallback
  if (!sourceElement) {
    console.warn("Élément source introuvable, génération directe en PDF vectoriel.");
    return exportCvAsVectorPdf(cvData, undefined, options);
  }

  // Wait for fonts if API available
  if ("fonts" in document) {
    try {
      await (document as any).fonts.ready;
    } catch (e) {
      // ignore
    }
  }

  // Prepare clean offscreen container to guarantee unscaled 210mm rendering regardless of zoom or mobile view
  const isolationContainer = document.createElement("div");
  isolationContainer.id = "cv-pdf-render-isolation";
  isolationContainer.style.position = "fixed";
  isolationContainer.style.top = "0";
  isolationContainer.style.left = "0";
  isolationContainer.style.width = "794px"; // 210mm @ 96 DPI
  isolationContainer.style.minHeight = "1123px"; // 297mm @ 96 DPI
  isolationContainer.style.background = "#ffffff";
  isolationContainer.style.zIndex = "-9999";
  isolationContainer.style.opacity = "0.99";
  isolationContainer.style.pointerEvents = "none";
  isolationContainer.style.overflow = "visible";

  const clone = sourceElement.cloneNode(true) as HTMLElement;
  clone.id = "cv-pdf-render-clone";
  clone.style.transform = "none";
  clone.style.margin = "0";
  clone.style.width = "794px";
  clone.style.boxShadow = "none";
  clone.style.border = "none";
  clone.style.display = "block";
  clone.style.visibility = "visible";

  isolationContainer.appendChild(clone);
  document.body.appendChild(isolationContainer);

  try {
    // Inline images to avoid tainted canvas
    await inlineImagesAsBase64(clone);

    // Let layout settle
    await new Promise((r) => setTimeout(r, 100));

    // Capture with html2canvas and sanitize cloned document
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: 1024,
      imageTimeout: 10000,
      onclone: (clonedDoc, clonedEl) => {
        sanitizeClonedDom(clonedDoc, clonedEl);
      },
    });

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error("Canvas vide lors de la capture graphique.");
    }

    // Convert canvas to image data
    const imgData = canvas.toDataURL("image/jpeg", options.quality || 0.95);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pageWidth = 210; // mm
    const pageHeight = 297; // mm
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    if (imgHeight <= pageHeight + 4) {
      pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, Math.min(imgHeight, pageHeight), undefined, "FAST");
    } else {
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, pageWidth, imgHeight, undefined, "FAST");
      heightLeft -= pageHeight;

      while (heightLeft > 5) {
        position = -(imgHeight - heightLeft);
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, pageWidth, imgHeight, undefined, "FAST");
        heightLeft -= pageHeight;
      }
    }

    const cleanFirst = (cvData.personal.firstName || "Mon").trim().replace(/[^a-zA-Z0-9À-ÿ_-]/g, "_");
    const cleanLast = (cvData.personal.lastName || "CV").trim().replace(/[^a-zA-Z0-9À-ÿ_-]/g, "_");
    const targetFileName = options.fileName || `CV_${cleanFirst}_${cleanLast}.pdf`;

    pdf.save(targetFileName);
    return { success: true, method: "canvas" };
  } catch (canvasErr: any) {
    console.warn("Capture canvas échouée, activation immédiate du moteur de rendu vectoriel jsPDF:", canvasErr);
    // Automatic reliable fallback to native Vector PDF!
    return exportCvAsVectorPdf(cvData, undefined, options);
  } finally {
    if (isolationContainer && isolationContainer.parentNode) {
      isolationContainer.parentNode.removeChild(isolationContainer);
    }
  }
}

/**
 * 100% Reliable Native Vector PDF Generator.
 * Directly renders text, lines, sections, and formatting via jsPDF.
 * Guaranteed to generate and download without canvas or CORS dependencies.
 */
export function exportCvAsVectorPdf(
  cvData: CVData,
  _config?: CVDesignConfig,
  options: PdfExportOptions = {}
): { success: boolean; error?: string; method: "vector" } {
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const marginX = 18;
    const pageWidth = 210;
    const contentWidth = pageWidth - marginX * 2;
    let y = 20;

    // Primary & neutral palette
    const primaryR = 2, primaryG = 132, primaryB = 199; // #0284c7
    const darkR = 15, darkG = 23, darkB = 42; // #0f172a
    const mutedR = 100, mutedG = 116, mutedB = 139; // #64748b

    // Helper: check page break
    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > 275) {
        pdf.addPage();
        y = 20;
      }
    };

    // Helper: draw section heading
    const drawSectionTitle = (title: string) => {
      checkPageBreak(14);
      y += 4;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(primaryR, primaryG, primaryB);
      pdf.text(title.toUpperCase(), marginX, y);

      pdf.setDrawColor(primaryR, primaryG, primaryB);
      pdf.setLineWidth(0.4);
      pdf.line(marginX, y + 2, marginX + contentWidth, y + 2);
      y += 7;
    };

    // 1. Header (Name & Title)
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.setTextColor(darkR, darkG, darkB);
    const fullName = `${cvData.personal.firstName || ""} ${cvData.personal.lastName || ""}`.trim();
    pdf.text(fullName || "Curriculum Vitae", marginX, y);
    y += 7;

    if (cvData.personal.title) {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(13);
      pdf.setTextColor(primaryR, primaryG, primaryB);
      pdf.text(cvData.personal.title, marginX, y);
      y += 6;
    }

    // Contact info bar
    const contactParts: string[] = [];
    if (cvData.personal.email) contactParts.push(cvData.personal.email);
    if (cvData.personal.phone) contactParts.push(cvData.personal.phone);
    const location = [cvData.personal.city, cvData.personal.country].filter(Boolean).join(", ");
    if (location) contactParts.push(location);
    if (cvData.personal.driverLicense) contactParts.push(`Permis: ${cvData.personal.driverLicense}`);

    if (contactParts.length > 0) {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(mutedR, mutedG, mutedB);
      pdf.text(contactParts.join("  •  "), marginX, y);
      y += 5;
    }

    // Social Links
    const socialLinks = getUnifiedSocialLinks(cvData.personal);
    if (socialLinks.length > 0) {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      pdf.setTextColor(primaryR, primaryG, primaryB);
      const linksText = socialLinks.map((l) => `${l.label}: ${l.displayText || l.url}`).join("  |  ");
      const splitLinks = pdf.splitTextToSize(linksText, contentWidth);
      pdf.text(splitLinks, marginX, y);
      y += splitLinks.length * 4 + 2;
    }

    // Top separator
    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(0.2);
    pdf.line(marginX, y, marginX + contentWidth, y);
    y += 4;

    // 2. Summary
    if (cvData.personal.summary) {
      drawSectionTitle("Profil Professionnel");
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9.5);
      pdf.setTextColor(darkR, darkG, darkB);
      const splitSummary = pdf.splitTextToSize(cvData.personal.summary, contentWidth);
      checkPageBreak(splitSummary.length * 4.5);
      pdf.text(splitSummary, marginX, y);
      y += splitSummary.length * 4.5 + 2;
    }

    // 3. Experiences
    if (cvData.experiences.length > 0) {
      drawSectionTitle("Expériences Professionnelles");

      for (const exp of cvData.experiences) {
        checkPageBreak(18);

        // Role & Dates
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10.5);
        pdf.setTextColor(darkR, darkG, darkB);
        pdf.text(exp.role, marginX, y);

        const dateStr = `${exp.startDate} – ${exp.isCurrent ? "Présent" : exp.endDate}`;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(mutedR, mutedG, mutedB);
        pdf.text(dateStr, marginX + contentWidth, y, { align: "right" });
        y += 4.5;

        // Company & Location
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        pdf.setTextColor(primaryR, primaryG, primaryB);
        const compLine = [exp.company, exp.location, exp.contractType].filter(Boolean).join(" • ");
        pdf.text(compLine, marginX, y);
        y += 4.5;

        // Highlights
        if (exp.highlights && exp.highlights.length > 0) {
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(9);
          pdf.setTextColor(darkR, darkG, darkB);

          for (const hl of exp.highlights) {
            const splitHl = pdf.splitTextToSize(`• ${hl}`, contentWidth - 4);
            checkPageBreak(splitHl.length * 4.2);
            pdf.text(splitHl, marginX + 3, y);
            y += splitHl.length * 4.2;
          }
        }
        y += 3;
      }
    }

    // 4. Education
    if (cvData.education.length > 0) {
      drawSectionTitle("Formation");

      for (const edu of cvData.education) {
        checkPageBreak(14);

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.setTextColor(darkR, darkG, darkB);
        pdf.text(edu.degree, marginX, y);

        const eduDates = `${edu.startDate} – ${edu.endDate}`;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(mutedR, mutedG, mutedB);
        pdf.text(eduDates, marginX + contentWidth, y, { align: "right" });
        y += 4.5;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(primaryR, primaryG, primaryB);
        pdf.text(edu.institution, marginX, y);
        y += 4;

        if (edu.description) {
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(8.5);
          pdf.setTextColor(mutedR, mutedG, mutedB);
          const splitDesc = pdf.splitTextToSize(edu.description, contentWidth);
          pdf.text(splitDesc, marginX, y);
          y += splitDesc.length * 4;
        }
        y += 2.5;
      }
    }

    // 5. Skills
    if (cvData.skillCategories.length > 0) {
      drawSectionTitle("Compétences");

      for (const cat of cvData.skillCategories) {
        checkPageBreak(8);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        pdf.setTextColor(darkR, darkG, darkB);
        const catLabel = `${cat.category} : `;
        pdf.text(catLabel, marginX, y);

        const labelWidth = pdf.getTextWidth(catLabel);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(mutedR, mutedG, mutedB);
        const skillsText = cat.skills.map((s) => s.name).join(", ");
        const splitSkills = pdf.splitTextToSize(skillsText, contentWidth - labelWidth);

        pdf.text(splitSkills[0] || "", marginX + labelWidth, y);
        if (splitSkills.length > 1) {
          for (let i = 1; i < splitSkills.length; i++) {
            y += 4;
            pdf.text(splitSkills[i], marginX, y);
          }
        }
        y += 5;
      }
    }

    // 6. Languages & Certifications
    if (cvData.languages.length > 0 || cvData.certifications.length > 0) {
      drawSectionTitle("Langues & Certifications");

      if (cvData.languages.length > 0) {
        const langStr = cvData.languages.map((l) => `${l.language} (${l.proficiency})`).join("  •  ");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        pdf.setTextColor(darkR, darkG, darkB);
        pdf.text("Langues : ", marginX, y);
        const lw = pdf.getTextWidth("Langues : ");
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(mutedR, mutedG, mutedB);
        pdf.text(langStr, marginX + lw, y);
        y += 5;
      }

      if (cvData.certifications.length > 0) {
        const certStr = cvData.certifications.map((c) => `${c.title} (${c.issuer} ${c.year})`).join("  •  ");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        pdf.setTextColor(darkR, darkG, darkB);
        pdf.text("Certifications : ", marginX, y);
        const cw = pdf.getTextWidth("Certifications : ");
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(mutedR, mutedG, mutedB);
        const splitCerts = pdf.splitTextToSize(certStr, contentWidth - cw);
        pdf.text(splitCerts[0] || "", marginX + cw, y);
        if (splitCerts.length > 1) {
          for (let i = 1; i < splitCerts.length; i++) {
            y += 4;
            pdf.text(splitCerts[i], marginX, y);
          }
        }
        y += 5;
      }
    }

    const cleanFirst = (cvData.personal.firstName || "Mon").trim().replace(/[^a-zA-Z0-9À-ÿ_-]/g, "_");
    const cleanLast = (cvData.personal.lastName || "CV").trim().replace(/[^a-zA-Z0-9À-ÿ_-]/g, "_");
    const targetFileName = options.fileName || `CV_${cleanFirst}_${cleanLast}.pdf`;

    pdf.save(targetFileName);
    return { success: true, method: "vector" };
  } catch (err: any) {
    console.error("Erreur génération PDF vectoriel:", err);
    return {
      success: false,
      error: err?.message || "Erreur lors de la génération du PDF.",
      method: "vector",
    };
  }
}

/**
 * Triggers native browser print dialog for 100% vector-sharp A4 PDF export.
 */
export function printCvNative(): void {
  window.print();
}

/**
 * Exports CV in JSON format for backups.
 */
export function exportCvAsJson(cvData: CVData): void {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(cvData, null, 2)
  )}`;
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", jsonString);
  const cleanFirst = (cvData.personal.firstName || "Mon").trim().replace(/[^a-zA-Z0-9À-ÿ_-]/g, "_");
  const cleanLast = (cvData.personal.lastName || "CV").trim().replace(/[^a-zA-Z0-9À-ÿ_-]/g, "_");
  downloadAnchor.setAttribute("download", `Sauvegarde_Curriculum_${cleanFirst}_${cleanLast}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Exports CV as plain text formatted for ATS submission.
 */
export function exportCvAsTxt(cvData: CVData): void {
  const { personal, experiences, education, skillCategories, languages, certifications, interests } = cvData;
  let text = "";

  text += `${personal.firstName} ${personal.lastName}\n`;
  if (personal.title) text += `${personal.title}\n`;
  text += `${personal.email} | ${personal.phone} | ${[personal.city, personal.country].filter(Boolean).join(", ")}\n`;
  const socialLinks = getUnifiedSocialLinks(personal);
  if (socialLinks.length > 0) {
    text += socialLinks.map((l) => `${l.label}: ${l.url}`).join(" | ") + "\n";
  }
  text += "\n" + "=".repeat(40) + "\n\n";

  if (personal.summary) {
    text += `PROFIL PROFESSIONNEL\n${personal.summary}\n\n`;
  }

  if (experiences.length > 0) {
    text += `EXPÉRIENCES PROFESSIONNELLES\n`;
    experiences.forEach((e) => {
      text += `\n${e.role} — ${e.company} (${e.startDate} - ${e.isCurrent ? "Présent" : e.endDate})\n`;
      if (e.location) text += `Lieu: ${e.location}\n`;
      if (e.highlights && e.highlights.length > 0) {
        e.highlights.forEach((h) => (text += `• ${h}\n`));
      }
    });
    text += "\n";
  }

  if (education.length > 0) {
    text += `FORMATION\n`;
    education.forEach((edu) => {
      text += `\n${edu.degree} — ${edu.institution} (${edu.startDate} - ${edu.endDate})\n`;
      if (edu.description) text += `${edu.description}\n`;
    });
    text += "\n";
  }

  if (skillCategories.length > 0) {
    text += `COMPÉTENCES TECHNIQUES & EXPERTISE\n`;
    skillCategories.forEach((cat) => {
      text += `${cat.category}: ${cat.skills.map((s) => s.name).join(", ")}\n`;
    });
    text += "\n";
  }

  if (languages.length > 0) {
    text += `LANGUES\n`;
    languages.forEach((l) => {
      text += `• ${l.language}: ${l.proficiency}\n`;
    });
    text += "\n";
  }

  if (certifications.length > 0) {
    text += `CERTIFICATIONS\n`;
    certifications.forEach((c) => {
      text += `• ${c.title} (${c.issuer}, ${c.year})\n`;
    });
    text += "\n";
  }

  if (interests && interests.length > 0) {
    text += `CENTRES D'INTÉRÊT\n${interests.join(", ")}\n\n`;
  }

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  const cleanFirst = (personal.firstName || "Mon").trim().replace(/[^a-zA-Z0-9À-ÿ_-]/g, "_");
  const cleanLast = (personal.lastName || "CV").trim().replace(/[^a-zA-Z0-9À-ÿ_-]/g, "_");
  anchor.download = `CV_ATS_${cleanFirst}_${cleanLast}.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
