"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Trash2,
} from "lucide-react";

export function DataExportImport() {
  const { progress, subjectNotes, studySessions, achievements, resetProgress } = useAppStore();
  const [exportSuccess, setExportSuccess] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importError, setImportError] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleExport = () => {
    const data = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      progress,
      subjectNotes,
      studySessions,
      achievements,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `albadeel-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2000);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (!data.version || !data.progress) {
            throw new Error("ملف غير صالح");
          }
          // Import data into store
          // Since we use persist middleware, we can directly update localStorage
          const currentState = JSON.parse(
            localStorage.getItem("albadeel-storage") || "{}"
          );
          const newState = {
            ...currentState,
            state: {
              ...currentState.state,
              progress: data.progress || [],
              subjectNotes: data.subjectNotes || {},
              studySessions: data.studySessions || [],
              achievements: data.achievements || [],
            },
          };
          localStorage.setItem(
            "albadeel-storage",
            JSON.stringify(newState)
          );
          setImportSuccess(true);
          setImportError("");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } catch {
          setImportError("خطأ في قراءة الملف. تأكد من أنه ملف نسخة احتياطية صالح.");
          setImportSuccess(false);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleReset = () => {
    resetProgress();
    setShowResetConfirm(false);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <Card className="glass card-ornament overflow-hidden border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Download className="size-5 text-omni-gold" />
          إدارة البيانات
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          صدّر بياناتك للاحتفاظ بنسخة احتياطية، أو استورد بيانات سابقة
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Export */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleExport}
              className={`w-full gap-2 btn-ripple ${exportSuccess ? 'bg-green-600 hover:bg-green-700' : 'btn-omni-primary'}`}
            >
              {exportSuccess ? (
                <>
                  <CheckCircle2 className="size-4" />
                  تم التصدير ✓
                </>
              ) : (
                <>
                  <Download className="size-4" />
                  تصدير البيانات
                </>
              )}
            </Button>
          </motion.div>

          {/* Import */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleImport}
              variant="outline"
              className="w-full gap-2 btn-ripple"
            >
              {importSuccess ? (
                <>
                  <CheckCircle2 className="size-4 text-green-600" />
                  تم الاستيراد ✓
                </>
              ) : (
                <>
                  <Upload className="size-4" />
                  استيراد البيانات
                </>
              )}
            </Button>
          </motion.div>
        </div>

        {importError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 p-2 rounded-lg bg-red-50 dark:bg-red-900/10"
          >
            <AlertTriangle className="size-4 shrink-0" />
            {importError}
          </motion.div>
        )}

        {/* Reset */}
        <div className="pt-3 border-t border-border">
          <AnimatePresence>
            {!showResetConfirm ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                  onClick={() => setShowResetConfirm(true)}
                >
                  <Trash2 className="size-4" />
                  إعادة تعيين جميع البيانات
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  ⚠️ سيتم حذف جميع بياناتك نهائياً!
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    className="gap-1"
                    onClick={handleReset}
                  >
                    <Trash2 className="size-3.5" />
                    نعم، احذف الكل
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowResetConfirm(false)}
                  >
                    إلغاء
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
