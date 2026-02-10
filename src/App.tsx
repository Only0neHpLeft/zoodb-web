import { useState, useEffect, useCallback, useRef, memo } from "react";
import { Icons } from "@/lib/icons";
import { SEO } from "@/components/seo";
import { CommandPalette, useCommandPaletteShortcut } from "@/components/command-palette";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";

import { HeroSlide, DownloadSlide } from "@/components/slides";
import { useSlideNavigation } from "@/hooks/use-slide-navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGitHubVersion } from "@/hooks/use-github-version";
import { useReleaseAssets } from "@/hooks/use-release-assets";
import { useOSDetection, type Platform } from "@/hooks/use-os-detection";
import { useTheme } from "@/hooks/use-theme";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useAnalytics } from "@/hooks/use-analytics";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const RELEASES_FALLBACK = "https://github.com/Only0neHpLeft/zoodb-app/releases/latest";
const DEFAULT_DOWNLOAD_LINKS: Record<Platform, string> = {
  windows: RELEASES_FALLBACK,
  macos: RELEASES_FALLBACK,
  linux: RELEASES_FALLBACK,
};


const TOTAL_SLIDES = 2;

// Translations
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
        { icon: "shield", text: "Your progress saved locally, always private" },
        { icon: "certificate", text: "Certificate upon completion" },
      ],
      platforms: {
        windows: { name: "Windows", file: ".exe" },
        macos: { name: "macOS", file: ".dmg" },
        linux: { name: "Linux", file: ".AppImage" },
      },
      versionLabel: "Version",
      sizeLabel: "Size",
      desktopLabel: "ZooDB for desktop.",
      desktopSubtitle: "Windows, macOS and Linux.",
    },

    features: [
      "Real zoo database included",
      "Works completely offline",
      "Instant feedback on queries",
      "Progress tracking & certificates",
    ],
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
        { icon: "shield", text: "Váš pokrok uložen lokálně, vždy soukromý" },
        { icon: "certificate", text: "Certifikát po dokončení" },
      ],
      platforms: {
        windows: { name: "Windows", file: ".exe" },
        macos: { name: "macOS", file: ".dmg" },
        linux: { name: "Linux", file: ".AppImage" },
      },
      versionLabel: "Verze",
      sizeLabel: "Velikost",
      desktopLabel: "ZooDB pro desktop.",
      desktopSubtitle: "Windows, macOS a Linux.",
    },

    features: [
      "Reálná databáze zoo v ceně",
      "Funguje zcela offline",
      "Okamžitá zpětná vazba",
      "Sledování pokroku & certifikáty",
    ],
    footer: {
      slogan: "Od dotazů k sebedůvěře.",
      openSource: "Open Source",
    },
  },
};

type Language = "en" | "cz";

// Color scheme hook
function useColorScheme(theme: "dark" | "light") {
  return {
    bg: theme === "dark" ? "bg-[#0a0a0a]" : "bg-[#fafafa]",
    text: theme === "dark" ? "text-[#fafafa]" : "text-[#0a0a0a]",
    muted: theme === "dark" ? "text-[#888]" : "text-[#666]",
    border: theme === "dark" ? "border-white/10" : "border-black/10",
    card: theme === "dark" ? "bg-white/[0.03]" : "bg-black/[0.03]",
    accent: theme === "dark" ? "text-[#ffe0c2]" : "text-[#b8845c]",
    accentBg: theme === "dark" ? "bg-[#ffe0c2]" : "bg-[#b8845c]",
    accentGradient: theme === "dark" ? "from-[#ffe0c2] to-[#ffb380]" : "from-[#b8845c] to-[#8b6346]",
  };
}

// Slide indicators component
const SlideIndicators = memo(function SlideIndicators({
  totalSlides,
  currentSlide,
  onSlideChange,
  accentBg,
  theme,
}: {
  totalSlides: number;
  currentSlide: number;
  onSlideChange: (index: number) => void;
  accentBg: string;
  theme: "dark" | "light";
}) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
      {Array.from({ length: totalSlides }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSlideChange(i)}
          className={cn(
            "h-2 rounded-full motion-safe:transition-all duration-500",
            currentSlide === i
              ? cn("w-8", accentBg)
              : cn("w-2", theme === "dark" ? "bg-white/20 hover:bg-white/40" : "bg-black/20 hover:bg-black/40")
          )}
          aria-label={`Go to slide ${i + 1}`}
          aria-current={currentSlide === i ? "true" : undefined}
        />
      ))}
    </div>
  );
});

