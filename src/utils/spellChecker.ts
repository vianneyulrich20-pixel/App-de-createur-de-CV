import { CVData } from "../types";

export interface SpellError {
  id: string;
  word: string;
  suggestion: string;
  startIndex: number;
  endIndex: number;
  type: "orthographe" | "accent" | "doublon" | "typographie";
  reason: string;
}

/**
 * Common French & CV spelling, accentuation, and grammatical error dictionary.
 * Maps lowercase incorrect or unaccented words to their correct form.
 */
const CV_SPELL_DICTIONARY: Record<string, string> = {
  // Accents fréquents (CV & Titres)
  "developpeur": "développeur",
  "developpeuse": "développeuse",
  "developpeurs": "développeurs",
  "developpeuses": "développeuses",
  "developpement": "développement",
  "developpements": "développements",
  "ingenieur": "ingénieur",
  "ingenieure": "ingénieure",
  "ingenieurs": "ingénieurs",
  "ingenieures": "ingénieures",
  "ingenierie": "ingénierie",
  "experience": "expérience",
  "experiences": "expériences",
  "competence": "compétence",
  "competences": "compétences",
  "diplome": "diplôme",
  "diplomes": "diplômes",
  "diplomee": "diplômée",
  "diplomees": "diplômées",
  "equipe": "équipe",
  "equipes": "équipes",
  "creation": "création",
  "creations": "créations",
  "realisation": "réalisation",
  "realisations": "réalisations",
  "realiser": "réaliser",
  "realise": "réalisé",
  "realisee": "réalisée",
  "realises": "réalisés",
  "realisees": "réalisées",
  "ameliorer": "améliorer",
  "ameliore": "amélioré",
  "amelioree": "améliorée",
  "ameliores": "améliorés",
  "amelioration": "amélioration",
  "ameliorations": "améliorations",
  "optimiser": "optimiser",
  "optimise": "optimisé",
  "optimisee": "optimisée",
  "optimises": "optimisés",
  "optimisation": "optimisation",
  "optimisations": "optimisations",
  "gerer": "gérer",
  "gere": "géré",
  "geree": "gérée",
  "geres": "gérés",
  "gerees": "gérées",
  "gestionnaire": "gestionnaire",
  "coordination": "coordination",
  "coordonner": "coordonner",
  "coordonne": "coordonné",
  "coordonnee": "coordonnée",
  "strategie": "stratégie",
  "strategies": "stratégies",
  "strategique": "stratégique",
  "strategiques": "stratégiques",
  "operationnel": "opérationnel",
  "operationnelle": "opérationnelle",
  "operationnels": "opérationnels",
  "operationnelles": "opérationnelles",
  "qualite": "qualité",
  "qualites": "qualités",
  "societe": "société",
  "societes": "sociétés",
  "activite": "activité",
  "activites": "activités",
  "departement": "département",
  "departements": "départements",
  "securite": "sécurité",
  "securise": "sécurisé",
  "securisee": "sécurisée",
  "synthese": "synthèse",
  "methodologie": "méthodologie",
  "methodologies": "méthodologies",
  "benevole": "bénévole",
  "benevoles": "bénévoles",
  "benevolat": "bénévolat",
  "reference": "référence",
  "references": "références",
  "delai": "délai",
  "delais": "délais",
  "reussite": "réussite",
  "succes": "succès",
  "evaluer": "évaluer",
  "evaluation": "évaluation",
  "evaluations": "évaluations",
  "interet": "intérêt",
  "interets": "intérêts",
  "interesse": "intéressé",
  "interessee": "intéressée",
  "interesses": "intéressés",
  "metier": "métier",
  "metiers": "métiers",
  "etude": "étude",
  "etudes": "études",
  "etudiant": "étudiant",
  "etudiante": "étudiante",
  "etudiants": "étudiants",
  "charge": "chargé",
  "chargee": "chargée",
  "charges": "chargés",
  "maitrise": "maîtrise",
  "maitriser": "maîtriser",
  "maitrisee": "maîtrisée",
  "numerique": "numérique",
  "numeriques": "numériques",
  "budgetaire": "budgétaire",
  "budgetaires": "budgétaires",
  "financiere": "financière",
  "financieres": "financières",
  "ecrit": "écrit",
  "ecrite": "écrite",
  "ecriture": "écriture",
  "redige": "rédigé",
  "redigee": "rédigée",
  "rediger": "rédiger",
  "redaction": "rédaction",
  "dirige": "dirigé",
  "dirigee": "dirigée",
  "diriger": "diriger",
  "encadre": "encadré",
  "encadree": "encadrée",
  "forme": "formé",
  "formee": "formée",
  "deploye": "déployé",
  "deployee": "déployée",
  "deployer": "déployer",
  "deploiement": "déploiement",
  "deploiements": "déploiements",
  "integre": "intégré",
  "integree": "intégrée",
  "integrer": "intégrer",
  "integration": "intégration",
  "parametrages": "paramétrages",
  "parametrage": "paramétrage",
  "parametrer": "paramétrer",
  "configure": "configuré",
  "configuree": "configurée",
  "automatise": "automatisé",
  "automatisee": "automatisée",
  "automatiser": "automatiser",
  "automatisation": "automatisation",
  "resolu": "résolu",
  "resolution": "résolution",
  "probleme": "problème",
  "problemes": "problèmes",
  "complexite": "complexité",
  "defi": "défi",
  "defis": "défis",
  "delivre": "délivré",
  "delivree": "délivrée",
  "delivrer": "délivrer",
  "agilite": "agilité",
  "intitule": "intitulé",
  "intitulee": "intitulée",
  "competent": "compétent",
  "competente": "compétente",
  "competents": "compétents",
  "creer": "créer",
  "cree": "créé",
  "creee": "créée",
  "crees": "créés",
  "creees": "créées",
  "evenement": "événement",
  "evenements": "événements",
  "taches": "tâches",
  "tache": "tâche",

  // Fautes d'orthographe classiques (doubles consonnes, coquilles courantes)
  "professionel": "professionnel",
  "professionelle": "professionnelle",
  "professionels": "professionnels",
  "professionelles": "professionnelles",
  "proféssionnel": "professionnel",
  "proféssionnelle": "professionnelle",
  "acceuil": "accueil",
  "acceuillir": "accueillir",
  "acceuillant": "accueillant",
  "connection": "connexion",
  "connections": "connexions",
  "language": "langage",
  "languages": "langages",
  "parmis": "parmi",
  "malgrés": "malgré",
  "exigeance": "exigence",
  "exigeances": "exigences",
  "appeller": "appeler",
  "comunication": "communication",
  "comunications": "communications",
  "colaborateur": "collaborateur",
  "colaborateurs": "collaborateurs",
  "colaboration": "collaboration",
  "colaboratif": "collaboratif",
  "ressourse": "ressource",
  "ressourses": "ressources",
  "clientelle": "clientèle",
  "efficasse": "efficace",
  "efficacite": "efficacité",
  "authonome": "autonome",
  "dinamique": "dynamique",
  "polivalent": "polyvalent",
  "pertinant": "pertinent",
  "pertinance": "pertinence",
  "conseption": "conception",
  "curiculum": "curriculum",
  "curicullum": "curriculum",
  "certifaction": "certification",
  "lisence": "licence",
  "mastere": "master",
  "baccalaureat": "baccalauréat",
  "technolgie": "technologie",
  "technolgies": "technologies",
  "maintenence": "maintenance",
  "performence": "performance",
  "performences": "performances",
  "calandrier": "calendrier",
  "developeur": "développeur",
  "responssable": "responsable",
  "managment": "management",
  "leadersheep": "leadership",
  "aquis": "acquis",
  "interressé": "intéressé",
  "interressée": "intéressée",
  "interresser": "intéresser",
  "satisfation": "satisfaction",
  "environement": "environnement",
  "dévelopement": "développement",
  "déveloper": "développer",
};

