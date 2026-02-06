import type { ReactNode } from "react";

export interface SlideProps {
  isActive: boolean;
  prefersReducedMotion: boolean;
  theme: "dark" | "light";
  lang: "en" | "cz";
}

export interface TranslationSet {
  hero: {
    tag: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    cta: string;
    source: string;
  };
  stats: { value: string; label: string }[];
  download: {
    title: string;
    cta: string;
    otherPlatforms: string;
    requirements: string;
    whatsIncluded: string;
    ready: string;
    included: { icon: string; text: string }[];
    platforms: Record<string, { name: string; file: string; reqs: string[] }>;
  };
  features: string[];
  nav: {
    next: string;
    prev: string;
  };
  footer: {
    slogan: string;
    openSource: string;
  };
  editor?: {
    title: string;
    subtitle: string;
    features: string[];
  };
}

export interface ColorScheme {
  bg: string;
  text: string;
  muted: string;
  border: string;
  card: string;
  accent: string;
  accentBg: string;
  accentGradient: string;
}

export interface IconComponents {
  [key: string]: ReactNode;
}
