import { useState, useMemo, memo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";
import type { SlideProps } from "./types";

interface EditorSlideProps extends SlideProps {
  onNext: () => void;
  onPrev: () => void;
}

// Editor view states
type EditorView = "code" | "pipelines" | "branches";
type CodeFile = "app" | "button";

// Code content constants
const CODE_CONTENT = {
  app: `import { useState } from "react";
import { Button } from "./button";

export function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="container">
      <h1>Count: {count}</h1>
      <Button onClick={() => setCount(c => c + 1)}>
        Increment
      </Button>
    </div>
  );
}`,
  button: `import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, onClick, variant = "primary" }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={cn("btn", variant)}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";`,
};

const PIPELINE_STAGES = [
  { name: "build", duration: "4ms", status: "success", command: "bun install", output: "✓ Installed 142 packages" },
  { name: "test", duration: "6ms", status: "success", command: "bun test", output: "✓ 24 tests passed" },
  { name: "deploy", duration: "4ms", status: "success", command: "", output: "✓ Deployed to production" },
];

const BRANCHES = [
  { name: "main", default: true, updated: "2m ago", commits: 142, status: "success" },
  { name: "develop", ahead: 3, updated: "1h ago", status: "pending" },
  { name: "feature/auth", ahead: 8, updated: "3d ago", status: "pending" },
];

const SYNTAX_HIGHLIGHT = (code: string, isDark: boolean) => {
  const colors = {
    keyword: isDark ? "text-purple-400" : "text-purple-600",
    function: isDark ? "text-amber-400" : "text-amber-600",
    string: isDark ? "text-green-400" : "text-green-600",
    tag: isDark ? "text-red-400" : "text-red-600",
    component: isDark ? "text-teal-400" : "text-teal-600",
    comment: isDark ? "text-zinc-500" : "text-zinc-400",
    plain: isDark ? "text-zinc-300" : "text-zinc-700",
  };

  return code.split("\n").map((line, i) => {
    // Very basic highlighting - just color specific keywords
    let processed = line
      .replace(/\b(import|export|const|return|from|function|interface|let|var)\b/g, `<span class="${colors.keyword}">$1</span>`)
      .replace(/\b(useState|useEffect|useCallback|forwardRef)\b/g, `<span class="${colors.function}">$1</span>`)
      .replace(/\b(App|Button|React|HTMLButtonElement)\b/g, `<span class="${colors.component}">$1</span>`)
      .replace(/("[^"]*")/g, `<span class="${colors.string}">$1</span>`)
      .replace(/\b(div|button|h1|span|className|onClick|ref)\b/g, `<span class="${colors.tag}">$1</span>`);

    return { lineNum: i + 1, html: processed || line };
  });
};

// Sidebar navigation item component
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  badge?: number;
  theme: "dark" | "light";
}

const NavItem = memo(function NavItem({ icon, label, isActive, onClick, badge, theme }: NavItemProps) {
  const c = useMemo(
    () => ({
      activeBg: theme === "dark" ? "bg-zinc-900 text-white" : "bg-zinc-900 text-white",
      inactive: theme === "dark" ? "text-zinc-600 hover:bg-zinc-800" : "text-zinc-600 hover:bg-zinc-100",
      badgeBg: theme === "dark" ? "bg-white/20" : "bg-green-100",
      badgeText: theme === "dark" ? "text-white" : "text-green-700",
    }),
    [theme]
  );

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive ? c.activeBg : c.inactive
      )}
    >
      {icon}
      {label}
      {badge !== undefined && (
        <span className={cn("ml-auto flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold", c.badgeBg, c.badgeText)}>
          {badge}
        </span>
      )}
    </button>
  );
});

// Code editor view
interface CodeEditorProps {
  activeFile: CodeFile;
  onFileChange: (file: CodeFile) => void;
  theme: "dark" | "light";
}

