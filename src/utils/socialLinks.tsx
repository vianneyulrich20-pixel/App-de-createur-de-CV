import React from "react";
import {
  Linkedin,
  Github,
  Globe,
  Twitter,
  Dribbble,
  Gitlab,
  Youtube,
  Link2,
  Briefcase,
  BookOpen,
  Palette,
  ExternalLink,
} from "lucide-react";
import { PersonalInfo, SocialLinkItem, SocialPlatform } from "../types";

export interface PlatformConfig {
  id: SocialPlatform;
  label: string;
  placeholder: string;
  example: string;
  domainPrefix?: string;
  accentColor: string;
}

export const SOCIAL_PLATFORMS: Record<SocialPlatform, PlatformConfig> = {
  linkedin: {
    id: "linkedin",
    label: "LinkedIn",
    placeholder: "linkedin.com/in/jean-dupont",
    example: "linkedin.com/in/jean-dupont",
    domainPrefix: "https://linkedin.com/in/",
    accentColor: "#0A66C2",
  },
  github: {
    id: "github",
    label: "GitHub",
    placeholder: "github.com/jeandupont",
    example: "github.com/jeandupont",
    domainPrefix: "https://github.com/",
    accentColor: "#24292F",
  },
  portfolio: {
    id: "portfolio",
    label: "Portfolio",
    placeholder: "jeandupont.dev",
    example: "jeandupont.dev",
    accentColor: "#6366F1",
  },
  website: {
    id: "website",
    label: "Site web",
    placeholder: "mon-site.fr",
    example: "mon-site.fr",
    accentColor: "#0284C7",
  },
  twitter: {
    id: "twitter",
    label: "X / Twitter",
    placeholder: "x.com/jeandupont",
    example: "x.com/jeandupont",
    domainPrefix: "https://x.com/",
    accentColor: "#000000",
  },
  dribbble: {
    id: "dribbble",
    label: "Dribbble",
    placeholder: "dribbble.com/jeandupont",
    example: "dribbble.com/jeandupont",
    domainPrefix: "https://dribbble.com/",
    accentColor: "#EA4C89",
  },
  behance: {
    id: "behance",
    label: "Behance",
    placeholder: "behance.net/jeandupont",
    example: "behance.net/jeandupont",
    domainPrefix: "https://behance.net/",
    accentColor: "#0057FF",
  },
  gitlab: {
    id: "gitlab",
    label: "GitLab",
    placeholder: "gitlab.com/jeandupont",
    example: "gitlab.com/jeandupont",
    domainPrefix: "https://gitlab.com/",
    accentColor: "#FC6D26",
  },
  medium: {
    id: "medium",
    label: "Medium",
    placeholder: "medium.com/@jeandupont",
    example: "medium.com/@jeandupont",
    domainPrefix: "https://medium.com/@",
    accentColor: "#000000",
  },
  youtube: {
    id: "youtube",
    label: "YouTube",
    placeholder: "youtube.com/@chaine",
    example: "youtube.com/@chaine",
    domainPrefix: "https://youtube.com/@",
    accentColor: "#FF0000",
  },
  other: {
    id: "other",
    label: "Autre lien",
    placeholder: "https://...",
    example: "lien-personnalise.com",
    accentColor: "#64748B",
  },
};

export interface ResolvedSocialLink {
  id: string;
  platform: SocialPlatform;
  label: string;
  url: string;
  href: string;
  displayText: string;
}

/**
 * Ensures a valid web link with protocol
 */
export function formatHref(rawUrl: string): string {
  if (!rawUrl) return "";
  const trimmed = rawUrl.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^mailto:/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/**
 * Formats a clean display text for CVs (removes https://, www., etc.)
 */
export function formatDisplayText(url: string, platform: SocialPlatform, customLabel?: string): string {
  if (customLabel && customLabel.trim().length > 0) {
    return customLabel.trim();
  }
  if (!url) return "";

  let clean = url.trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/$/, "");

  if (platform === "linkedin") {
    clean = clean.replace(/^linkedin\.com\/in\//i, "");
  } else if (platform === "github") {
    clean = clean.replace(/^github\.com\//i, "");
  } else if (platform === "twitter") {
    clean = clean.replace(/^(twitter|x)\.com\//i, "@");
  } else if (platform === "medium") {
    clean = clean.replace(/^medium\.com\/@/i, "@");
  } else if (platform === "youtube") {
    clean = clean.replace(/^youtube\.com\/@/i, "@");
  }

  return clean || url;
}

/**
 * Returns unified social links from personal info, supporting both dynamic socialLinks
 * and backward-compatible fields (linkedin, github, website).
 */
export function getUnifiedSocialLinks(personal?: PersonalInfo): ResolvedSocialLink[] {
  if (!personal) return [];

  // If new dynamic socialLinks are present and contain valid items
  if (personal.socialLinks && personal.socialLinks.length > 0) {
    const valid = personal.socialLinks.filter((item) => item.url && item.url.trim().length > 0);
    if (valid.length > 0) {
      return valid.map((item) => {
        const platform = item.platform || "other";
        const config = SOCIAL_PLATFORMS[platform] || SOCIAL_PLATFORMS.other;
        const defaultName = config.label;
        const label = item.label?.trim() || defaultName;

        return {
          id: item.id || `social-${Math.random()}`,
          platform,
          label,
          url: item.url.trim(),
          href: formatHref(item.url),
          displayText: formatDisplayText(item.url, platform, item.label),
        };
      });
    }
  }

  // Fallback to legacy fields
  const fallback: ResolvedSocialLink[] = [];

  if (personal.linkedin && personal.linkedin.trim().length > 0) {
    fallback.push({
      id: "legacy-linkedin",
      platform: "linkedin",
      label: "LinkedIn",
      url: personal.linkedin.trim(),
      href: formatHref(personal.linkedin),
      displayText: formatDisplayText(personal.linkedin, "linkedin"),
    });
  }

  if (personal.github && personal.github.trim().length > 0) {
    fallback.push({
      id: "legacy-github",
      platform: "github",
      label: "GitHub",
      url: personal.github.trim(),
      href: formatHref(personal.github),
      displayText: formatDisplayText(personal.github, "github"),
    });
  }

  if (personal.website && personal.website.trim().length > 0) {
    fallback.push({
      id: "legacy-website",
      platform: "portfolio",
      label: "Portfolio",
      url: personal.website.trim(),
      href: formatHref(personal.website),
      displayText: formatDisplayText(personal.website, "portfolio"),
    });
  }

  return fallback;
}

/**
 * Returns the appropriate Lucide icon component for a platform
 */
export function getPlatformIcon(platform: SocialPlatform, className = "w-3.5 h-3.5") {
  switch (platform) {
    case "linkedin":
      return <Linkedin className={className} />;
    case "github":
      return <Github className={className} />;
    case "portfolio":
      return <Globe className={className} />;
    case "website":
      return <Globe className={className} />;
    case "twitter":
      return <Twitter className={className} />;
    case "dribbble":
      return <Dribbble className={className} />;
    case "behance":
      return <Palette className={className} />;
    case "gitlab":
      return <Gitlab className={className} />;
    case "medium":
      return <BookOpen className={className} />;
    case "youtube":
      return <Youtube className={className} />;
    case "other":
    default:
      return <Link2 className={className} />;
  }
}
