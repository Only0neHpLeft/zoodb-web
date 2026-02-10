import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  lang?: "en" | "cz";
}

const DEFAULT_SEO = {
  en: {
    title: "ZooDB - Learn SQL Interactively | Free Offline SQL Practice",
    description: "ZooDB is a free, offline desktop app to learn SQL interactively. Practice with a real zoo database — 26 lessons, 68+ tasks. No account needed. Download for Windows, macOS & Linux.",
  },
  cz: {
    title: "ZooDB - Naučte se SQL interaktivně | Bezplatný offline SQL trenažér",
    description: "ZooDB je bezplatná offline desktopová aplikace pro interaktivní výuku SQL. Cvičte s reálnou databází zoo — 26 lekcí, 68+ úkolů. Bez registrace. Pro Windows, macOS a Linux.",
  },
};

const SITE_URL = "https://zoodb.app"; // Update with actual domain
const DEFAULT_IMAGE = "/images/main_image.png";

export function SEO({
  title,
  description,
  image = DEFAULT_IMAGE,
  url = SITE_URL,
  lang = "en",
}: SEOProps) {
  const seoTitle = title ?? DEFAULT_SEO[lang].title;
  const seoDescription = description ?? DEFAULT_SEO[lang].description;
  const fullImageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  useEffect(() => {
    // Update document title
    document.title = seoTitle;

    // Update meta tags
    const keywords = lang === "cz"
      ? "zoodb, zoo db, zoo databáze, naučit se sql, sql cvičení, sql tutoriál, interaktivní sql, sql lekce, sql úkoly, offline sql, sql trenažér, sql pro začátečníky, zoodb app"
      : "zoodb, zoo db, zoo database, learn sql, sql practice, sql tutorial, interactive sql, sql lessons, sql tasks, offline sql, free sql course, sql trainer, sql exercises, sql for beginners, practice sql queries, desktop sql app, zoodb app";

    const metaTags: Record<string, string> = {
      "description": seoDescription,
      "keywords": keywords,
      "author": "ZooDB",
      "robots": "index, follow",
      "og:title": seoTitle,
      "og:description": seoDescription,
      "og:image": fullImageUrl,
      "og:url": url,
      "og:type": "website",
      "og:site_name": "ZooDB",
      "og:locale": lang === "cz" ? "cs_CZ" : "en_US",
      "twitter:card": "summary_large_image",
      "twitter:title": seoTitle,
      "twitter:description": seoDescription,
      "twitter:image": fullImageUrl,
    };

    // Update or create meta tags
    Object.entries(metaTags).forEach(([name, content]) => {
      const isOg = name.startsWith("og:");
      const isTwitter = name.startsWith("twitter:");
      const attrName = isOg || isTwitter ? "property" : "name";
      
      let meta = document.querySelector(`meta[${attrName}="${name}"]`);
      
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attrName, name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute("content", content);
    });

    // Update HTML lang
    document.documentElement.lang = lang === "cz" ? "cs" : "en";

    // Cleanup function to remove dynamically added meta tags
    return () => {
      Object.keys(metaTags).forEach((name) => {
        const isOg = name.startsWith("og:");
        const isTwitter = name.startsWith("twitter:");
        const attrName = isOg || isTwitter ? "property" : "name";
        const meta = document.querySelector(`meta[${attrName}="${name}"]`);
        if (meta && meta.getAttribute("data-dynamic") === "true") {
          meta.remove();
        }
      });
    };
  }, [seoTitle, seoDescription, fullImageUrl, url, lang]);

  return null;
}
