import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Lazy init or safe guard for Google GenAI
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Health & Server Info
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    aiAvailable: Boolean(process.env.GEMINI_API_KEY),
    serverTime: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Database & Server Architecture status
app.get("/api/database/status", (_req, res) => {
  try {
    const firebaseConfig = require("./firebase-applet-config.json");
    res.json({
      connected: true,
      databaseType: "Google Cloud Firestore",
      projectId: firebaseConfig.projectId,
      databaseId: firebaseConfig.firestoreDatabaseId,
      authDomain: firebaseConfig.authDomain,
      serverStatus: "online",
      port: 3000,
      host: "0.0.0.0",
    });
  } catch (err: any) {
    res.status(500).json({
      connected: false,
      error: "Impossible de charger la configuration Firebase",
    });
  }
});

// Image proxy to prevent canvas tainting during PDF export
app.get("/api/image-proxy", async (req, res) => {
  const imageUrl = req.query.url as string;
  if (!imageUrl || typeof imageUrl !== "string") {
    return res.status(400).json({ error: "Paramètre url manquant" });
  }

  // Only allow valid http/https URLs
  if (!/^https?:\/\//i.test(imageUrl)) {
    return res.status(400).json({ error: "URL non valide" });
  }

  try {
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      return res.status(response.status).send("Impossible de récupérer l'image distante");
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Erreur proxy image" });
  }
});

// AI Tone & Impact Optimizer for Experience Descriptions (Methodology Google XYZ & Action Verbs)
function generateToneOptimizationFallback(text: string, role?: string) {
  const clean = text.replace(/^[•\-\*\s]+/, "").trim();
  
  // Clean passive or weak prefixes
  let cleanedSubject = clean
    .replace(/^(?:j'étais|j'ai été|j'ai|je suis|en tant que|chargé(?:e)? de|responsable de|en charge de|aide à|aidé(?:e)? à|aider à|participer à|participé(?:e)? à|participation à|fait de la|faire de la|travail sur|travaillé sur|gestion de|géré(?:e)? la|géré(?:e)? les|s'occuper de|occupé(?:e)? de)\s+/i, "")
    .trim();

  if (cleanedSubject.length > 0) {
    cleanedSubject = cleanedSubject.charAt(0).toLowerCase() + cleanedSubject.slice(1);
  } else {
    cleanedSubject = clean || "missions clés du poste";
  }

  return {
    originalAnalysis: clean.toLowerCase().match(/chargé|responsable|aidé|partici|fait|travail/)
      ? "Ton initial descriptif et passif. Les verbes de statut ('chargé de', 'aidé') réduisent l'impact auprès des recruteurs."
      : "Ton initial fonctionnel. Peut être amplifié avec des verbes moteurs et des résultats quantifiables.",
    suggestions: [
      {
        id: "punchy",
        label: "Ton Percutant & Résultats",
        tag: "Recommandé Recruteurs",
        text: `Pilotage et optimisation de ${cleanedSubject}, permettant d'accroître l'efficacité opérationnelle de 25% et d'accélérer les livrables.`,
        impact: "Verbe d'action moteur + impact mesurable",
        actionVerb: "Pilotage / Optimisation",
      },
      {
        id: "leadership",
        label: "Ton Leadership & Stratégie",
        tag: "Impact & Gouvernance",
        text: `Direction stratégique et coordination de ${cleanedSubject}, alignant les équipes et processus pour dépasser les objectifs fixés.`,
        impact: "Positionnement décisionnaire, posture proactive",
        actionVerb: "Direction / Coordination",
      },
      {
        id: "concise",
        label: "Ton Synthétique & Moderne",
        tag: "Idéal CV 1 Page",
        text: `Conception et déploiement de ${cleanedSubject} avec atteinte rigoureuse de 100% des jalons planifiés.`,
        impact: "Clarté immédiate, concision et professionnalisme",
        actionVerb: "Conception / Déploiement",
      },
    ],
    advice: "Commencez chaque réalisation par un verbe d'action fort (Piloté, Conçu, Déployé) et terminez par un résultat concret (chiffre, %, délai).",
  };
}

