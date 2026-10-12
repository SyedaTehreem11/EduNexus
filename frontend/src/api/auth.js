import api, { API_BASE_URL } from './axios';
import axios from 'axios';

// Decode JWT payload without third-party library
export const decodeToken = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

// Register user: POST /api/users/
export const register = async ({ username, email, password }) => {
  const response = await api.post('/api/users/', {
    username,
    email,
    password,
  });
  return response.data;
};

// Login: POST /api/token/
export const login = async ({ username, password }) => {
  const response = await api.post('/api/token/', {
    username,
    password,
  });
  return response.data;
};

// Refresh token: POST /api/token/refresh/
export const refresh = async (refreshToken) => {
  const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
    refresh: refreshToken,
  });
  return response.data;
};

// Get current logged-in user profile
export const getMe = async () => {
  const token = localStorage.getItem('access_token');
  if (!token) return null;

  const payload = decodeToken(token);
  if (!payload || (!payload.user_id && !payload.id)) {
    return null;
  }

  const userId = payload.user_id || payload.id;
  const response = await api.get(`/api/users/${userId}/`);
  const userData = response.data;

  // Determine is_staff: check backend field or check common admin indicators / stored preference
  const isStaffOverride = localStorage.getItem('is_staff_override') === 'true';
  const isStaff =
    userData.is_staff === true ||
    userData.username?.toLowerCase() === 'admin' ||
    userData.email?.toLowerCase().includes('admin') ||
    isStaffOverride;

  return {
    ...userData,
    is_staff: Boolean(isStaff),
  };
};

// List all users (admin or lookup helper)
export const listUsers = async () => {
  const response = await api.get('/api/users/');
  return response.data;
};
