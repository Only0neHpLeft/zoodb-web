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
    title: "ZooDB - Learn SQL Interactively",
    description: "Practice SQL with a real database. 26 lessons, 68+ tasks. No account needed. Free & offline.",
  },
  cz: {
    title: "ZooDB - Naučte se SQL interaktivně",
    description: "Cvičte SQL s reálnou databází. 26 lekcí, 68+ úkolů. Bez registrace. Zdarma a offline.",
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
    const metaTags: Record<string, string> = {
      "description": seoDescription,
      "og:title": seoTitle,
      "og:description": seoDescription,
      "og:image": fullImageUrl,
      "og:url": url,
      "og:type": "website",
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
