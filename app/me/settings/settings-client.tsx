"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TelegramLinkModal } from "@/components/settings/telegram-link-modal";
import { OTPInput } from "@/components/auth/otp-input";
import {
  sendOtp,
  changePassword as changePasswordApi,
  updateNotificationPreferences,
  unlinkTelegram,
  addMobilePhone,
  sendMobileOtp,
  verifyTempMobileNumber,
  verifyMobilePhone,
  listMobilePhones,
  deleteMobilePhone,
  setDefaultMobilePhone,
} from "@/lib/api-auth";
import {
  Mail, Lock, Bell, CheckCircle, Send, MessageSquare,
  Phone, User, X, Smartphone, Trash2, Star, ShieldCheck, ShieldAlert,
  Plus, RefreshCw, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PhoneInputField, type PhoneInputValue } from "@/components/ui/phone-input";
import { PageHeader } from "@/components/ui/page-header";
import type { MobilePhone } from "@/types/auth";

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  // Notification channels state
  const [notificationChannels, setNotificationChannels] = useState({
    email: user?.preferences?.notifications ?? true,
    sms: false,
    whatsapp: false,
    telegram: false,
  });

  const [linkedAccounts, setLinkedAccounts] = useState({
    telegramUsername: undefined as string | undefined,
  });

  // Change email state
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");

  // Change password state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Phone management state
  const [phones, setPhones] = useState<MobilePhone[]>([]);
  const [phonesLoading, setPhonesLoading] = useState(true);
  const [phonesError, setPhonesError] = useState("");
  const [showAddPhone, setShowAddPhone] = useState(false);
  const [newPhoneData, setNewPhoneData] = useState<PhoneInputValue>({
    phone: "",
    isValid: false,
    country: null,
    inputValue: "",
  });
  const [addPhoneLoading, setAddPhoneLoading] = useState(false);
  const [addPhoneError, setAddPhoneError] = useState("");
  const [phoneActionLoading, setPhoneActionLoading] = useState<number | null>(null);

  // Phone OTP modal state
  const [showPhoneOtp, setShowPhoneOtp] = useState(false);
  const [phoneOtpTarget, setPhoneOtpTarget] = useState<{ phone: string; phoneId?: number } | null>(null);
  const [phoneOtp, setPhoneOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [phoneOtpLoading, setPhoneOtpLoading] = useState(false);
  const [phoneOtpError, setPhoneOtpError] = useState("");
  const [phoneOtpSuccess, setPhoneOtpSuccess] = useState(false);
  const [phoneOtpResendCountdown, setPhoneOtpResendCountdown] = useState(120);
  const [phoneOtpCanResend, setPhoneOtpCanResend] = useState(false);

  // Telegram modal state
  const [showTelegramModal, setShowTelegramModal] = useState(false);

  // Fetch phone list
  const fetchPhones = useCallback(async () => {
    setPhonesLoading(true);
    setPhonesError("");
    try {
      const response = await listMobilePhones();
      setPhones(response.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : t.pages.settings.phone.errorLoad;
      setPhonesError(message);
    }
    setPhonesLoading(false);
  }, [t]);

  useEffect(() => {
    fetchPhones();
  }, [fetchPhones]);

  // Countdown timer for phone OTP resend
  useEffect(() => {
    if (!showPhoneOtp) return;
    if (phoneOtpResendCountdown > 0) {
      const timer = setTimeout(() => setPhoneOtpResendCountdown(phoneOtpResendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setPhoneOtpCanResend(true);
    }
  }, [showPhoneOtp, phoneOtpResendCountdown]);

  // AuthGuard in layout handles redirect — this is a safety fallback
  if (!user) return null;

  // ---- Email handlers ----
  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setEmailSuccess("");
    setEmailLoading(true);

    try {
      await sendOtp(newEmail);
      setEmailSuccess(t.pages.settings.emailOtpSent);
      setTimeout(() => {
        router.push(`/auth/verify-otp?email=${encodeURIComponent(newEmail)}&purpose=email-change`);
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : t.common.error;
      setEmailError(message);
    }

    setEmailLoading(false);
  };

  // ---- Password handlers ----
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError(t.common.errorPasswordMismatch);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(t.common.errorPasswordLength);
      return;
    }

    setPasswordLoading(true);

    try {
      await changePasswordApi({
        old_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });
      setPasswordSuccess(t.pages.settings.passwordChanged);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setShowChangePassword(false);
        setPasswordSuccess("");
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : t.common.error;
      setPasswordError(message);
    }

    setPasswordLoading(false);
  };

  // ---- Phone handlers ----
  const handleAddPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddPhoneError("");

    if (!newPhoneData.phone || newPhoneData.phone.length < 4) {
      setAddPhoneError(t.pages.settings.phone.errorAdd);
      return;
    }

    if (!newPhoneData.isValid) {
      setAddPhoneError(t.pages.settings.phone.phoneIncomplete);
      return;
    }

    setAddPhoneLoading(true);

    try {
      const response = await addMobilePhone(newPhoneData.phone);
      // Open OTP modal for the new phone
      setPhoneOtpTarget({ phone: newPhoneData.phone, phoneId: response.data?.id });
      setPhoneOtpResendCountdown(response.seconds_to_next_msg || 120);
      setPhoneOtpCanResend(false);
      setPhoneOtp(["", "", "", "", "", ""]);
      setPhoneOtpError("");
      setPhoneOtpSuccess(false);
      setShowPhoneOtp(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : t.pages.settings.phone.errorAdd;
      setAddPhoneError(message);
    }

    setAddPhoneLoading(false);
  };

  const handleVerifyExistingPhone = async (phone: MobilePhone) => {
    // Send OTP to existing unverified phone, then open OTP modal
    setPhoneActionLoading(phone.id);
    try {
      await sendMobileOtp(phone.mobile_number);
      setPhoneOtpTarget({ phone: phone.mobile_number, phoneId: phone.id });
      setPhoneOtpResendCountdown(120);
      setPhoneOtpCanResend(false);
      setPhoneOtp(["", "", "", "", "", ""]);
      setPhoneOtpError("");
      setPhoneOtpSuccess(false);
      setShowPhoneOtp(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : t.pages.settings.phone.errorVerify;
      setPhonesError(message);
    }
    setPhoneActionLoading(null);
  };

  const handleDeletePhone = async (phoneId: number) => {
    if (!confirm(t.pages.settings.phone.deleteConfirm)) return;

    setPhoneActionLoading(phoneId);
    try {
      await deleteMobilePhone(phoneId);
      setPhones(prev => prev.filter(p => p.id !== phoneId));
      refreshUser();
    } catch (err) {
      const message = err instanceof Error ? err.message : t.pages.settings.phone.errorDelete;
      setPhonesError(message);
    }
    setPhoneActionLoading(null);
  };

  const handleSetDefaultPhone = async (phoneId: number) => {
    setPhoneActionLoading(phoneId);
    try {
      await setDefaultMobilePhone(phoneId);
      setPhones(prev => prev.map(p => ({ ...p, default: p.id === phoneId })));
      refreshUser();
    } catch (err) {
      const message = err instanceof Error ? err.message : t.pages.settings.phone.errorSetDefault;
      setPhonesError(message);
    }
    setPhoneActionLoading(null);
  };

  // ---- Phone OTP handlers ----
  const handlePhoneOtpComplete = async (otpValue: string) => {
    if (!phoneOtpTarget) return;
    setPhoneOtpError("");
    setPhoneOtpLoading(true);

    try {
      if (phoneOtpTarget.phoneId) {
        // Verify existing phone by ID
        await verifyMobilePhone(phoneOtpTarget.phoneId, otpValue);
      } else {
        // Verify temp phone number
        await verifyTempMobileNumber(phoneOtpTarget.phone, otpValue);
      }
      setPhoneOtpSuccess(true);
      setTimeout(() => {
        setShowPhoneOtp(false);
        setShowAddPhone(false);
        setNewPhoneData({ phone: "", isValid: false, country: null, inputValue: "" });
        setPhoneOtpSuccess(false);
        setPhoneOtpTarget(null);
        fetchPhones();
        refreshUser();
      }, 1500);
    } catch (err) {
      const message = err instanceof Error ? err.message : t.pages.settings.phone.otpError;
      setPhoneOtpError(message);
      setPhoneOtp(["", "", "", "", "", ""]);
    }

    setPhoneOtpLoading(false);
  };

  const handlePhoneOtpResend = async () => {
    if (!phoneOtpTarget) return;
    setPhoneOtpError("");
    try {
      await sendMobileOtp(phoneOtpTarget.phone);
      setPhoneOtpResendCountdown(120);
      setPhoneOtpCanResend(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : t.common.error;
      setPhoneOtpError(message);
    }
  };

  // ---- Notification handlers ----
  const handleToggleNotification = async (channel: keyof typeof notificationChannels) => {
    const newChannels = {
      ...notificationChannels,
      [channel]: !notificationChannels[channel],
    };
    setNotificationChannels(newChannels);
    await updateNotificationPreferences(newChannels);
  };

  const handleTelegramLinkSuccess = (username: string) => {
    setLinkedAccounts({ ...linkedAccounts, telegramUsername: username });
    setNotificationChannels({ ...notificationChannels, telegram: true });
  };

  const handleUnlinkTelegram = async () => {
    if (confirm(t.pages.settings.unlinkConfirm)) {
      const result = await unlinkTelegram();
      if (result.success) {
        setLinkedAccounts({ ...linkedAccounts, telegramUsername: undefined });
        setNotificationChannels({ ...notificationChannels, telegram: false });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <PageHeader title={t.pages.settings.title} lead={t.pages.settings.subtitle} className="py-0 md:py-0 pb-0 md:pb-0" />

        {/* Tabs */}
        <Tabs defaultValue="account" className="w-full md:flex md:gap-6" orientation="vertical">
          <TabsList className="grid w-full grid-cols-4 md:flex md:flex-col md:w-56 md:shrink-0 md:h-auto md:justify-start md:gap-1">
            <TabsTrigger value="account" className="gap-2 md:justify-start md:w-full">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{t.pages.settings.tabs.account}</span>
            </TabsTrigger>
            <TabsTrigger value="phone" className="gap-2 md:justify-start md:w-full">
              <Smartphone className="h-4 w-4" />
              <span className="hidden sm:inline">{t.pages.settings.tabs.phone}</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 md:justify-start md:w-full">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">{t.pages.settings.tabs.security}</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2 md:justify-start md:w-full">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">{t.pages.settings.tabs.notifications}</span>
            </TabsTrigger>
          </TabsList>

          <div className="md:flex-1 md:min-w-0">
          {/* Account Tab */}
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t.pages.settings.profileSection}
                </CardTitle>
                <CardDescription>
                  {t.pages.settings.profileDescription}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">{t.pages.settings.nameLabel}</Label>
                    <p className="text-base font-medium">{user.name}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">{t.pages.settings.emailLabel}</Label>
                    <div className="flex items-center gap-2">
                      <p className="text-base font-medium">{user.email}</p>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Phone Tab */}
          <TabsContent value="phone" className="space-y-4">
            {/* Phone List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5" />
                      {t.pages.settings.phone.title}
                    </CardTitle>
                    <CardDescription>
                      {t.pages.settings.phone.description}
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setShowAddPhone(true);
                      setAddPhoneError("");
                      setNewPhoneData({ phone: "", isValid: false, country: null, inputValue: "" });
                    }}
                    className="gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    {t.pages.settings.phone.addButton}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Loading state */}
                {phonesLoading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span className={`text-sm text-muted-foreground ${isRTL ? "mr-2" : "ml-2"}`}>{t.common.loading}</span>
                  </div>
                )}

                {/* Error state */}
                {phonesError && (
                  <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800 flex items-center justify-between">
                    <span>{phonesError}</span>
                    <Button size="sm" variant="ghost" onClick={() => { setPhonesError(""); fetchPhones(); }}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Empty state */}
                {!phonesLoading && !phonesError && phones.length === 0 && (
                  <div className="text-center py-8 space-y-3">
                    <div className="mx-auto w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                      <Phone className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-300">{t.pages.settings.phone.noPhones}</p>
                      <p className="text-sm text-muted-foreground">{t.pages.settings.phone.noPhonesDescription}</p>
                    </div>
                  </div>
                )}

                {/* Phone list */}
                {!phonesLoading && phones.map((phone) => (
                  <div
                    key={phone.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg border",
                      phone.default
                        ? "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800"
                        : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "mt-0.5 p-2 rounded-full",
                        phone.verified_at
                          ? "bg-green-100 dark:bg-green-900/20"
                          : "bg-yellow-100 dark:bg-yellow-900/20"
                      )}>
                        {phone.verified_at
                          ? <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                          : <ShieldAlert className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        }
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium" dir="ltr">
                            {phone.country_code} {phone.mobile_number}
                          </p>
                          {phone.default && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                              <Star className="h-3 w-3" />
                              {t.pages.settings.phone.defaultBadge}
                            </span>
                          )}
                        </div>
                        <p className={cn(
                          "text-xs mt-1",
                          phone.verified_at
                            ? "text-green-600 dark:text-green-400"
                            : "text-yellow-600 dark:text-yellow-400"
                        )}>
                          {phone.verified_at ? t.pages.settings.phone.verified : t.pages.settings.phone.notVerified}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Verify button for unverified phones */}
                      {!phone.verified_at && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVerifyExistingPhone(phone)}
                          disabled={phoneActionLoading === phone.id}
                          className="text-xs gap-1"
                        >
                          {phoneActionLoading === phone.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <ShieldCheck className="h-3 w-3" />
                          )}
                          {t.pages.settings.phone.verify}
                        </Button>
                      )}

                      {/* Set as default button (only for verified, non-default phones) */}
                      {phone.verified_at && !phone.default && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSetDefaultPhone(phone.id)}
                          disabled={phoneActionLoading === phone.id}
                          className="text-xs gap-1"
                        >
                          {phoneActionLoading === phone.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Star className="h-3 w-3" />
                          )}
                          {t.pages.settings.phone.setDefault}
                        </Button>
                      )}

                      {/* Delete button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeletePhone(phone.id)}
                        disabled={phoneActionLoading === phone.id}
                        className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        {phoneActionLoading === phone.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Add phone form */}
                {showAddPhone && (
                  <div className="mt-4 p-4 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950">
                    <form onSubmit={handleAddPhone} className="space-y-4">
                      <div className="space-y-2">
                        <Label>{t.pages.settings.phone.newPhoneLabel}</Label>
                        <PhoneInputField
                          value={newPhoneData.phone}
                          onChange={setNewPhoneData}
                          defaultCountry="eg"
                          disabled={addPhoneLoading}
                          autoFocus
                          placeholder={t.pages.settings.phone.phonePlaceholder}
                          error={!!addPhoneError}
                        />
                        {newPhoneData.phone && newPhoneData.phone.length > 4 && !newPhoneData.isValid && (
                          <p className="text-xs text-yellow-600 dark:text-yellow-400">
                            {t.pages.settings.phone.phoneIncomplete}
                          </p>
                        )}
                        {newPhoneData.isValid && (
                          <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            {t.pages.settings.phone.phoneValid}
                          </p>
                        )}
                      </div>

                      {addPhoneError && (
                        <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
                          {addPhoneError}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          disabled={addPhoneLoading || !newPhoneData.isValid}
                          size="sm"
                        >
                          {addPhoneLoading ? (
                            <>
                              <Loader2 className={`h-4 w-4 animate-spin ${isRTL ? "ms-1" : "me-1"}`} />
                              {t.pages.settings.phone.sending}
                            </>
                          ) : (
                            t.pages.settings.phone.addAndVerify
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShowAddPhone(false);
                            setNewPhoneData({ phone: "", isValid: false, country: null, inputValue: "" });
                            setAddPhoneError("");
                          }}
                          disabled={addPhoneLoading}
                        >
                          {t.pages.settings.cancel}
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            {/* Change Email Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  {t.pages.settings.changeEmailSection}
                </CardTitle>
                <CardDescription>
                  {t.pages.settings.changeEmailDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showChangeEmail ? (
                  <Button onClick={() => setShowChangeEmail(true)} variant="outline">
                    {t.pages.settings.changeEmailButton}
                  </Button>
                ) : (
                  <form onSubmit={handleChangeEmail} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newEmail">{t.pages.settings.newEmailLabel}</Label>
                      <Input
                        id="newEmail"
                        type="email"
                        placeholder="example@email.com"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        required
                        disabled={emailLoading}
                      />
                    </div>

                    {emailError && (
                      <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
                        {emailError}
                      </div>
                    )}

                    {emailSuccess && (
                      <div className="p-3 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                        {emailSuccess}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button type="submit" disabled={emailLoading}>
                        {emailLoading ? t.pages.settings.changingEmail : t.pages.settings.changeEmailButton}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowChangeEmail(false);
                          setNewEmail("");
                          setEmailError("");
                          setEmailSuccess("");
                        }}
                        disabled={emailLoading}
                      >
                        {t.pages.settings.cancel}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Change Password Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  {t.pages.settings.changePasswordSection}
                </CardTitle>
                <CardDescription>
                  {t.pages.settings.changePasswordDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showChangePassword ? (
                  <Button onClick={() => setShowChangePassword(true)} variant="outline">
                    {t.pages.settings.changePasswordButton}
                  </Button>
                ) : (
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">{t.pages.settings.currentPassword}</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        disabled={passwordLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">{t.pages.settings.newPassword}</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        disabled={passwordLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">{t.pages.settings.confirmPasswordLabel}</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={passwordLoading}
                      />
                      <p className="text-xs text-muted-foreground">
                        {t.pages.settings.passwordHint}
                      </p>
                    </div>

                    {passwordError && (
                      <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
                        {passwordError}
                      </div>
                    )}

                    {passwordSuccess && (
                      <div className="p-3 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                        {passwordSuccess}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button type="submit" disabled={passwordLoading}>
                        {passwordLoading ? t.pages.settings.changingPassword : t.pages.settings.changePasswordButton}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowChangePassword(false);
                          setCurrentPassword("");
                          setNewPassword("");
                          setConfirmPassword("");
                          setPasswordError("");
                          setPasswordSuccess("");
                        }}
                        disabled={passwordLoading}
                      >
                        {t.pages.settings.cancel}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  {t.pages.settings.notificationsSection}
                </CardTitle>
                <CardDescription>
                  {t.pages.settings.notificationsDescription}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Email Notifications */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium">{t.pages.settings.emailNotifications}</p>
                      <p className="text-sm text-muted-foreground">{t.pages.settings.emailNotificationsDesc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleNotification("email")}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      notificationChannels.email ? "bg-amber-600" : "bg-slate-300 dark:bg-slate-600"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        notificationChannels.email ? (isRTL ? "-translate-x-6" : "translate-x-6") : (isRTL ? "-translate-x-1" : "translate-x-1")
                      )}
                    />
                  </button>
                </div>

                {/* SMS Notifications */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium">{t.pages.settings.smsNotifications}</p>
                      <p className="text-sm text-muted-foreground">{t.pages.settings.smsNotificationsDesc}</p>
                      {phones.filter(p => p.verified_at).length === 0 && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                          {t.pages.settings.smsRequiresPhone}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleNotification("sms")}
                    disabled={phones.filter(p => p.verified_at).length === 0}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      notificationChannels.sms ? "bg-amber-600" : "bg-slate-300 dark:bg-slate-600",
                      phones.filter(p => p.verified_at).length === 0 && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        notificationChannels.sms ? (isRTL ? "-translate-x-6" : "translate-x-6") : (isRTL ? "-translate-x-1" : "translate-x-1")
                      )}
                    />
                  </button>
                </div>

                {/* WhatsApp Notifications */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium">{t.pages.settings.whatsappNotifications}</p>
                      <p className="text-sm text-muted-foreground">{t.pages.settings.whatsappNotificationsDesc}</p>
                      {phones.filter(p => p.verified_at).length === 0 && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                          {t.pages.settings.whatsappRequiresPhone}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleNotification("whatsapp")}
                    disabled={phones.filter(p => p.verified_at).length === 0}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      notificationChannels.whatsapp ? "bg-amber-600" : "bg-slate-300 dark:bg-slate-600",
                      phones.filter(p => p.verified_at).length === 0 && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        notificationChannels.whatsapp ? (isRTL ? "-translate-x-6" : "translate-x-6") : (isRTL ? "-translate-x-1" : "translate-x-1")
                      )}
                    />
                  </button>
                </div>

                {/* Telegram Notifications */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="flex items-start gap-3">
                    <Send className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium">{t.pages.settings.telegramNotifications}</p>
                      <p className="text-sm text-muted-foreground">{t.pages.settings.telegramNotificationsDesc}</p>
                      {linkedAccounts.telegramUsername ? (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          {t.pages.settings.linked}: @{linkedAccounts.telegramUsername}
                        </p>
                      ) : (
                        <Button
                          size="sm"
                          variant="link"
                          className="h-auto p-0 text-xs text-amber-600 hover:text-amber-700"
                          onClick={() => setShowTelegramModal(true)}
                        >
                          {t.pages.settings.linkTelegram}
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {linkedAccounts.telegramUsername && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleUnlinkTelegram}
                        className="text-xs"
                      >
                        {t.pages.settings.unlink}
                      </Button>
                    )}
                    <button
                      onClick={() => handleToggleNotification("telegram")}
                      disabled={!linkedAccounts.telegramUsername}
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                        notificationChannels.telegram ? "bg-amber-600" : "bg-slate-300 dark:bg-slate-600",
                        !linkedAccounts.telegramUsername && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                          notificationChannels.telegram ? (isRTL ? "-translate-x-6" : "translate-x-6") : (isRTL ? "-translate-x-1" : "translate-x-1")
                        )}
                      />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Telegram Link Modal */}
      <TelegramLinkModal
        isOpen={showTelegramModal}
        onClose={() => setShowTelegramModal(false)}
        onSuccess={handleTelegramLinkSuccess}
      />

      {/* Phone OTP Verification Modal */}
      {showPhoneOtp && phoneOtpTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md border-slate-200 dark:border-slate-800 relative">
            <button
              onClick={() => {
                setShowPhoneOtp(false);
                setPhoneOtpError("");
                setPhoneOtpSuccess(false);
                setPhoneOtpTarget(null);
              }}
              className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} text-muted-foreground hover:text-foreground`}
            >
              <X className="h-5 w-5" />
            </button>
            <CardHeader className="text-center">
              {phoneOtpSuccess ? (
                <>
                  <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {t.pages.settings.phone.otpSuccess}
                  </CardTitle>
                  <CardDescription>
                    {t.pages.settings.phone.otpSuccessDesc}
                  </CardDescription>
                </>
              ) : (
                <>
                  <CardTitle className="text-xl font-bold">{t.pages.settings.phone.otpTitle}</CardTitle>
                  <CardDescription>
                    {t.pages.settings.phone.otpSubtitle}
                  </CardDescription>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1" dir="ltr">
                    {phoneOtpTarget.phone}
                  </p>
                </>
              )}
            </CardHeader>

            {!phoneOtpSuccess && (
              <CardContent className="space-y-4">
                <OTPInput
                  length={6}
                  value={phoneOtp}
                  onChange={setPhoneOtp}
                  onComplete={handlePhoneOtpComplete}
                  disabled={phoneOtpLoading}
                  error={!!phoneOtpError}
                  autoFocus
                />

                {phoneOtpError && (
                  <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800 text-center">
                    {phoneOtpError}
                  </div>
                )}

                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">
                    {t.pages.settings.phone.otpNoCode}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handlePhoneOtpResend}
                    disabled={!phoneOtpCanResend}
                    className="text-sm"
                  >
                    {phoneOtpCanResend
                      ? t.pages.settings.phone.otpResend
                      : `${t.pages.settings.phone.otpResendIn} ${phoneOtpResendCountdown} ${t.pages.settings.phone.otpSeconds}`}
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
