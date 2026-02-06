import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/lib/icons";

type Platform = "windows" | "macos" | "linux";
type Theme = "light" | "dark";
type Lang = "en" | "zh";

interface SystemCheckProps {
  platform: Platform;
  theme?: Theme;
  lang?: Lang;
}

interface CheckResult {
  passed: boolean;
  label: string;
  value: string;
}

// Extend Navigator interface for deviceMemory
interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

const translations = {
  en: {
    osCheck: "Operating System",
    ramCheck: "Memory",
    passed: "Passed",
    failed: "Failed",
    windows: "Windows 10+",
    macos: "macOS 11+",
    linux: "Ubuntu 20.04+",
    requirement: "Requires ",
  },
  zh: {
    osCheck: "操作系统",
    ramCheck: "内存",
    passed: "通过",
    failed: "未通过",
    windows: "Windows 10+",
    macos: "macOS 11+",
    linux: "Ubuntu 20.04+",
    requirement: "需要 ",
  },
};

function parseOSVersion(userAgent: string): { os: string; version: string; major: number; minor: number } | null {
  // Windows
  const windowsMatch = userAgent.match(/Windows NT (\d+)\.(\d+)/);
  if (windowsMatch) {
    return {
      os: "windows",
      version: `${windowsMatch[1]}.${windowsMatch[2]}`,
      major: parseInt(windowsMatch[1], 10),
      minor: parseInt(windowsMatch[2], 10),
    };
  }

  // macOS - try multiple patterns
  // Old format: Mac OS X 10_15_7 or Mac OS X 10.15
  let macMatch = userAgent.match(/Mac OS X (\d+)[_.](\d+)(?:[_.](\d+))?/i);
  if (macMatch) {
    const major = parseInt(macMatch[1], 10);
    // If we see 10.x, it's the old format (Catalina and earlier)
    // If we see 11+, it's the new format (Big Sur and later)
    return {
      os: "macos",
      version: `${major}.${macMatch[2]}`,
      major: major,
      minor: parseInt(macMatch[2], 10),
    };
  }

  // New format: macOS 11+, macOS 12+, etc
  const macOSMatch = userAgent.match(/macOS\s*(\d+)[._](\d+)/i);
  if (macOSMatch) {
    return {
      os: "macos",
      version: `${macOSMatch[1]}.${macOSMatch[2]}`,
      major: parseInt(macOSMatch[1], 10),
      minor: parseInt(macOSMatch[2], 10),
    };
  }

  // Safari Version pattern: Version/XX.X (especially for newer macOS versions)
  // Safari version roughly correlates to macOS version
  // Version/15.x ≈ macOS 12.x (Monterey)
  // Version/16.x ≈ macOS 13.x (Ventura) 
  // Version/17.x ≈ macOS 14.x (Sonoma)
  // Version/18.x ≈ macOS 15.x (Sequoia)
  // Version/26.x ≈ macOS 26.x (Future/Tahoe)
  const versionMatch = userAgent.match(/Version\/(\d+)[._](\d+)/);
  if (versionMatch && userAgent.includes("Macintosh")) {
    const safariMajor = parseInt(versionMatch[1], 10);
    // Map Safari version to estimated macOS version
    // Safari 15+ usually means macOS 11+
    let estimatedMacVersion = safariMajor;
    if (safariMajor >= 15 && safariMajor <= 18) {
      // Safari 15 -> macOS 12, Safari 16 -> macOS 13, etc
      estimatedMacVersion = safariMajor - 3;
    } else if (safariMajor > 18) {
      // For Safari 19+, assume it maps roughly 1:1 or slightly less
      estimatedMacVersion = Math.max(15, safariMajor - 3);
    }
    return {
      os: "macos",
      version: `${estimatedMacVersion}.x`,
      major: estimatedMacVersion,
      minor: 0,
    };
  }

  // Generic macOS check - if we see Macintosh but can't parse version
  if (userAgent.includes("Macintosh") || userAgent.includes("Mac OS X") || userAgent.includes("macOS")) {
    // Try to extract from any number pattern
    const genericMac = userAgent.match(/(?:Mac|macOS)\D*(\d+)[._](\d+)/i);
    if (genericMac) {
      const major = parseInt(genericMac[1], 10);
      // If major is 10, it's old macOS (10.15 = Catalina)
      // If major is 11+, it's new macOS
      // If major is 20+, it's likely a Safari version, map it
      let mappedMajor = major;
      if (major > 20) {
        // Likely Safari version, map to macOS version
        mappedMajor = Math.max(15, major - 10);
      }
      return {
        os: "macos",
        version: `${mappedMajor}.${genericMac[2]}`,
        major: mappedMajor,
        minor: parseInt(genericMac[2], 10),
      };
    }
    // If we can't parse but see Macintosh, assume modern macOS (15+)
    return { os: "macos", version: "15+", major: 15, minor: 0 };
  }

  // Linux/Ubuntu
  const ubuntuMatch = userAgent.match(/Ubuntu[\/](\d+)\.(\d+)/);
  if (ubuntuMatch) {
    return {
      os: "linux",
      version: `${ubuntuMatch[1]}.${ubuntuMatch[2]}`,
      major: parseInt(ubuntuMatch[1], 10),
      minor: parseInt(ubuntuMatch[2], 10),
    };
  }

  // Generic Linux
  if (userAgent.includes("Linux")) {
    return { os: "linux", version: "unknown", major: 0, minor: 0 };
  }

  return null;
}

