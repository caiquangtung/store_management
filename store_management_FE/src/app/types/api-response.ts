export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  error?: string | null;
  timestamp?: string;
}

export interface ApiError {
  message: string;
  details?: string[];
  statusCode?: number;
  metadata?: Record<string, unknown>;
}

