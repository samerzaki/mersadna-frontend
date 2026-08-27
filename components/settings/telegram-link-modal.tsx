"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getTelegramLinkToken, checkTelegramLinkStatus } from "@/lib/api-auth";
import { X, Copy, CheckCircle, ExternalLink, Loader2 } from "lucide-react";

interface TelegramLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (telegramUsername: string) => void;
}

export function TelegramLinkModal({ isOpen, onClose, onSuccess }: TelegramLinkModalProps) {
  const [token, setToken] = useState("");
  const [deepLink, setDeepLink] = useState("");
  const [botUsername, setBotUsername] = useState("");
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLinked, setIsLinked] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Initialize and fetch token
  useEffect(() => {
    if (isOpen) {
      fetchLinkToken();
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const now = new Date();
      const remaining = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));
      setTimeRemaining(remaining);

      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  // Poll for link status
  useEffect(() => {
    if (!token || isLinked) return;

    const pollInterval = setInterval(async () => {
      const result = await checkTelegramLinkStatus(token);
      if (result.success && result.linked) {
        setIsLinked(true);
        clearInterval(pollInterval);
        if (onSuccess) {
          onSuccess(result.telegramUsername || "");
        }
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [token, isLinked, onSuccess, onClose]);

  const fetchLinkToken = async () => {
    setIsLoading(true);
    const result = await getTelegramLinkToken();

    if (result.success && result.data) {
      setToken(result.data.token);
      setDeepLink(result.data.deepLink);
      setBotUsername(result.data.botUsername);
      setExpiresAt(new Date(result.data.expiresAt));
    }

    setIsLoading(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(deepLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleOpenTelegram = () => {
    window.open(deepLink, "_blank");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            ربط حساب تليجرام
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500 mb-4" />
              <p className="text-sm text-muted-foreground">جاري التحضير...</p>
            </div>
          ) : isLinked ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">
                تم ربط تليجرام بنجاح!
              </h3>
              <p className="text-sm text-muted-foreground">
                سيتم إغلاق النافذة تلقائياً...
              </p>
            </div>
          ) : (
            <>
              {/* Instructions */}
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  اتبع الخطوات التالية لربط حسابك:
                </p>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full flex items-center justify-center text-xs font-semibold">
                      1
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      افتح تطبيق تليجرام
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full flex items-center justify-center text-xs font-semibold">
                      2
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      ابحث عن البوت{" "}
                      <code className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">
                        {botUsername}
                      </code>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full flex items-center justify-center text-xs font-semibold">
                      3
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      اضغط على "ابدأ" أو أرسل <code className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">/start</code>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full flex items-center justify-center text-xs font-semibold">
                      4
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      سيتم ربط حسابك تلقائياً
                    </span>
                  </li>
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleOpenTelegram}
                  className="w-full"
                  size="lg"
                >
                  <ExternalLink className="ml-2 h-4 w-4" />
                  فتح تليجرام
                </Button>

                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  {copySuccess ? (
                    <>
                      <CheckCircle className="ml-2 h-4 w-4 text-green-600" />
                      تم نسخ الرابط!
                    </>
                  ) : (
                    <>
                      <Copy className="ml-2 h-4 w-4" />
                      نسخ الرابط
                    </>
                  )}
                </Button>
              </div>

              {/* Status */}
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-amber-600 dark:text-amber-400" />
                    <span className="text-sm font-medium text-amber-900 dark:text-amber-100">
                      في انتظار الربط...
                    </span>
                  </div>
                  {timeRemaining > 0 && (
                    <span className="text-sm text-amber-700 dark:text-amber-300">
                      {formatTime(timeRemaining)}
                    </span>
                  )}
                </div>
                {timeRemaining === 0 && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                    انتهت صلاحية الرابط. يرجى إغلاق النافذة والمحاولة مرة أخرى.
                  </p>
                )}
              </div>

              {/* Help Text */}
              <p className="text-xs text-center text-muted-foreground">
                إذا واجهت مشكلة، تأكد من فتح الرابط في تطبيق تليجرام وليس المتصفح
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        {!isLinked && !isLoading && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full"
            >
              إغلاق
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
