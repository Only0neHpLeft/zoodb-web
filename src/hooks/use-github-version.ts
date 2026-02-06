import { useState, useEffect, useRef } from "react";

interface UseGitHubVersionOptions {
  owner: string;
  repo: string;
  enabled?: boolean;
}

interface UseGitHubVersionReturn {
  version: string | null;
  isLoading: boolean;
  error: Error | null;
}

export function useGitHubVersion({
  owner,
  repo,
  enabled = true,
}: UseGitHubVersionOptions): UseGitHubVersionReturn {
  const [version, setVersion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    abortControllerRef.current = new AbortController();

    fetch(`https://api.github.com/repos/${owner}/${repo}/tags`, {
      signal: abortControllerRef.current.signal,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`GitHub API responded with ${res.status}`);
        }
        return res.json();
      })
      .then((tags) => {
        if (tags && tags.length > 0 && tags[0].name) {
          setVersion(tags[0].name);
        }
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
  }, [owner, repo, enabled]);

  return { version, isLoading, error };
}
