// API response type definitions

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface HistoryQueryParams {
  karat?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}
