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
      platforms: Record<string, { name: string; file: string; reqs: string[] }>;
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
      bg: theme === "dark" ? "bg-[#0a0a0a]" : "bg-[#fafafa]",
      text: theme === "dark" ? "text-[#fafafa]" : "text-[#0a0a0a]",
      muted: theme === "dark" ? "text-[#888]" : "text-[#666]",
      border: theme === "dark" ? "border-white/10" : "border-black/10",
      accent: theme === "dark" ? "text-[#ffe0c2]" : "text-[#b8845c]",
      accentGradient: theme === "dark" ? "from-[#ffe0c2] to-[#ffb380]" : "from-[#b8845c] to-[#8b6346]",
    }),
    [theme]
  );

  const slideClasses = cn(
    "motion-safe:transition-all",
    !prefersReducedMotion && "duration-700",
    isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
  );

  const currentPlatform = t.download.platforms[userOS];
  const otherPlatforms = (Object.keys(t.download.platforms) as Platform[]).filter((p) => p !== userOS);

  return (
    <section className="w-screen h-screen flex-shrink-0 flex items-center justify-center px-6 py-20">
      <div className="max-w-6xl mx-auto w-full">
        <div
          className={cn(slideClasses, "grid lg:grid-cols-2 gap-16 items-center")}
          style={{ transitionDelay: prefersReducedMotion ? "0ms" : "200ms" }}
        >
          {/* Left - Download Info */}
          <div>
            <div className={cn("inline-block px-3 py-1 rounded-full text-xs border mb-6", c.muted, c.border)}>
              {t.download.ready}
            </div>

            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-4">
              {t.download.title}
              <br />
              <span className={cn("bg-gradient-to-r", c.accentGradient, "bg-clip-text text-transparent")}>
                {currentPlatform.name}
              </span>
            </h2>

            <p className={cn("text-lg mb-8 max-w-md", c.muted)}>{t.footer.slogan}</p>

            {/* Download Button */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Button
                size="lg"
                onClick={() => {
                  onTrackDownload(userOS, "button");
                  window.location.href = downloadLinks[userOS];
                }}
                className={cn(
                  "rounded-full h-12 px-8 gap-2 text-base font-semibold",
                  theme === "dark"
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-black text-white hover:bg-black/90"
                )}
              >
                {Icons.download}
                {t.download.cta}
              </Button>
            </div>

            {/* Version Badge */}
            {version && (
              <div className="mb-6">
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border",
                  c.border,
                  c.accent,
                  theme === "dark" ? "bg-[#ffe0c2]/10" : "bg-[#b8845c]/10"
                )}>
                  {Icons.tag}
                  {version}
                </span>
              </div>
            )}

            {/* Requirements with File Sizes */}
            <ul className="space-y-2 mb-6">
              {currentPlatform.reqs.map((req, i) => (
                <li key={i} className={cn("flex items-center gap-2 text-sm", c.muted)}>
                  <span className={c.accent}>{Icons.check}</span>
                  {req}
                </li>
              ))}
              <li className={cn("flex items-center gap-2 text-sm", c.muted)}>
                <span className={c.accent}>{Icons.download}</span>
                {sizesLoading ? (
                  <Skeleton className="w-16 h-4" />
                ) : fileSizes[userOS] ? (
                  <span>Size: {fileSizes[userOS]}</span>
                ) : (
                  <span>Size: ~30MB</span>
                )}
              </li>
            </ul>

            {/* Other Platforms */}
            <div className={cn("flex gap-6 pt-8 border-t", c.border)}>
              {otherPlatforms.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    onTrackDownload(p, "link");
                    window.location.href = downloadLinks[p];
                  }}
                  className={cn(
                    "flex items-center gap-2 text-sm motion-safe:transition-colors cursor-pointer",
                    c.muted
                  )}
                >
                  <span className="opacity-60">{PLATFORM_ICONS[p]}</span>
                  {t.download.platforms[p].name}
                </button>
              ))}
            </div>
          </div>

          {/* Right - Features Card */}
          <div
            className={cn(slideClasses, !prefersReducedMotion && "motion-safe:transition-all duration-700")}
            style={{ transitionDelay: prefersReducedMotion ? "0ms" : "400ms" }}
          >
            <div className="space-y-5">
              <h3 className={cn("text-sm font-medium uppercase tracking-wider", c.muted)}>
                {t.download.whatsIncluded}
              </h3>

              <div className="space-y-4">
                {t.download.included.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className={c.accent}>{INCLUDED_ICONS[item.icon]}</span>
                    <span className={cn(c.muted, "text-sm")}>{item.text}</span>
                  </div>
                ))}
              </div>


            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={cn("flex items-center justify-center gap-6 mt-16 pt-10 border-t", c.border)}>
          <span className="font-bold">ZooDB</span>
          <span className={cn("text-sm", c.muted)}>{t.footer.slogan}</span>
        </div>
      </div>
    </section>
  );
});
