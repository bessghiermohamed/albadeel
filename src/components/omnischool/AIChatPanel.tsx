"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot,
  X,
  Send,
  Minimize2,
  Maximize2,
  Sparkles,
  MessageCircle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

/* ------------------------------------------------------------------ */
/*  Quick questions                                                    */
/* ------------------------------------------------------------------ */
const quickQuestions = [
  "ما هي أفضل طريقة للمذاكرة؟",
  "ساعدني في التخطيط",
  "نصائح للنجاح",
];

/* ------------------------------------------------------------------ */
/*  Mock AI responses (fallback if API not available)                  */
/* ------------------------------------------------------------------ */
const mockResponses: Record<string, string> = {
  "ما هي أفضل طريقة للمذاكرة؟":
    "إليك أفضل طرق المذاكرة الفعّالة:\n\n1. **تقنية بومودورو**: ادرس 25 دقيقة ثم استرح 5 دقائق\n2. **المراجعة المتفرقة**: راجع المعلومات على فترات متباعدة\n3. **الاسترجاع النشط**: اختبر نفسك بدلاً من إعادة القراءة\n4. **تدوين الملاحظات بطريقتك**: اكتب بأسلوبك الخاص\n5. **الشرح للآخرين**: علّم زميلك لتثبيت المعلومة\n\nتذكّر: الجودة أهم من الكمية! 📚",
  "ساعدني في التخطيط":
    "بالتأكيد! إليك خطة دراسية نموذجية:\n\n📅 **الخطة الأسبوعية:**\n\n- **السبت-الأربعاء**: دراسة المواد الأساسية (3 ساعات يومياً)\n- **الخميس**: مراجعة شاملة + حل تمارين\n- **الجمعة**: راحة + مراجعة خفيفة\n\n⏰ **توزيع اليوم:**\n- 8:00-10:00 مادة صعبة\n- 10:30-12:00 مادة متوسطة\n- بعد الظهر: مراجعة + ملاحظات\n\nابدأ بالمواد الأصعب عندما تكون طاقتك في القمة! 💪",
  "نصائح للنجاح":
    "نصائح ذهبية للنجاح الدراسي:\n\n🏆 **التحفيز:**\n- حدد أهدافك بوضوح\n- كافئ نفسك عند الإنجاز\n\n📝 **الدراسة:**\n- لا تؤجل المهام\n- حضر الدرس قبل الحضور\n- راجع في نفس اليوم\n\n🧠 **الصحة النفسية:**\n- نم 7-8 ساعات\n- مارس الرياضة\n- تواصل مع زملائك\n\n💪 تذكّر: النجاح رحلة وليس وجهة! كل يوم هو فرصة جديدة للتقدم.",
};

const defaultResponse =
  "شكراً لسؤالك! أنا مساعدك التعليمي في البديل. يمكنني مساعدتك في:\n\n- 📚 نصائح المذاكرة والمراجعة\n- 📅 التخطيط الدراسي\n- 💡 شرح المفاهيم التربوية\n- 🎯 تحسين أدائك الأكاديمي\n\nجرّب سؤالي عن أي من هذه المواضيع!";

function getMockResponse(message: string): string {
  const lowerMessage = message.trim();
  for (const [key, value] of Object.entries(mockResponses)) {
    if (lowerMessage.includes(key) || key.includes(lowerMessage)) {
      return value;
    }
  }

  // Keyword matching
  if (lowerMessage.includes("مذاكر") || lowerMessage.includes("دراس")) {
    return mockResponses["ما هي أفضل طريقة للمذاكرة؟"];
  }
  if (lowerMessage.includes("تخطيط") || lowerMessage.includes("خطة") || lowerMessage.includes("جدول")) {
    return mockResponses["ساعدني في التخطيط"];
  }
  if (lowerMessage.includes("نجاح") || lowerMessage.includes("نصيح") || lowerMessage.includes("نصائح")) {
    return mockResponses["نصائح للنجاح"];
  }

  return defaultResponse;
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */
const panelVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.9,
    transformOrigin: "bottom left",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.9,
    transition: { duration: 0.2 },
  },
};

const fabVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 400, damping: 20, delay: 0.5 },
  },
  hover: {
    scale: 1.1,
    boxShadow: "0 0 25px rgba(185, 28, 28, 0.4), 0 0 50px rgba(185, 28, 28, 0.1)",
  },
  tap: { scale: 0.9 },
};

const messageVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },
};

