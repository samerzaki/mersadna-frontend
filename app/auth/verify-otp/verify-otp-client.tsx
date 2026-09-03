"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/auth-card";
import { OTPInput } from "@/components/auth/otp-input";
import { verifyEmail, sendOtp, verifyTempMobileNumber, sendMobileOtp, changeEmail } from "@/lib/api-auth";
import { useAuth, type RegisterData } from "@/contexts/auth-context";
import { RefreshCw, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";

function VerifyOTPContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, language } = useLanguage();
  const isRTL = language === "ar";
  const BackArrow = isRTL ? ArrowLeft : ArrowRight;

  const email = searchParams.get("email") || "";
  const phone = searchParams.get("phone") || "";
  const purpose = searchParams.get("purpose") || "registration";
  const isMobilePurpose = purpose === "mobile-phone";
  const { register } = useAuth();

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendCountdown]);

  // Mask email for display (e.g., s***r@example.com)
  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 2) {
      return email;
    }
    const masked = localPart[0] + "*".repeat(localPart.length - 2) + localPart[localPart.length - 1];
    return `${masked}@${domain}`;
  };

  const handleOTPComplete = async (otpValue: string) => {
    setError("");
    setIsLoading(true);

    try {
      if (isMobilePurpose) {
        await verifyTempMobileNumber(phone, otpValue);
      } else {
        await verifyEmail(email, otpValue);
      }

      if (purpose === "registration") {
        const pending = sessionStorage.getItem("gold_pending_registration");
        if (!pending) throw new Error(language === "ar" ? "انتهت جلسة التسجيل. يرجى المحاولة مرة أخرى." : "Your registration session has expired. Please try again.");
        const result = await register(JSON.parse(pending) as RegisterData);
        if (!result.success) throw new Error(result.error || t.pages.verifyOtp.errorDefault);
        sessionStorage.removeItem("gold_pending_registration");
      }

      if (purpose === "email-change") {
        await changeEmail({ email, verification_code: otpValue });
      }
      setIsVerified(true);

      // Redirect after verification
      setTimeout(() => {
        if (purpose === "email-change" || isMobilePurpose) {
          router.push("/me/settings");
        } else {
          router.push("/");
        }
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : t.pages.verifyOtp.errorDefault;
      setError(message);
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
    }

    setIsLoading(false);
  };

  const handleResend = async () => {
    setError("");
    try {
      if (isMobilePurpose) {
        await sendMobileOtp(phone);
      } else {
        await sendOtp(email);
      }
      setResendCountdown(60);
      setCanResend(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : t.pages.verifyOtp.errorDefault;
      setError(message);
    }
  };

  const handleSkip = () => {
    router.push("/");
  };

  // If OTP verified
  if (isVerified) {
    return (
      <AuthCard appTitle={t.common.appName} showTabs={false}>
        <div className="text-center">
          <div className="mx-auto w-14 h-14 bg-up-soft rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-7 h-7 text-up" />
          </div>
          <h2 className="font-heading text-[18px] font-semibold text-up mb-1.5">
            {t.pages.verifyOtp.successTitle}
          </h2>
          <p className="text-[13px] text-muted">{t.pages.verifyOtp.successRedirect}</p>
        </div>
      </AuthCard>
    );
  }

  // OTP entry form
  return (
    <AuthCard appTitle={t.common.appName} appSubtitle={t.pages.login.appSubtitle} showTabs={false}>
      <div className="text-center mb-6">
        <h2 className="font-heading text-[18px] font-semibold text-text">{t.pages.verifyOtp.title}</h2>
        <p className="text-[13px] text-muted mt-1">
          {isMobilePurpose ? t.pages.verifyOtp.subtitlePhone : t.pages.verifyOtp.subtitle}
        </p>
        <p className="num text-[13px] font-medium text-text mt-2" dir="ltr">
          {isMobilePurpose ? phone : maskEmail(email)}
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <OTPInput
            length={6}
            value={otp}
            onChange={setOtp}
            onComplete={handleOTPComplete}
            disabled={isLoading}
            error={!!error}
            autoFocus
          />

          {error && (
            <div className="p-3 text-[13px] text-down bg-down-soft rounded-[10px] text-center">
              {error}
            </div>
          )}

          <div className="text-center">
            <p className="text-[12px] text-dim mb-2">{t.pages.verifyOtp.noCode}</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResend}
              disabled={!canResend}
              className="text-[13px]"
            >
              <RefreshCw className="h-4 w-4" />
              {canResend
                ? t.pages.verifyOtp.resendButton
                : `${t.pages.verifyOtp.resendIn} ${resendCountdown} ${t.pages.verifyOtp.seconds}`}
            </Button>
          </div>

          {purpose === "registration" && (
            <div className="text-center pt-4 border-t border-line2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSkip}
                className="text-[13px]"
              >
                <BackArrow className="h-4 w-4" />
                {t.pages.verifyOtp.skipButton}
              </Button>
              <p className="text-[12px] text-dim mt-2">{t.pages.verifyOtp.skipWarning}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link href="/auth/login" className="inline-flex items-center gap-2 text-[13px] text-gold hover:underline">
          <BackArrow className="h-4 w-4" />
          {t.pages.verifyOtp.backToLogin}
        </Link>
      </div>
    </AuthCard>
  );
}

export default function VerifyOTPPage() {
  const { t } = useLanguage();

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted">{t.common.loading}</div>}>
      <VerifyOTPContent />
    </Suspense>
  );
}
