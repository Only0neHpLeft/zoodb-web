import { memo, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";
import type { SlideProps } from "./types";

interface HeroSlideProps extends SlideProps {
  onNext: () => void;
  translations: {
    hero: { tag: string; title: string; titleHighlight: string; subtitle: string; cta: string; source: string };
    stats: { value: string; label: string }[];
    features: string[];
  };
}

export const HeroSlide = memo(function HeroSlide({
  isActive,
  prefersReducedMotion,
  theme,
  onNext,
  translations: t,
}: HeroSlideProps) {
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
    isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
  );

  return (
    <section className="w-screen h-screen flex-shrink-0 flex items-center justify-center px-6 py-20">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div
            className={slideClasses}
            style={{ transitionDelay: prefersReducedMotion ? "0ms" : "200ms" }}
          >
            <div className={cn("inline-block px-3 py-1 rounded-full text-xs border mb-6", c.muted, c.border)}>
              {t.hero.tag}
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-4">
              {t.hero.title}
              <br />
              <span className={cn("bg-gradient-to-r", c.accentGradient, "bg-clip-text text-transparent")}>
                {t.hero.titleHighlight}
              </span>
            </h1>

            <p className={cn("text-lg mb-8 max-w-md", c.muted)}>{t.hero.subtitle}</p>

            {/* CTA Button */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Button
                onClick={onNext}
                size="lg"
                className={cn(
                  "rounded-full h-12 px-8 gap-2 text-base font-semibold group",
                  theme === "dark"
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-black text-white hover:bg-black/90"
                )}
              >
                {t.hero.cta}
                <span className="motion-safe:group-hover:translate-x-1 motion-safe:transition-transform">
                  {Icons.arrowRight}
                </span>
              </Button>
            </div>

            {/* Features */}
            <ul className="space-y-2">
              {t.features.map((f, i) => (
                <li key={i} className={cn("flex items-center gap-2 text-sm", c.muted)}>
                  <span className={c.accent}>{Icons.check}</span>
                  {f}
                </li>
              ))}
            </ul>

            {/* Stats */}
            <div className={cn("flex gap-10 mt-10 pt-8 border-t", c.border)}>
              {t.stats.map((s, i) => (
                <div key={i}>
                  <div className={cn("text-3xl font-bold tabular-nums", c.accent)}>{s.value}</div>
                  <div className={cn("text-sm", c.muted)}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Product Image */}
          <div
            className={cn(
              slideClasses,
              isActive ? "scale-100" : "scale-95"
            )}
            style={{ transitionDelay: prefersReducedMotion ? "0ms" : "400ms" }}
          >
            <div
              className={cn(
                "relative overflow-hidden rounded-[5px] shadow-2xl lg:scale-125",
                theme === "dark" ? "shadow-black/50" : "shadow-black/10"
              )}
            >
              <img
                src="/images/main_image.png"
                alt="ZooDB application interface showing SQL learning environment"
                width={1000}
                height={750}
                className="w-full h-auto"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
