"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, X, Search, LayoutDashboard, Home, BookOpen, Calendar, Timer } from "lucide-react";
import { useAppStore } from "@/lib/store";

/* ------------------------------------------------------------------ */
/*  Shortcuts definition                                               */
/* ------------------------------------------------------------------ */
interface ShortcutItem {
  keys: string[];
  label: string;
  action: () => void;
  category: "navigation" | "tools";
  icon?: React.ElementType;
}

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */
export function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);
  const { setView, toggleChat, setSearchQuery } = useAppStore();

  const openSearch = useCallback(() => {
    setSearchQuery("");
    setView("search");
  }, [setSearchQuery, setView]);

  const shortcuts: ShortcutItem[] = [
    {
      keys: ["Ctrl", "K"],
      label: "فتح البحث",
      action: openSearch,
      category: "navigation",
      icon: Search,
    },
    {
      keys: ["Ctrl", "D"],
      label: "لوحة المتعلم",
      action: () => setView("dashboard"),
      category: "navigation",
      icon: LayoutDashboard,
    },
    {
      keys: ["Ctrl", "H"],
      label: "الرئيسية",
      action: () => setView("home"),
      category: "navigation",
      icon: Home,
    },
    {
      keys: ["Ctrl", "S"],
      label: "المواد",
      action: () => setView("subjects"),
      category: "navigation",
      icon: BookOpen,
    },
    {
      keys: ["Ctrl", "P"],
      label: "مخطط الدراسة",
      action: () => setView("planner"),
      category: "tools",
      icon: Calendar,
    },
    {
      keys: ["Ctrl", "T"],
      label: "مؤقت البومودورو",
      action: () => setView("timer"),
      category: "tools",
      icon: Timer,
    },
    {
      keys: ["Ctrl", "/"],
      label: "عرض الاختصارات",
      action: () => setIsOpen((prev) => !prev),
      category: "tools",
    },
    {
      keys: ["Esc"],
      label: "إغلاق",
      action: () => setIsOpen(false),
      category: "tools",
    },
  ];

  // Global keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey;

      if (isCtrl && e.key === "k") {
        e.preventDefault();
        openSearch();
      } else if (isCtrl && e.key === "d") {
        e.preventDefault();
        setView("dashboard");
      } else if (isCtrl && e.key === "h") {
        e.preventDefault();
        setView("home");
      } else if (isCtrl && e.key === "s") {
        e.preventDefault();
        setView("subjects");
      } else if (isCtrl && e.key === "p") {
        e.preventDefault();
        setView("planner");
      } else if (isCtrl && e.key === "t") {
        e.preventDefault();
        setView("timer");
      } else if (isCtrl && e.key === "/") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setView, openSearch]);

  const navShortcuts = shortcuts.filter((s) => s.category === "navigation");
  const toolShortcuts = shortcuts.filter((s) => s.category === "tools");

  return (
    <>
      {/* Floating button - bottom left (scroll-to-top is bottom-right) */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-[70] w-11 h-11 rounded-full bg-gradient-to-br from-omni-gold-dark to-omni-gold text-white shadow-lg flex items-center justify-center"
        aria-label="اختصارات لوحة المفاتيح"
      >
        <Keyboard className="size-5" />
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:inset-x-auto sm:w-[420px] z-[90] glass rounded-2xl border border-border shadow-2xl overflow-hidden"
              dir="rtl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Keyboard className="size-5 text-omni-gold" />
                  <h2 className="text-lg font-bold text-foreground">اختصارات لوحة المفاتيح</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="إغلاق"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-5 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {/* Navigation section */}
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    تنقل
                  </h3>
                  <div className="space-y-2">
                    {navShortcuts.map((shortcut) => {
                      const IconComp = shortcut.icon;
                      return (
                        <div
                          key={shortcut.keys.join("+")}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-background/50 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            {IconComp && (
                              <div className="size-7 rounded-lg bg-omni-red/10 flex items-center justify-center">
                                <IconComp className="size-3.5 text-omni-red" />
                              </div>
                            )}
                            <span className="text-sm font-medium">{shortcut.label}</span>
                          </div>
                          <div className="flex items-center gap-1" dir="ltr">
                            {shortcut.keys.map((key, i) => (
                              <span key={i}>
                                <kbd className="px-2 py-1 text-xs font-mono font-bold rounded-md bg-neutral-800 text-neutral-200 border border-neutral-700 shadow-sm dark:bg-neutral-200 dark:text-neutral-800 dark:border-neutral-300">
                                  {key}
                                </kbd>
                                {i < shortcut.keys.length - 1 && (
                                  <span className="mx-0.5 text-muted-foreground text-xs">+</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tools section */}
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    أدوات
                  </h3>
                  <div className="space-y-2">
                    {toolShortcuts.map((shortcut) => {
                      const IconComp = shortcut.icon;
                      return (
                        <div
                          key={shortcut.keys.join("+")}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-background/50 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            {IconComp ? (
                              <div className="size-7 rounded-lg bg-omni-gold/10 flex items-center justify-center">
                                <IconComp className="size-3.5 text-omni-gold" />
                              </div>
                            ) : (
                              <div className="size-7 rounded-lg bg-muted flex items-center justify-center">
                                <Keyboard className="size-3.5 text-muted-foreground" />
                              </div>
                            )}
                            <span className="text-sm font-medium">{shortcut.label}</span>
                          </div>
                          <div className="flex items-center gap-1" dir="ltr">
                            {shortcut.keys.map((key, i) => (
                              <span key={i}>
                                <kbd className="px-2 py-1 text-xs font-mono font-bold rounded-md bg-neutral-800 text-neutral-200 border border-neutral-700 shadow-sm dark:bg-neutral-200 dark:text-neutral-800 dark:border-neutral-300">
                                  {key}
                                </kbd>
                                {i < shortcut.keys.length - 1 && (
                                  <span className="mx-0.5 text-muted-foreground text-xs">+</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer hint */}
              <div className="p-3 border-t border-border bg-background/30">
                <p className="text-[10px] text-muted-foreground text-center">
                  اضغط <kbd className="px-1 py-0.5 text-[9px] font-mono rounded bg-neutral-800 text-neutral-200 dark:bg-neutral-200 dark:text-neutral-800">Esc</kbd> للإغلاق
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