/**
 * Multi-word phrases that frequently contain errors or missing hyphens / accents.
 */
const PHRASE_SPELL_RULES: Array<{ pattern: RegExp; suggestion: string; reason: string }> = [
  {
    pattern: /\bchiffre\s+d['’]affaire\b/gi,
    suggestion: "chiffre d'affaires",
    reason: "En français, 'chiffre d'affaires' prend toujours un 's' à affaires.",
  },
  {
    pattern: /\bchiffres\s+d['’]affaire\b/gi,
    suggestion: "chiffres d'affaires",
    reason: "Prend toujours un 's' à affaires.",
  },
  {
    pattern: /\bcentres?\s+d['’]inter[eê]ts?\b/gi,
    suggestion: "centres d'intérêt",
    reason: "S'écrit 'centres d'intérêt' avec accent circonflexe sur le deuxième e.",
  },
  {
    pattern: /\bvis[- ]a[- ]vis\b/gi,
    suggestion: "vis-à-vis",
    reason: "S'écrit avec traits d'union et accent sur le à : 'vis-à-vis'.",
  },
  {
    pattern: /\bgrace\s+a\b/gi,
    suggestion: "grâce à",
    reason: "S'écrit avec accent circonflexe et accent grave : 'grâce à'.",
  },
  {
    pattern: /\bgrâce\s+a\b/gi,
    suggestion: "grâce à",
    reason: "Nécessite un accent grave sur le 'à'.",
  },
  {
    pattern: /\bgrace\s+à\b/gi,
    suggestion: "grâce à",
    reason: "Nécessite un accent circonflexe : 'grâce'.",
  },
  {
    pattern: /\ba\s+l['’]ecoute\b/gi,
    suggestion: "à l'écoute",
    reason: "Nécessite les accents : 'à l'écoute'.",
  },
  {
    pattern: /\ba\s+l['’]écoute\b/gi,
    suggestion: "à l'écoute",
    reason: "Nécessite un accent grave sur la préposition 'à'.",
  },
  {
    pattern: /\bc['’]est[- ]a[- ]dire\b/gi,
    suggestion: "c'est-à-dire",
    reason: "S'écrit avec traits d'union et accent sur le à : 'c'est-à-dire'.",
  },
  {
    pattern: /\bmise?\s+a\s+jour\b/gi,
    suggestion: "mise à jour",
    reason: "La préposition 'à' prend un accent grave : 'mise à jour'.",
  },
  {
    pattern: /\bau\s+seing?\s+de\b/gi,
    suggestion: "au sein de",
    reason: "S'écrit 'au sein de'.",
  },
  {
    pattern: /\ba\s+terme\b/gi,
    suggestion: "à terme",
    reason: "La préposition 'à' prend un accent grave.",
  },
  {
    pattern: /\ba\s+temps\s+(plein|partiel)\b/gi,
    suggestion: "à temps $1",
    reason: "La préposition 'à' prend un accent grave.",
  },
  {
    pattern: /\bcurriculum\s+vita[eë]\b/gi,
    suggestion: "Curriculum Vitae",
    reason: "Orthographe standard en majuscules ou minuscules sans altération.",
  },
];

/**
 * Match capitalization pattern from source word onto target suggestion.
 */
function matchCasing(source: string, target: string): string {
  if (source === source.toUpperCase()) {
    return target.toUpperCase();
  }
  if (source[0] && source[0] === source[0].toUpperCase()) {
    return target.charAt(0).toUpperCase() + target.slice(1);
  }
  return target.toLowerCase();
}

/**
 * Analyzes text and returns potential spelling and grammatical errors with suggestions.
 */
export function checkSpelling(text: string): SpellError[] {
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return [];
  }

  const errors: SpellError[] = [];
  const coveredRanges: Array<[number, number]> = [];

  const isCovered = (start: number, end: number) => {
    return coveredRanges.some(([s, e]) => !(end <= s || start >= e));
  };

  // 1. Check Multi-word phrases
  for (const rule of PHRASE_SPELL_RULES) {
    rule.pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = rule.pattern.exec(text)) !== null) {
      const matchText = match[0];
      const startIndex = match.index;
      const endIndex = startIndex + matchText.length;

      if (!isCovered(startIndex, endIndex)) {
        coveredRanges.push([startIndex, endIndex]);
        const suggestion = matchCasing(matchText, rule.suggestion);
        errors.push({
          id: `phrase-${startIndex}-${endIndex}`,
          word: matchText,
          suggestion,
          startIndex,
          endIndex,
          type: "orthographe",
          reason: rule.reason,
        });
      }
    }
  }

  // 2. Check Duplicated consecutive words (e.g. "de de", "le le", "dans dans")
  const duplicateRegex = /\b([a-zA-ZÀ-ÿ]{2,})\s+\1\b/gi;
  let dupMatch: RegExpExecArray | null;
  while ((dupMatch = duplicateRegex.exec(text)) !== null) {
    const fullMatch = dupMatch[0];
    const repeatedWord = dupMatch[1];
    const startIndex = dupMatch.index;
    const endIndex = startIndex + fullMatch.length;

    if (!isCovered(startIndex, endIndex)) {
      coveredRanges.push([startIndex, endIndex]);
      errors.push({
        id: `dup-${startIndex}`,
        word: fullMatch,
        suggestion: repeatedWord,
        startIndex,
        endIndex,
        type: "doublon",
        reason: `Mot répété inutilement ('${repeatedWord}').`,
      });
    }
  }

  // 3. Check individual words against the dictionary
  // Word regex supporting French accented characters and hyphens
  const wordRegex = /\b([a-zA-ZÀ-ÿ]+(?:-[a-zA-ZÀ-ÿ]+)?)\b/g;
  let wordMatch: RegExpExecArray | null;
  while ((wordMatch = wordRegex.exec(text)) !== null) {
    const rawWord = wordMatch[0];
    const lowerWord = rawWord.toLowerCase();
    const startIndex = wordMatch.index;
    const endIndex = startIndex + rawWord.length;

    if (isCovered(startIndex, endIndex)) {
      continue;
    }

    if (CV_SPELL_DICTIONARY[lowerWord]) {
      const baseSuggestion = CV_SPELL_DICTIONARY[lowerWord];
      const suggestion = matchCasing(rawWord, baseSuggestion);

      if (suggestion !== rawWord) {
        coveredRanges.push([startIndex, endIndex]);
        const isAccent =
          suggestion.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() ===
          rawWord.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

        errors.push({
          id: `word-${startIndex}`,
          word: rawWord,
          suggestion,
          startIndex,
          endIndex,
          type: isAccent ? "accent" : "orthographe",
          reason: isAccent
            ? `Accent manquant ou incorrect sur '${rawWord}'.`
            : `Erreur d'orthographe potentielle sur '${rawWord}'.`,
        });
      }
    }
  }

  // Sort errors by position in text
  return errors.sort((a, b) => a.startIndex - b.startIndex);
}

/**
 * Replaces a single detected error with its suggestion in the text string.
 */
export function applySpellCorrection(
  text: string,
  error: SpellError,
  customReplacement?: string
): string {
  const replacement = customReplacement !== undefined ? customReplacement : error.suggestion;
  return text.substring(0, error.startIndex) + replacement + text.substring(error.endIndex);
}

/**
 * Replaces all detected errors sequentially from end to start to maintain indices.
 */
export function applyAllCorrections(text: string, errors: SpellError[]): string {
  if (!errors || errors.length === 0) return text;
  // Sort descending by startIndex so replacements don't shift prior indices
  const sorted = [...errors].sort((a, b) => b.startIndex - a.startIndex);
  let result = text;
  for (const err of sorted) {
    result = result.substring(0, err.startIndex) + err.suggestion + result.substring(err.endIndex);
  }
  return result;
}

/**
 * Audit the entire CV for spelling mistakes across all textual sections.
 */
export interface CVAuditResult {
  totalErrors: number;
  items: Array<{
    section: string;
    fieldLabel: string;
    currentText: string;
    errors: SpellError[];
    onApplyCorrection: (newText: string) => void;
  }>;
}

export function auditEntireCV(
  cvData: CVData,
  onUpdateCV: (updater: (prev: CVData) => CVData) => void
): CVAuditResult {
  const items: CVAuditResult["items"] = [];

  // 1. Personal Title
  if (cvData.personal.title) {
    const errs = checkSpelling(cvData.personal.title);
    if (errs.length > 0) {
      items.push({
        section: "Profil",
        fieldLabel: "Titre professionnel",
        currentText: cvData.personal.title,
        errors: errs,
        onApplyCorrection: (newText) => {
          onUpdateCV((prev) => ({
            ...prev,
            personal: { ...prev.personal, title: newText },
          }));
        },
      });
    }
  }

  // 2. Personal Summary
  if (cvData.personal.summary) {
    const errs = checkSpelling(cvData.personal.summary);
    if (errs.length > 0) {
      items.push({
        section: "Profil",
        fieldLabel: "Accroche / Résumé",
        currentText: cvData.personal.summary,
        errors: errs,
        onApplyCorrection: (newText) => {
          onUpdateCV((prev) => ({
            ...prev,
            personal: { ...prev.personal, summary: newText },
          }));
        },
      });
    }
  }

  // 3. Experiences (roles & highlights)
  cvData.experiences.forEach((exp, expIdx) => {
    // Role title
    if (exp.role) {
      const errs = checkSpelling(exp.role);
      if (errs.length > 0) {
        items.push({
          section: "Expériences",
          fieldLabel: `Poste : ${exp.company || `#${expIdx + 1}`}`,
          currentText: exp.role,
          errors: errs,
          onApplyCorrection: (newText) => {
            onUpdateCV((prev) => ({
              ...prev,
              experiences: prev.experiences.map((e) =>
                e.id === exp.id ? { ...e, role: newText } : e
              ),
            }));
          },
        });
      }
    }

    // Highlights
    (exp.highlights || []).forEach((hl, hlIdx) => {
      const errs = checkSpelling(hl);
      if (errs.length > 0) {
        items.push({
          section: "Expériences",
          fieldLabel: `${exp.company || "Expérience"} - Puce ${hlIdx + 1}`,
          currentText: hl,
          errors: errs,
          onApplyCorrection: (newText) => {
            onUpdateCV((prev) => ({
              ...prev,
              experiences: prev.experiences.map((e) => {
                if (e.id !== exp.id) return e;
                const copy = [...e.highlights];
                copy[hlIdx] = newText;
                return { ...e, highlights: copy };
              }),
            }));
          },
        });
      }
    });
  });

  // 4. Education
  cvData.education.forEach((edu) => {
    if (edu.degree) {
      const errs = checkSpelling(edu.degree);
      if (errs.length > 0) {
        items.push({
          section: "Formation",
          fieldLabel: `Diplôme : ${edu.institution || "Formation"}`,
          currentText: edu.degree,
          errors: errs,
          onApplyCorrection: (newText) => {
            onUpdateCV((prev) => ({
              ...prev,
              education: prev.education.map((ed) =>
                ed.id === edu.id ? { ...ed, degree: newText } : ed
              ),
            }));
          },
        });
      }
    }
    if (edu.description) {
      const errs = checkSpelling(edu.description);
      if (errs.length > 0) {
        items.push({
          section: "Formation",
          fieldLabel: `Détails : ${edu.institution || "Formation"}`,
          currentText: edu.description,
          errors: errs,
          onApplyCorrection: (newText) => {
            onUpdateCV((prev) => ({
              ...prev,
              education: prev.education.map((ed) =>
                ed.id === edu.id ? { ...ed, description: newText } : ed
              ),
            }));
          },
        });
      }
    }
  });

  // 5. Projects
  (cvData.projects || []).forEach((proj) => {
    if (proj.description) {
      const errs = checkSpelling(proj.description);
      if (errs.length > 0) {
        items.push({
          section: "Projets",
          fieldLabel: `Projet : ${proj.title || "Sans titre"}`,
          currentText: proj.description,
          errors: errs,
          onApplyCorrection: (newText) => {
            onUpdateCV((prev) => ({
              ...prev,
              projects: (prev.projects || []).map((p) =>
                p.id === proj.id ? { ...p, description: newText } : p
              ),
            }));
          },
        });
      }
    }
  });

  const totalErrors = items.reduce((acc, item) => acc + item.errors.length, 0);
  return { totalErrors, items };
}