/* ------------------------------------------------------------------ */
/*  Typing indicator                                                   */
/* ------------------------------------------------------------------ */
function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 mb-3">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-omni-red to-omni-red-dark flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="glass-gold rounded-2xl rounded-tr-sm px-4 py-3 border border-omni-gold/20">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-omni-gold"
              animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */
export function AIChatPanel() {
  const { chatOpen, toggleChat } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Auto-scroll to bottom */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  /* Focus input when panel opens */
  useEffect(() => {
    if (chatOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [chatOpen]);

  /* Add welcome message on first open */
  useEffect(() => {
    if (chatOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: "مرحباً! 👋 أنا مساعدك التعليمي في البديل. كيف يمكنني مساعدتك اليوم؟",
          timestamp: Date.now(),
        },
      ]);
    }
  }, [chatOpen]);

  /* Send message */
  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Try API first
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: data.message || defaultResponse,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error("API error");
      }
    } catch {
      // Fallback to mock
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: getMockResponse(text.trim()),
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  return (
    <>
      {/* Floating Action Button — RTL: bottom-left */}
      <AnimatePresence>
        {!chatOpen && (
          <motion.button
            variants={fabVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            onClick={toggleChat}
            className="fixed bottom-6 left-6 z-[80] w-14 h-14 rounded-full bg-gradient-to-br from-omni-red to-omni-red-dark text-white shadow-xl glow-red flex items-center justify-center"
            aria-label="فتح المساعد الذكي"
          >
            <MessageCircle className="w-6 h-6" />
            {/* Pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-omni-red"
              animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed z-[80] flex flex-col overflow-hidden shadow-2xl rounded-2xl border border-white/10 ${
              isExpanded
                ? "inset-4 sm:inset-8"
                : "bottom-6 left-6 w-[360px] h-[520px] sm:w-[400px] sm:h-[560px]"
            }`}
            style={{ direction: "rtl" }}
          >
            {/* Glass morphism background */}
            <div className="absolute inset-0 glass-strong" />
            <div className="absolute inset-0 bg-gradient-to-b from-omni-red/5 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-omni-red to-omni-red-dark flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">المساعد الذكي</h3>
                  <div className="flex items-center gap-1.5">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-green-500"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-[10px] text-muted-foreground">متصل</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                >
                  {isExpanded ? (
                    <Minimize2 className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Maximize2 className="w-4 h-4 text-muted-foreground" />
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleChat}
                  className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </div>
            </div>

            {/* Messages area */}
            <div className="relative z-10 flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div ref={scrollRef} className="p-4 space-y-1">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      className={`flex items-start gap-2 mb-3 ${
                        msg.role === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          msg.role === "user"
                            ? "bg-gradient-to-br from-omni-gold to-omni-gold-dark"
                            : "bg-gradient-to-br from-omni-red to-omni-red-dark"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <span className="text-white text-xs font-bold">أ</span>
                        ) : (
                          <Bot className="w-3.5 h-3.5 text-white" />
                        )}
                      </div>

                      {/* Bubble */}
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-gradient-to-br from-omni-gold to-omni-gold-dark text-white rounded-tl-sm"
                            : "glass-gold border border-omni-gold/15 text-foreground rounded-tr-sm"
                        }`}
                      >
                        {msg.content.split("\n").map((line, i) => (
                          <span key={i}>
                            {line}
                            {i < msg.content.split("\n").length - 1 && <br />}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && <TypingIndicator />}
                </div>
              </ScrollArea>
            </div>

            {/* Quick questions */}
            {messages.length <= 1 && !isTyping && (
              <div className="relative z-10 px-4 pb-2">
                <div className="flex flex-wrap gap-1.5">
                  {quickQuestions.map((q, i) => (
                    <motion.button
                      key={q}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleQuickQuestion(q)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-omni-red/5 dark:bg-omni-red/10 text-omni-red dark:text-red-400 border border-omni-red/10 dark:border-omni-red/20 hover:bg-omni-red/10 dark:hover:bg-omni-red/20 transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      {q}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input area */}
            <div className="relative z-10 p-3 border-t border-border/50">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="اكتب سؤالك هنا..."
                  disabled={isTyping}
                  className="flex-1 h-10 bg-muted/50 border-border/50 focus:border-omni-red/30 focus:ring-omni-red/20 text-sm"
                  dir="rtl"
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!inputValue.trim() || isTyping}
                    className="h-10 w-10 rounded-xl bg-gradient-to-br from-omni-red to-omni-red-dark hover:from-omni-red-light hover:to-omni-red text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
