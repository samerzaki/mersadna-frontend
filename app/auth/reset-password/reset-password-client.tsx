"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "@/components/auth/auth-card";
import { resetPassword } from "@/lib/api-auth";
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, language } = useLanguage();
  const isRTL = language === "ar";
  const BackArrow = isRTL ? ArrowLeft : ArrowRight;

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t.pages.resetPassword.errorPasswordMismatch);
      return;
    }

    if (password.length < 6) {
      setError(t.pages.resetPassword.errorPasswordLength);
      return;
    }

    if (!token || !email) {
      setError(t.pages.resetPassword.errorInvalidLink);
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword({
        email,
        token,
        password,
        password_confirmation: confirmPassword,
        'cf-turnstile-response': getTurnstileToken(),
      });
      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : t.pages.resetPassword.errorDefault;
      setError(message);
    }

    setIsLoading(false);
  };

  if (success) {
    return (
      <AuthCard appTitle={t.common.appName} showTabs={false}>
        <div className="text-center">
          <div className="mx-auto w-14 h-14 bg-up-soft rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-7 h-7 text-up" />
          </div>
          <h2 className="font-heading text-[18px] font-semibold text-up mb-1.5">
            {t.pages.resetPassword.successTitle}
          </h2>
          <p className="text-[13px] text-muted">{t.pages.resetPassword.successRedirect}</p>
        </div>
      </AuthCard>
    );
  }

  if (!token || !email) {
    return (
      <AuthCard appTitle={t.common.appName} showTabs={false}>
        <div className="text-center mb-6">
          <h2 className="font-heading text-[18px] font-semibold text-down">{t.pages.resetPassword.invalidLinkTitle}</h2>
          <p className="text-[13px] text-muted mt-1">{t.pages.resetPassword.invalidLinkDescription}</p>
        </div>
        <div className="space-y-4">
          <Link href="/auth/forgot-password">
            <Button className="w-full h-12" size="lg">
              {t.pages.resetPassword.requestNewLink}
            </Button>
          </Link>
          <div className="text-center">
            <Link href="/auth/login" className="inline-flex items-center gap-2 text-[13px] text-gold hover:underline">
              <BackArrow className="h-4 w-4" />
              {t.pages.resetPassword.backToLogin}
            </Link>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard appTitle={t.common.appName} showTabs={false}>
      <div className="text-center mb-6">
        <h2 className="font-heading text-[18px] font-semibold text-text">{t.pages.resetPassword.title}</h2>
        <p className="text-[13px] text-muted mt-1">{t.pages.resetPassword.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">{t.pages.resetPassword.newPasswordLabel}</Label>
          <Input
            id="password"
            type="password"
            placeholder={t.pages.resetPassword.newPasswordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="w-full"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t.pages.resetPassword.confirmPasswordLabel}</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder={t.pages.resetPassword.confirmPasswordPlaceholder}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
            className="w-full"
          />
          <p className="text-[12px] text-dim">{t.pages.resetPassword.passwordHint}</p>
        </div>

        {error && (
          <div className="p-3 text-[13px] text-down bg-down-soft rounded-[10px]">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full h-12" size="lg" disabled={isLoading}>
          {isLoading ? t.pages.resetPassword.submitting : t.pages.resetPassword.submitButton}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/auth/login" className="inline-flex items-center gap-2 text-[13px] text-gold hover:underline">
          <BackArrow className="h-4 w-4" />
          {t.pages.resetPassword.backToLogin}
        </Link>
      </div>
    </AuthCard>
  );
}

function getTurnstileToken(): string | undefined {
  return process.env.NEXT_PUBLIC_TURNSTILE_TOKEN ||
    (process.env.NODE_ENV === 'development' ? '1x0000000000000000000000000000000AA' : undefined);
}

export default function ResetPasswordPage() {
  const { t } = useLanguage();

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted">{t.pages.resetPassword.loading}</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