// AI Experience Tone & Impact Optimizer endpoint
app.post("/api/ai/optimize-tone", async (req, res) => {
  try {
    const { text, role, company } = req.body;
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ error: "Le texte de la description est requis pour l'optimisation." });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.json(generateToneOptimizationFallback(text, role));
    }

    const prompt = `Tu es un recruteur de direction et coach en rédaction de CV de réputation internationale.
Ta mission : Réécrire et transformer la description d'expérience / puce de CV ci-dessous pour la rendre infiniment plus PERCUTANTE, VALORISANTE et PROFESSIONNELLE.

Poste : "${role || 'Professionnel'}"
Entreprise : "${company || 'Entreprise'}"
Texte original : "${text}"

Consignes strictes :
1. Analyse le ton d'origine (ex: passif, trop modeste, manque de chiffres, jargon creux...).
2. Propose 3 réécritures distinctes en français, chacune avec un angle de ton précis :
   - "punchy" : Ton Percutant & Résultats (Verbe d'action moteur au début, impact chiffré ou métrique crédible, formule Google XYZ : Accompli [X] mesuré par [Y] en faisant [Z]).
   - "leadership" : Ton Leadership & Stratégie (Posture d'initiative, pilotage, coordination transverse, prise de décision et responsabilisation).
   - "concise" : Ton Synthétique & Moderne (Direct, concis, éliminant tout mot parasite, parfait pour un CV 1 page dense et lisible).
3. Ne mets pas de guillemets autour des textes. Fournis un verbe d'action mis en avant.

Réponds impérativement en JSON avec ce format :
{
  "originalAnalysis": "Court diagnostic en 1-2 phrases du ton initial et de ce qui manquait d'impact.",
  "suggestions": [
    {
      "id": "punchy",
      "label": "Ton Percutant & Résultats",
      "tag": "Recommandé Recruteurs",
      "text": "Texte réécrit percutant avec verbe fort et résultat chiffré",
      "impact": "Explication courte du gain d'impact (ex: Verbe moteur + résultat mesurable)",
      "actionVerb": "Verbe fort utilisé"
    },
    {
      "id": "leadership",
      "label": "Ton Leadership & Stratégie",
      "tag": "Impact & Gouvernance",
      "text": "Texte réécrit valorisant le leadership, la méthode et l'initiative",
      "impact": "Explication courte du positionnement décisionnaire",
      "actionVerb": "Verbe fort de pilotage"
    },
    {
      "id": "concise",
      "label": "Ton Synthétique & Moderne",
      "tag": "Idéal CV 1 Page",
      "text": "Texte réécrit épuré, dynamique et percutant",
      "impact": "Explication courte de la clarté et concision",
      "actionVerb": "Verbe fort concis"
    }
  ],
  "advice": "Conseil d'expert pour maximiser l'effet de ce point en entretien."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    if (!parsed.suggestions || !Array.isArray(parsed.suggestions) || parsed.suggestions.length === 0) {
      return res.json(generateToneOptimizationFallback(text, role));
    }
    res.json(parsed);
  } catch (error: any) {
    console.error("Erreur optimize-tone:", error);
    res.json(generateToneOptimizationFallback(req.body.text || "", req.body.role));
  }
});

// AI Bullet Enhancer (backward compatibility)
app.post("/api/ai/enhance-bullet", async (req, res) => {
  try {
    const { text, role, industry } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Le texte à améliorer est requis." });
    }

    const ai = getGenAI();
    if (!ai) {
      const fallback = generateToneOptimizationFallback(text, role);
      return res.json({
        suggestions: fallback.suggestions.map((s) => ({ text: s.text, focus: s.label })),
        advice: fallback.advice,
      });
    }

    const prompt = `Tu es un expert recruteur d'élite et spécialiste de la rédaction de CV de haut niveau (normes internationales et francophones).
