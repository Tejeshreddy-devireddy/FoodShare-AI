const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5006/api';

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('gs_token');
  }
  return null;
};

export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('gs_token', token);
  }
};

export const clearAuth = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('gs_token');
    localStorage.removeItem('gs_user');
    try {
      document.cookie = 'gs_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } catch (e) {}
  }
};

export const getCurrentUser = () => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('gs_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

export const setCurrentUser = (user: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('gs_user', JSON.stringify(user));
    try {
      if (user && user.role) {
        document.cookie = `gs_role=${encodeURIComponent(user.role)}; path=/`;
      }
    } catch (e) {
      // ignore cookie errors in some environments
    }
  }
};

// Generic fetch wrapper that inserts Auth Token
export const apiRequest = async (path: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};