// Navigation arrows component
const NavigationArrows = memo(function NavigationArrows({
  currentSlide,
  totalSlides,
  onPrev,
  onNext,
  borderClass,
  cardClass,
  mutedClass,
}: {
  currentSlide: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
  borderClass: string;
  cardClass: string;
  mutedClass: string;
}) {
  return (
    <div className="hidden md:contents">
      {currentSlide > 0 && (
        <button
          onClick={onPrev}
          className={cn(
            "fixed left-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full border motion-safe:transition-all",
            borderClass,
            cardClass,
            mutedClass,
            "hover:text-[#ffe0c2] hover:border-[#ffe0c2]/30"
          )}
          aria-label="Previous slide"
        >
          {Icons.chevronLeft}
        </button>
      )}
      {currentSlide < totalSlides - 1 && (
        <button
          onClick={onNext}
          className={cn(
            "fixed right-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full border motion-safe:transition-all",
            borderClass,
            cardClass,
            mutedClass,
            "hover:text-[#ffe0c2] hover:border-[#ffe0c2]/30"
          )}
          aria-label="Next slide"
        >
          {Icons.chevronRight}
        </button>
      )}
    </div>
  );
});

// Language toggle
const LanguageToggle = memo(function LanguageToggle({
  lang,
  onToggle,
  mutedClass,
}: {
  lang: Language;
  onToggle: () => void;
  mutedClass: string;
}) {
  return (
    <button
      onClick={onToggle}
      className={cn("text-sm px-2 py-1 rounded motion-safe:transition-colors", mutedClass)}
      aria-label={`Switch to ${lang === "en" ? "Czech" : "English"}`}
    >
      {lang === "en" ? "CZ" : "EN"}
    </button>
  );
});

// Theme toggle
const ThemeToggle = memo(function ThemeToggle({
  theme,
  onToggle,
  mutedClass,
}: {
  theme: "dark" | "light";
  onToggle: () => void;
  mutedClass: string;
}) {
  return (
    <button
      onClick={onToggle}
      className={cn("p-1.5 rounded motion-safe:transition-colors", mutedClass)}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? Icons.sun : Icons.moon}
    </button>
  );
}
);

// Command palette button
const CommandPaletteButton = memo(function CommandPaletteButton({
  onClick,
  theme,
  lang,
}: {
  onClick: () => void;
  theme: "dark" | "light";
  lang: Language;
}) {
  const c = useColorScheme(theme);
  const isMac = typeof navigator !== "undefined" && navigator.platform.includes("Mac");

  return (
    <button
      onClick={onClick}
      className={cn(
        "hidden sm:flex items-center gap-1.5 px-2 py-1.5 rounded text-xs border motion-safe:transition-colors",
        c.border,
        c.muted,
        "hover:text-[#ffe0c2] hover:border-[#ffe0c2]/30"
      )}
      aria-label={lang === "en" ? "Open command palette" : "Otevřít příkazovou paletu"}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <kbd className="font-mono">{isMac ? "⌘" : "Ctrl"}</kbd>
      <kbd className="font-mono">K</kbd>
    </button>
  );
});

