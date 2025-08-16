import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const apiService = {
  // Health check
  async healthCheck() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('Failed to connect to server');
    }
  },

  // Summary endpoints
  async generateSummary(data) {
    try {
      const response = await api.post('/summarize', data);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to generate summary';
      throw new Error(message);
    }
  },

  async getSummary(id) {
    try {
      const response = await api.get(`/summarize/${id}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch summary';
      throw new Error(message);
    }
  },

  async updateSummary(id, data) {
    try {
      const response = await api.put(`/summarize/${id}`, data);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update summary';
      throw new Error(message);
    }
  },

  async getAllSummaries(page = 1, limit = 10) {
    try {
      const response = await api.get(`/summarize?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch summaries';
      throw new Error(message);
    }
  },

  async deleteSummary(id) {
    try {
      const response = await api.delete(`/summarize/${id}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete summary';
      throw new Error(message);
    }
  },

  // Sharing endpoints
  async shareSummary(summaryId, recipients) {
    try {
      const response = await api.post('/share', {
        summaryId,
        recipients
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to share summary';
      throw new Error(message);
    }
  },

  async getShareHistory(summaryId) {
    try {
      const response = await api.get(`/share/history/${summaryId}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch share history';
      throw new Error(message);
    }
  },

  async getShareStats() {
    try {
      const response = await api.get('/share/stats');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch share statistics';
      throw new Error(message);
    }
  },

  // Test endpoints
  async testAI() {
    try {
      const response = await api.post('/summarize/test-ai');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to test AI service';
      throw new Error(message);
    }
  },

  async testEmail(testEmail) {
    try {
      const response = await api.post('/share/test-email', { testEmail });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to test email service';
      throw new Error(message);
    }
  },
};

export default apiService;
