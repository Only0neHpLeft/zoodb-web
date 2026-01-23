import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";

type Platform = "windows" | "macos" | "linux";

const DOWNLOAD_LINKS: Record<Platform, string> = {
  windows: "/downloads/ZooDB-Setup.exe",
  macos: "/downloads/ZooDB.dmg",
  linux: "/downloads/ZooDB.AppImage",
};

const GITHUB_URL = "https://github.com/Only0neHpLeft/zoodb-app";
const TOTAL_SLIDES = 2;

function detectOS(): Platform {
  const ua = navigator.userAgent.toLowerCase();
  const platform = navigator.platform.toLowerCase();

  if (platform.includes("mac") || ua.includes("mac")) return "macos";
  if (platform.includes("linux") || ua.includes("linux")) return "linux";
  return "windows";
}

const translations = {
  en: {
    hero: {
      tag: "Free & Offline",
      title: "Learn SQL",
      titleHighlight: "interactively.",
      subtitle: "Practice SQL with a real database. 26 lessons, 68+ tasks. No account needed.",
      cta: "Get Started",
      source: "GitHub",
    },
    stats: [
      { value: "26", label: "Lessons" },
      { value: "68+", label: "Tasks" },
      { value: "3", label: "Platforms" },
    ],
    download: {
      title: "Download for",
      cta: "Download Now",
      otherPlatforms: "Also available for",
      requirements: "System Requirements",
      whatsIncluded: "What's Included",
      ready: "Ready to start?",
      included: [
        { icon: "database", text: "Pre-loaded zoo database with realistic data" },
        { icon: "zap", text: "Instant query feedback & error explanations" },
        { icon: "offline", text: "No internet required after download" },
        { icon: "shield", text: "Your progress saved locally, always private" },
      ],
      platforms: {
        windows: { name: "Windows", file: ".exe", reqs: ["Windows 10+", "2GB RAM", "~30MB"] },
        macos: { name: "macOS", file: ".dmg", reqs: ["macOS 11+", "2GB RAM", "~30MB"] },
        linux: { name: "Linux", file: ".AppImage", reqs: ["Ubuntu 20.04+", "2GB RAM", "~30MB"] },
      },
    },
    features: [
      "Real zoo database included",
      "Works completely offline",
      "Instant feedback on queries",
      "Progress tracking & certificates",
    ],
    nav: {
      next: "Next",
      prev: "Back",
    },
    footer: {
      slogan: "From queries to confidence.",
      openSource: "Open Source",
    },
  },
  cz: {
    hero: {
      tag: "Zdarma & Offline",
      title: "Naučte se SQL",
      titleHighlight: "interaktivně.",
      subtitle: "Cvičte SQL s reálnou databází. 26 lekcí, 68+ úkolů. Bez registrace.",
      cta: "Začít",
      source: "GitHub",
    },
    stats: [
      { value: "26", label: "Lekcí" },
      { value: "68+", label: "Úkolů" },
      { value: "3", label: "Platformy" },
    ],
    download: {
      title: "Stáhnout pro",
      cta: "Stáhnout nyní",
      otherPlatforms: "Dostupné také pro",
      requirements: "Systémové požadavky",
      whatsIncluded: "Co je zahrnuto",
      ready: "Připraveni začít?",
      included: [
        { icon: "database", text: "Předinstalovaná databáze zoo s reálnými daty" },
        { icon: "zap", text: "Okamžitá zpětná vazba & vysvětlení chyb" },
        { icon: "offline", text: "Po stažení není potřeba internet" },
        { icon: "shield", text: "Váš pokrok uložen lokálně, vždy soukromý" },
      ],
      platforms: {
        windows: { name: "Windows", file: ".exe", reqs: ["Windows 10+", "2GB RAM", "~30MB"] },
        macos: { name: "macOS", file: ".dmg", reqs: ["macOS 11+", "2GB RAM", "~30MB"] },
        linux: { name: "Linux", file: ".AppImage", reqs: ["Ubuntu 20.04+", "2GB RAM", "~30MB"] },
      },
    },
    features: [
      "Reálná databáze zoo v ceně",
      "Funguje zcela offline",
      "Okamžitá zpětná vazba",
      "Sledování pokroku & certifikáty",
    ],
    nav: {
      next: "Další",
      prev: "Zpět",
    },
    footer: {
      slogan: "Od dotazů k sebedůvěře.",
      openSource: "Open Source",
    },
  },
};