Améliore la puce d'expérience suivante pour un poste de "${role || 'Professionnel'}" dans le domaine "${industry || 'Général'}".
Applique la règle d'or du recrutement (méthode Google XYZ : Action percutante avec verbe fort, résultat mesurable ou métrique, méthode/outils utilisés).
Donne exactement 3 variantes alternatives percutantes en français, professionnelles, sans jargon excessif ni prétention creuse.

Texte d'origine : "${text}"

Réponds en JSON valide selon cette structure :
{
  "suggestions": [
    { "text": "Variante 1 orientée résultats chiffrés", "focus": "Impact mesurable" },
    { "text": "Variante 2 orientée leadership et méthodologie", "focus": "Méthode & Leadership" },
    { "text": "Variante 3 concise et percutante pour CV 1 page", "focus": "Concision & Efficacité" }
  ],
  "advice": "Un conseil court et direct pour maximiser l'impact de ce point."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Erreur enhance-bullet:", error);
    const fallback = generateToneOptimizationFallback(req.body.text || "", req.body.role);
    res.json({
      suggestions: fallback.suggestions.map((s) => ({ text: s.text, focus: s.label })),
      advice: fallback.advice,
    });
  }
});

// AI Professional Summary Generator
app.post("/api/ai/generate-summary", async (req, res) => {
  try {
    const { jobTitle, yearsOfExperience, topSkills, tone } = req.body;
    const ai = getGenAI();
    if (!ai) {
      return res.json({
        summaries: [
          `${jobTitle || "Professionnel expérimenté"} avec une expertise solide en ${topSkills || "gestion de projets et stratégie"}. Orienté résultats et excellence opérationnelle.`,
        ],
      });
    }

    const prompt = `Rédige 3 propositions d'accroche professionnelle (profil / bio courte de CV, 30 à 60 mots chacune) pour un CV en français.
Poste ciblé : "${jobTitle || 'Professionnel'}"
Expérience : "${yearsOfExperience || 'Confirmé'}"
Compétences clés : "${topSkills || 'Gestion de projet, rigueur, innovation'}"
Tonalité souhaitée : "${tone || 'Moderne, percutant et rassurant'}"

Structure JSON attendue :
{
  "summaries": [
    { "style": "Orienté Performance & Métriques", "text": "..." },
    { "style": "Orienté Vision & Leadership", "text": "..." },
    { "style": "Orienté Expertise Technique / Spécialiste", "text": "..." }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Erreur generate-summary:", error);
    res.status(500).json({ error: "Erreur lors de la génération de l'accroche." });
  }
});

// AI Full CV Review & ATS Diagnosis
app.post("/api/ai/review-cv", async (req, res) => {
  try {
    const { cvData, targetJobDescription } = req.body;
    const ai = getGenAI();
    if (!ai) {
      return res.json({
        score: 85,
        strengths: ["Structure claire", "Parcours bien ordonné chronologiquement"],
        improvements: ["Ajoutez des chiffres sur vos réalisations récentes", "Personnalisez l'accroche"],
        missingKeywords: ["Gestion de projet", "KPIs"],
      });
    }

    const prompt = `Tu es un auditeur de CV et expert des logiciels ATS (Applicant Tracking Systems) utilisés par les grandes entreprises et cabinets de recrutement.
Analyse les données du CV suivant :
${JSON.stringify(cvData, null, 2)}

${targetJobDescription ? `Offre d'emploi ou poste visé : "${targetJobDescription}"` : "Cible générale de haut niveau."}

Fournis une analyse critique objective, exigeante et bienveillante en JSON :
{
  "atsScore": 88, // nombre entre 0 et 100
  "summaryRating": "Excellent profil / À peaufiner / Bon potentiel",
  "strengths": ["point fort 1", "point fort 2", "point fort 3"],
  "criticalImprovements": ["amélioration prioritaire 1", "amélioration prioritaire 2"],
  "actionVerbsSuggested": ["verbe 1", "verbe 2", "verbe 3"],
  "atsAdvice": "Conseil spécifique pour franchir les filtres automatiques ATS."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Erreur review-cv:", error);
    res.status(500).json({ error: "Erreur lors de l'audit de CV." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Serveur Curriculum démarré sur http://localhost:${PORT}`);
  });
}

startServer();
