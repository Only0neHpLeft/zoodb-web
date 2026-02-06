import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/lib/icons";
import type { Platform } from "@/hooks/use-os-detection";
import { formatNumber } from "@/hooks/use-analytics";
import { Button } from "@/components/ui/button";

interface AnalyticsStats {
  totalDownloads: number;
  byPlatform: Record<Platform, number>;
  bySource: Record<"button" | "link" | "command", number>;
  todayDownloads: number;
  weekDownloads: number;
  monthDownloads: number;
}

interface AnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  stats: AnalyticsStats;
  visitCount: number;
  onClear: () => void;
  theme: "dark" | "light";
  lang: "en" | "cz";
}

const PLATFORM_NAMES: Record<Platform, string> = {
  windows: "Windows",
  macos: "macOS",
  linux: "Linux",
};

const PLATFORM_ICONS: Record<Platform, React.ReactNode> = {
  windows: Icons.windows,
  macos: Icons.apple,
  linux: Icons.linux,
};

export function AnalyticsDashboard({
  isOpen,
  onClose,
  stats,
  visitCount,
  onClear,
  theme,
  lang,
}: AnalyticsDashboardProps) {
  const c = useMemo(
    () => ({
      bg: theme === "dark" ? "bg-[#0a0a0a]" : "bg-[#fafafa]",
      text: theme === "dark" ? "text-[#fafafa]" : "text-[#0a0a0a]",
      muted: theme === "dark" ? "text-[#888]" : "text-[#666]",
      border: theme === "dark" ? "border-white/10" : "border-black/10",
      card: theme === "dark" ? "bg-white/[0.03]" : "bg-black/[0.03]",
      accent: theme === "dark" ? "text-[#ffe0c2]" : "text-[#b8845c]",
      accentBg: theme === "dark" ? "bg-[#ffe0c2]" : "bg-[#b8845c]",
    }),
    [theme]
  );

  const t = {
    en: {
      title: "Download Analytics",
      subtitle: "Privacy-friendly local statistics",
      total: "Total Downloads",
      today: "Today",
      thisWeek: "This Week",
      thisMonth: "This Month",
      byPlatform: "By Platform",
      bySource: "By Source",
      visits: "Your Visits",
      clear: "Clear Data",
      close: "Close",
      noData: "No downloads yet",
      source: {
        button: "Button",
        link: "Link",
        command: "Command",
      },
    },
    cz: {
      title: "Analytika stažení",
      subtitle: "Respektující soukromí lokální statistiky",
      total: "Celkem stažení",
      today: "Dnes",
      thisWeek: "Tento týden",
      thisMonth: "Tento měsíc",
      byPlatform: "Podle platformy",
      bySource: "Podle zdroje",
      visits: "Vaše návštěvy",
      clear: "Smazat data",
      close: "Zavřít",
      noData: "Zatím žádná stažení",
      source: {
        button: "Tlačítko",
        link: "Odkaz",
        command: "Příkaz",
      },
    },
  }[lang];

  if (!isOpen) return null;

  const hasDownloads = stats.totalDownloads > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={cn(
          "relative w-full max-w-2xl max-h-[85vh] overflow-auto rounded-2xl shadow-2xl border",
          c.bg,
          c.border
        )}
        role="dialog"
        aria-modal="true"
        aria-label={t.title}
      >
        {/* Header */}
        <div className={cn("flex items-center justify-between p-6 border-b", c.border)}>
          <div>
            <h2 className={cn("text-xl font-semibold", c.text)}>{t.title}</h2>
            <p className={cn("text-sm", c.muted)}>{t.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className={cn("p-2 rounded-lg motion-safe:transition-colors", c.muted, "hover:bg-white/5")}
            aria-label={t.close}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              label={t.total}
              value={formatNumber(stats.totalDownloads)}
              icon={Icons.download}
              theme={theme}
            />
            <StatCard
              label={t.today}
              value={formatNumber(stats.todayDownloads)}
              icon={Icons.check}
              theme={theme}
            />
            <StatCard
              label={t.thisWeek}
              value={formatNumber(stats.weekDownloads)}
              icon={Icons.arrowRight}
              theme={theme}
            />
            <StatCard
              label={t.visits}
              value={formatNumber(visitCount)}
              icon={Icons.tag}
              theme={theme}
            />
          </div>

          {hasDownloads ? (
            <>
              {/* Platform Breakdown */}
              <div>
                <h3 className={cn("text-sm font-medium mb-4", c.muted)}>{t.byPlatform}</h3>
                <div className="space-y-3">
                  {(Object.keys(stats.byPlatform) as Platform[]).map((platform) => {
                    const count = stats.byPlatform[platform];
                    const percentage = stats.totalDownloads > 0
                      ? Math.round((count / stats.totalDownloads) * 100)
                      : 0;

                    return (
                      <div key={platform} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className={cn("flex items-center gap-2", c.text)}>
                            <span className="opacity-60">{PLATFORM_ICONS[platform]}</span>
                            {PLATFORM_NAMES[platform]}
                          </div>
                          <div className={c.muted}>
                            {formatNumber(count)} ({percentage}%)
                          </div>
                        </div>
                        <div className={cn("h-2 rounded-full overflow-hidden", c.card)}>
                          <div
                            className={cn("h-full rounded-full motion-safe:transition-all duration-500", c.accentBg)}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Source Breakdown */}
              <div>
                <h3 className={cn("text-sm font-medium mb-4", c.muted)}>{t.bySource}</h3>
                <div className="flex gap-4">
                  {(Object.entries(stats.bySource) as ["button" | "link" | "command", number][]).map(
                    ([source, count]) => (
                      <div
                        key={source}
                        className={cn(
                          "flex-1 p-4 rounded-xl border text-center",
                          c.border,
                          c.card
                        )}
                      >
                        <div className={cn("text-2xl font-bold", c.accent)}>{formatNumber(count)}</div>
                        <div className={cn("text-xs mt-1", c.muted)}>
                          {t.source[source]}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className={cn("text-center py-12", c.muted)}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <p>{t.noData}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={cn("flex items-center justify-between p-6 border-t", c.border)}>
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className={cn("border text-sm", c.border, c.muted)}
          >
            {t.clear}
          </Button>
          <Button
            onClick={onClose}
            size="sm"
            className="bg-white text-black hover:bg-white/90"
          >
            {t.close}
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  theme,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  theme: "dark" | "light";
}) {
  const c = {
    text: theme === "dark" ? "text-[#fafafa]" : "text-[#0a0a0a]",
    muted: theme === "dark" ? "text-[#888]" : "text-[#666]",
    card: theme === "dark" ? "bg-white/[0.03]" : "bg-black/[0.03]",
    border: theme === "dark" ? "border-white/10" : "border-black/10",
    accent: theme === "dark" ? "text-[#ffe0c2]" : "text-[#b8845c]",
  };

  return (
    <div className={cn("p-4 rounded-xl border", c.card, c.border)}>
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-3", c.card)}>
        <span className={c.accent}>{icon}</span>
      </div>
      <div className={cn("text-2xl font-bold", c.text)}>{value}</div>
      <div className={cn("text-xs", c.muted)}>{label}</div>
    </div>
  );
}
