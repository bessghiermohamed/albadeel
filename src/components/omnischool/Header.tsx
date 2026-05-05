"use client";

import { useAppStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  X,
  Sun,
  Moon,
  Home,
  BookOpen,
  LayoutDashboard,
  Search,
  Info,
  GraduationCap,
  CalendarDays,
  Timer,
  Library,
  User,
  Sparkles,
} from "lucide-react";
import { NotificationCenter } from "@/components/omnischool/NotificationCenter";
import { useState, useEffect } from "react";
import type { ViewType } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Nav link data                                                      */
/* ------------------------------------------------------------------ */
interface NavLink {
  label: string;
  view: ViewType;
  icon: React.ElementType;
  group: "main" | "tools";
}

const NAV_LINKS: NavLink[] = [
  { label: "الرئيسية", view: "home", icon: Home, group: "main" },
  { label: "المواد", view: "subjects", icon: BookOpen, group: "main" },
  { label: "لوحة الطالب", view: "dashboard", icon: LayoutDashboard, group: "main" },
  { label: "مكتبة الموارد", view: "resources", icon: Library, group: "main" },
  { label: "مخطط الدراسة", view: "planner", icon: CalendarDays, group: "tools" },
  { label: "مؤقت البومودورو", view: "timer", icon: Timer, group: "tools" },
  { label: "بحث متقدم", view: "search", icon: Search, group: "tools" },
  { label: "حول المنصة", view: "about", icon: Info, group: "tools" },
];

