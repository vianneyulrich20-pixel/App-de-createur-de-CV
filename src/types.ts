export type PhotoShape = 'circle' | 'square' | 'rounded';
export type PhotoSize = 'sm' | 'md' | 'lg';
export type PhotoFilter = 'none' | 'grayscale' | 'contrast';

export type CVTemplateId = 
  | 'nordic-modern' 
  | 'prestige-executive' 
  | 'modern-tech' 
  | 'studio-creative' 
  | 'oxford-classic' 
  | 'dense-compact';

export type FontFamilyOption = 'sans' | 'serif' | 'display' | 'mono';
export type SpacingDensity = 'compact' | 'normal' | 'spacious';
export type FontSizeScale = 'sm' | 'base' | 'lg';

export type SocialPlatform =
  | 'linkedin'
  | 'github'
  | 'portfolio'
  | 'website'
  | 'twitter'
  | 'dribbble'
  | 'behance'
  | 'gitlab'
  | 'medium'
  | 'youtube'
  | 'other';

export interface SocialLinkItem {
  id: string;
  platform: SocialPlatform;
  label?: string; // Libellé personnalisé optionnel
  url: string;    // URL ou identifiant du profil
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  postalCode?: string;
  driverLicense?: string;
  birthDate?: string;
  nationality?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  socialLinks?: SocialLinkItem[];
  photoUrl?: string;
  showPhoto: boolean;
  photoShape: PhotoShape;
  photoSize?: PhotoSize;
  photoFilter?: PhotoFilter;
  summary: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  contractType?: string; // CDI, CDD, Freelance, Stage, Alternance
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  highlights: string[];
  techStack?: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  field: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  honors?: string; // Mention Très Bien, Cum Laude, etc.
  description?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level?: number; // 1 to 5 optional
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: SkillItem[];
}

export type LanguageProficiency = 
  | 'A1 - Débutant'
  | 'A2 - Élémentaire'
  | 'B1 - Intermédiaire'
  | 'B2 - Intermédiaire supérieur'
  | 'C1 - Avancé'
  | 'C2 - Bilingue'
  | 'Langue maternelle';

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: LanguageProficiency;
  certification?: string; // e.g. "TOEIC 940", "DELE C1"
}

export interface ProjectItem {
  id: string;
  title: string;
  role?: string;
  link?: string;
  date?: string;
  description: string;
  techStack: string[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  url?: string;
}

export interface ReferenceItem {
  id: string;
  name: string;
  role: string;
  company: string;
  contact: string;
}

export interface VolunteerItem {
  id: string;
  role: string;
  organization: string;
  period: string;
  description: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  items: {
    id: string;
    label: string;
    subLabel?: string;
    date?: string;
    details?: string;
  }[];
}

export interface CVData {
  id: string;
  version: string;
  lastModified: number;
  personal: PersonalInfo;
  experiences: ExperienceItem[];
  education: EducationItem[];
  skillCategories: SkillCategory[];
  languages: LanguageItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  interests?: string[];
  volunteer?: VolunteerItem[];
  references?: ReferenceItem[];
  customSections: CustomSectionItem[];
  sectionVisibility?: {
    summary?: boolean;
    experiences?: boolean;
    education?: boolean;
    skills?: boolean;
    languages?: boolean;
    projects?: boolean;
    certifications?: boolean;
    interests?: boolean;
    volunteer?: boolean;
    references?: boolean;
    customSections?: boolean;
  };
}

export interface CVDesignConfig {
  templateId: CVTemplateId;
  primaryColor: string; // e.g. '#0284c7'
  secondaryColor: string; // e.g. '#0f172a'
  accentColor: string;
  fontFamily: FontFamilyOption;
  fontSize: FontSizeScale;
  spacing: SpacingDensity;
  showDividers: boolean;
  showIcons: boolean;
  twoColumnLayout: boolean;
  sidebarPosition: 'left' | 'right';
  paperFormat?: 'a4' | 'letter';
  activeSectionOrder: string[];
}

export interface AtsReport {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D';
  metricsCount: number;
  actionVerbsCount: number;
  wordCount: number;
  warnings: string[];
  successes: string[];
  suggestions: {
    id: string;
    type: 'warning' | 'info' | 'critical';
    title: string;
    message: string;
    actionLabel?: string;
    section?: string;
  }[];
}
