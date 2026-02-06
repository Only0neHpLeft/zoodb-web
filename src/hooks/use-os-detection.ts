import { useState, useEffect } from "react";

export type Platform = "windows" | "macos" | "linux";

function detectOS(): Platform {
  const ua = navigator.userAgent.toLowerCase();
  const platform = navigator.platform.toLowerCase();

  if (platform.includes("mac") || ua.includes("mac")) return "macos";
  if (platform.includes("linux") || ua.includes("linux")) return "linux";
  return "windows";
}

export function useOSDetection(): Platform {
  const [os, setOs] = useState<Platform>("windows");

  useEffect(() => {
    setOs(detectOS());
  }, []);

  return os;
}