function checkOSRequirement(platform: Platform, userAgent: string): { passed: boolean; current: string } {
  const osInfo = parseOSVersion(userAgent);

  if (!osInfo) {
    return { passed: false, current: "Unknown" };
  }

  switch (platform) {
    case "windows":
      if (osInfo.os !== "windows") return { passed: false, current: `Windows ${osInfo.version}` };
      // Windows 10 = NT 10.0
      const passed = osInfo.major > 10 || (osInfo.major === 10 && osInfo.minor >= 0);
      return { passed, current: `Windows ${osInfo.major}.${osInfo.minor}` };

    case "macos":
      if (osInfo.os !== "macos") return { passed: false, current: `macOS ${osInfo.version}` };
      // macOS 11+
      const macPassed = osInfo.major >= 11;
      return { passed: macPassed, current: `macOS ${osInfo.major}.${osInfo.minor}` };

    case "linux":
      if (osInfo.os !== "linux") return { passed: false, current: "Non-Linux OS" };
      // Ubuntu 20.04+ (major >= 20)
      if (osInfo.major === 0) {
        // Generic Linux, assume pass
        return { passed: true, current: "Linux" };
      }
      const linuxPassed = osInfo.major >= 20;
      return { passed: linuxPassed, current: `Ubuntu ${osInfo.major}.${osInfo.minor.toString().padStart(2, "0")}` };

    default:
      return { passed: false, current: "Unknown" };
  }
}

function checkRAMRequirement(): { passed: boolean; current: string } {
  const nav = navigator as NavigatorWithMemory;
  const memoryGB = nav.deviceMemory;

  if (memoryGB === undefined) {
    return { passed: true, current: "Unknown" };
  }

  return {
    passed: memoryGB >= 2,
    current: `${memoryGB} GB`,
  };
}

export function SystemCheck({ platform, theme = "dark", lang = "en" }: SystemCheckProps) {
  const t = translations[lang];

  const { osCheck, ramCheck, allPassed } = useMemo(() => {
    const osResult = checkOSRequirement(platform, navigator.userAgent);
    const ramResult = checkRAMRequirement();

    const osCheckData: CheckResult = {
      passed: osResult.passed,
      label: t.osCheck,
      value: osResult.current,
    };

    const ramCheckData: CheckResult = {
      passed: ramResult.passed,
      label: t.ramCheck,
      value: ramResult.current,
    };

    return {
      osCheck: osCheckData,
      ramCheck: ramCheckData,
      allPassed: osResult.passed && ramResult.passed,
    };
  }, [platform, t]);

  const platformLabel = t[platform];
  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "rounded-lg border p-4 space-y-3",
        isDark
          ? "bg-[#0a0a0a] border-white/10 text-[#fafafa]"
          : "bg-white border-gray-200 text-gray-900"
      )}
    >
      <div className="flex items-center gap-2 pb-2 border-b border-current/10">
        <div className="flex items-center justify-center w-8 h-8">
          {platform === "windows" && <span className="text-blue-400">{Icons.windows}</span>}
          {platform === "macos" && <span className="opacity-80">{Icons.apple}</span>}
          {platform === "linux" && <span className="text-orange-400">{Icons.linux}</span>}
        </div>
        <div>
          <h3 className="font-medium text-sm">{t.requirement}{platformLabel}</h3>
          <p className={cn("text-xs", isDark ? "text-[#888]" : "text-gray-500")}>
            2GB RAM minimum
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {/* OS Check */}
        <CheckItem
          check={osCheck}
          requirement={platformLabel}
          isDark={isDark}
          t={t}
        />

        {/* RAM Check */}
        <CheckItem
          check={ramCheck}
          requirement="2GB+"
          isDark={isDark}
          t={t}
        />
      </div>

      {allPassed && (
        <div className={cn(
          "flex items-center gap-2 pt-2 text-xs font-medium",
          isDark ? "text-green-400" : "text-green-600"
        )}>
          <span className="w-4 h-4 flex items-center justify-center">
            {Icons.check}
          </span>
          {lang === "en" ? "System requirements met" : "系统要求已满足"}
        </div>
      )}
    </div>
  );
}

interface CheckItemProps {
  check: CheckResult;
  requirement: string;
  isDark: boolean;
  t: typeof translations.en;
}

function CheckItem({ check, requirement, isDark, t }: CheckItemProps) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2">
        <StatusIcon passed={check.passed} isDark={isDark} />
        <span className={cn("text-sm", isDark ? "text-[#fafafa]" : "text-gray-900")}>
          {check.label}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className={cn("text-sm", isDark ? "text-[#888]" : "text-gray-500")}>
          {check.value}
        </span>
        {!check.passed && (
          <span className={cn("text-xs", isDark ? "text-red-400" : "text-red-500")}>
            ({t.requirement}{requirement})
          </span>
        )}
      </div>
    </div>
  );
}

function StatusIcon({ passed, isDark }: { passed: boolean; isDark: boolean }) {
  if (passed) {
    return (
      <div className={cn(
        "w-5 h-5 rounded-full flex items-center justify-center",
        isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-600"
      )}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
    );
  }

  return (
    <div className={cn(
      "w-5 h-5 rounded-full flex items-center justify-center",
      isDark ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-600"
    )}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
  );
}
