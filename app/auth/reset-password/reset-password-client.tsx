"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {t.common.appName}
            </h1>
          </div>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
                {t.pages.resetPassword.successTitle}
              </CardTitle>
              <CardDescription>
                {t.pages.resetPassword.successRedirect}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {t.common.appName}
            </h1>
          </div>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400">
                {t.pages.resetPassword.invalidLinkTitle}
              </CardTitle>
              <CardDescription>
                {t.pages.resetPassword.invalidLinkDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/auth/forgot-password">
                <Button className="w-full" variant="default">
                  {t.pages.resetPassword.requestNewLink}
                </Button>
              </Link>
              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center text-sm text-primary hover:underline"
                >
                  <BackArrow className={`h-4 w-4 ${isRTL ? "ms-2" : "me-2"}`} />
                  {t.pages.resetPassword.backToLogin}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {t.common.appName}
          </h1>
        </div>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{t.pages.resetPassword.title}</CardTitle>
            <CardDescription>
              {t.pages.resetPassword.subtitle}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">
                  {t.pages.resetPassword.newPasswordLabel}
                </Label>
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
                <Label htmlFor="confirmPassword">
                  {t.pages.resetPassword.confirmPasswordLabel}
                </Label>
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
                <p className="text-xs text-muted-foreground">
                  {t.pages.resetPassword.passwordHint}
                </p>
              </div>

              {error && (
                <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? t.pages.resetPassword.submitting : t.pages.resetPassword.submitButton}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center text-sm text-primary hover:underline"
              >
                <BackArrow className={`h-4 w-4 ${isRTL ? "ms-2" : "me-2"}`} />
                {t.pages.resetPassword.backToLogin}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getTurnstileToken(): string | undefined {
  return process.env.NEXT_PUBLIC_TURNSTILE_TOKEN ||
    (process.env.NODE_ENV === 'development' ? '1x0000000000000000000000000000000AA' : undefined);
}

export default function ResetPasswordPage() {
  const { t } = useLanguage();

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">{t.pages.resetPassword.loading}</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
