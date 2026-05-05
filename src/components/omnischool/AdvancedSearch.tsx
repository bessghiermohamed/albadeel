"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { subjectsData, categories, searchSubjects } from "@/lib/subjects-data";
import { Subject } from "@/lib/types";
import { SubjectCard } from "./SubjectCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  X,
  Filter,
  SlidersHorizontal,
  BookOpen,
  Sparkles,
  TrendingUp,
  Clock,
  Star,
} from "lucide-react";

export function AdvancedSearch() {
  const { progress, selectSubject, searchQuery, setSearchQuery, searchCategory, setSearchCategory } =
    useAppStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(() => {
    if (!localQuery.trim() && !searchCategory) return [];
    let filtered = searchSubjects(localQuery);

    if (searchCategory) {
      filtered = filtered.filter((s) => s.category === searchCategory);
    }

    return filtered;
  }, [localQuery, searchCategory]);

  const allFiltered = useMemo(() => {
    if (!localQuery.trim() && !searchCategory) return subjectsData;
    let filtered = localQuery.trim() ? searchSubjects(localQuery) : subjectsData;
    if (searchCategory) {
      filtered = filtered.filter((s) => s.category === searchCategory);
    }
    return filtered;
  }, [localQuery, searchCategory]);

  /* Trending searches */
  const trendingSearches = [
    "علم النفس",
    "اللغة العربية",
    "تربوية",
    "مناهج",
    "إحصاء",
    "تدريس",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const getProgress = (subjectId: string) =>
    progress.find((p) => p.subjectId === subjectId);

  return (
    <motion.div
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
          <Search className="size-8 text-omni-red" />
          بحث متقدم
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          ابحث في جميع المواد الدراسية بالعربية أو الإنجليزية
        </p>
      </motion.div>

      {/* Search Bar - Large */}
      <motion.div variants={itemVariants}>
        <div className="glass rounded-2xl p-6 space-y-4">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <Input
              type="text"
              value={localQuery}
              onChange={(e) => {
                setLocalQuery(e.target.value);
                setSearchQuery(e.target.value);
              }}
              placeholder="اكتب اسم المادة، التصنيف، الكود، أو أي كلمة مفتاحية..."
              className="pe-12 h-14 text-lg border-border rounded-xl"
              autoFocus
            />
            {localQuery && (
              <button
                onClick={() => {
                  setLocalQuery("");
                  setSearchQuery("");
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="size-5" />
              </button>
            )}
          </div>

          {/* Quick filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Sparkles className="size-3.5 text-omni-gold" />
              عمليات بحث شائعة:
            </span>
            {trendingSearches.map((term) => (
              <Badge
                key={term}
                variant="outline"
                className="cursor-pointer hover:bg-omni-red/5 hover:border-omni-red/30 transition-all"
                onClick={() => {
                  setLocalQuery(term);
                  setSearchQuery(term);
                }}
              >
                {term}
              </Badge>
            ))}
          </div>

          {/* Category filter */}
          <div className="space-y-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <SlidersHorizontal className="size-3.5" />
              تصفية حسب التصنيف
              <span className="text-xs">({categories.length})</span>
            </button>
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Badge
                      variant={searchCategory === "" ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSearchCategory("")}
                    >
                      الكل
                    </Badge>
                    {categories.map((cat) => (
                      <Badge
                        key={cat.id}
                        variant={searchCategory === cat.id ? "default" : "outline"}
                        className="cursor-pointer"
                        style={
                          searchCategory === cat.id
                            ? { backgroundColor: cat.color, borderColor: cat.color }
                            : { borderColor: `${cat.color}40`, color: cat.color }
                        }
                        onClick={() => setSearchCategory(cat.id)}
                      >
                        {cat.label}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Results Stats */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {localQuery.trim() || searchCategory ? (
              <>
                تم العثور على{" "}
                <span className="font-bold text-foreground">
                  {allFiltered.length}
                </span>{" "}
                نتيجة
              </>
            ) : (
              "جميع المواد الدراسية"
            )}
          </p>
          {(localQuery || searchCategory) && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs"
              onClick={() => {
                setLocalQuery("");
                setSearchQuery("");
                setSearchCategory("");
              }}
            >
              <X className="size-3" />
              إزالة التصفية
            </Button>
          )}
        </div>
      </motion.div>

      {/* Results Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerVariants}
      >
        <AnimatePresence mode="popLayout">
          {allFiltered.map((subject) => (
            <motion.div
              key={subject.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.9 }}
              layout
            >
              <SubjectCard
                subject={subject}
                progress={getProgress(subject.id)}
                onClick={() => selectSubject(subject.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {allFiltered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <Search className="size-20 text-muted-foreground/20 mb-6" />
          <p className="text-xl font-medium text-muted-foreground mb-2">
            لا توجد نتائج
          </p>
          <p className="text-sm text-muted-foreground/70 max-w-md">
            حاول استخدام كلمات بحث مختلفة أو تغيير التصنيف المحدد
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setLocalQuery("");
              setSearchQuery("");
              setSearchCategory("");
            }}
          >
            إزالة جميع التصفيات
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
