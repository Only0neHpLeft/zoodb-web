import { useState, useEffect, useCallback, useMemo } from "react";
import type { Platform } from "./use-os-detection";

const STORAGE_KEY = "zoodb-analytics";

interface DownloadEvent {
  platform: Platform;
  timestamp: number;
  source: "button" | "link" | "command";
}

interface AnalyticsData {
  downloads: DownloadEvent[];
  firstVisit: number;
  lastVisit: number;
  visitCount: number;
}

interface AggregatedStats {
  totalDownloads: number;
  byPlatform: Record<Platform, number>;
  bySource: Record<DownloadEvent["source"], number>;
  todayDownloads: number;
  weekDownloads: number;
  monthDownloads: number;
}

function getInitialData(): AnalyticsData {
  const now = Date.now();
  return {
    downloads: [],
    firstVisit: now,
    lastVisit: now,
    visitCount: 1,
  };
}

function loadData(): AnalyticsData {
  if (typeof window === "undefined") return getInitialData();
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as AnalyticsData;
      // Update visit stats
      data.lastVisit = Date.now();
      data.visitCount++;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    }
  } catch {
    // Ignore storage errors (private mode, etc.)
  }
  
  return getInitialData();
}

function saveData(data: AnalyticsData): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData>(() => loadData());
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage after mount
  useEffect(() => {
    setData(loadData());
    setIsHydrated(true);
  }, []);

  // Persist changes
  useEffect(() => {
    if (isHydrated) {
      saveData(data);
    }
  }, [data, isHydrated]);

  const trackDownload = useCallback((platform: Platform, source: DownloadEvent["source"] = "button") => {
    setData((prev) => ({
      ...prev,
      downloads: [
        ...prev.downloads,
        {
          platform,
          timestamp: Date.now(),
          source,
        },
      ],
    }));
  }, []);

  const clearAnalytics = useCallback(() => {
    setData(getInitialData());
  }, []);

  const stats: AggregatedStats = useMemo(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;

    const byPlatform: Record<Platform, number> = {
      windows: 0,
      macos: 0,
      linux: 0,
    };

    const bySource: Record<DownloadEvent["source"], number> = {
      button: 0,
      link: 0,
      command: 0,
    };

    let todayDownloads = 0;
    let weekDownloads = 0;
    let monthDownloads = 0;

    // Keep only last 90 days of data for performance
    const cutoff = now - 90 * oneDay;
    const recentDownloads = data.downloads.filter((d) => d.timestamp > cutoff);

    for (const download of recentDownloads) {
      byPlatform[download.platform]++;
      bySource[download.source]++;

      const age = now - download.timestamp;
      if (age < oneDay) todayDownloads++;
      if (age < oneWeek) weekDownloads++;
      if (age < oneMonth) monthDownloads++;
    }

    return {
      totalDownloads: recentDownloads.length,
      byPlatform,
      bySource,
      todayDownloads,
      weekDownloads,
      monthDownloads,
    };
  }, [data.downloads]);

  const exportData = useCallback(() => {
    return {
      ...data,
      stats,
      exportedAt: Date.now(),
    };
  }, [data, stats]);

  return {
    stats,
    trackDownload,
    clearAnalytics,
    exportData,
    isHydrated,
    visitCount: data.visitCount,
    firstVisit: data.firstVisit,
  };
}

// Format number with locale
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

// Format relative time
export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 30) return `${Math.floor(days / 30)} months ago`;
  if (days > 0) return `${days} day${days === 1 ? "" : "s"} ago`;
  if (hours > 0) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (minutes > 0) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  return "Just now";
}
