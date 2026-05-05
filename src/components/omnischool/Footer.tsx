"use client";

import { motion } from "framer-motion";
import { GraduationCap, Heart, Github, BookOpen, Mail, MapPin, ArrowUp, Twitter, Shield, FileText, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="mt-auto relative">
      {/* Elaborate multi-layer wave divider — 5 layers for depth */}
      <div className="w-full overflow-hidden leading-[0]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-16 sm:h-20">
          {/* Layer 1 — faintest, topmost */}
          <path fill="rgba(212, 168, 67, 0.04)" d="M0,20L120,22C240,24,480,28,720,24C960,20,1200,10,1320,8L1440,6L1440,80L0,80Z" />
          {/* Layer 2 — subtle red */}
          <path fill="rgba(185, 28, 28, 0.06)" d="M0,35L80,32C160,29,320,24,480,28C640,32,800,44,960,46C1120,48,1280,40,1360,36L1440,32L1440,80L0,80Z" />
          {/* Layer 3 — medium red */}
          <path fill="rgba(185, 28, 28, 0.12)" d="M0,45L60,42C120,39,240,34,360,38C480,42,600,50,720,52C840,54,960,48,1080,44C1200,40,1320,42,1380,44L1440,46L1440,80L0,80Z" />
          {/* Layer 4 — darker red */}
          <path fill="rgba(26, 10, 10, 0.6)" d="M0,55L72,53C144,51,288,48,432,50C576,52,720,58,864,57C1008,56,1152,50,1296,48L1440,52L1440,80L0,80Z" />
          {/* Layer 5 — solid dark, bottom */}
          <path fill="#1A0A0A" d="M0,62L96,60C192,58,384,55,576,57C768,59,960,65,1152,64C1344,63,1392,60,1440,62L1440,80L0,80Z" />
        </svg>
      </div>

      {/* Dark gradient background with Islamic pattern */}
      <div className="bg-gradient-to-b from-[#1A0A0A] to-[#0F0505] islamic-pattern-bg border-t border-omni-red/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* Logo & Description */}
            <div className="space-y-4 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-omni-red to-omni-red-dark flex items-center justify-center shadow-md">
                  <GraduationCap className="size-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  ال<span className="text-omni-gold">بديل</span>
                </span>
              </div>
              <p className="text-sm text-white/45 leading-relaxed">
                منصة تعليمية متكاملة لطلبة المدرسة العليا للأساتذة بالجزائر — مساعدتك نحو التفوق
              </p>
              {/* Decorative gold line */}
              <div className="w-20 h-0.5 bg-gradient-to-l from-omni-gold/60 via-omni-gold/30 to-omni-red/30 rounded-full" />
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-omni-gold flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-omni-gold/50" />
                روابط سريعة
              </h4>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-2.5 footer-link-hover text-white/45 cursor-pointer hover:text-white/70 transition-colors">
                  <BookOpen className="size-3.5" />
                  <span>24 مادة دراسية</span>
                </div>
                <div className="flex items-center gap-2.5 footer-link-hover text-white/45 cursor-pointer hover:text-white/70 transition-colors">
                  <MapPin className="size-3.5" />
                  <span>المدرسة العليا للأساتذة ENS</span>
                </div>
                <div className="flex items-center gap-2.5 footer-link-hover text-white/45 cursor-pointer hover:text-white/70 transition-colors">
                  <Mail className="size-3.5" />
                  <span>فرع PEP — الأدب العربي</span>
                </div>
              </div>
              {/* Legal Links */}
              <div className="flex items-center gap-4 pt-2">
                <a href="#" className="flex items-center gap-1.5 text-xs text-white/30 hover:text-omni-gold/70 transition-colors footer-link-hover">
                  <Shield className="size-3" />
                  الخصوصية
                </a>
                <a href="#" className="flex items-center gap-1.5 text-xs text-white/30 hover:text-omni-gold/70 transition-colors footer-link-hover">
                  <FileText className="size-3" />
                  الشروط
                </a>
              </div>
            </div>

            {/* Newsletter/Subscribe */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-omni-gold flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-omni-gold/50" />
                النشرة البريدية
              </h4>
              <p className="text-xs text-white/40 leading-relaxed">
                اشترك ليصلك كل جديد من التحديثات والموارد التعليمية
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="بريدك الإلكتروني"
                  className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/80 placeholder:text-white/25 focus:outline-none focus:border-omni-gold/40 focus:ring-1 focus:ring-omni-gold/20 transition-all"
                  dir="ltr"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-gradient-to-r from-omni-red to-omni-red-dark hover:from-omni-red-light hover:to-omni-red text-white rounded-lg px-3 py-2 transition-all shadow-sm"
                >
                  <Send className="size-3.5" />
                </motion.button>
              </form>
              {subscribed && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-omni-gold/80 flex items-center gap-1"
                >
                  <span>✓</span> تم الاشتراك بنجاح!
                </motion.p>
              )}
            </div>

            {/* Social */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-omni-gold flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-omni-gold/50" />
                تواصل معنا
              </h4>
              <div className="flex items-center gap-2.5 flex-wrap">
                <motion.div whileHover={{ scale: 1.12, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-white/35 hover:text-white hover:bg-white/8 rounded-lg border border-white/5 hover:border-white/15 transition-all"
                    onClick={() =>
                      window.open(
                        "https://github.com/bessghiermohamed/albadeel",
                        "_blank"
                      )
                    }
                    aria-label="GitHub"
                  >
                    <Github className="size-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.12, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-white/35 hover:text-white hover:bg-white/8 rounded-lg border border-white/5 hover:border-white/15 transition-all"
                    onClick={() =>
                      window.open("https://x.com/albadeel_ens", "_blank")
                    }
                    aria-label="Twitter / X"
                  >
                    <Twitter className="size-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.12, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-white/35 hover:text-white hover:bg-white/8 rounded-lg border border-white/5 hover:border-white/15 transition-all"
                    onClick={() =>
                      window.open("mailto:contact@albadeel.dz", "_blank")
                    }
                    aria-label="البريد الإلكتروني"
                  >
                    <Mail className="size-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>

          <Separator className="mb-6 bg-white/5" />

          {/* Credits Section — Enhanced */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              {/* Decorative heart animation */}
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Heart className="size-3.5 text-omni-red fill-omni-red/30" />
              </motion.div>
              <p className="text-xs text-white/35">
                صُمم بـ شغف بواسطة
                <span className="text-white/50 font-medium mr-1">Besseghier Mohamed</span>
              </p>
            </div>
            <div className="flex items-center gap-5">
              <p className="text-xs text-white/25">
                © {new Date().getFullYear()} البديل — جميع الحقوق محفوظة
                <span className="mr-1">🇩🇿</span>
              </p>
              {/* Back to top link */}
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToTop}
                className="footer-link-hover flex items-center gap-1.5 text-xs text-white/30 hover:text-omni-gold transition-colors bg-white/3 hover:bg-white/6 px-3 py-1.5 rounded-full border border-white/5"
              >
                <ArrowUp className="size-3" />
                العودة للأعلى
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
