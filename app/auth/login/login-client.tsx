"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "@/components/auth/auth-card";
import { Turnstile } from "@/components/auth/turnstile";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const { login } = useAuth();
  const { t, language } = useLanguage();
  const handleTurnstileVerify = useCallback((token: string) => setTurnstileToken(token), []);
  const handleTurnstileExpire = useCallback(() => setTurnstileToken(""), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!turnstileToken) {
      setError(language === "ar" ? "يرجى إكمال التحقق الأمني" : "Please complete the security check.");
      return;
    }
    setIsLoading(true);

    const result = await login(email, password, turnstileToken);

    if (!result.success) {
      setError(result.error || t.pages.login.errorDefault);
      setIsLoading(false);
    }
    // On success, GuestGuard will automatically redirect to home
  };

  return (
    <AuthCard appTitle={t.pages.login.appTitle} appSubtitle={t.pages.login.appSubtitle}>
      <div className="text-center mb-6">
        <h2 className="font-heading text-[18px] font-semibold text-text">{t.pages.login.title}</h2>
        <p className="text-[13px] text-muted mt-1">{t.pages.login.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t.pages.login.emailLabel}</Label>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t.pages.login.passwordLabel}</Label>
            <Link href="/auth/forgot-password" className="text-[12.5px] text-gold hover:underline">
              {t.pages.login.forgotPassword}
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="w-full"
          />
        </div>

        {error && (
          <div className="p-3 text-[13px] text-down bg-down-soft rounded-[10px]">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full h-12" size="lg" disabled={isLoading}>
          {isLoading && <Loader2 className="animate-spin" />}
          {isLoading ? t.pages.login.submitting : t.pages.login.submitButton}
        </Button>

        <Turnstile
          onVerify={handleTurnstileVerify}
          onExpire={handleTurnstileExpire}
          language={language}
        />
      </form>

      <p className="mt-6 text-[12.5px] text-center text-dim leading-relaxed">
        {t.pages.login.termsText}{" "}
        <Link href="/terms" className="underline hover:text-gold">
          {t.pages.login.termsLink}
        </Link>{" "}
        {t.pages.login.and}{" "}
        <Link href="/privacy" className="underline hover:text-gold">
          {t.pages.login.privacyLink}
        </Link>
      </p>
    </AuthCard>
  );
}
