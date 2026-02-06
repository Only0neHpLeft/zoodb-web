import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

interface Command {
  id: string;
  label: string;
  shortcut?: string;
  icon?: React.ReactNode;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: Command[];
  theme: "dark" | "light";
}

export function CommandPalette({ isOpen, onClose, commands, theme }: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter commands based on search
  const filteredCommands = useMemo(() => {
    if (!search.trim()) return commands;
    const query = search.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(query) ||
        cmd.shortcut?.toLowerCase().includes(query)
    );
  }, [commands, search]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSearch("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          const command = filteredCommands[selectedIndex];
          if (command) {
            command.action();
            onClose();
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [selectedIndex]);

  const handleCommandClick = useCallback(
    (command: Command) => {
      command.action();
      onClose();
    },
    [onClose]
  );

  if (!isOpen) return null;

  const c = {
    bg: theme === "dark" ? "bg-[#0a0a0a]" : "bg-[#fafafa]",
    text: theme === "dark" ? "text-[#fafafa]" : "text-[#0a0a0a]",
    muted: theme === "dark" ? "text-[#888]" : "text-[#666]",
    border: theme === "dark" ? "border-white/10" : "border-black/10",
    card: theme === "dark" ? "bg-white/[0.03]" : "bg-black/[0.03]",
    hover: theme === "dark" ? "hover:bg-white/[0.06]" : "hover:bg-black/[0.06]",
    accent: theme === "dark" ? "text-[#ffe0c2]" : "text-[#b8845c]",
    accentBg: theme === "dark" ? "bg-[#ffe0c2]/10" : "bg-[#b8845c]/15",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={cn(
          "relative w-full max-w-xl mx-4 rounded-2xl shadow-2xl overflow-hidden border",
          c.bg,
          c.border
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        {/* Search Input */}
        <div className={cn("flex items-center gap-3 px-4 py-4 border-b", c.border)}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={c.muted}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search..."
            className={cn(
              "flex-1 bg-transparent outline-none text-base placeholder:text-[#666]",
              c.text
            )}
            aria-label="Search commands"
          />
          <kbd
            className={cn(
              "px-2 py-1 rounded text-xs font-mono",
              c.card,
              c.muted
            )}
          >
            ESC
          </kbd>
        </div>

        {/* Commands List */}
        <div
          ref={listRef}
          className="max-h-[50vh] overflow-y-auto py-2"
          role="listbox"
          aria-label="Commands"
        >
          {filteredCommands.length === 0 ? (
            <div className={cn("px-4 py-8 text-center text-sm", c.muted)}>
              No commands found
            </div>
          ) : (
            filteredCommands.map((command, index) => (
              <button
                key={command.id}
                onClick={() => handleCommandClick(command)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left motion-safe:transition-colors",
                  index === selectedIndex
                    ? cn(c.accentBg, c.accent)
                    : cn(c.text, c.hover)
                )}
                role="option"
                aria-selected={index === selectedIndex}
              >
                {command.icon && <span className="flex-shrink-0">{command.icon}</span>}
                <span className="flex-1">{command.label}</span>
                {command.shortcut && (
                  <kbd
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-mono flex-shrink-0",
                      c.card,
                      index === selectedIndex ? c.accent : c.muted
                    )}
                  >
                    {command.shortcut}
                  </kbd>
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className={cn("flex items-center gap-4 px-4 py-3 text-xs border-t", c.border, c.muted)}>
          <span className="flex items-center gap-1">
            <kbd className={cn("px-1.5 py-0.5 rounded", c.card)}>↑</kbd>
            <kbd className={cn("px-1.5 py-0.5 rounded", c.card)}>↓</kbd>
            to navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className={cn("px-1.5 py-0.5 rounded", c.card)}>↵</kbd>
            to select
          </span>
        </div>
      </div>
    </div>
  );
}

// Hook for command palette keyboard shortcut
export function useCommandPaletteShortcut(onOpen: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD+K (Mac) or CTRL+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpen]);
}
