import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest?.url || '';

    // Handle 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Exclude public endpoints such as /api/faqs/ from refreshing or throwing unhandled errors
      const isFaqEndpoint = url.includes('/api/faqs/') || url.includes('/faqs/');
      if (isFaqEndpoint) {
        // Silently resolve with empty data and unauthorized flag
        return Promise.resolve({
          data: [],
          status: 401,
          statusText: 'Unauthorized',
          unauthorized: true,
          headers: error.response.headers,
          config: originalRequest,
        });
      }

      if (
        !originalRequest._retry &&
        !url.includes('/api/token/')
      ) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('refresh_token');

        if (refreshToken) {
          try {
            const res = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
              refresh: refreshToken,
            });

            const newAccess = res.data.access;
            localStorage.setItem('access_token', newAccess);
            if (res.data.refresh) {
              localStorage.setItem('refresh_token', res.data.refresh);
            }

            originalRequest.headers.Authorization = `Bearer ${newAccess}`;
            return api(originalRequest);
          } catch (refreshErr) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
            return Promise.reject(refreshErr);
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
