// Auth API functions - real API integration

import { apiFetch } from './auth-utils';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ApiResponse,
  AuthUser,
  CheckEmailExistsData,
  ResetPasswordRequest,
  ChangePasswordApiRequest,
  ChangeEmailApiRequest,
  UpdateProfileRequest,
  VerificationStatus,
  CheckMobileAvailableData,
  MobilePhone,
  StoreMobilePhoneResponse,
  MobilePhoneListResponse,
} from '@/types/auth';

/**
 * Login user
 * POST /user/login
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Register a new user
 * POST /user/register
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Send OTP verification code to email
 * POST /user/send-otp
 */
export async function sendOtp(email: string): Promise<ApiResponse<null>> {
  return apiFetch<ApiResponse<null>>('/user/send-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/**
 * Verify email with OTP code
 * POST /user/verify-temp-mobile-number
 */
export async function verifyEmail(
  email: string,
  verification_code: string
): Promise<ApiResponse<null>> {
  return apiFetch<ApiResponse<null>>('/user/verify-temp-mobile-number', {
    method: 'POST',
    body: JSON.stringify({ email, verification_code }),
  });
}

/**
 * Request password reset email with link
 * POST /user/forgot-password
 */
export async function forgotPassword(email: string): Promise<ApiResponse<null>> {
  return apiFetch<ApiResponse<null>>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/**
 * Reset password using token from email link
 * POST /user/reset-password
 */
export async function resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<null>> {
  return apiFetch<ApiResponse<null>>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Check if email is available (not taken)
 * GET /user/check-if-email-exists
 */
export async function checkEmailExists(email: string): Promise<ApiResponse<CheckEmailExistsData>> {
  return apiFetch<ApiResponse<CheckEmailExistsData>>(
    `/user/check-if-email-exists?email=${encodeURIComponent(email)}`
  );
}

/**
 * Change password (authenticated)
 * POST /user/change-password
 */
export async function changePassword(data: ChangePasswordApiRequest): Promise<ApiResponse<null>> {
  return apiFetch<ApiResponse<null>>('/user/change-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Change email (authenticated, requires OTP verification)
 * POST /user/change-email
 */
export async function changeEmail(data: ChangeEmailApiRequest): Promise<ApiResponse<null>> {
  return apiFetch<ApiResponse<null>>('/user/change-email', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Get current authenticated user info
 * GET /user/who-am-i
 */
export async function whoAmI(): Promise<ApiResponse<AuthUser>> {
  return apiFetch<ApiResponse<AuthUser>>('/auth/who-am-i');
}

export async function logout(): Promise<ApiResponse<{ logged_out: boolean }>> {
  return apiFetch<ApiResponse<{ logged_out: boolean }>>('/auth/logout', { method: 'POST' });
}

/**
 * Update user profile (authenticated)
 * POST /user/update-my-profile (with _method=PUT)
 */
export async function updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<AuthUser>> {
  const formData = new FormData();
  formData.append('_method', 'PUT');

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  }

  return apiFetch<ApiResponse<AuthUser>>('/user/update-my-profile', {
    method: 'POST',
    body: formData,
  });
}

/**
 * Update user avatar (authenticated)
 * POST /user/update-avatar (with _method=PUT)
 */
export async function updateAvatar(
  file: File,
  caption?: string
): Promise<ApiResponse<{ avatar: { small: string; medium: string; large: string } }>> {
  const formData = new FormData();
  formData.append('_method', 'PUT');
  formData.append('file', file);
  if (caption) {
    formData.append('caption', caption);
  }

  return apiFetch<ApiResponse<{ avatar: { small: string; medium: string; large: string } }>>(
    '/user/update-avatar',
    {
      method: 'POST',
      body: formData,
    }
  );
}

/**
 * Delete account (authenticated) - permanently after 14 days
 * GET /user/delete-account
 */
export async function deleteAccount(): Promise<ApiResponse<null>> {
  return apiFetch<ApiResponse<null>>('/user/delete-account');
}

/**
 * Change timezone (authenticated)
 * PUT /user/change-timezone
 */
export async function changeTimezone(timezone_code: string): Promise<ApiResponse<unknown>> {
  return apiFetch<ApiResponse<unknown>>('/user/change-timezone', {
    method: 'PUT',
    body: JSON.stringify({ timezone_code }),
  });
}

/**
 * Get identity verification status
 * GET /userVerification/get-status
 */
export async function getVerificationStatus(): Promise<ApiResponse<VerificationStatus | null>> {
  return apiFetch<ApiResponse<VerificationStatus | null>>('/userVerification/get-status');
}

/**
 * Submit identity verification (multipart)
 * POST /userVerification
 */
export async function submitVerification(
  frontFace: File,
  selfyWithCard: File
): Promise<ApiResponse<VerificationStatus>> {
  const formData = new FormData();
  formData.append('front-face', frontFace);
  formData.append('selfy-with-card', selfyWithCard);

  return apiFetch<ApiResponse<VerificationStatus>>('/userVerification', {
    method: 'POST',
    body: formData,
  });
}

// ---- Mobile Phone API functions ----

/**
 * Check if a mobile number is available
 * POST /mobilePhone/check-if-mobile-available
 */
export async function checkMobileAvailable(
  mobile_number: string
): Promise<ApiResponse<CheckMobileAvailableData>> {
  return apiFetch<ApiResponse<CheckMobileAvailableData>>('/mobilePhone/check-if-mobile-available', {
    method: 'POST',
    body: JSON.stringify({ mobile_number }),
  });
}

/**
 * Send OTP to a mobile number
 * POST /mobilePhone/send-otp
 */
export async function sendMobileOtp(
  mobile_number: string
): Promise<ApiResponse<null>> {
  return apiFetch<ApiResponse<null>>('/mobilePhone/send-otp', {
    method: 'POST',
    body: JSON.stringify({ mobile_number }),
  });
}

/**
 * Verify a temporary mobile number with OTP code
 * POST /mobilePhone/verify-temp-mobile-number
 */
export async function verifyTempMobileNumber(
  mobile_number: string,
  verification_code: string
): Promise<ApiResponse<null>> {
  return apiFetch<ApiResponse<null>>('/mobilePhone/verify-temp-mobile-number', {
    method: 'POST',
    body: JSON.stringify({ mobile_number, verification_code }),
  });
}

/**
 * Verify an existing mobile phone by ID with OTP code
 * POST /mobilePhone/:id/verify-mobile-number
 */
export async function verifyMobilePhone(
  id: number,
  code: string
): Promise<ApiResponse<MobilePhone>> {
  return apiFetch<ApiResponse<MobilePhone>>(`/mobilePhone/${id}/verify-mobile-number`, {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
}

/**
 * Store (add) a new mobile phone number (authenticated)
 * POST /mobilePhone/store
 */
export async function addMobilePhone(
  mobile_number: string
): Promise<StoreMobilePhoneResponse> {
  return apiFetch<StoreMobilePhoneResponse>('/mobilePhone/store', {
    method: 'POST',
    body: JSON.stringify({ mobile_number }),
  });
}

/**
 * List all mobile phones for the authenticated user
 * GET /mobilePhone
 */
export async function listMobilePhones(): Promise<MobilePhoneListResponse> {
  return apiFetch<MobilePhoneListResponse>('/mobilePhone');
}

/**
 * Delete a mobile phone by ID
 * DELETE /mobilePhone/:id
 */
export async function deleteMobilePhone(id: number): Promise<ApiResponse<null>> {
  return apiFetch<ApiResponse<null>>(`/mobilePhone/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Set a mobile phone as default
 * PUT /mobilePhone/:id/set-default
 */
export async function setDefaultMobilePhone(id: number): Promise<ApiResponse<MobilePhone>> {
  return apiFetch<ApiResponse<MobilePhone>>(`/mobilePhone/${id}/set-default`, {
    method: 'PUT',
  });
}

/**
 * Resend OTP for an existing (unverified) mobile phone
 * POST /mobilePhone/:id/resend-otp
 */
export async function resendMobilePhoneOtp(id: number): Promise<ApiResponse<null>> {
  return apiFetch<ApiResponse<null>>(`/mobilePhone/${id}/resend-otp`, {
    method: 'POST',
  });
}

// ---- Telegram functions (mock - no API endpoints yet) ----

/**
 * Get Telegram link token (mock)
 */
export async function getTelegramLinkToken(): Promise<{
  success: boolean;
  data?: {
    token: string;
    botUsername: string;
    deepLink: string;
    expiresAt: string;
  };
  error?: string;
}> {
  const token = 'TG_' + Date.now().toString(36).toUpperCase();
  return {
    success: true,
    data: {
      token,
      botUsername: 'nezzel_gold_bot',
      deepLink: `https://t.me/nezzel_gold_bot?start=${token}`,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    },
  };
}

/**
 * Check Telegram link status (mock)
 */
export async function checkTelegramLinkStatus(
  _token: string
): Promise<{
  success: boolean;
  linked: boolean;
  telegramUsername?: string;
}> {
  return {
    success: true,
    linked: false,
  };
}

/**
 * Unlink Telegram (mock)
 */
export async function unlinkTelegram(): Promise<{ success: boolean; error?: string }> {
  return { success: true };
}

/**
 * Update notification preferences (mock)
 */
export async function updateNotificationPreferences(
  _channels: Record<string, boolean>
): Promise<{ success: boolean; error?: string }> {
  return { success: true };
}