const CodeEditor = memo(function CodeEditor({ activeFile, onFileChange, theme }: CodeEditorProps) {
  const highlighted = useMemo(() => SYNTAX_HIGHLIGHT(CODE_CONTENT[activeFile], theme === "dark"), [activeFile, theme]);
  
  const c = useMemo(() => ({
    bg: theme === "dark" ? "bg-zinc-900" : "bg-white",
    lineNum: theme === "dark" ? "text-zinc-600" : "text-zinc-300",
    text: theme === "dark" ? "text-zinc-300" : "text-zinc-700",
  }), [theme]);

  return (
    <>
      {/* Tabs */}
      <div className={cn("flex items-center border-b px-2", theme === "dark" ? "border-zinc-700 bg-zinc-800/50" : "border-zinc-200 bg-zinc-50/50")}>
        {(["app", "button"] as CodeFile[]).map((file) => (
          <button
            key={file}
            onClick={() => onFileChange(file)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm transition-colors",
              activeFile === file
                ? cn("border-b-2 border-zinc-900 font-medium", theme === "dark" ? "text-white border-white" : "text-zinc-900")
                : cn("hover:text-zinc-700", theme === "dark" ? "text-zinc-500" : "text-zinc-500")
            )}
          >
            <span className="text-blue-600">◉</span>
            {file}.tsx
          </button>
        ))}
      </div>

      {/* Code */}
      <div className={cn("flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed", c.bg)}>
        <div className="flex">
          <div className={cn("pr-4 text-right select-none min-w-[2rem]", c.lineNum)}>
            {highlighted.map((line) => (
              <div key={line.lineNum}>{line.lineNum}</div>
            ))}
          </div>
          <div className={cn("flex-1", c.text)}>
            {highlighted.map((line) => (
              <div key={line.lineNum} dangerouslySetInnerHTML={{ __html: line.html }} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
});

// Pipeline view
const PipelineView = memo(function PipelineView({ theme }: { theme: "dark" | "light" }) {
  return (
    <div className="flex-1 overflow-auto p-4 space-y-3">
      {PIPELINE_STAGES.map((stage) => (
        <div
          key={stage.name}
          className={cn(
            "rounded-lg border overflow-hidden",
            theme === "dark" ? "border-zinc-700 bg-zinc-800" : "border-zinc-200 bg-white"
          )}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <div className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full",
              stage.status === "success" ? "bg-green-500/20 text-green-500" : "bg-zinc-700"
            )}>
              ✓
            </div>
            <span className={cn("text-sm font-medium", theme === "dark" ? "text-white" : "text-zinc-900")}>
              {stage.name}
            </span>
            <span className={cn("text-xs ml-auto", theme === "dark" ? "text-zinc-500" : "text-zinc-400")}>
              {stage.duration}
            </span>
          </div>
          {stage.output && (
            <div className={cn("border-t px-4 py-2 font-mono text-xs", theme === "dark" ? "border-zinc-700 bg-zinc-900 text-green-400" : "border-zinc-100 bg-zinc-50 text-green-600")}>
              {stage.command && <div className={theme === "dark" ? "text-zinc-500" : "text-zinc-400"}>$ {stage.command}</div>}
              <div>{stage.output}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
});

// Branches view
const BranchesView = memo(function BranchesView({ theme }: { theme: "dark" | "light" }) {
  return (
    <div className="flex-1 overflow-auto p-4 space-y-2">
      {BRANCHES.map((branch) => (
        <div
          key={branch.name}
          className={cn(
            "rounded-lg border p-4",
            theme === "dark" ? "border-zinc-700 bg-zinc-800" : "border-zinc-200 bg-white"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full",
              branch.default ? "bg-green-500/20 text-green-500" : "bg-blue-500/20 text-blue-500"
            )}>
              {Icons.tag}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={cn("text-sm font-semibold", theme === "dark" ? "text-white" : "text-zinc-900")}>
                  {branch.name}
                </span>
                {branch.default && (
                  <span className="text-[10px] bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded font-medium">
                    default
                  </span>
                )}
              </div>
              <div className={cn("text-xs", theme === "dark" ? "text-zinc-500" : "text-zinc-500")}>
                {branch.ahead ? `${branch.ahead} commits ahead • ` : ""}Updated {branch.updated}
              </div>
            </div>
            {!branch.default && (
              <button className={cn(
                "text-xs border px-2 py-1 rounded",
                theme === "dark" ? "border-zinc-600 text-zinc-400 hover:bg-zinc-700" : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              )}>
                Merge
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

// Main Editor Slide Component
export const EditorSlide = memo(function EditorSlide({
  isActive,
  prefersReducedMotion,
  theme,
  lang,
  onPrev,
}: EditorSlideProps) {
  const [activeView, setActiveView] = useState<EditorView>("code");
  const [activeFile, setActiveFile] = useState<CodeFile>("app");

  const t = useMemo(() => ({
    en: {
      title: "Code. Build. Ship.",
      subtitle: "A complete development environment in your browser. Edit, test, and deploy without leaving the app.",
      cta: "Try Demo",
      back: "Back to Download",
      features: ["Syntax highlighting", "Live preview", "CI/CD pipelines", "Git integration"],
      nav: { code: "Code", pipelines: "Pipelines", branches: "Branches" },
    },
    cz: {
      title: "Kódujte. Sestavujte. Nasazujte.",
      subtitle: "Kompletní vývojové prostředí ve vašem prohlížeči. Upravujte, testujte a nasazujte bez opuštění aplikace.",
      cta: "Vyzkoušet demo",
      back: "Zpět ke stažení",
      features: ["Zvýrazňování syntaxe", "Živý náhled", "CI/CD pipeline", "Git integrace"],
      nav: { code: "Kód", pipelines: "Pipeline", branches: "Větve" },
    },
  }[lang]), [lang]);

  const c = useMemo(
    () => ({
      bg: theme === "dark" ? "bg-[#0a0a0a]" : "bg-[#fafafa]",
      text: theme === "dark" ? "text-[#fafafa]" : "text-[#0a0a0a]",
      muted: theme === "dark" ? "text-[#888]" : "text-[#666]",
      border: theme === "dark" ? "border-white/10" : "border-black/10",
      card: theme === "dark" ? "bg-zinc-900" : "bg-white",
      accent: theme === "dark" ? "text-[#ffe0c2]" : "text-[#b8845c]",
      editorBg: theme === "dark" ? "bg-zinc-900" : "bg-white",
      editorBorder: theme === "dark" ? "border-zinc-800" : "border-zinc-200",
      sidebarBg: theme === "dark" ? "bg-zinc-900/50" : "bg-zinc-50/50",
    }),
    [theme]
  );

  const slideClasses = cn(
    "motion-safe:transition-all",
    !prefersReducedMotion && "duration-700",
    isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
  );

  return (
    <section className="w-screen h-screen flex-shrink-0 flex items-center justify-center px-6 py-20">
      <div className="max-w-6xl mx-auto w-full">
        <div
          className={cn(slideClasses, "grid lg:grid-cols-2 gap-12 items-center")}
          style={{ transitionDelay: prefersReducedMotion ? "0ms" : "200ms" }}
        >
          {/* Left - Content */}
          <div className="space-y-6">
            <div className={cn("inline-block px-3 py-1 rounded-full text-xs border", c.muted, c.border)}>
              Editor Preview
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
              {t.title.split(". ").map((part, i, arr) => (
                <span key={i}>
                  {i === 0 ? (
                    <span className={c.accent}>{part}</span>
                  ) : (
                    part
                  )}
                  {i < arr.length - 1 && ". "}
                  {i === 0 && <br />}
                </span>
              ))}
            </h1>

            <p className={cn("text-lg max-w-md", c.muted)}>{t.subtitle}</p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              {t.features.map((feature, i) => (
                <span
                  key={i}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs border",
                    c.border,
                    c.muted
                  )}
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Button
                onClick={() => {}}
                size="lg"
                className={cn(
                  "rounded-full h-12 px-8 gap-2 text-base font-semibold group",
                  theme === "dark"
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-black text-white hover:bg-black/90"
                )}
              >
                {t.cta}
                <span className="motion-safe:group-hover:translate-x-1 motion-safe:transition-transform">
                  {Icons.arrowRight}
                </span>
              </Button>
              <Button
                onClick={onPrev}
                variant="outline"
                size="lg"
                className={cn("border bg-transparent rounded-full h-12 px-6", c.border, c.muted)}
              >
                {Icons.chevronLeft}
                {t.back}
              </Button>
            </div>
          </div>

          {/* Right - Editor Mockup */}
          <div
            className={cn(
              slideClasses,
              "relative",
              !prefersReducedMotion && "motion-safe:transition-all duration-700"
            )}
            style={{ transitionDelay: prefersReducedMotion ? "0ms" : "400ms" }}
          >
            <div
              className={cn(
                "relative rounded-xl border shadow-2xl overflow-hidden",
                c.editorBorder,
                c.card
              )}
            >
              {/* Window Header */}
              <div className={cn("flex items-center gap-2 border-b px-4 py-3", c.editorBorder, c.sidebarBg)}>
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
                  <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                  <div className="h-3 w-3 rounded-full bg-[#27CA40]" />
                </div>
                <div className={cn("ml-4 flex items-center gap-1 rounded px-2 py-1 text-xs border", c.border, c.muted)}>
                  <span>{Icons.github}</span>
                  <span>n3x.dev/</span>
                  <span className={c.text}>acme-corp/web-app</span>
                </div>
              </div>

              {/* Editor Body */}
              <div className="flex h-auto max-h-[280px]">
                {/* Sidebar */}
                <div className={cn("hidden w-48 border-r p-3 space-y-1 md:block", c.editorBorder, c.sidebarBg)}>
                  <NavItem
                    icon={<span className="text-blue-500">◉</span>}
                    label={t.nav.code}
                    isActive={activeView === "code"}
                    onClick={() => setActiveView("code")}
                    theme={theme}
                  />
                  <NavItem
                    icon={<span className="text-green-500">▶</span>}
                    label={t.nav.pipelines}
                    isActive={activeView === "pipelines"}
                    onClick={() => setActiveView("pipelines")}
                    badge={3}
                    theme={theme}
                  />
                  <NavItem
                    icon={Icons.tag}
                    label={t.nav.branches}
                    isActive={activeView === "branches"}
                    onClick={() => setActiveView("branches")}
                    theme={theme}
                  />

                  {/* File Tree (Code view only) */}
                  {activeView === "code" && (
                    <div className={cn("border-t pt-3 mt-3", c.border)}>
                      <div className={cn("text-[10px] font-semibold uppercase tracking-wider mb-2 px-1", c.muted)}>
                        Explorer
                      </div>
                      <div className="space-y-0.5 text-sm">
                        <button
                          onClick={() => setActiveFile("app")}
                          className={cn(
                            "w-full flex items-center gap-1.5 rounded px-1.5 py-1 text-left transition-colors",
                            activeFile === "app"
                              ? cn("bg-white/10", c.text)
                              : c.muted
                          )}
                        >
                          <span className="text-blue-500">◉</span>
                          <span>app.tsx</span>
                        </button>
                        <button
                          onClick={() => setActiveFile("button")}
                          className={cn(
                            "w-full flex items-center gap-1.5 rounded px-1.5 py-1 text-left transition-colors",
                            activeFile === "button"
                              ? cn("bg-white/10", c.text)
                              : c.muted
                          )}
                        >
                          <span className="text-blue-500">◉</span>
                          <span>button.tsx</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                  {activeView === "code" && (
                    <CodeEditor
                      activeFile={activeFile}
                      onFileChange={setActiveFile}
                      theme={theme}
                    />
                  )}
                  {activeView === "pipelines" && <PipelineView theme={theme} />}
                  {activeView === "branches" && <BranchesView theme={theme} />}

                  {/* Status Bar */}
                  <div className={cn("mt-auto border-t px-4 py-2 flex items-center gap-3 text-xs", c.editorBorder, c.sidebarBg)}>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <span className={theme === "dark" ? "text-green-400" : "text-green-600"}>Ready</span>
                    </div>
                    <div className={cn("ml-auto flex gap-3", c.muted)}>
                      <span>TypeScript</span>
                      <span>UTF-8</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
