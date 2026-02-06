import { useState, useCallback, useRef, useEffect } from "react";
import { useReducedMotion } from "./use-reduced-motion";

interface UseSlideNavigationOptions {
  totalSlides: number;
  transitionDuration?: number;
}

interface UseSlideNavigationReturn {
  currentSlide: number;
  isTransitioning: boolean;
  goToSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
}

export function useSlideNavigation({
  totalSlides,
  transitionDuration = 700,
}: UseSlideNavigationOptions): UseSlideNavigationReturn {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index < 0 || index >= totalSlides) return;

      setIsTransitioning(true);
      setCurrentSlide(index);

      const duration = prefersReducedMotion ? 0 : transitionDuration;
      
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, duration);
    },
    [isTransitioning, totalSlides, transitionDuration, prefersReducedMotion]
  );

  const nextSlide = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  return {
    currentSlide,
    isTransitioning,
    goToSlide,
    nextSlide,
    prevSlide,
  };
}
