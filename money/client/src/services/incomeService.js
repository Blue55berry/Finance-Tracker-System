import axios from 'axios';

const API_URL = 'http://localhost:5000/api/income';

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

export const incomeService = {
  createIncome: async (incomeData) => {
    try {
      const response = await axiosInstance.post(API_URL, incomeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error creating income');
    }
  },
  
  getIncomes: async () => {
    try {
      const response = await axiosInstance.get(API_URL);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error fetching income');
    }
  },
  
  getIncomeById: async (id) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error fetching income record');
    }
  },
  
  updateIncome: async (id, incomeData) => {
    try {
      const response = await axiosInstance.put(`${API_URL}/${id}`, incomeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error updating income');
    }
  },
  
  deleteIncome: async (id) => {
    try {
      const response = await axiosInstance.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error deleting income');
    }
  },

  getIncomeSummary: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/summary`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error fetching income summary');
    }
  }
};