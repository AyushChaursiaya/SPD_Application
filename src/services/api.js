import axios from 'axios';
import { mockTransactions } from '../data/mockData';

// Simulate an API endpoint that returns mockTransactions
const mockApi = {
  get: async (url) => {
    if (url === '/api/transactions') {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { data: mockTransactions };
    }
    throw new Error('Invalid API endpoint');
  }
};

const axiosInstance = { get: mockApi.get };

export const transactionAPI = {
  _cachedTransactions: null,

  async fetchAllTransactions() {
    if (this._cachedTransactions) {
      return this._cachedTransactions;
    }
    try {
      const response = await axiosInstance.get('/api/transactions');
      this._cachedTransactions = response.data;
      return this._cachedTransactions;
    } catch (error) {
      console.error('Error fetching mock transactions:', error);
      throw new Error('Failed to fetch transactions');
    }
  },

  getTransactions: async (params) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const allMockTransactions = await transactionAPI.fetchAllTransactions();
      let filteredData = [...allMockTransactions];
      
      if (params?.status?.length) {
        filteredData = filteredData.filter(t => params.status.includes(t.status));
      }
      
      if (params?.school_ids?.length) {
        filteredData = filteredData.filter(t => params.school_ids.includes(t.school_id));
      }
      
      if (params?.date_from) {
        filteredData = filteredData.filter(t => 
          new Date(t.created_at) >= new Date(params.date_from)
        );
      }
      
      if (params?.date_to) {
        filteredData = filteredData.filter(t => 
          new Date(t.created_at) <= new Date(params.date_to)
        );
      }
      
      if (params?.search) {
        const searchTerm = params.search.toLowerCase();
        filteredData = filteredData.filter(t =>
          t.collect_id.toLowerCase().includes(searchTerm) ||
          t.custom_order_id.toLowerCase().includes(searchTerm) ||
          t.school_id.toLowerCase().includes(searchTerm)
        );
      }
      
      if (params?.sort_by && params?.sort_order) {
        filteredData.sort((a, b) => {
          const aVal = a[params.sort_by];
          const bVal = b[params.sort_by];
          
          if (aVal < bVal) return params.sort_order === 'asc' ? -1 : 1;
          if (aVal > bVal) return params.sort_order === 'asc' ? 1 : -1;
          return 0;
        });
      }
      
      const stats = {
        successful: filteredData.filter(t => t.status === 'Success').length,
        pending: filteredData.filter(t => t.status === 'Pending').length,
        failed: filteredData.filter(t => t.status === 'Failed').length,
        totalAmount: filteredData.reduce((sum, t) => sum + t.transaction_amount, 0),
      };
      
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      return {
        data: filteredData.slice(startIndex, endIndex),
        total: filteredData.length,
        stats,
      };
    } catch (error) {
      console.error('Error processing transactions:', error);
      throw new Error('Failed to process transactions');
    }
  },

  getTransactionsBySchool: async (schoolId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const allMockTransactions = await transactionAPI.fetchAllTransactions();
      return allMockTransactions.filter(t => t.school_id === schoolId);
    } catch (error) {
      console.error(`Error fetching transactions for ${schoolId}:`, error);
      throw new Error('Failed to fetch school transactions');
    }
  },

  checkTransactionStatus: async (customOrderId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const allMockTransactions = await transactionAPI.fetchAllTransactions();
      return allMockTransactions.find(t => t.custom_order_id === customOrderId) || null;
    } catch (error) {
      console.error(`Error checking transaction status for ${customOrderId}:`, error);
      throw new Error('Failed to check transaction status');
    }
  },

  getSchoolIds: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const allMockTransactions = await transactionAPI.fetchAllTransactions();
      const schoolIds = [...new Set(allMockTransactions.map(t => t.school_id))];
      return schoolIds.sort();
    } catch (error) {
      console.error('Error fetching school IDs:', error);
      throw new Error('Failed to fetch school IDs');
    }
  },
};