// Main App
export default function App() {
  const [lang, setLang] = useState<Language>("en");
  const { theme, toggleTheme } = useTheme();
  const userOS = useOSDetection();
  const prefersReducedMotion = useReducedMotion();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const { stats, trackDownload, clearAnalytics, visitCount } = useAnalytics();

  const { version } = useGitHubVersion({
    owner: "Only0neHpLeft",
    repo: "zoodb-app",
  });

  const { currentSlide, goToSlide, nextSlide, prevSlide } = useSlideNavigation({
    totalSlides: TOTAL_SLIDES,
    transitionDuration: prefersReducedMotion ? 0 : 700,
  });

  const isMobile = useIsMobile();
  const [showSwipeHint, setShowSwipeHint] = useState(false);

  // On mobile, play a brief leftward bounce to hint that swiping works
  useEffect(() => {
    if (!isMobile || prefersReducedMotion || currentSlide !== 0) return;
    const timer = setTimeout(() => setShowSwipeHint(true), 1200);
    const reset = setTimeout(() => setShowSwipeHint(false), 1800);
    return () => { clearTimeout(timer); clearTimeout(reset); };
  }, [isMobile, prefersReducedMotion, currentSlide]);

  const touchStartX = useRef<number | null>(null);
  const t = translations[lang];
  const c = useColorScheme(theme);

  // Command palette commands
  const commands = useState(() => [
    { id: "go-home", label: lang === "en" ? "Go to Home" : "Přejít na domovskou stránku", shortcut: "1", icon: Icons.check, action: () => goToSlide(0) },
    { id: "go-download", label: lang === "en" ? "Go to Download" : "Přejít na stažení", shortcut: "2", icon: Icons.download, action: () => goToSlide(1) },
    { id: "toggle-theme", label: lang === "en" ? `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode` : `Přepnout na ${theme === "dark" ? "světlý" : "tmavý"} režim`, shortcut: "T", icon: theme === "dark" ? Icons.sun : Icons.moon, action: () => { toggleTheme(); toast.success(lang === "en" ? `Switched to ${theme === "dark" ? "light" : "dark"} mode` : `Přepnuto na ${theme === "dark" ? "světlý" : "tmavý"} režim`); } },
    { id: "toggle-language", label: lang === "en" ? "Switch to Czech" : "Přepnout do angličtiny", shortcut: "L", icon: Icons.tag, action: () => { setLang(l => l === "en" ? "cz" : "en"); toast.success(lang === "en" ? "Switched to Czech" : "Přepnuto do angličtiny"); } },
    { id: "download", label: lang === "en" ? `Download for ${t.download.platforms[userOS].name}` : `Stáhnout pro ${t.download.platforms[userOS].name}`, shortcut: "D", icon: Icons.download, action: () => { trackDownload(userOS, "command"); window.location.href = downloadLinks[userOS]; toast.success(lang === "en" ? "Download started" : "Stahování zahájeno"); } },
    { id: "analytics", label: lang === "en" ? "View Analytics" : "Zobrazit analytiku", shortcut: "A", icon: Icons.database, action: () => setIsAnalyticsOpen(true) },
  ])[0];

  useCommandPaletteShortcut(() => setIsCommandPaletteOpen(true));

  const isAnyModalOpen = isCommandPaletteOpen || isAnalyticsOpen;

  // Keyboard navigation
  useEffect(() => {
    if (isAnyModalOpen) return;
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
  }, [nextSlide, prevSlide, isAnyModalOpen]);

  // Touch/swipe support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isAnyModalOpen) return;
    touchStartX.current = e.touches[0].clientX;
  }, [isAnyModalOpen]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (isAnyModalOpen || touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  }, [nextSlide, prevSlide, isAnyModalOpen]);

  // Mouse wheel + trackpad horizontal swipe
  useEffect(() => {
    if (isAnyModalOpen) return;
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 30) {
        // Horizontal trackpad swipe – prevent browser back/forward
        e.preventDefault();
        if (e.deltaX > 0) nextSlide();
        else prevSlide();
      } else if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && Math.abs(e.deltaY) > 30) {
        // Vertical scroll
        if (e.deltaY > 0) nextSlide();
        else prevSlide();
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [nextSlide, prevSlide, isAnyModalOpen]);

  const toggleLang = useCallback(() => setLang(l => l === "en" ? "cz" : "en"), []);

  // Fetch release assets sizes and download URLs
  const { sizes: fileSizes, urls: releaseUrls, isLoading: sizesLoading } = useReleaseAssets();
  const downloadLinks = sizesLoading ? DEFAULT_DOWNLOAD_LINKS : releaseUrls;

  return (
    <>
      <SEO lang={lang} />
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        commands={commands}
        theme={theme}
      />
      <AnalyticsDashboard
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        stats={stats}
        visitCount={visitCount}
        onClear={clearAnalytics}
        theme={theme}
        lang={lang}
      />

      <div
        className={cn("h-screen w-screen overflow-hidden", c.bg, c.text, isAnyModalOpen && "pointer-events-none")}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Nav */}
        <nav className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <LanguageToggle lang={lang} onToggle={toggleLang} mutedClass={c.muted} />
          <ThemeToggle theme={theme} onToggle={toggleTheme} mutedClass={c.muted} />
          <CommandPaletteButton onClick={() => setIsCommandPaletteOpen(true)} theme={theme} lang={lang} />
        </nav>

        <SlideIndicators
          totalSlides={TOTAL_SLIDES}
          currentSlide={currentSlide}
          onSlideChange={goToSlide}
          accentBg={c.accentBg}
          theme={theme}
        />

        <NavigationArrows
          currentSlide={currentSlide}
          totalSlides={TOTAL_SLIDES}
          onPrev={prevSlide}
          onNext={nextSlide}
          borderClass={c.border}
          cardClass={c.card}
          mutedClass={c.muted}
        />

        {/* Slides */}
        <div
          className={cn("flex h-full ease-out", !prefersReducedMotion && "motion-safe:transition-transform duration-700")}
          style={{
            width: `${TOTAL_SLIDES * 100}vw`,
            transform: `translateX(calc(-${currentSlide * 100}vw${showSwipeHint ? " - 40px" : ""}))`,
          }}
        >
          <HeroSlide
            isActive={currentSlide === 0}
            prefersReducedMotion={prefersReducedMotion}
            theme={theme}
            lang={lang}
            onNext={nextSlide}
            translations={t}
          />

          <DownloadSlide
            isActive={currentSlide === 1}
            prefersReducedMotion={prefersReducedMotion}
            theme={theme}
            lang={lang}
            onPrev={prevSlide}
            onNext={nextSlide}
            onTrackDownload={trackDownload}
            translations={t}
            userOS={userOS}
            downloadLinks={downloadLinks}
            version={version}
            fileSizes={fileSizes}
            sizesLoading={sizesLoading}
          />


        </div>
      </div>
    </>
  );
}
