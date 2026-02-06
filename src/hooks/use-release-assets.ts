import { useState, useEffect, useRef } from "react";

type Platform = "windows" | "macos" | "linux";

interface GitHubAsset {
  name: string;
  size: number;
  browser_download_url: string;
}

interface GitHubRelease {
  assets: GitHubAsset[];
  html_url: string;
}

export interface UseReleaseAssetsReturn {
  sizes: Record<Platform, string>;
  urls: Record<Platform, string>;
  isLoading: boolean;
  error: Error | null;
}

const RELEASES_PAGE = "https://github.com/Only0neHpLeft/zoodb-app/releases/latest";

// Match assets to platforms by file extension patterns
function matchAssetToPlatform(name: string): Platform | null {
  const lower = name.toLowerCase();
  if (lower.endsWith(".exe") || lower.endsWith(".msi")) return "windows";
  if (lower.endsWith(".dmg")) return "macos";
  if (lower.endsWith(".appimage") || lower.endsWith(".deb")) return "linux";
  return null;
}

function formatSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

export function useReleaseAssets(): UseReleaseAssetsReturn {
  const [sizes, setSizes] = useState<Record<Platform, string>>({
    windows: "",
    macos: "",
    linux: "",
  });
  const [urls, setUrls] = useState<Record<Platform, string>>({
    windows: RELEASES_PAGE,
    macos: RELEASES_PAGE,
    linux: RELEASES_PAGE,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    abortControllerRef.current = new AbortController();

    fetch("https://api.github.com/repos/Only0neHpLeft/zoodb-app/releases/latest", {
      signal: abortControllerRef.current.signal,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`GitHub API responded with ${res.status}`);
        }
        return res.json() as Promise<GitHubRelease>;
      })
      .then((release) => {
        const newSizes: Record<Platform, string> = {
          windows: "",
          macos: "",
          linux: "",
        };
        const newUrls: Record<Platform, string> = {
          windows: release.html_url || RELEASES_PAGE,
          macos: release.html_url || RELEASES_PAGE,
          linux: release.html_url || RELEASES_PAGE,
        };

        for (const asset of release.assets) {
          const platform = matchAssetToPlatform(asset.name);
          if (platform && !newSizes[platform]) {
            newSizes[platform] = formatSize(asset.size);
            newUrls[platform] = asset.browser_download_url;
          }
        }

        setSizes(newSizes);
        setUrls(newUrls);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return { sizes, urls, isLoading, error };
}
