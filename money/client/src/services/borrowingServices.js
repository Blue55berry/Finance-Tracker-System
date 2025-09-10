import axios from 'axios';

const API_URL = 'http://localhost:5000/api/borrowings';

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

export const borrowingService = {
  createBorrowing: async (borrowingData) => {
    try {
      const response = await axiosInstance.post(API_URL, borrowingData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error creating borrowing record');
    }
  },
  
  getBorrowings: async (isRepaid) => {
    try {
      const params = {};
      if (isRepaid !== undefined) {
        params.isRepaid = isRepaid;
      }
      
      const response = await axiosInstance.get(API_URL, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error fetching borrowings');
    }
  },
  
  getBorrowingById: async (id) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error fetching borrowing record');
    }
  },
  
  updateBorrowing: async (id, borrowingData) => {
    try {
      const response = await axiosInstance.put(`${API_URL}/${id}`, borrowingData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error updating borrowing record');
    }
  },
  
  markAsRepaid: async (id, repaymentData) => {
    try {
      const response = await axiosInstance.patch(`${API_URL}/${id}/repay`, repaymentData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error marking borrowing as repaid');
    }
  },
  
  deleteBorrowing: async (id) => {
    try {
      const response = await axiosInstance.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error deleting borrowing record');
    }
  },
  
  getBorrowingsByDate: async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await axiosInstance.get(`${API_URL}/byDate`, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error fetching borrowings by date');
    }
  },

  getBorrowingsByLender: async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await axiosInstance.get(`${API_URL}/by-lender`, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error fetching borrowings by lender');
    }
  }
};
