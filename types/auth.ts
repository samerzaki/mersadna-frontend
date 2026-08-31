// Auth API request/response types

// Generic API response wrapper
export interface ApiResponse<T> {
  status: number;
  success: boolean;
  data: T;
  message?: string;
}

// Generic API error response
export interface ApiErrorResponse {
  status: number;
  success: boolean;
  error: {
    code: number | string;
    message: string;
  };
}

// Validation error response (422)
export interface ApiValidationError {
  message: string;
  errors: Record<string, string[]>;
}

// User avatar structure from API
export interface UserAvatar {
  small: string;
  medium: string;
  large: string;
}

// User as returned by API (login, register, who-am-i)
export interface AuthUser {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  username: string | null;
  email: string;
  mobile_number?: string | null;
  birth_date: string | null;
  gender: number | null;
  avatar: UserAvatar;
  restricted_at: string | null;
  banned_at: string | null;
  prevent_name_change: boolean | number | null;
  email_verified?: boolean;
  country: {
    id: number;
    country_code: string;
    name: string;
  } | null;
  state: {
    id: number;
    country_id: number;
    name: string;
  } | null;
}

// Auth response (login + register) - access_token is at top level
export interface AuthResponse {
  status: number;
  success: boolean;
  data: AuthUser;
  access_token: string;
}

// Register request
export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  mobile_number?: string;
  'cf-turnstile-response'?: string;
}

// Login request
export interface LoginRequest {
  email: string;
  password: string;
  'cf-turnstile-response'?: string;
}

// Send OTP request
export interface SendOtpRequest {
  email: string;
}

// Verify email/mobile request
export interface VerifyEmailRequest {
  email: string;
  verification_code: string;
}

// Forgot password request
export interface ForgotPasswordRequest {
  email: string;
  'cf-turnstile-response'?: string;
}

// Reset password request (via email link with token)
export interface ResetPasswordRequest {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
  'cf-turnstile-response'?: string;
}

// Reset password by mobile number
export interface ResetPasswordByMobileRequest {
  verification_code: string;
  mobile_number: string;
  new_password: string;
}

// Change password request (authenticated)
export interface ChangePasswordApiRequest {
  new_password: string;
  new_password_confirmation: string;
  old_password: string;
}

// Change email request (authenticated)
export interface ChangeEmailApiRequest {
  email: string;
  verification_code: string;
}

// Check email exists response
export interface CheckEmailExistsData {
  email: string;
  available: boolean;
}

// Update profile request fields
export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  username?: string;
  birth_date?: string;
  gender?: number;
  country_id?: number;
  state_id?: number;
  city_id?: number;
  timezone_id?: number;
  about?: string;
  mailing_list?: number;
  address?: string;
}

// Update avatar request
export interface UpdateAvatarRequest {
  file: File;
  caption?: string;
}

// Mobile phone object from API
export interface MobilePhone {
  id: number;
  country_code: string;
  mobile_number: string;
  verified_at: string | null;
  default: boolean;
}

// Check mobile availability response
export interface CheckMobileAvailableData {
  mobile_number: string;
  available: boolean;
}

// Store mobile phone response (includes seconds_to_next_msg)
export interface StoreMobilePhoneResponse {
  status: number;
  success: boolean;
  data: MobilePhone;
  message: string;
  seconds_to_next_msg: number;
}

// List mobile phones response
export interface MobilePhoneListResponse {
  status: number;
  success: boolean;
  data: MobilePhone[];
}

// Verify mobile phone request
export interface VerifyMobilePhoneRequest {
  code: string;
}

// Send mobile OTP request
export interface SendMobileOtpRequest {
  mobile_number: string;
}

// Verify temp mobile number request
export interface VerifyTempMobileNumberRequest {
  mobile_number: string;
  verification_code: string;
}

// Identity verification
export interface VerificationStatus {
  id: number;
  created_at: string;
  approval_status: {
    code: number;
    name: string;
    nice_name: string;
    reasons?: Array<{
      content: string;
      custom_reason: boolean;
    }>;
    approved_at?: string;
  };
}
