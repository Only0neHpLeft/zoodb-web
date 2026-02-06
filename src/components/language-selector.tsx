import { memo } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type Language = "en" | "cz";

interface LanguageOption {
  code: Language;
  label: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "cz", label: "Čeština", flag: "🇨🇿" },
];

interface LanguageSelectorProps {
  lang: Language;
  onChange: (lang: Language) => void;
  theme: "dark" | "light";
}

function useColorScheme(theme: "dark" | "light") {
  return {
    muted: theme === "dark" ? "text-[#888]" : "text-[#666]",
    border: theme === "dark" ? "border-white/10" : "border-black/10",
    card: theme === "dark" ? "bg-white/[0.03]" : "bg-black/[0.03]",
    hover: theme === "dark" ? "hover:bg-white/10" : "hover:bg-black/10",
  };
}

export const LanguageSelector = memo(function LanguageSelector({
  lang,
  onChange,
  theme,
}: LanguageSelectorProps) {
  const currentLang = languages.find((l) => l.code === lang) ?? languages[0];
  const c = useColorScheme(theme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-1.5 px-2 py-1.5 rounded text-sm border motion-safe:transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          c.border,
          c.card,
          c.muted,
          "hover:text-[#ffe0c2] hover:border-[#ffe0c2]/30"
        )}
        aria-label={`Select language, current: ${currentLang.label}`}
      >
        <span className="text-base leading-none" aria-hidden="true">
          {currentLang.flag}
        </span>
        <span className="font-medium uppercase">{currentLang.code}</span>
        <ChevronDown className="size-3 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => onChange(language.code)}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              lang === language.code && "bg-accent text-accent-foreground"
            )}
          >
            <span className="text-base leading-none" aria-hidden="true">
              {language.flag}
            </span>
            <span className="flex-1">{language.label}</span>
            {lang === language.code && (
              <span className="sr-only">(selected)</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
