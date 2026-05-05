"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useAppStore } from "@/lib/store";

interface SubjectFavoriteToggleProps {
  subjectId: string;
  size?: number;
  className?: string;
}

export function SubjectFavoriteToggle({
  subjectId,
  size = 16,
  className = "",
}: SubjectFavoriteToggleProps) {
  const { favorites, toggleFavorite } = useAppStore();
  const isFavorite = favorites.includes(subjectId);

  return (
    <motion.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(subjectId);
      }}
      className={`relative flex items-center justify-center ${className}`}
      aria-label={isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
    >
      <AnimatePresence mode="wait">
        {isFavorite ? (
          <motion.div
            key="filled"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="animate-heart-pop"
          >
            <Heart
              size={size}
              className="fill-omni-red text-omni-red"
            />
          </motion.div>
        ) : (
          <motion.div
            key="outline"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Heart
              size={size}
              className="text-muted-foreground/40 hover:text-omni-red/60 transition-colors"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
