import { memo, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/lib/icons";
import type { Platform } from "@/hooks/use-os-detection";
import type { SlideProps } from "./types";

interface DownloadSlideProps extends SlideProps {
  onPrev: () => void;
  onNext: () => void;
  onTrackDownload: (platform: Platform, source: "button" | "link") => void;
  translations: {
    download: {
      title: string;
      cta: string;
      otherPlatforms: string;
      whatsIncluded: string;
      ready: string;
      included: { icon: string; text: string }[];
      platforms: Record<string, { name: string; file: string }>;
      versionLabel: string;
      sizeLabel: string;
      desktopLabel: string;
      desktopSubtitle: string;
    };
    footer: { slogan: string; openSource: string };
  };
  userOS: Platform;
  downloadLinks: Record<Platform, string>;
  version: string | null;
  fileSizes: Record<Platform, string>;
  sizesLoading: boolean;
}

const INCLUDED_ICONS: Record<string, React.ReactNode> = {
  database: Icons.database,
  zap: Icons.zap,
  shield: Icons.shield,
  certificate: Icons.certificate,
};

const PLATFORM_ICONS: Record<Platform, React.ReactNode> = {
  windows: Icons.windows,
  macos: Icons.apple,
  linux: Icons.linux,
};

const ALL_PLATFORMS: Platform[] = ["windows", "macos", "linux"];

export const DownloadSlide = memo(function DownloadSlide({
  isActive,
  prefersReducedMotion,
  theme,
  onTrackDownload,
  translations: t,
  userOS,
  downloadLinks,
  version,
  fileSizes,
  sizesLoading,
}: DownloadSlideProps) {
  const c = useMemo(
    () => ({
      muted: theme === "dark" ? "text-[#888]" : "text-[#666]",
      mutedFaint: theme === "dark" ? "text-[#555]" : "text-[#aaa]",
      border: theme === "dark" ? "border-white/10" : "border-black/10",
      accent: theme === "dark" ? "text-[#ffe0c2]" : "text-[#b8845c]",
      accentGradient: theme === "dark" ? "from-[#ffe0c2] to-[#ffb380]" : "from-[#b8845c] to-[#8b6346]",
    }),
    [theme]
  );

  const slideClasses = cn(
    "motion-safe:transition-all",
    !prefersReducedMotion && "duration-700",
    isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
  );

  const currentPlatform = t.download.platforms[userOS];

  return (
    <section className="w-screen h-screen flex-shrink-0 flex items-center justify-center px-6">
      <div
        className={cn(slideClasses, "flex flex-col items-center w-full max-w-2xl")}
        style={{ transitionDelay: prefersReducedMotion ? "0ms" : "200ms" }}
      >
        {/* ── Hero area ── */}
        <div className="flex flex-col items-center text-center">
          {/* Tag */}
          <span className={cn("text-xs tracking-widest uppercase mb-5", c.accent)}>
            {t.download.ready}
          </span>

          {/* Title */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-3">
            {t.download.title}{" "}
            <span className={cn("bg-gradient-to-r", c.accentGradient, "bg-clip-text text-transparent")}>
              {currentPlatform.name}
            </span>
          </h2>

          {/* Subtitle */}
          <p className={cn("text-sm lg:text-base mb-8", c.muted)}>
            {t.download.desktopSubtitle}
          </p>

          {/* Primary CTA */}
          <Button
            size="lg"
            onClick={() => {
              onTrackDownload(userOS, "button");
              window.location.href = downloadLinks[userOS];
            }}
            className={cn(
              "rounded-full h-12 px-8 gap-2.5 text-sm font-semibold",
              theme === "dark"
                ? "bg-white text-black hover:bg-white/90"
                : "bg-black text-white hover:bg-black/90"
            )}
          >
            {PLATFORM_ICONS[userOS]}
            {t.download.cta}
          </Button>

          {/* Version & Size */}
          <div className={cn("flex items-center gap-3 mt-4 text-xs", c.mutedFaint)}>
            {version ? (
              <span>{version}</span>
            ) : (
              <Skeleton className="w-12 h-3.5" />
            )}
            <span>·</span>
            {sizesLoading ? (
              <Skeleton className="w-12 h-3.5" />
            ) : fileSizes[userOS] ? (
              <span>{fileSizes[userOS]}</span>
            ) : null}
          </div>
        </div>

        {/* ── Divider ── */}
        <div className={cn("w-full border-t mt-10 mb-8", c.border)} />

        {/* ── Platform table ── */}
        <div
          className={cn(
            "w-full",
            "motion-safe:transition-all",
            !prefersReducedMotion && "duration-700",
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: prefersReducedMotion ? "0ms" : "400ms" }}
        >
          {/* Section heading */}
          <div className="mb-5">
            <h3 className="text-lg font-semibold">{t.download.desktopLabel}</h3>
            <p className={cn("text-sm", c.muted)}>{t.download.desktopSubtitle}</p>
          </div>

          {/* Platform rows */}
          <div className={cn("divide-y", c.border)}>
            {ALL_PLATFORMS.map((p) => (
              <div
                key={p}
                className="flex items-center justify-between py-3.5"
              >
                <div className="flex items-center gap-3">
                  <span className={c.muted}>{PLATFORM_ICONS[p]}</span>
                  <span className="text-sm font-medium">
                    {t.download.platforms[p].name}
                  </span>
                  <span className={cn("text-xs", c.mutedFaint)}>
                    {t.download.platforms[p].file}
                  </span>
                  {sizesLoading ? (
                    <Skeleton className="w-10 h-3.5 ml-1" />
                  ) : fileSizes[p] ? (
                    <span className={cn("text-xs", c.mutedFaint)}>{fileSizes[p]}</span>
                  ) : null}
                </div>
                <button
                  onClick={() => {
                    onTrackDownload(p, p === userOS ? "button" : "link");
                    window.location.href = downloadLinks[p];
                  }}
                  className={cn(
                    "text-xs font-medium px-4 py-1.5 rounded-full border motion-safe:transition-colors cursor-pointer",
                    c.border,
                    p === userOS ? c.accent : c.muted,
                    "hover:border-current"
                  )}
                >
                  {Icons.download}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Features row ── */}
        <div
          className={cn(
            "grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2.5 mt-10 w-full text-xs",
            c.muted,
            "motion-safe:transition-all",
            !prefersReducedMotion && "duration-700",
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: prefersReducedMotion ? "0ms" : "600ms" }}
        >
          {t.download.included.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={cn("flex-shrink-0 opacity-50", c.accent)}>{INCLUDED_ICONS[item.icon]}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        <div className={cn("flex items-center gap-2 mt-8", c.mutedFaint, "text-xs")}>
          <span className="font-semibold">ZooDB</span>
          <span>·</span>
          <span>{t.footer.slogan}</span>
        </div>
      </div>
    </section>
  );
});
