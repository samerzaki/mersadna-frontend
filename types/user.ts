// User notification and settings types

export interface NotificationChannels {
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
  telegram: boolean;
}

export interface LinkedAccounts {
  telegramId?: string;
  telegramUsername?: string;
  whatsappPhone?: string;
}

export interface UserSettings {
  notificationChannels: NotificationChannels;
  linkedAccounts: LinkedAccounts;
}

// OTP Verification
export interface OTPVerificationState {
  email: string;
  purpose: 'registration' | 'email-change';
  expiresAt: string;
}

// Password Reset Request
export interface PasswordResetRequest {
  email: string;
}

// Password Reset Confirm (via email link with token)
export interface PasswordResetConfirm {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

// Change Email Request (requires OTP verification)
export interface ChangeEmailRequest {
  email: string;
  verification_code: string;
}

// Change Password Request
export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  new_password_confirmation: string;
}

// Telegram Link Token
export interface TelegramLinkToken {
  token: string;
  botUsername: string;
  deepLink: string;
  expiresAt: string;
}
