"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "@/components/auth/auth-card";
import { PhoneInputField, type PhoneInputValue } from "@/components/ui/phone-input";
import { CheckCircle, Loader2 } from "lucide-react";
import { checkEmailExists, sendOtp } from "@/lib/api-auth";
import { Turnstile } from "@/components/auth/turnstile";

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
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const router = useRouter();
  const { t, language } = useLanguage();
  const isRTL = language === "ar";
  const handleTurnstileVerify = useCallback((token: string) => setTurnstileToken(token), []);
  const handleTurnstileExpire = useCallback(() => setTurnstileToken(""), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!turnstileToken) {
      setError(language === "ar" ? "يرجى إكمال التحقق الأمني" : "Please complete the security check.");
      return;
    }
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

    try {
      const availability = await checkEmailExists(formData.email);
      if (!availability.data?.available) {
        setError(language === "ar" ? "هذا البريد الإلكتروني مستخدم بالفعل" : "This email address is already in use");
        return;
      }

      await sendOtp(formData.email);
      sessionStorage.setItem("gold_pending_registration", JSON.stringify({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: phoneData.phone || undefined,
        confirmPassword: formData.confirmPassword,
        turnstileToken,
      }));
      router.push(`/auth/verify-otp?email=${encodeURIComponent(formData.email)}&purpose=registration`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.pages.register.errorDefault);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard appTitle={t.pages.register.appTitle} appSubtitle={t.pages.register.appSubtitle}>
      <div className="text-center mb-6">
        <h2 className="font-heading text-[18px] font-semibold text-text">{t.pages.register.title}</h2>
        <p className="text-[13px] text-muted mt-1">{t.pages.register.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">{t.pages.register.firstNameLabel}</Label>
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
            <Label htmlFor="lastName">{t.pages.register.lastNameLabel}</Label>
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
          <Label htmlFor="email">{t.pages.register.emailLabel}</Label>
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
          <Label htmlFor="phone">{t.pages.register.phoneLabel}</Label>
          <PhoneInputField
            value={phoneData.phone}
            onChange={setPhoneData}
            defaultCountry="eg"
            disabled={isLoading}
            placeholder="+201234567890"
          />
          {phoneData.phone && phoneData.phone.length > 4 && !phoneData.isValid && (
            <p className="text-[12px] text-muted">
              {isRTL ? "يرجى إدخال رقم هاتف صحيح" : "Please enter a valid phone number"}
            </p>
          )}
          {phoneData.isValid && (
            <p className="text-[12px] text-up flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              {isRTL ? "رقم الهاتف صحيح" : "Phone number is valid"}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t.pages.register.passwordLabel}</Label>
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
          <p className="text-[12px] text-dim">{t.pages.register.passwordHint}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t.pages.register.confirmPasswordLabel}</Label>
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
          <div className="p-3 text-[13px] text-down bg-down-soft rounded-[10px]">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full h-12" size="lg" disabled={isLoading}>
          {isLoading && <Loader2 className="animate-spin" />}
          {isLoading ? t.pages.register.submitting : t.pages.register.submitButton}
        </Button>

        <Turnstile
          onVerify={handleTurnstileVerify}
          onExpire={handleTurnstileExpire}
          language={language}
        />
      </form>

      <p className="mt-6 text-[12.5px] text-center text-dim leading-relaxed">
        {t.pages.register.termsText}{" "}
        <Link href="/terms" className="underline hover:text-gold">
          {t.pages.register.termsLink}
        </Link>{" "}
        {t.pages.register.and}{" "}
        <Link href="/privacy" className="underline hover:text-gold">
          {t.pages.register.privacyLink}
        </Link>
      </p>
    </AuthCard>
  );
}
