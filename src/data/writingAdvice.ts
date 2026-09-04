export interface ActionVerbCategory {
  category: string;
  description: string;
  verbs: string[];
}

export interface GoldenRule {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  summary: string;
  detailedText: string;
  goodExample: string;
  badExample: string;
}

export interface Pitfall {
  id: string;
  title: string;
  frequency: 'Très fréquent' | 'Fréquent' | 'Critique';
  impact: string;
  howToFix: string;
  bannedWords?: string[];
}

export const ACTION_VERB_CATEGORIES: ActionVerbCategory[] = [
  {
    category: "Direction & Pilotage",
    description: "Idéal pour exprimer le leadership, la gouvernance et la vision stratégique.",
    verbs: [
      "Piloter", "Orchestrer", "Fédérer", "Superviser", "Restructurer",
      "Arbitrer", "Déployer", "Impulser", "Instaurer", "Déléguer",
      "Gouverner", "Diriger", "Manager", "Coordonner", "Transmettre"
    ]
  },
  {
    category: "Développement & Ingénierie",
    description: "Pour valoriser la création technique, l'architecture et la résolution de problèmes complexes.",
    verbs: [
      "Architecturer", "Concevoir", "Implémenter", "Refactoriser", "Automatiser",
      "Industrialiser", "Intégrer", "Optimiser", "Sécuriser", "Migrer",
      "Programmer", "Développer", "Profiler", "Résoudre", "Standardiser"
    ]
  },
  {
    category: "Gestion de Projet & Organisation",
    description: "Pour illustrer la maîtrise des délais, des budgets et des processus agiles.",
    verbs: [
      "Planifier", "Cadrer", "Livrer", "Rationaliser", "Périliser",
      "Faciliter", "Harmoniser", "Fluidifier", "Prioriser", "Budgétiser",
      "Négocier", "Auditer", "Synchroniser", "Standardiser", "Documenter"
    ]
  },
  {
    category: "Analyse, Données & Stratégie",
    description: "Pour démontrer votre rigueur analytique, prise de décision rationnelle et insights.",
    verbs: [
      "Quantifier", "Évaluer", "Modéliser", "Diagnostiquer", "Formuler",
      "Identifier", "Benchmark", "Prédire", "Interpréter", "Cartographier",
      "Extraire", "Synthétiser", "Auditer", "Segmenter", "Corréler"
    ]
  },
  {
    category: "Performance, Vente & Croissance",
    description: "Pour prouver votre impact direct sur le chiffre d'affaires, l'acquisition et le ROI.",
    verbs: [
      "Multiplier", "Accélérer", "Convertir", "Conquérir", "Fidéliser",
      "Générer", "Augmenter", "Maximiser", "Rentabiliser", "Pénétrer",
      "Décrocher", "Surpasser", "Accroître", "Monétiser", "Transformer"
    ]
  },
  {
    category: "Création, Design & Contenu",
    description: "Pour mettre en avant l'innovation visuelle, le storytelling et l'expérience utilisateur.",
    verbs: [
      "Scénariser", "Conceptualiser", "Éditorialiser", "Moderniser", "Prototyper",
      "Illustrer", "Dynamiser", "Refondre", "Épurer", "Harmoniser"
    ]
  }
];

export const GOLDEN_RULES: GoldenRule[] = [
  {
    id: "rule-xyz",
    title: "La Méthode XYZ de Google",
    subtitle: "La formule suprême pour chaque puce d'expérience",
    iconName: "Target",
    summary: "Accompli [X], mesuré par [Y], en faisant [Z].",
    detailedText: "Un recruteur ne cherche pas une fiche de poste répétée, mais la preuve de ce que vous avez accompli. Précisez toujours l'action réalisée (X), le résultat chiffré ou l'impact mesuré (Y) et le moyen ou la compétence utilisée (Z).",
    badExample: "Responsable de la refonte du site internet et gestion des campagnes publicitaires.",
    goodExample: "Augmentation du taux de conversion de 28% (+140k€ de CA) en 6 mois via la refonte UX du tunnel d'achat sous React et l'optimisation des flux Stripe."
  },
  {
    id: "rule-6-seconds",
    title: "La Règle des 6 Secondes",
    subtitle: "Captiver instantanément le regard du recruteur",
    iconName: "Clock",
    summary: "Hiérarchie visuelle stricte : Titre précis, 3 derniers postes clairs, mots-clés ATS.",
    detailedText: "En première lecture, un recruteur humain balaie votre CV en 6 à 8 secondes. Votre regard doit immédiatement trouver : 1) Le titre exact du poste visé, 2) Le nom de vos entreprises et vos dates, 3) Votre niveau d'impact via des chiffres en gras.",
    badExample: "CV sans titre, paragraphe de bio de 12 lignes denses et blocs d'expériences sans puces distinctes.",
    goodExample: "Titre explicite 'Lead Développeur React / Node.js • 7 ans exp.', contact avec liens LinkedIn/GitHub clairs et puces concises."
  },
  {
    id: "rule-tailoring",
    title: "L'Alignement ATS (Mots-clés cibles)",
    subtitle: "Déjouer les filtres automatiques des logiciels RH",
    iconName: "Cpu",
    summary: "Intégrez 5 à 10 mots-clés exacts mentionnés dans l'offre ciblée.",
    detailedText: "Plus de 75% des CV en grandes entreprises passent par un logiciel ATS (Taleo, Workday, Greenhouse). Si l'offre mentionne 'Méthodologie Scrum' et 'TypeScript', assurez-vous que ces termes exacts figurent dans votre CV, et non des synonymes vagues.",
    badExample: "Utiliser des images de texte ou des barres de pourcentage sans mentionner le nom précis des technologies.",
    goodExample: "Section Compétences structurée par domaines avec les technologies cibles écrites en texte brut sélectionnable."
  },
  {
    id: "rule-single-page",
    title: "Longueur : Le Mythe de la Page Unique",
    subtitle: "Quand faire 1 page et quand passer à 2 pages ?",
    iconName: "FileText",
    summary: "1 page pour les profils juniors (< 5 ans d'expérience) ; 2 pages autorisées pour les profils seniors et experts.",
    detailedText: "Il vaut mieux un CV d'1 page parfaitement calibré, aéré et percutant qu'un CV de 2 pages avec 4 lignes perdues sur la seconde page. Ajustez la densité typographique de Curriculum pour un rendu impeccable.",
    badExample: "CV de 2 pages où la page 2 ne contient que 3 centres d'intérêt et deux langues.",
    goodExample: "CV dense et harmonieux de 1 page pleine, sans espace gaspillé ni impression d'étouffement."
  }
];

