"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Megaphone } from "lucide-react";

export function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false);

  // Don't show if dismissed in this session
  if (dismissed) return null;

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="announcement-banner text-white text-center overflow-hidden"
        >
          <div className="mx-auto max-w-7xl px-4 py-2.5 flex items-center justify-center gap-3 text-sm sm:text-base">
            <Megaphone className="size-4 shrink-0 hidden sm:block" />
            <p className="font-medium leading-relaxed sm:leading-normal text-xs sm:text-sm md:text-base">
              🎓 مرحباً بكم في البديل! المنصة التعليمية لطلبة ENS — فرع PEP
            </p>
            <button
              onClick={() => setDismissed(true)}
              className="shrink-0 ms-2 rounded-full p-1 hover:bg-white/20 transition-colors"
              aria-label="إغلاق"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
