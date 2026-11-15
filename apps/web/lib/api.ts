export function resolveApiUrl(endpoint: string): string {
  if (endpoint.startsWith('http')) return endpoint;

  let base = '/api/v1';
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && !envUrl.includes('sisfortress.cyber')) {
    if (typeof window !== 'undefined') {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isLocal || !envUrl.includes('localhost')) {
        base = envUrl;
      }
    } else {
      base = envUrl;
    }
  }

  const cleanBase = base.replace(/\/$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${cleanBase}${cleanEndpoint}`;
}

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
      localStorage.setItem('sis_jwt_token', token);
      sessionStorage.setItem('sis_jwt_token', token);
    } else {
      localStorage.removeItem('sis_jwt_token');
      sessionStorage.removeItem('sis_jwt_token');
    }
  }
};

export const getAuthToken = (): string | null => {
  if (storedToken) return storedToken;
  if (typeof window !== 'undefined') {
    return localStorage.getItem('sis_jwt_token') || sessionStorage.getItem('sis_jwt_token');
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

  const url = resolveApiUrl(endpoint);

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
