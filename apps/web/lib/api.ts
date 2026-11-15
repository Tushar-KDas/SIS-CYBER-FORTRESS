const API_BASE_URL = typeof window !== 'undefined' ? '/api/v1' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1');

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  timestamp: string;
}

export class ApiError extends Error {
  statusCode: number;
  errorType: string;

  constructor(message: string, statusCode: number, errorType: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errorType = errorType;
  }
}

let storedToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  storedToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      sessionStorage.setItem('sis_jwt_token', token);
    } else {
      sessionStorage.removeItem('sis_jwt_token');
    }
  }
};

export const getAuthToken = (): string | null => {
  if (storedToken) return storedToken;
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('sis_jwt_token');
  }
  return null;
};

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || response.statusText || 'Request failed';
    throw new ApiError(
      Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg,
      response.status,
      data?.error || 'HttpError',
    );
  }

  // Handle wrapped { success: true, data: ... }
  if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
    return data.data as T;
  }

  return data as T;
}
