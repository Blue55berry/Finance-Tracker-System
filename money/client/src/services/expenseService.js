import axios from "axios";

const API_URL = "http://localhost:5000/api/expenses";

// Create axios instance with auth header
const axiosInstance = axios.create();

// Add token to request if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const expenseService = {
  createExpense: async (expenseData) => {
    try {
      const response = await axiosInstance.post(API_URL, expenseData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error creating expense"
      );
    }
  },

  getExpenses: async (params = {}) => {
    try {
      const response = await axiosInstance.get(API_URL, { params });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error fetching expenses"
      );
    }
  },

  getExpenseById: async (id) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error fetching expense"
      );
    }
  },

  updateExpense: async (id, expenseData) => {
    try {
      const response = await axiosInstance.put(`${API_URL}/${id}`, expenseData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error updating expense"
      );
    }
  },

  deleteExpense: async (id) => {
    try {
      const response = await axiosInstance.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error deleting expense"
      );
    }
  },

  getExpenseSummary: async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await axiosInstance.get(`${API_URL}/summary`, {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error fetching expense summary"
      );
    }
  },

  getExpensesByCategory: async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await axiosInstance.get(`${API_URL}/categories`, {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error fetching expenses by category"
      );
    }
  },

  getWeeklySummary: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/weekly`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error fetching weekly summary"
      );
    }
  },

  getExpensesByDay: async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await axiosInstance.get(`${API_URL}/byDay`, { params });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error fetching daily expenses"
      );
    }
  },
};