const Icons = {
  chevronRight: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  ),
  chevronLeft: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
  arrowRight: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  windows: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 5.5L10 4.5V11H3V5.5ZM3 18.5L10 19.5V13H3V18.5ZM11 19.6L21 21V13H11V19.6ZM11 4.4V11H21V3L11 4.4Z" />
    </svg>
  ),
  apple: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
    </svg>
  ),
  linux: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.5 2C11.03 2 9.78 3.12 9.38 4.61L9.2 5.22C9.04 5.81 8.79 6.31 8.38 6.68C7.82 7.18 7.63 7.93 7.63 8.68C7.63 9.23 7.82 9.78 8.08 10.23C7.53 10.53 7.16 10.88 6.93 11.31C6.53 12.04 6.63 12.96 7.16 13.6C7.04 13.96 6.88 14.35 6.63 14.73C5.79 16.08 4.88 18.21 5.96 19.71C6.33 20.25 6.88 20.62 7.5 20.8C8.03 20.95 8.6 20.97 9.13 20.81C9.65 20.65 10.12 20.35 10.5 19.95C10.85 19.57 11.15 19.12 11.38 18.62C11.59 18.17 11.74 17.68 11.82 17.17C11.91 17.18 12 17.18 12.09 17.18C12.22 17.18 12.35 17.17 12.47 17.15C12.55 17.68 12.71 18.2 12.95 18.67C13.18 19.15 13.48 19.59 13.83 19.95C14.21 20.35 14.68 20.65 15.2 20.81C15.73 20.97 16.3 20.95 16.83 20.8C17.45 20.62 18 20.25 18.37 19.71C19.45 18.21 18.54 16.08 17.7 14.73C17.45 14.35 17.29 13.96 17.17 13.6C17.7 12.96 17.8 12.04 17.4 11.31C17.17 10.88 16.8 10.53 16.25 10.23C16.51 9.78 16.7 9.23 16.7 8.68C16.7 7.93 16.51 7.18 15.95 6.68C15.54 6.31 15.29 5.81 15.13 5.22L14.95 4.61C14.55 3.12 13.3 2 11.83 2H12.5ZM12 4C12.55 4 13 4.45 13 5C13 5.55 12.55 6 12 6C11.45 6 11 5.55 11 5C11 4.45 11.45 4 12 4Z" />
    </svg>
  ),
  download: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  ),
  github: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  sun: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  ),
  moon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  database: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  offline: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" y1="2" x2="22" y2="22" />
      <path d="M8.5 16.5a5 5 0 0 1 7 0" />
      <path d="M2 8.82a15 15 0 0 1 4.17-2.65" />
      <path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76" />
      <path d="M16.85 11.25a10 10 0 0 1 2.22 1.68" />
      <path d="M5 13a10 10 0 0 1 5.24-2.76" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  ),
  zap: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  shield: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  tag: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
};

