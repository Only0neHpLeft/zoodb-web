import { memo, useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";

interface GitHubStarsProps {
  owner: string;
  repo: string;
  theme?: "dark" | "light";
}

interface GitHubRepoData {
  stargazers_count: number;
}

function formatStars(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

function useAnimatedCounter(targetValue: number, duration: number = 1000): number {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (targetValue === 0) return;

    startTimeRef.current = null;
    startValueRef.current = 0;

    const animate = (timestamp: number): void => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValueRef.current + (targetValue - startValueRef.current) * easeOut);
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, duration]);

  return displayValue;
}

export const GitHubStars = memo(function GitHubStars({
  owner,
  repo,
  theme = "dark",
}: GitHubStarsProps) {
  const [stars, setStars] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const animatedStars = useAnimatedCounter(stars);

  const textColor = theme === "dark" ? "text-[#ffe0c2]" : "text-[#b8845c]";
  const skeletonBg = theme === "dark" ? "bg-[#ffe0c2]/20" : "bg-[#b8845c]/20";

  useEffect(() => {
    const abortController = new AbortController();

    async function fetchStars(): Promise<void> {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}`,
          {
            signal: abortController.signal,
            headers: {
              Accept: "application/vnd.github.v3+json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const data: GitHubRepoData = await response.json();
        setStars(data.stargazers_count);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    void fetchStars();

    return () => {
      abortController.abort();
    };
  }, [owner, repo]);

  if (error) {
    return (
      <a
        href={`https://github.com/${owner}/${repo}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 ${textColor} opacity-60 hover:opacity-100 transition-opacity`}
        aria-label="View on GitHub"
      >
        <Star className="w-4 h-4" />
        <span className="text-sm font-medium">Star</span>
      </a>
    );
  }

  if (loading) {
    return (
      <div className="inline-flex items-center gap-1.5">
        <Star className={`w-4 h-4 ${textColor} opacity-40`} />
        <div className={`w-8 h-4 ${skeletonBg} rounded animate-pulse`} />
      </div>
    );
  }

  return (
    <a
      href={`https://github.com/${owner}/${repo}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 ${textColor} hover:opacity-80 transition-opacity`}
      aria-label={`${stars} stars on GitHub`}
    >
      <Star className="w-4 h-4 fill-current" />
      <span className="text-sm font-medium tabular-nums">
        {formatStars(animatedStars)}
      </span>
    </a>
  );
});
