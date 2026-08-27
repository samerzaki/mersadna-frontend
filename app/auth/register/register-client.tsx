"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PhoneInputField, type PhoneInputValue } from "@/components/ui/phone-input";
import { CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [phoneData, setPhoneData] = useState<PhoneInputValue>({
    phone: "",
    isValid: false,
    country: null,
    inputValue: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError(t.pages.register.errorPasswordMismatch);
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError(t.pages.register.errorPasswordLength);
      setIsLoading(false);
      return;
    }

    const result = await register({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: phoneData.phone || undefined,
      confirmPassword: formData.confirmPassword,
    });

    if (result.success) {
      setSuccess(t.pages.register.successMessage);
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1500);
    } else {
      setError(result.error || t.pages.register.errorDefault);
    }

    setIsLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-start justify-center bg-slate-50 dark:bg-slate-950 pt-20 sm:pt-28 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-amber-200/20 dark:bg-amber-500/[0.07] blur-3xl" />
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
      </div>
      <div className="relative z-10 max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {t.pages.register.appTitle}
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            {t.pages.register.appSubtitle}
          </p>
        </div>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{t.pages.register.title}</CardTitle>
            <CardDescription>
              {t.pages.register.subtitle}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    {t.pages.register.firstNameLabel}
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder={t.pages.register.firstNamePlaceholder}
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    {t.pages.register.lastNameLabel}
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder={t.pages.register.lastNamePlaceholder}
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  {t.pages.register.emailLabel}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  {t.pages.register.phoneLabel}
                </Label>
                <PhoneInputField
                  value={phoneData.phone}
                  onChange={setPhoneData}
                  defaultCountry="eg"
                  disabled={isLoading}
                  placeholder="+201234567890"
                />
                {phoneData.phone && phoneData.phone.length > 4 && !phoneData.isValid && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    يرجى إدخال رقم هاتف صحيح
                  </p>
                )}
                {phoneData.isValid && (
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    رقم الهاتف صحيح
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  {t.pages.register.passwordLabel}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t.pages.register.passwordPlaceholder}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {t.pages.register.passwordHint}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  {t.pages.register.confirmPasswordLabel}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={t.pages.register.confirmPasswordPlaceholder}
                  value={formData.confirmPassword}
                  onChange={handleChange}
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

              {success && (
                <div className="p-3 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                  {success}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? t.pages.register.submitting : t.pages.register.submitButton}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                {t.pages.register.hasAccount}{" "}
              </span>
              <Link
                href="/auth/login"
                className="font-medium text-primary hover:underline"
              >
                {t.pages.register.loginLink}
              </Link>
            </div>
          </CardContent>

          <CardFooter>
            <p className="text-xs text-center text-muted-foreground w-full">
              {t.pages.register.termsText}{" "}
              <Link href="/terms" className="underline">
                {t.pages.register.termsLink}
              </Link>{" "}
              {t.pages.register.and}{" "}
              <Link href="/privacy" className="underline">
                {t.pages.register.privacyLink}
              </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {t.pages.register.footerText}
          </p>
        </div>
      </div>
    </div>
  );
}
