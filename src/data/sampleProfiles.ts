import { CVData } from "../types";

export const SAMPLE_PROFILES: Record<string, CVData> = {
  tech: {
    id: "tech-profile",
    version: "1.0",
    lastModified: Date.now(),
    personal: {
      firstName: "Alexandre",
      lastName: "Dubois",
      title: "Lead Développeur Full-Stack & DevOps",
      email: "alexandre.dubois.dev@gmail.com",
      phone: "+33 6 42 89 12 34",
      city: "Paris",
      country: "France",
      website: "https://alexdubois.dev",
      linkedin: "linkedin.com/in/alexandre-dubois-tech",
      github: "github.com/alexdubois",
      socialLinks: [
        {
          id: "link-linkedin-tech",
          platform: "linkedin",
          label: "LinkedIn",
          url: "linkedin.com/in/alexandre-dubois-tech",
        },
        {
          id: "link-github-tech",
          platform: "github",
          label: "GitHub",
          url: "github.com/alexdubois",
        },
        {
          id: "link-portfolio-tech",
          platform: "portfolio",
          label: "Portfolio",
          url: "https://alexdubois.dev",
        },
      ],
      showPhoto: true,
      photoShape: "rounded",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      summary: "Ingénieur logiciel chevronné avec 8 ans d'expérience dans la conception d'architectures web distribuées et résilientes. Spécialiste TypeScript, React, Node.js et Cloud GCP/AWS. Passionné par l'excellence technique, l'expérience développeur et l'agilité à grande échelle.",
    },
    experiences: [
      {
        id: "exp-1",
        role: "Lead Tech Full-Stack",
        company: "PayNova Solutions",
        location: "Paris, France",
        startDate: "2022-01",
        endDate: "Présent",
        isCurrent: true,
        highlights: [
          "Pilotage technique d'une équipe de 7 ingénieurs sur la plateforme de paiement haute disponibilité (3M+ transactions/mois).",
          "Conception et migration d'un monolithe vers des microservices événementiels sous Node.js & Kafka, réduisant la latence p99 de 42%.",
          "Mise en place de pipelines CI/CD automatisés sous GitHub Actions et Docker, diminuant le temps de déploiement de 45 à 8 minutes."
        ]
      },
      {
        id: "exp-2",
        role: "Développeur Senior React / Node.js",
        company: "Kinetix Digital",
        location: "Lyon, France",
        startDate: "2019-03",
        endDate: "2021-12",
        isCurrent: false,
        highlights: [
          "Développement complet du SaaS de gestion logistique B2B en React, TypeScript et PostgreSQL, générant 850k€ d'ARR en première année.",
          "Optimisation du bundle frontend et des requêtes GraphQL, augmentant le score Google Lighthouse de 62 à 96/100.",
          "Animation des rituels agiles Scrum et encadrement de 3 développeurs juniors avec revue de code systématique."
        ]
      },
      {
        id: "exp-3",
        role: "Développeur Web Full-Stack",
        company: "Aura Studio",
        location: "Grenoble, France",
        startDate: "2017-09",
        endDate: "2019-02",
        isCurrent: false,
        highlights: [
          "Création de 12 applications web sur-mesure pour des clients e-commerce et fintech.",
          "Intégration d'APIs tierces sécurisées (Stripe, Twilio, SendGrid) et mise en conformité RGPD."
        ]
      }
    ],
    education: [
      {
        id: "edu-1",
        degree: "Master Ingénierie du Logiciel & Systèmes d'Information",
        field: "Informatique & Génie Logiciel",
        institution: "INSA Lyon",
        location: "Lyon",
        startDate: "2015",
        endDate: "2017",
        description: "Major de promotion • Spécialisation en architectures distribuées et sécurité logicielle."
      },
      {
        id: "edu-2",
        degree: "Licence Informatique Mathématiques",
        field: "Sciences Fondamentales",
        institution: "Université Claude Bernard Lyon 1",
        location: "Lyon",
        startDate: "2012",
        endDate: "2015"
      }
    ],
    skillCategories: [
      {
        id: "sc-1",
        category: "Langages & Frameworks",
        skills: [
          { id: "s1", name: "TypeScript / JavaScript", level: 5 },
          { id: "s2", name: "React / Next.js", level: 5 },
          { id: "s3", name: "Node.js / Express / NestJS", level: 5 },
          { id: "s4", name: "Python", level: 3 }
        ]
      },
      {
        id: "sc-2",
        category: "Cloud, DevOps & Data",
        skills: [
          { id: "s5", name: "Docker / Kubernetes", level: 4 },
          { id: "s6", name: "PostgreSQL / Redis / MongoDB", level: 4 },
          { id: "s7", name: "GCP & AWS Cloud", level: 4 },
          { id: "s8", name: "CI/CD GitHub Actions", level: 5 }
        ]
      },
      {
        id: "sc-3",
        category: "Méthodes & Soft Skills",
        skills: [
          { id: "s9", name: "Architecture Microservices", level: 5 },
          { id: "s10", name: "Management Agile / Scrum", level: 4 },
          { id: "s11", name: "Mentoring technique", level: 5 }
        ]
      }
    ],
    languages: [
      { id: "l1", language: "Français", proficiency: "Langue maternelle" },
      { id: "l2", language: "Anglais", proficiency: "C1 - Avancé" }
    ],
    projects: [
      {
        id: "p1",
        title: "OmniMetrics • Plateforme Open-Source",
        role: "Créateur & Mainteneur",
        link: "github.com/alexdubois/omni-metrics",
        date: "2023",
        description: "Outil de télémétrie léger pour applications Node.js téléchargeant plus de 40 000 packages/mois.",
        techStack: ["TypeScript", "Grafana", "Prometheus", "Fastify"]
      }
    ],
    certifications: [
      { id: "c1", title: "Google Cloud Certified Professional Cloud Architect", issuer: "Google Cloud", year: "2023" },
      { id: "c2", title: "AWS Certified Solutions Architect – Associate", issuer: "Amazon Web Services", year: "2021" }
    ],
    customSections: []
  },

  marketing: {
    id: "marketing-profile",
    version: "1.0",
    lastModified: Date.now(),
    personal: {
      firstName: "Camille",
      lastName: "Laurent",
      title: "Directrice Marketing & Stratégie Digitale",
      email: "camille.laurent.pro@gmail.com",
      phone: "+33 6 78 90 23 45",
      city: "Lyon",
      country: "France",
      website: "https://camillelaurent.com",
      linkedin: "linkedin.com/in/camille-laurent-growth",
      socialLinks: [
        {
          id: "link-linkedin-mkt",
          platform: "linkedin",
          label: "LinkedIn",
          url: "linkedin.com/in/camille-laurent-growth",
        },
        {
          id: "link-portfolio-mkt",
          platform: "portfolio",
          label: "Portfolio & Cas d'études",
          url: "https://camillelaurent.com",
        },
      ],
      showPhoto: true,
      photoShape: "circle",
      photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      summary: "Leader marketing stratégique avec 10 ans d'impact avéré dans l'acquisition client, le branding omnicanal et la fidélisation en univers SaaS et E-commerce. Experte du pilotage des KPIs de rentabilité (CAC, LTV, ROI) et de la coordination d'équipes pluridisciplinaires.",
    },
    experiences: [
      {
        id: "m-exp-1",
        role: "Head of Marketing & Growth",
        company: "Veloce SaaS",
        location: "Lyon, France",
        startDate: "2021-06",
        endDate: "Présent",
        isCurrent: true,
        highlights: [
          "Supervision d'une équipe de 9 personnes (content, acquisition paid, CRM et design) avec un budget annuel de 1,2M€.",
          "Multiplication par 3 du MRR en 24 mois (de 120k€ à 380k€/mois) grâce à la structuration d'une stratégie inbound et SEO agressive.",
          "Diminution du coût d'acquisition client (CAC) de 35% via l'optimisation des flux d'onboarding et des tunnels publicitaires Meta & Google Ads."
        ]
      },
      {
        id: "m-exp-2",
        role: "Responsable Marketing Digital & Acquisition",
        company: "Elysium Retail",
        location: "Paris, France",
        startDate: "2018-01",
        endDate: "2021-05",
        isCurrent: false,
        highlights: [
          "Gestion des campagnes Paid Search et Social Ads générant plus de 4,5M€ de chiffre d'affaires e-commerce.",
          "Lancement d'un programme de fidélité personnalisé ayant augmenté le taux de réachat de 22% en un an."
        ]
      }
    ],
    education: [
      {
        id: "m-edu-1",
        degree: "Master 2 Marketing Stratégique & Digital Business",
        field: "Sciences de Gestion & Commerce",
        institution: "EM Lyon Business School",
        location: "Lyon",
        startDate: "2014",
        endDate: "2016"
      }
    ],
    skillCategories: [
      {
        id: "m-sc-1",
        category: "Stratégie & Acquisition",
        skills: [
          { id: "ms1", name: "Inbound Marketing & SEO", level: 5 },
          { id: "ms2", name: "Google Ads / Meta Ads / LinkedIn", level: 5 },
          { id: "ms3", name: "Growth Hacking & Funnels", level: 4 }
        ]
      },
      {
        id: "m-sc-2",
        category: "Outils & Analyse",
        skills: [
          { id: "ms4", name: "HubSpot / Salesforce CRM", level: 5 },
          { id: "ms5", name: "Google Analytics 4 & Mixpanel", level: 5 },
          { id: "ms6", name: "Figma & Miro", level: 4 }
        ]
      }
    ],
    languages: [
      { id: "ml1", language: "Français", proficiency: "Langue maternelle" },
      { id: "ml2", language: "Anglais", proficiency: "C2 - Bilingue" },
      { id: "ml3", language: "Espagnol", proficiency: "B2 - Intermédiaire supérieur" }
    ],
    projects: [],
    certifications: [
      { id: "mc1", title: "HubSpot Inbound Marketing Certified", issuer: "HubSpot Academy", year: "2023" },
      { id: "mc2", title: "Google Analytics 4 Certification", issuer: "Google Skillshop", year: "2022" }
    ],
    customSections: []
  },

  product: {
    id: "product-profile",
    version: "1.0",
    lastModified: Date.now(),
    personal: {
      firstName: "Thomas",
      lastName: "Moreau",
      title: "Senior Product Manager • B2B SaaS",
      email: "thomas.moreau.pm@gmail.com",
      phone: "+33 6 11 22 33 44",
      city: "Bordeaux",
      country: "France",
      linkedin: "linkedin.com/in/thomas-moreau-product",
      socialLinks: [
        {
          id: "link-linkedin-prod",
          platform: "linkedin",
          label: "LinkedIn",
          url: "linkedin.com/in/thomas-moreau-product",
        },
      ],
      showPhoto: true,
      photoShape: "rounded",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      summary: "Product Manager orienté data et valeur utilisateur avec 6 ans d'expérience dans la transformation de visions stratégiques en produits scalables. Praticien agile certifié, facilitateur d'équipes pluridisciplinaires (ingénierie, design, ventes) et passionné de discovery produit.",
    },
    experiences: [
      {
        id: "p-exp-1",
        role: "Senior Product Manager",
        company: "FlowSync Cloud",
        location: "Bordeaux (Hybride)",
        startDate: "2021-09",
        endDate: "Présent",
        isCurrent: true,
        highlights: [
          "Leadership sur le core product utilisé par 180 000 utilisateurs actifs mensuels à l'international.",
          "Conception et livraison de la nouvelle suite d'automatisations No-Code, générant +18% de rétention à 90 jours.",
          "Mise en place d'un framework d'entretiens utilisateurs systématiques (plus de 120 interviews menées)."
        ]
      },
      {
        id: "p-exp-2",
        role: "Product Owner / Chef de Projet",
        company: "NextGen Media",
        location: "Paris, France",
        startDate: "2018-05",
        endDate: "2021-08",
        isCurrent: false,
        highlights: [
          "Gestion du backlog et priorisation pour une squad de 8 développeurs et 1 designer UX.",
          "Réduction du délai de mise sur le marché (Time-to-Market) de 30% grâce à des cycles de release bi-hebdomadaires."
        ]
      }
    ],
    education: [
      {
        id: "p-edu-1",
        degree: "Diplôme d'Ingénieur Généraliste & Management",
        field: "Systèmes d'Information et Innovation",
        institution: "Centrale Méditerranée",
        location: "Marseille",
        startDate: "2014",
        endDate: "2017"
      }
    ],
    skillCategories: [
      {
        id: "p-sc-1",
        category: "Product Management",
        skills: [
          { id: "ps1", name: "Product Discovery & User Interviews", level: 5 },
          { id: "ps2", name: "Roadmapping & Priorisation (RICE)", level: 5 },
          { id: "ps3", name: "Data Analysis & Métriques Produit", level: 4 }
        ]
      },
      {
        id: "p-sc-2",
        category: "Outils & Méthodes",
        skills: [
          { id: "ps4", name: "Jira / Linear / Notion", level: 5 },
          { id: "ps5", name: "Amplitude & Hotjar", level: 4 },
          { id: "ps6", name: "Scrum & Kanban", level: 5 }
        ]
      }
    ],
    languages: [
      { id: "pl1", language: "Français", proficiency: "Langue maternelle" },
      { id: "pl2", language: "Anglais", proficiency: "C1 - Avancé" }
    ],
    projects: [],
    certifications: [
      { id: "pc1", title: "Professional Scrum Product Owner (PSPO II)", issuer: "Scrum.org", year: "2022" }
    ],
    customSections: []
  }
};
