"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { forgotPassword } from "@/lib/api-auth";
import { ArrowRight, ArrowLeft, Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { t, language } = useLanguage();
  const isRTL = language === "ar";
  const BackArrow = isRTL ? ArrowLeft : ArrowRight;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : t.pages.forgotPassword.errorDefault;
      setError(message);
    }

    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="relative min-h-screen flex items-start justify-center bg-slate-50 dark:bg-slate-950 pt-20 sm:pt-28 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative background elements */}
        <div className="pointer-events-none absolute inset-0">
          {/* Dot grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15]"
            style={{
              backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          {/* Warm amber glow top-center */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-150 h-80 rounded-full bg-amber-300/25 dark:bg-amber-500/10 blur-3xl" />
          {/* Subtle accent stripe */}
          <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-transparent via-amber-400/60 to-transparent" />
          {/* Scattered financial icons */}
          <div className="absolute inset-0 text-slate-300/20 dark:text-slate-700/15 select-none" aria-hidden="true">
            {/* Row 1 - top area */}
            <span className="absolute text-5xl" style={{ top: '8%', left: '6%', transform: 'rotate(-15deg)' }}>$</span>
            <span className="absolute text-4xl" style={{ top: '5%', left: '25%', transform: 'rotate(10deg)' }}>€</span>
            <span className="absolute text-6xl" style={{ top: '12%', left: '48%', transform: 'rotate(-8deg)' }}>💰</span>
            <span className="absolute text-4xl" style={{ top: '6%', left: '72%', transform: 'rotate(20deg)' }}>£</span>
            <span className="absolute text-5xl" style={{ top: '10%', left: '90%', transform: 'rotate(-12deg)' }}>¥</span>

            {/* Row 2 */}
            <span className="absolute text-4xl" style={{ top: '22%', left: '12%', transform: 'rotate(8deg)' }}>📊</span>
            <span className="absolute text-5xl" style={{ top: '25%', left: '35%', transform: 'rotate(-18deg)' }}>₿</span>
            <span className="absolute text-5xl" style={{ top: '20%', left: '82%', transform: 'rotate(15deg)' }}>🏦</span>

            {/* Row 3 - sides */}
            <span className="absolute text-4xl" style={{ top: '38%', left: '4%', transform: 'rotate(-10deg)' }}>📈</span>
            <span className="absolute text-5xl" style={{ top: '42%', left: '92%', transform: 'rotate(12deg)' }}>💱</span>

            {/* Row 4 */}
            <span className="absolute text-5xl" style={{ top: '55%', left: '8%', transform: 'rotate(18deg)' }}>🪙</span>
            <span className="absolute text-4xl" style={{ top: '52%', left: '88%', transform: 'rotate(-20deg)' }}>₹</span>

            {/* Row 5 - lower */}
            <span className="absolute text-5xl" style={{ top: '68%', left: '5%', transform: 'rotate(-12deg)' }}>🏛️</span>
            <span className="absolute text-4xl" style={{ top: '65%', left: '30%', transform: 'rotate(8deg)' }}>₽</span>
            <span className="absolute text-5xl" style={{ top: '70%', left: '75%', transform: 'rotate(-15deg)' }}>📉</span>
            <span className="absolute text-4xl" style={{ top: '66%', left: '93%', transform: 'rotate(10deg)' }}>$</span>

            {/* Row 6 - bottom */}
            <span className="absolute text-4xl" style={{ top: '82%', left: '15%', transform: 'rotate(14deg)' }}>💳</span>
            <span className="absolute text-6xl" style={{ top: '85%', left: '45%', transform: 'rotate(-8deg)' }}>🏦</span>
            <span className="absolute text-5xl" style={{ top: '80%', left: '68%', transform: 'rotate(22deg)' }}>€</span>
            <span className="absolute text-4xl" style={{ top: '88%', left: '88%', transform: 'rotate(-16deg)' }}>📊</span>

            {/* Extra scattered */}
            <span className="absolute text-5xl" style={{ top: '92%', left: '5%', transform: 'rotate(-5deg)' }}>¥</span>
            <span className="absolute text-4xl" style={{ top: '95%', left: '55%', transform: 'rotate(12deg)' }}>₿</span>
          </div>
        </div>
        <div className="relative max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {t.common.appName}
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              {t.pages.login.appSubtitle}
            </p>
          </div>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
                {t.pages.forgotPassword.successTitle}
              </CardTitle>
              <CardDescription>
                {t.pages.forgotPassword.successDescription}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="p-3 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                {t.pages.forgotPassword.successEmailSent} <strong>{email}</strong>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                {t.pages.forgotPassword.successOpenEmail}
              </p>

              <Link href="/auth/login">
                <Button className="w-full" variant="default">
                  <BackArrow className={`h-4 w-4 ${isRTL ? "ms-2" : "me-2"}`} />
                  {t.pages.forgotPassword.backToLogin}
                </Button>
              </Link>
            </CardContent>

            <CardFooter className="flex justify-center">
              <p className="text-xs text-muted-foreground">
                {t.pages.forgotPassword.successCheckSpam}
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-start justify-center bg-slate-50 dark:bg-slate-950 pt-20 sm:pt-28 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0">
        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15]"
          style={{
            backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Warm amber glow top-center */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-150 h-80 rounded-full bg-amber-300/25 dark:bg-amber-500/10 blur-3xl" />
        {/* Subtle accent stripe */}
        <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-transparent via-amber-400/60 to-transparent" />
        {/* Scattered financial icons */}
        <div className="absolute inset-0 text-slate-300/20 dark:text-slate-700/15 select-none" aria-hidden="true">
          {/* Row 1 - top area */}
          <span className="absolute text-5xl" style={{ top: '8%', left: '6%', transform: 'rotate(-15deg)' }}>$</span>
          <span className="absolute text-4xl" style={{ top: '5%', left: '25%', transform: 'rotate(10deg)' }}>€</span>
          <span className="absolute text-6xl" style={{ top: '12%', left: '48%', transform: 'rotate(-8deg)' }}>💰</span>
          <span className="absolute text-4xl" style={{ top: '6%', left: '72%', transform: 'rotate(20deg)' }}>£</span>
          <span className="absolute text-5xl" style={{ top: '10%', left: '90%', transform: 'rotate(-12deg)' }}>¥</span>

          {/* Row 2 */}
          <span className="absolute text-4xl" style={{ top: '22%', left: '12%', transform: 'rotate(8deg)' }}>📊</span>
          <span className="absolute text-5xl" style={{ top: '25%', left: '35%', transform: 'rotate(-18deg)' }}>₿</span>
          <span className="absolute text-5xl" style={{ top: '20%', left: '82%', transform: 'rotate(15deg)' }}>🏦</span>

          {/* Row 3 - sides */}
          <span className="absolute text-4xl" style={{ top: '38%', left: '4%', transform: 'rotate(-10deg)' }}>📈</span>
          <span className="absolute text-5xl" style={{ top: '42%', left: '92%', transform: 'rotate(12deg)' }}>💱</span>

          {/* Row 4 */}
          <span className="absolute text-5xl" style={{ top: '55%', left: '8%', transform: 'rotate(18deg)' }}>🪙</span>
          <span className="absolute text-4xl" style={{ top: '52%', left: '88%', transform: 'rotate(-20deg)' }}>₹</span>

          {/* Row 5 - lower */}
          <span className="absolute text-5xl" style={{ top: '68%', left: '5%', transform: 'rotate(-12deg)' }}>🏛️</span>
          <span className="absolute text-4xl" style={{ top: '65%', left: '30%', transform: 'rotate(8deg)' }}>₽</span>
          <span className="absolute text-5xl" style={{ top: '70%', left: '75%', transform: 'rotate(-15deg)' }}>📉</span>
          <span className="absolute text-4xl" style={{ top: '66%', left: '93%', transform: 'rotate(10deg)' }}>$</span>

          {/* Row 6 - bottom */}
          <span className="absolute text-4xl" style={{ top: '82%', left: '15%', transform: 'rotate(14deg)' }}>💳</span>
          <span className="absolute text-6xl" style={{ top: '85%', left: '45%', transform: 'rotate(-8deg)' }}>🏦</span>
          <span className="absolute text-5xl" style={{ top: '80%', left: '68%', transform: 'rotate(22deg)' }}>€</span>
          <span className="absolute text-4xl" style={{ top: '88%', left: '88%', transform: 'rotate(-16deg)' }}>📊</span>

          {/* Extra scattered */}
          <span className="absolute text-5xl" style={{ top: '92%', left: '5%', transform: 'rotate(-5deg)' }}>¥</span>
          <span className="absolute text-4xl" style={{ top: '95%', left: '55%', transform: 'rotate(12deg)' }}>₿</span>
        </div>
      </div>
      <div className="relative max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {t.common.appName}
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            {t.pages.login.appSubtitle}
          </p>
        </div>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{t.pages.forgotPassword.title}</CardTitle>
            <CardDescription>
              {t.pages.forgotPassword.subtitle}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  {t.pages.forgotPassword.emailLabel}
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
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">
                  {t.pages.forgotPassword.emailHint}
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
                <Mail className={`h-4 w-4 ${isRTL ? "ms-2" : "me-2"}`} />
                {isLoading ? t.pages.forgotPassword.submitting : t.pages.forgotPassword.submitButton}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center text-sm text-primary hover:underline"
              >
                <BackArrow className={`h-4 w-4 ${isRTL ? "ms-2" : "me-2"}`} />
                {t.pages.forgotPassword.backToLogin}
              </Link>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <p className="text-xs text-center text-muted-foreground">
              {t.pages.forgotPassword.rememberedPassword}{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                {t.pages.forgotPassword.loginLink}
              </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {t.pages.forgotPassword.checkSpamFooter}
          </p>
        </div>
      </div>
    </div>
  );
}
