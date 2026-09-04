import { CVData, AtsReport } from "../types";
import { TOP_PITFALLS } from "../data/writingAdvice";

export function calculateAtsReport(cv: CVData): AtsReport {
  let score = 10; // base presence
  const warnings: string[] = [];
  const successes: string[] = [];
  const suggestions: AtsReport["suggestions"] = [];

  const { personal, experiences, education, skillCategories, languages } = cv;

  // 1. Personal Contact Info Check
  if (personal.firstName && personal.lastName) {
    score += 8;
  } else {
    warnings.push("Le nom complet est incomplet.");
    suggestions.push({
      id: "sug-name",
      type: "critical",
      title: "Nom & Prénom manquants",
      message: "Indiquez clairement votre prénom et nom pour être identifiable.",
      section: "personal"
    });
  }

  if (personal.title && personal.title.trim().length > 4) {
    score += 10;
    successes.push("Titre de poste clair et explicite.");
  } else {
    suggestions.push({
      id: "sug-title",
      type: "critical",
      title: "Titre de poste manquant",
      message: "Un titre de poste explicite augmente les chances d'accroche en 6 secondes de 40%.",
      section: "personal"
    });
  }

  if (personal.email && personal.email.includes("@")) {
    score += 6;
  } else {
    warnings.push("Email manquant ou invalide.");
  }

  if (personal.phone && personal.phone.trim().length >= 8) {
    score += 6;
  } else {
    suggestions.push({
      id: "sug-phone",
      type: "warning",
      title: "Numéro de téléphone conseillé",
      message: "Les recruteurs appellent souvent pour une pré-qualification téléphonique rapide.",
      section: "personal"
    });
  }

  if (personal.city) {
    score += 5;
  }

  const hasLinks =
    (personal.socialLinks && personal.socialLinks.some((l) => l.url && l.url.trim().length > 0)) ||
    Boolean(personal.linkedin || personal.github || personal.website);

  if (hasLinks) {
    score += 5;
    successes.push("Lien vers profil professionnel ou portfolio renseigné.");
  }

  // 2. Summary / Bio Check
  const summaryLength = (personal.summary || "").trim().split(/\s+/).filter(Boolean).length;
  if (summaryLength >= 25 && summaryLength <= 100) {
    score += 12;
    successes.push(`Accroche idéale (${summaryLength} mots).`);
  } else if (summaryLength > 0 && summaryLength < 25) {
    score += 5;
    suggestions.push({
      id: "sug-summary-short",
      type: "info",
      title: "Accroche un peu courte",
      message: "Développez votre accroche (30 à 60 mots) en citant vos atouts clés et votre valeur ajoutée.",
      section: "personal"
    });
  } else if (summaryLength === 0) {
    suggestions.push({
      id: "sug-summary-empty",
      type: "warning",
      title: "Aucune accroche professionnelle",
      message: "Une courte introduction personnalisée capte immédiatement l'attention du recruteur.",
      section: "personal"
    });
  }

  // 3. Experiences & Metrics quantification
  let totalHighlights = 0;
  let metricsCount = 0;
  let actionVerbsCount = 0;

  const metricRegex = /\b(\d+[%kK€$]|[\+\-]?\d+(\s?(jours|mois|ans|utilisateurs|clients|projets|membres|h|s))?)\b/i;
  const commonActionVerbs = [
    "pilot", "conçu", "développ", "manag", "augment", "réduit", "créé", "optimis",
    "coordonn", "architectur", "analys", "déploy", "amélior", "génér", "multipli"
  ];

  experiences.forEach((exp) => {
    (exp.highlights || []).forEach((hl) => {
      totalHighlights++;
      if (metricRegex.test(hl) || /\d+/.test(hl)) {
        metricsCount++;
      }
      const lower = hl.toLowerCase();
      if (commonActionVerbs.some(v => lower.includes(v))) {
        actionVerbsCount++;
      }
    });
  });

  if (experiences.length >= 2) {
    score += 15;
    successes.push("Parcours professionnel bien structuré.");
  } else if (experiences.length === 1) {
    score += 8;
  } else {
    suggestions.push({
      id: "sug-exp",
      type: "critical",
      title: "Aucune expérience renseignée",
      message: "Ajoutez au moins 1 à 2 expériences professionnelles ou projets significatifs.",
      section: "experience"
    });
  }

  // Quantification score
  if (metricsCount >= 3) {
    score += 12;
    successes.push(`Excellente quantification des résultats (${metricsCount} chiffres et métriques détectés).`);
  } else if (metricsCount >= 1) {
    score += 6;
    suggestions.push({
      id: "sug-metrics-more",
      type: "info",
      title: "Renforcez vos chiffres d'impact",
      message: "La méthode XYZ de Google recommande de quantifier chaque succès (+X%, X k€ de CA, X utilisateurs).",
      section: "experience"
    });
  } else if (totalHighlights > 0) {
    suggestions.push({
      id: "sug-metrics-zero",
      type: "warning",
      title: "Aucune métrique chiffrée",
      message: "Ajoutez des pourcentages, budgets ou volumes pour rendre vos résultats irréfutables.",
      section: "experience"
    });
  }

  // 4. Skills & Languages Check
  const totalSkills = skillCategories.reduce((acc, cat) => acc + (cat.skills ? cat.skills.length : 0), 0);
  if (totalSkills >= 6) {
    score += 10;
    successes.push(`Compétences clés fournies (${totalSkills} compétences).`);
  } else if (totalSkills >= 2) {
    score += 5;
    suggestions.push({
      id: "sug-skills",
      type: "info",
      title: "Ajoutez plus de compétences cibles",
      message: "Les ATS recherchent les mots-clés exacts de l'offre (visez 6 à 12 compétences ciblées).",
      section: "skills"
    });
  }

  if (languages.length >= 1) {
    score += 5;
  }

  if (education.length >= 1) {
    score += 6;
  }

  // 5. Cliché detection
  const fullText = JSON.stringify(cv).toLowerCase();
  const bannedCliches = TOP_PITFALLS.find(p => p.id === "pitfall-cliches")?.bannedWords || [];
  const foundCliches = bannedCliches.filter(word => fullText.includes(word.toLowerCase()));

  if (foundCliches.length > 0) {
    suggestions.push({
      id: "sug-cliche",
      type: "warning",
      title: "Mots clichés détectés",
      message: `Attention aux adjectifs non prouvés : "${foundCliches.join(", ")}". Préférez des faits concrets.`,
      section: "personal"
    });
  }

  // Bound score
  const finalScore = Math.min(100, Math.max(15, score));
  let grade: AtsReport["grade"] = "D";
  if (finalScore >= 85) grade = "A";
  else if (finalScore >= 70) grade = "B";
  else if (finalScore >= 50) grade = "C";

  // Approximate word count
  const wordCount = fullText.split(/\s+/).filter(Boolean).length;

  return {
    score: finalScore,
    grade,
    metricsCount,
    actionVerbsCount,
    wordCount,
    warnings,
    successes,
    suggestions
  };
}
