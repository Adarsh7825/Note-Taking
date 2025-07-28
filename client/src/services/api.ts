import axios from 'axios';
import type {
  AuthResponse,
  ApiResponse,
  LoginCredentials,
  SignupData,
  GoogleAuthData,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  sendOTP: async (email: string, name: string): Promise<ApiResponse> => {
    const response = await api.post('/auth/send-otp', { email, name });
    return response.data;
  },

  verifyOTPAndSignup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await api.post('/auth/verify-otp', data);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  googleAuth: async (data: GoogleAuthData): Promise<AuthResponse> => {
    const response = await api.post('/auth/google', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<{ user: any }> => {
    const response = await api.get('/auth/curruser');
    return response.data;
  },
};


export default api; 