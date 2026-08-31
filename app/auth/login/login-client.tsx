"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
    <div className="relative min-h-screen flex items-start justify-center bg-slate-50 dark:bg-slate-950 pt-20 sm:pt-28 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-amber-200/20 dark:bg-amber-500/[0.07] blur-3xl" />
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
      </div>
      <div className="relative max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {t.pages.login.appTitle}
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            {t.pages.login.appSubtitle}
          </p>
        </div>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{t.pages.login.title}</CardTitle>
            <CardDescription>
              {t.pages.login.subtitle}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  {t.pages.login.emailLabel}
                </Label>
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
                  <Label htmlFor="password">
                    {t.pages.login.passwordLabel}
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
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
                <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="animate-spin" />}
                {isLoading ? t.pages.login.submitting : t.pages.login.submitButton}
              </Button>

              <Turnstile
                onVerify={handleTurnstileVerify}
                onExpire={handleTurnstileExpire}
                language={language}
              />
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                {t.pages.login.noAccount}{" "}
              </span>
              <Link
                href="/auth/register"
                className="font-medium text-primary hover:underline"
              >
                {t.pages.login.createAccount}
              </Link>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <p className="text-xs text-center text-muted-foreground">
              {t.pages.login.termsText}{" "}
              <Link href="/terms" className="underline">
                {t.pages.login.termsLink}
              </Link>{" "}
              {t.pages.login.and}{" "}
              <Link href="/privacy" className="underline">
                {t.pages.login.privacyLink}
              </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {t.pages.login.footerText}
          </p>
        </div>
      </div>
    </div>
  );
}