export default function App() {
  const [lang, setLang] = useState<"en" | "cz">("en");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [userOS, setUserOS] = useState<Platform>("windows");
  const [version, setVersion] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const t = translations[lang];

  useEffect(() => {
    setUserOS(detectOS());
    fetch("https://api.github.com/repos/Only0neHpLeft/zoodb-app/tags")
      .then(res => res.json())
      .then(tags => {
        if (tags && tags.length > 0) {
          setVersion(tags[0].name);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.documentElement.style.colorScheme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index < 0 || index >= TOTAL_SLIDES) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => goToSlide(currentSlide + 1), [currentSlide, goToSlide]);
  const prevSlide = useCallback(() => goToSlide(currentSlide - 1), [currentSlide, goToSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch/swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  // Mouse wheel horizontal scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        if (e.deltaY > 30) nextSlide();
        else if (e.deltaY < -30) prevSlide();
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [nextSlide, prevSlide]);

  const c = useMemo(() => ({
    bg: theme === "dark" ? "bg-[#0a0a0a]" : "bg-[#fafafa]",
    text: theme === "dark" ? "text-[#fafafa]" : "text-[#0a0a0a]",
    muted: theme === "dark" ? "text-[#888]" : "text-[#666]",
    border: theme === "dark" ? "border-white/10" : "border-black/10",
    card: theme === "dark" ? "bg-white/[0.03]" : "bg-black/[0.03]",
    accent: theme === "dark" ? "text-[#ffe0c2]" : "text-[#b8845c]",
    accentBg: theme === "dark" ? "bg-[#ffe0c2]" : "bg-[#b8845c]",
    accentGradient: theme === "dark" ? "from-[#ffe0c2] to-[#ffb380]" : "from-[#b8845c] to-[#8b6346]",
  }), [theme]);

  const platformIcons: Record<Platform, React.ReactNode> = {
    windows: Icons.windows,
    macos: Icons.apple,
    linux: Icons.linux,
  };

  const includedIcons: Record<string, React.ReactNode> = {
    database: Icons.database,
    zap: Icons.zap,
    offline: Icons.offline,
    shield: Icons.shield,
  };

  const currentPlatform = t.download.platforms[userOS];
  const otherPlatforms = (Object.keys(t.download.platforms) as Platform[]).filter(p => p !== userOS);

  return (
    <div
      className={`h-screen w-screen overflow-hidden ${c.bg} ${c.text}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Fixed Nav */}
      <nav className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <button
          onClick={() => setLang(l => l === "en" ? "cz" : "en")}
          className={`text-sm ${c.muted} hover:${c.text} px-2 py-1 rounded motion-safe:transition-colors`}
        >
          {lang === "en" ? "CZ" : "EN"}
        </button>
        <button
          onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
          className={`${c.muted} hover:${c.text} p-1.5 rounded motion-safe:transition-colors`}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? Icons.sun : Icons.moon}
        </button>
      </nav>

      {/* Slide Indicators */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`h-2 rounded-full motion-safe:transition-all duration-500 ${
              currentSlide === i
                ? `w-8 ${c.accentBg}`
                : `w-2 ${theme === "dark" ? "bg-white/20" : "bg-black/20"} hover:${theme === "dark" ? "bg-white/40" : "bg-black/40"}`
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      {currentSlide > 0 && (
        <button
          onClick={prevSlide}
          className={`fixed left-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full border ${c.border} ${c.card} ${c.muted} hover:${c.text} hover:border-[#ffe0c2]/30 motion-safe:transition-all`}
          aria-label="Previous slide"
        >
          {Icons.chevronLeft}
        </button>
      )}
      {currentSlide < TOTAL_SLIDES - 1 && (
        <button
          onClick={nextSlide}
          className={`fixed right-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full border ${c.border} ${c.card} ${c.muted} hover:${c.text} hover:border-[#ffe0c2]/30 motion-safe:transition-all`}
          aria-label="Next slide"
        >
          {Icons.chevronRight}
        </button>
      )}

      {/* Slides Container */}
      <div
        className="flex h-full motion-safe:transition-transform duration-700 ease-out"
        style={{
          width: `${TOTAL_SLIDES * 100}vw`,
          transform: `translateX(-${currentSlide * 100}vw)`,
        }}
      >
        {/* SLIDE 1: Hero */}
        <section className="w-screen h-screen flex-shrink-0 flex items-center justify-center px-6 py-20">
          <div className="max-w-6xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className={`motion-safe:transition-all duration-700 ${currentSlide === 0 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`} style={{ transitionDelay: "200ms" }}>
                <div className={`inline-block px-3 py-1 rounded-full text-xs ${c.muted} border ${c.border} mb-6`}>
                  {t.hero.tag}
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-4">
                  {t.hero.title}<br />
                  <span className={`bg-gradient-to-r ${c.accentGradient} bg-clip-text text-transparent`}>
                    {t.hero.titleHighlight}
                  </span>
                </h1>

                <p className={`text-lg ${c.muted} mb-8 max-w-md`}>
                  {t.hero.subtitle}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-3 mb-10">
                  <Button
                    onClick={nextSlide}
                    size="lg"
                    className={`${theme === "dark" ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90"} rounded-full h-12 px-8 gap-2 text-base font-semibold group`}
                  >
                    {t.hero.cta}
                    <span className="motion-safe:group-hover:translate-x-1 motion-safe:transition-transform">
                      {Icons.arrowRight}
                    </span>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className={`border ${c.border} bg-transparent rounded-full h-12 px-6 gap-2 ${c.muted}`}
                  >
                    <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                      {Icons.github}
                      {t.hero.source}
                    </a>
                  </Button>
                </div>

                {/* Features */}
                <ul className="space-y-2">
                  {t.features.map((f, i) => (
                    <li key={i} className={`flex items-center gap-2 text-sm ${c.muted}`}>
                      <span className={c.accent}>{Icons.check}</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Stats */}
                <div className={`flex gap-10 mt-10 pt-8 border-t ${c.border}`}>
                  {t.stats.map((s, i) => (
                    <div key={i}>
                      <div className={`text-3xl font-bold ${c.accent} tabular-nums`}>{s.value}</div>
                      <div className={`text-sm ${c.muted}`}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right - Product Image */}
              <div className={`motion-safe:transition-all duration-700 ${currentSlide === 0 ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-8 scale-95"}`} style={{ transitionDelay: "400ms" }}>
                <div className={`relative overflow-hidden rounded-[5px] shadow-2xl ${theme === "dark" ? "shadow-black/50" : "shadow-black/10"} lg:scale-125`}>
                  <img
                    src="/images/main_image.png"
                    alt="ZooDB"
                    width={1000}
                    height={750}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 2: Download */}
        <section className="w-screen h-screen flex-shrink-0 flex items-center justify-center px-6 py-20">
          <div className="max-w-6xl mx-auto w-full">
            <div className={`motion-safe:transition-all duration-700 ${currentSlide === 1 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`} style={{ transitionDelay: "200ms" }}>
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                {/* Left - Download Info */}
                <div>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs ${c.muted} border ${c.border} mb-6`}>
                    {t.download.ready}
                  </div>

                  <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-4">
                    {t.download.title}<br />
                    <span className={`bg-gradient-to-r ${c.accentGradient} bg-clip-text text-transparent`}>
                      {currentPlatform.name}
                    </span>
                  </h2>

                  <p className={`text-lg ${c.muted} mb-8 max-w-md`}>
                    {t.footer.slogan}
                  </p>

                  {/* Download Button */}
                  <div className="flex flex-wrap gap-3 mb-10">
                    <Button
                      asChild
                      size="lg"
                      className={`${theme === "dark" ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90"} rounded-full h-12 px-8 gap-2 text-base font-semibold`}
                    >
                      <a href={DOWNLOAD_LINKS[userOS]}>
                        {Icons.download}
                        {t.download.cta}
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className={`border ${c.border} bg-transparent rounded-full h-12 px-6 gap-2 ${c.muted}`}
                    >
                      <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                        {Icons.github}
                        {t.footer.openSource}
                      </a>
                    </Button>
                  </div>

                  {/* Requirements as checklist */}
                  <ul className="space-y-2 mb-10">
                    {currentPlatform.reqs.map((req, i) => (
                      <li key={i} className={`flex items-center gap-2 text-sm ${c.muted}`}>
                        <span className={c.accent}>{Icons.check}</span>
                        {req}
                      </li>
                    ))}
                    {version && (
                      <li className={`flex items-center gap-2 text-sm ${c.muted}`}>
                        <span className={c.accent}>{Icons.tag}</span>
                        {version}
                      </li>
                    )}
                  </ul>

                  {/* Other Platforms */}
                  <div className={`flex gap-6 pt-8 border-t ${c.border}`}>
                    {otherPlatforms.map(p => (
                      <a
                        key={p}
                        href={DOWNLOAD_LINKS[p]}
                        className={`flex items-center gap-2 text-sm ${c.muted} hover:${c.text} motion-safe:transition-colors`}
                      >
                        <span className="opacity-60">{platformIcons[p]}</span>
                        {t.download.platforms[p].name}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Right - Features Card */}
                <div className={`motion-safe:transition-all duration-700 ${currentSlide === 1 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`} style={{ transitionDelay: "400ms" }}>
                  <div className={`rounded-2xl border ${c.border} p-8 ${c.card}`}>
                    <h3 className={`text-lg font-semibold mb-6`}>{t.download.whatsIncluded}</h3>
                    <div className="space-y-5">
                      {t.download.included.map((item, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <div className={`${c.accent} mt-0.5`}>
                            {includedIcons[item.icon]}
                          </div>
                          <span className={`${c.muted} text-sm leading-relaxed`}>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className={`flex items-center justify-center gap-6 mt-16 pt-10 border-t ${c.border}`}>
                <span className="font-bold">ZooDB</span>
                <span className={`text-sm ${c.muted}`}>{t.footer.slogan}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
