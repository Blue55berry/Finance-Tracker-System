import axios from 'axios';

const API_URL = 'http://localhost:5000/api/receipts';

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

export const receiptService = {
  getReceipts: async () => {
    try {
      const response = await axiosInstance.get(API_URL);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error fetching receipts');
    }
  },
  
  getReceiptById: async (id) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error fetching receipt');
    }
  }
};