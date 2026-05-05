"use client";

import { useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { subjectsData, categories } from "@/lib/subjects-data";
import { Subject } from "@/lib/types";
import { SubjectCard } from "./SubjectCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  BookOpen,
  Grid3X3,
  List,
  SlidersHorizontal,
  X,
  Heart,
  Library,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";

export function SubjectsGrid() {
  const { progress, selectSubject, selectedSemester, setSelectedSemester, favorites } =
    useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const filteredSubjects = useMemo(() => {
    let subjects = subjectsData.filter(
      (s) => s.semester === selectedSemester
    );

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      subjects = subjects.filter(
        (s) =>
          s.nameAr.includes(q) ||
          s.nameEn?.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.description?.includes(q)
      );
    }

    if (showFavorites) {
      subjects = subjects.filter((s) => favorites.includes(s.id));
    } else if (selectedCategory) {
      subjects = subjects.filter((s) => s.category === selectedCategory);
    }

    return subjects.sort((a, b) => a.order - b.order);
  }, [selectedSemester, searchQuery, selectedCategory, showFavorites, favorites]);

  const getProgress = (subjectId: string) =>
    progress.find((p) => p.subjectId === subjectId);

  /* Total subjects for current semester (no filters) */
  const totalSemesterSubjects = useMemo(
    () => subjectsData.filter((s) => s.semester === selectedSemester).length,
    [selectedSemester]
  );

  /* Check if any filters are active */
  const hasActiveFilters = searchQuery.trim() !== "" || selectedCategory !== "" || showFavorites;

  /* Clear all filters */
  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("");
    setShowFavorites(false);
  }, []);

  /* Keyboard shortcut: Ctrl+K to focus search */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const input = document.getElementById("subjects-search-input");
        input?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ========== Page Title Section ========== */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-omni-red to-omni-gold flex items-center justify-center shadow-lg shrink-0">
            <Library className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black gradient-text-red-gold">
              المواد الدراسية
            </h1>
            <p className="text-muted-foreground mt-0.5 text-xs sm:text-sm font-medium">
              تصفح جميع المواد —{" "}
              <span className="text-omni-red font-bold">{totalSemesterSubjects}</span> مادة في{" "}
              {selectedSemester === 1 ? "السداسي الأول" : "السداسي الثاني"}
              {hasActiveFilters && (
                <span className="text-omni-gold">
                  {" "}· {filteredSubjects.length} نتيجة
                </span>
              )}
            </p>
          </div>
        </div>
        {/* Decorative accent line */}
        <div className="decorative-line mt-3" />
      </motion.div>

      {/* ========== Search & Filter Bar ========== */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search — larger and more prominent */}
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-omni-red/60" />
            <Input
              id="subjects-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم أو الرمز أو الوصف..."
              className="pe-12 ps-20 h-13 text-base glass border-border rounded-xl search-glow-pulse focus:ring-omni-red/30"
            />
            {/* Keyboard shortcut hint */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-muted-foreground/60 bg-muted/60 border border-border/50 rounded">
                <span className="text-[9px]">Ctrl</span>K
              </kbd>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-14 sm:left-20 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-omni-red transition-colors"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* View mode toggle + Filter button */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="h-11 w-11"
            >
              <Grid3X3 className="size-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="h-11 w-11"
            >
              <List className="size-4" />
            </Button>
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`h-11 gap-2 px-4 ${showFilters ? "bg-omni-red hover:bg-omni-red/90" : ""}`}
            >
              <SlidersHorizontal className="size-4" />
              <span className="hidden sm:inline">تصفية</span>
            </Button>
          </div>
        </div>

        {/* ========== Category Filters ========== */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="glass rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Filter className="size-4 text-omni-red" />
                    تصفية حسب التصنيف
                  </h3>
                  {(selectedCategory || showFavorites) && (
                    <button
                      onClick={() => { setSelectedCategory(""); setShowFavorites(false); }}
                      className="text-xs text-muted-foreground hover:text-omni-red transition-colors flex items-center gap-1"
                    >
                      <X className="size-3" />
                      إزالة التصفية
                    </button>
                  )}
                </div>

                {/* Category badges with color dots */}
                <div className="flex flex-wrap gap-2">
                  {/* All */}
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Badge
                      variant={selectedCategory === "" && !showFavorites ? "default" : "outline"}
                      className={`cursor-pointer transition-all text-sm px-4 py-2 rounded-lg font-semibold ${
                        selectedCategory === "" && !showFavorites
                          ? "bg-omni-red hover:bg-omni-red/90 text-white shadow-md"
                          : "hover:border-omni-red/30"
                      }`}
                      onClick={() => { setSelectedCategory(""); setShowFavorites(false); }}
                    >
                      الكل
                      <span className="ms-1.5 text-[10px] opacity-70">({totalSemesterSubjects})</span>
                    </Badge>
                  </motion.div>

                  {/* Favorites */}
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Badge
                      variant={showFavorites ? "default" : "outline"}
                      className={`cursor-pointer transition-all gap-1.5 text-sm px-4 py-2 rounded-lg font-semibold ${
                        showFavorites
                          ? "bg-omni-red hover:bg-omni-red/90 text-white shadow-md"
                          : "hover:border-omni-red/30"
                      }`}
                      style={
                        !showFavorites
                          ? { borderColor: "rgba(185, 28, 28, 0.25)", color: "#B91C1C" }
                          : undefined
                      }
                      onClick={() => { setShowFavorites(true); setSelectedCategory(""); }}
                    >
                      <Heart className="size-3.5" />
                      المفضلة
                      {favorites.length > 0 && (
                        <span className="text-[10px] opacity-70">({favorites.length})</span>
                      )}
                    </Badge>
                  </motion.div>

                  {/* Category badges with colored dots */}
                  {categories.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    return (
                      <motion.div key={cat.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Badge
                          variant={isActive ? "default" : "outline"}
                          className={`cursor-pointer transition-all text-sm px-4 py-2 rounded-lg font-semibold ${
                            isActive
                              ? "text-white shadow-md"
                              : "hover:border-border"
                          }`}
                          style={
                            isActive
                              ? { backgroundColor: cat.color, borderColor: cat.color }
                              : {
                                  borderColor: `${cat.color}35`,
                                  color: cat.color,
                                }
                          }
                          onClick={() => { setSelectedCategory(cat.id); setShowFavorites(false); }}
                        >
                          <span
                            className="inline-block w-2 h-2 rounded-full me-1.5"
                            style={{ backgroundColor: cat.color }}
                          />
                          {cat.label}
                        </Badge>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Animated results count */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${filteredSubjects.length}-${selectedCategory}-${showFavorites}`}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 pt-1"
                  >
                    <Sparkles className="size-3.5 text-omni-gold" />
                    <span className="text-xs text-muted-foreground font-medium">
                      {filteredSubjects.length === 0
                        ? "لا توجد نتائج مطابقة"
                        : `${filteredSubjects.length} مادة مطابقة`}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ========== Semester Tabs ========== */}
      <motion.div variants={itemVariants}>
        <Tabs
          value={String(selectedSemester)}
          onValueChange={(v) => setSelectedSemester(Number(v) as 1 | 2)}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="1" className="gap-2">
              <BookOpen className="size-4" />
              السداسي الأول
            </TabsTrigger>
            <TabsTrigger value="2" className="gap-2">
              <BookOpen className="size-4" />
              السداسي الثاني
            </TabsTrigger>
          </TabsList>

          {([1, 2] as const).map((sem) => (
            <TabsContent key={sem} value={String(sem)}>
              {/* Results count */}
              <div className="mb-4 flex items-center justify-between">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={filteredSubjects.length}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm text-muted-foreground font-medium"
                  >
                    {filteredSubjects.length === 0
                      ? "لا توجد نتائج"
                      : `${filteredSubjects.length} مادة`}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Subjects Grid/List */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${sem}-${viewMode}-${selectedCategory}-${searchQuery}`}
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                      : "flex flex-col gap-3"
                  }
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredSubjects.map((subject, idx) => (
                    <motion.div
                      key={subject.id}
                      variants={itemVariants}
                      className="card-hover-lift card-entrance"
                      style={{ animationDelay: `${idx * 60}ms` }}
                    >
                      <SubjectCard
                        subject={subject}
                        progress={getProgress(subject.id)}
                        onClick={() => selectSubject(subject.id)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* ========== Empty State ========== */}
              {filteredSubjects.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  {/* Engaging empty illustration */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-omni-red/10 to-omni-gold/10 flex items-center justify-center border border-border/30">
                      <BookOpen className="size-12 text-omni-red/40" />
                    </div>
                    {/* Floating sparkle decorations */}
                    <motion.div
                      className="absolute -top-2 -right-2"
                      animate={{ rotate: [0, 15, 0], scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="size-5 text-omni-gold/60" />
                    </motion.div>
                    <motion.div
                      className="absolute -bottom-1 -left-1"
                      animate={{ rotate: [0, -10, 0], scale: [1, 1.15, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                    >
                      <Search className="size-4 text-omni-red/40" />
                    </motion.div>
                  </div>

                  <p className="text-lg font-bold text-foreground mb-2">
                    لا توجد مواد مطابقة
                  </p>
                  <p className="text-sm text-muted-foreground/70 mb-5 max-w-sm">
                    حاول تغيير كلمات البحث أو إزالة عوامل التصفية للعثور على ما تبحث عنه
                  </p>

                  {/* Clear filters button */}
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      onClick={clearAllFilters}
                      className="gap-2 border-omni-red/30 text-omni-red hover:bg-omni-red/10 hover:text-omni-red"
                    >
                      <RotateCcw className="size-4" />
                      إزالة جميع التصفيات
                    </Button>
                  )}
                </motion.div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