/* ------------------------------------------------------------------ */
/*  Header component                                                   */
/* ------------------------------------------------------------------ */
export default function Header() {
  const { currentView, setView, theme, toggleTheme, userName } = useAppStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Track scroll for enhanced glass effect */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Apply theme class to <html> */
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  /* Keyboard shortcut: Ctrl+K for search */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setView("search");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setView]);

  const handleNav = (view: ViewType) => {
    setView(view);
    setMobileOpen(false);
  };

  const mainLinks = NAV_LINKS.filter((l) => l.group === "main");
  const toolLinks = NAV_LINKS.filter((l) => l.group === "tools");

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "glass-strong shadow-xl border-b border-omni-gold/10"
          : "glass"
      }`}
      style={
        scrolled
          ? {
              boxShadow:
                "0 4px 30px rgba(185, 28, 28, 0.08), 0 1px 0 rgba(212, 168, 67, 0.15)",
            }
          : undefined
      }
    >
      {/* Subtle border-bottom glow on scroll */}
      <AnimatePresence>
        {scrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-0 inset-x-0 h-[2px]"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(212, 168, 67, 0.3) 30%, rgba(185, 28, 28, 0.2) 70%, transparent 100%)",
            }}
          />
        )}
      </AnimatePresence>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ---- Logo (RTL → right side) ---- */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="flex cursor-pointer items-center gap-2.5 group"
          onClick={() => handleNav("home")}
        >
          {/* Logo icon with glow */}
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-500"
              style={{
                background:
                  "radial-gradient(circle, rgba(212, 168, 67, 0.4) 0%, transparent 70%)",
              }}
            />
            <GraduationCap className="size-8 text-omni-gold relative z-10 transition-transform duration-300 group-hover:rotate-[-5deg]" />
          </div>

          {/* Logo text with gold gradient */}
          <span className="text-xl font-bold tracking-tight">
            <span className="text-foreground">ال</span>
            <span
              className="bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #D4A843 0%, #E5C168 50%, #D4A843 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}
            >
              بديل
            </span>
          </span>
        </motion.div>

        {/* ---- Desktop nav links ---- */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {/* Main navigation group */}
          {mainLinks.map((link) => {
            const isActive = currentView === link.view;
            const Icon = link.icon;
            return (
              <motion.button
                key={link.view}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleNav(link.view)}
                className={`relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "nav-link-active text-omni-red dark:text-red-400"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {/* Subtle icon background on hover */}
                <span
                  className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-omni-red/8 dark:bg-red-900/15"
                      : "group-hover:bg-muted/50"
                  }`}
                  style={{
                    backgroundColor: isActive
                      ? undefined
                      : undefined,
                  }}
                />
                <Icon className="size-4 relative z-10" />
                <span className="relative z-10">{link.label}</span>

                {/* Active indicator — thicker gold underline */}
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      layoutId="activeNav"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "70%" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[3px] rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, #D4A843, #E5C168)",
                        boxShadow: "0 0 8px rgba(212, 168, 67, 0.4)",
                      }}
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}

          {/* Visual separator between nav groups */}
          <div className="mx-2 h-6 w-px bg-gradient-to-b from-transparent via-omni-gold/30 to-transparent" />

          {/* Tools navigation group */}
          {toolLinks.map((link) => {
            const isActive = currentView === link.view;
            const Icon = link.icon;
            return (
              <motion.button
                key={link.view}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleNav(link.view)}
                className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "nav-link-active text-omni-red dark:text-red-400"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
                <span>{link.label}</span>

                {/* Active indicator — thicker gold underline */}
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      layoutId="activeNav"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "70%" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[3px] rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, #D4A843, #E5C168)",
                        boxShadow: "0 0 8px rgba(212, 168, 67, 0.4)",
                      }}
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </nav>

        {/* ---- Right actions: notifications + theme toggle + mobile menu ---- */}
        <div className="flex items-center gap-2">
          {/* Notification Center */}
          <NotificationCenter />

          {/* Theme toggle — enhanced with glow & larger button */}
          <motion.div whileTap={{ scale: 0.88 }} className="relative">
            {/* Background glow effect on toggle */}
            <motion.div
              key={theme + "-glow"}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  theme === "dark"
                    ? "radial-gradient(circle, rgba(212, 168, 67, 0.3) 0%, transparent 70%)"
                    : "radial-gradient(circle, rgba(185, 28, 28, 0.2) 0%, transparent 70%)",
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="تبديل المظهر"
              className="relative h-10 w-10 rounded-full overflow-hidden hover:bg-muted/60"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                  <motion.span
                    key="sun"
                    initial={{ rotate: -180, opacity: 0, scale: 0 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 180, opacity: 0, scale: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <Sun className="size-5 text-omni-gold" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ rotate: 180, opacity: 0, scale: 0 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -180, opacity: 0, scale: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <Moon className="size-5 text-omni-red" />
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>

          {/* Mobile hamburger */}
          <div className="lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="القائمة"
                  className="h-10 w-10"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="glass-strong w-80 p-0 overflow-hidden"
              >
                {/* Profile section at top */}
                <div
                  className="relative px-6 pt-8 pb-6 overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(185, 28, 28, 0.08) 0%, rgba(212, 168, 67, 0.06) 50%, rgba(185, 28, 28, 0.04) 100%)",
                  }}
                >
                  {/* Decorative circles */}
                  <div
                    className="absolute -top-4 -left-4 w-24 h-24 rounded-full opacity-10"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(212, 168, 67, 0.5) 0%, transparent 70%)",
                    }}
                  />
                  <div
                    className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full opacity-10"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(185, 28, 28, 0.4) 0%, transparent 70%)",
                    }}
                  />

                  <div className="flex items-center gap-3 relative z-10">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-omni-red/10 border-2 border-omni-gold/30">
                      <User className="size-5 text-omni-red" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-foreground">
                        {userName || "طالب"}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Sparkles className="size-3 text-omni-gold" />
                        منصة البديل التعليمية
                      </p>
                    </div>
                  </div>

                  {/* Logo line */}
                  <div className="mt-4 flex items-center gap-2 relative z-10">
                    <GraduationCap className="size-5 text-omni-gold" />
                    <span className="text-sm font-bold">
                      ال
                      <span
                        className="bg-clip-text"
                        style={{
                          backgroundImage:
                            "linear-gradient(135deg, #D4A843, #E5C168)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          color: "transparent",
                        }}
                      >
                        بديل
                      </span>
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="divider-omni mx-4 my-2" />

                {/* Mobile links — Main group */}
                <div className="px-3 py-1">
                  <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
                    التنقل الرئيسي
                  </p>
                  <nav className="flex flex-col gap-0.5">
                    {mainLinks.map((link, idx) => {
                      const isActive = currentView === link.view;
                      const Icon = link.icon;
                      return (
                        <motion.button
                          key={link.view}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleNav(link.view)}
                          className={`relative flex items-center gap-3 rounded-xl px-4 py-3 text-right text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-omni-red/10 text-omni-red dark:bg-red-900/20 dark:text-red-400"
                              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                          }`}
                        >
                          <Icon className="size-5" />
                          <span>{link.label}</span>
                          {isActive && (
                            <motion.span
                              layoutId="mobileActive"
                              className="ms-auto h-2 w-2 rounded-full bg-omni-red dark:bg-red-400"
                              style={{
                                boxShadow:
                                  "0 0 8px rgba(185, 28, 28, 0.4)",
                              }}
                            />
                          )}
                          {/* Active background bar */}
                          {isActive && (
                            <motion.div
                              layoutId="mobileActiveBar"
                              className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-l-full"
                              style={{
                                background:
                                  "linear-gradient(180deg, #B91C1C, #D4A843)",
                              }}
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </nav>
                </div>

                {/* Separator */}
                <div className="mx-6 my-2 h-px bg-gradient-to-r from-transparent via-omni-gold/20 to-transparent" />

                {/* Mobile links — Tools group */}
                <div className="px-3 py-1">
                  <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
                    أدوات الدراسة
                  </p>
                  <nav className="flex flex-col gap-0.5">
                    {toolLinks.map((link, idx) => {
                      const isActive = currentView === link.view;
                      const Icon = link.icon;
                      return (
                        <motion.button
                          key={link.view}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (mainLinks.length + idx) * 0.05 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleNav(link.view)}
                          className={`relative flex items-center gap-3 rounded-xl px-4 py-3 text-right text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-omni-red/10 text-omni-red dark:bg-red-900/20 dark:text-red-400"
                              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                          }`}
                        >
                          <Icon className="size-5" />
                          <span>{link.label}</span>
                          {isActive && (
                            <motion.span
                              layoutId="mobileActive"
                              className="ms-auto h-2 w-2 rounded-full bg-omni-red dark:bg-red-400"
                              style={{
                                boxShadow:
                                  "0 0 8px rgba(185, 28, 28, 0.4)",
                              }}
                            />
                          )}
                          {isActive && (
                            <motion.div
                              layoutId="mobileActiveBar"
                              className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-l-full"
                              style={{
                                background:
                                  "linear-gradient(180deg, #B91C1C, #D4A843)",
                              }}
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </nav>
                </div>

                {/* Bottom decorative section */}
                <div className="absolute bottom-0 inset-x-0 border-t border-border/50 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <p
                      className="text-xs text-muted-foreground"
                      dir="rtl"
                    >
                      منصة البديل التعليمية
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setMobileOpen(false)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
