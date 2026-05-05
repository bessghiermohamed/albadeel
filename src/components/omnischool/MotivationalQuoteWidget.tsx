"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Heart, Quote } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";

/* ------------------------------------------------------------------ */
/*  Arabic motivational/educational quotes                             */
/* ------------------------------------------------------------------ */
const quotes = [
  {
    text: "من جدّ وجد، ومن زرع حصد",
    author: "حكمة عربية",
  },
  {
    text: "اطلبوا العلم من المهد إلى اللحد",
    author: "حديث شريف",
  },
  {
    text: "العلم نور والجهل ظلام",
    author: "حكمة عربية",
  },
  {
    text: "إذا هبّت رياحك فاغتنمها",
    author: "الشريف الرضي",
  },
  {
    text: "اقرأ باسم ربك الذي خلق",
    author: "القرآن الكريم",
  },
  {
    text: "العلم يرفع بيوتاً لا عماد لها والجهل يهدم بيوت العز والكرم",
    author: "شعر عربي",
  },
  {
    text: "من أراد الدنيا فعليه بالعلم ومن أراد الآخرة فعليه بالعلم",
    author: "حديث شريف",
  },
  {
    text: "خير جليس في الزمان كتاب",
    author: "المتنبي",
  },
  {
    text: "إنما العلم بالتعلّم وإنما الحلم بالتحلّم",
    author: "حديث شريف",
  },
  {
    text: "ليس العلم ما حُفظ، إنما العلم ما نفع",
    author: "الإمام الشافعي",
  },
  {
    text: "العلم في الصغر كالنقش على الحجر",
    author: "حكمة عربية",
  },
  {
    text: "لا يصلح العلم بملاحة الوجه ولا بكثرة المال، وإنما يصلح بالعمل به",
    author: "الحسن البصري",
  },
  {
    text: "اطلبوا العلم ولو بالصين",
    author: "حديث شريف",
  },
  {
    text: "أنا أفكر، إذن أنا موجود",
    author: "رينيه ديكارت (ترجمة)",
  },
  {
    text: "التعليم هو أقوى سلاح يمكنك استخدامه لتغيير العالم",
    author: "نيلسون مانديلا (ترجمة)",
  },
  {
    text: "من لا يتقدم يتأخر، فالحياة لا تقف عند حد",
    author: "حكمة عربية",
  },
  {
    text: "الهمة ترفع صاحبها والكسل يضيع حظه",
    author: "حكمة عربية",
  },
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */
const quoteVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 40 : -40,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -40 : 40,
    transition: { duration: 0.3, ease: "easeIn" },
  }),
};

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */
export function MotivationalQuoteWidget() {
  const { favoriteQuotes, toggleFavoriteQuote } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  /* ---------- Auto-rotate ---------- */
  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(goNext, 8000);
    return () => clearInterval(interval);
  }, [goNext]);

  const isFavorite = favoriteQuotes.includes(currentIndex);
  const quote = quotes[currentIndex];

  return (
    <Card className="glass-dashboard overflow-hidden border-border shadow-lg relative">
      {/* Decorative gold accent at top */}
      <div className="h-1 w-full bg-gradient-to-l from-omni-red via-omni-gold to-omni-red" />

      {/* Decorative background circles */}
      <div className="absolute -top-10 -left-10 w-28 h-28 rounded-full bg-omni-gold/5 pointer-events-none" />
      <div className="absolute -bottom-8 -right-8 w-20 h-20 rounded-full bg-omni-red/5 pointer-events-none" />

      <CardContent className="p-6 sm:p-8 relative z-10">
        {/* Header row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Quote className="h-5 w-5 text-omni-gold" />
            <h3 className="text-base font-bold gradient-text-red-gold">
              حكمة اليوم
            </h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => toggleFavoriteQuote(currentIndex)}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{
              backgroundColor: isFavorite
                ? "rgba(185, 28, 28, 0.1)"
                : "transparent",
              color: isFavorite ? "#B91C1C" : "hsl(var(--muted-foreground))",
            }}
            aria-label={isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
          >
            <Heart
              className="h-4 w-4"
              fill={isFavorite ? "#B91C1C" : "none"}
            />
          </motion.button>
        </div>

        {/* Quote display */}
        <div className="min-h-[100px] flex items-center justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={quoteVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="text-center space-y-4 w-full"
            >
              {/* Decorative quotation mark */}
              <span className="text-4xl text-omni-gold/30 font-serif leading-none select-none">
                ❝
              </span>

              {/* Quote text */}
              <p className="text-lg sm:text-xl font-semibold text-foreground leading-relaxed">
                {quote.text}
              </p>

              {/* Author */}
              <p className="text-sm text-omni-gold-dark dark:text-omni-gold font-medium">
                — {quote.author}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation row */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
          {/* Previous */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goPrev}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-muted hover:bg-omni-red/10 text-muted-foreground hover:text-omni-red transition-colors"
            aria-label="الحكمة السابقة"
          >
            <ChevronRight className="h-4 w-4" />
          </motion.button>

          {/* Dots indicator */}
          <div className="flex items-center gap-1.5">
            {quotes.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className="rounded-full transition-all duration-300"
                style={{
                  width: idx === currentIndex ? 18 : 6,
                  height: 6,
                  backgroundColor:
                    idx === currentIndex
                      ? "#B91C1C"
                      : "hsl(var(--muted-foreground) / 0.3)",
                }}
                aria-label={`الحكمة ${idx + 1}`}
              />
            ))}
          </div>

          {/* Next */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goNext}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-muted hover:bg-omni-red/10 text-muted-foreground hover:text-omni-red transition-colors"
            aria-label="الحكمة التالية"
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.button>
        </div>
      </CardContent>
    </Card>
  );
}