export const TOP_PITFALLS: Pitfall[] = [
  {
    id: "pitfall-cliches",
    title: "Les adjectifs creux et clichés usés",
    frequency: "Très fréquent",
    impact: "Décrédibilise le profil et donne une impression de copier-coller.",
    howToFix: "Bannissez les adjectifs déclaratifs sans preuves. Remplacez 'Je suis dynamique et rigoureux' par des accomplissements concrets : 'Livraison de 14 sprints consécutifs sans régression'.",
    bannedWords: ["Dynamique", "Motivé", "Polyvalent", "Ponctuel", "Passionné", "Perfectionniste"]
  },
  {
    id: "pitfall-no-metrics",
    title: "L'absence totale de métriques et de chiffres",
    frequency: "Très fréquent",
    impact: "Le recruteur ne peut pas évaluer l'échelle de vos responsabilités.",
    howToFix: "Ajoutez au moins 1 chiffre par expérience : taille d'équipe managée, budget géré, volume d'utilisateurs, % de gain de temps, CA généré.",
  },
  {
    id: "pitfall-email",
    title: "Adresse email non professionnelle",
    frequency: "Fréquent",
    impact: "Donne immédiatement une impression d'amateurisme.",
    howToFix: "Utilisez impérativement une adresse sobre : 'prenom.nom@gmail.com' ou votre nom de domaine personnel. Fuyez les pseudonymes d'adolescence.",
  },
  {
    id: "pitfall-skill-bars",
    title: "Les jauges d'évaluation subjectives (80% Photoshop)",
    frequency: "Fréquent",
    impact: "Que signifie 'Photoshop à 80%' ? C'est illisible pour les recruteurs et les ATS.",
    howToFix: "Préférez lister vos compétences par niveau de maturité (Expert, Confirmé, Notions) ou associez-les à des certifications officielles.",
  },
  {
    id: "pitfall-typos",
    title: "Fautes d'orthographe et accords",
    frequency: "Critique",
    impact: "Cause d'élimination immédiate pour plus de 52% des recruteurs.",
    howToFix: "Faites relire votre CV par 2 personnes différentes et utilisez des correcteurs professionnels. Portez une attention particulière aux participes passés.",
  }
];

export const SECTOR_TIPS = [
  {
    sector: "Tech, Data & Ingénierie",
    keyAdvice: "Mettez en avant vos réalisations concrètes (projets GitHub, open-source, architecture), votre stack technique exacte et les gains de performance (latence, coûts cloud, scalabilité).",
    recommendedTemplate: "modern-tech",
  },
  {
    sector: "Finance, Audit, Conseil & Droit",
    keyAdvice: "Privilégiez la sobriété classique, une typographie élégante, les montants des transactions gérées, les accréditations officielles et la rigueur chronologique.",
    recommendedTemplate: "oxford-classic",
  },
  {
    sector: "Marketing, Produit & Communication",
    keyAdvice: "Insistez sur les KPIs de croissance (CAC, LTV, ROAS, taux d'engagement, leads qualifiés), le management de projets transverses et l'expérience utilisateur.",
    recommendedTemplate: "nordic-modern",
  },
  {
    sector: "Direction Générale & Management",
    keyAdvice: "Adoptez une posture stratégique avec le modèle Prestige Executive. Mettez l'accent sur la vision, les arbitrages budgétaires et la transformation d'équipe.",
    recommendedTemplate: "prestige-executive",
  }
];
