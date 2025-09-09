import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Create axios instance with auth header
const axiosInstance = axios.create();

// Add token to request if it exists
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password
      });
      localStorage.setItem('token', response.data.token);
      return response.data.user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },
  
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });
      localStorage.setItem('token', response.data.token);
      return response.data.user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },
  
  logout: async () => {
    localStorage.removeItem('token');
    return true;
  },
  
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
      const response = await axiosInstance.get(`${API_URL}/user`);
      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      throw new Error('Session expired. Please login again.');
    }
  }
};
