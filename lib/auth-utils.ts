// Token management and auth utilities

import { API_BASE_URL } from './constants';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('gold_access_token');
}

export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('gold_access_token', token);
}

export function removeStoredToken(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem('gold_access_token');
}

export function getAuthHeaders(includeContentType = true): HeadersInit {
  const headers: HeadersInit = {
    'Accept': 'application/json',
    'Accept-Language': 'ar',
  };

  if (includeContentType) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  const token = getStoredToken();
  if (token) (headers as Record<string, string>).Authorization = `Bearer ${token}`;

  if (typeof document !== 'undefined') {
    const csrf = document.cookie.split('; ').find((item) => item.startsWith('gold_csrf='))?.split('=')[1];
    if (csrf) (headers as Record<string, string>)['X-CSRF-Token'] = decodeURIComponent(csrf);
  }

  return headers;
}

export class ApiError extends Error {
  code: number | string;
  status: number;

  constructor(message: string, status: number, code: number | string = status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

/**
 * Authenticated fetch wrapper.
 * Adds auth headers, handles 401, and parses error responses.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const isFormData = options.body instanceof FormData;

  const headers = getAuthHeaders(!isFormData);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = 'حدث خطأ غير متوقع';
    let errorCode: number | string = response.status;

    try {
      const errorData = await response.json();
      if (errorData.meta?.message) {
        errorMessage = errorData.meta.message;
        errorCode = errorData.meta.code || response.status;
      } else if (errorData.error?.message) {
        errorMessage = errorData.error.message;
        errorCode = errorData.error.code || response.status;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
      // Handle validation errors (422)
      if (errorData.errors) {
        const firstField = Object.keys(errorData.errors)[0];
        if (firstField) {
          errorMessage = errorData.errors[firstField][0];
        }
      }
    } catch {
      // Response wasn't JSON
    }

    // Only an expired/missing cookie session is a session-expired event. A
    // rejected login also uses HTTP 401, but must show its own API message.
    if (response.status === 401 && errorCode === 'UNAUTHENTICATED') {
      removeStoredToken();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('unauthorized'));
      }
      throw new ApiError('انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى', 401, errorCode);
    }

    throw new ApiError(errorMessage, response.status, errorCode);
  }

  return response.json();
}
