import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Auth API
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (credentials) => api.post('/auth/register', credentials);

// Case API
export const createCase = (caseData) => api.post('/cases', caseData);
export const getCases = () => api.get('/cases');
export const getCaseDetails = (caseId) => api.get(`/cases/${caseId}`);
export const updateCaseStatus = (caseId, status) => api.put(`/cases/${caseId}/status`, { status });
// src/services/api.js
export const approveCase = async (caseId, data) => {
  const token = localStorage.getItem('token');
  console.log("Authorization Token:", token);
  return api.put(`/cases/${caseId}/approve`, data);
};


export const deleteCase = (caseId) => api.delete(`/cases/${caseId}`);

// Messages API
export const getMessages = (caseId) => api.get(`/messages/case/${caseId}`);
export const sendMessage = (messageData) => api.post('/messages', messageData);

// Reports API
export const getReport = () => api.get('/reports/cases');

// Feedback API
export const getAllFeedback = () => api.get('/feedback'); // Added this line
export const submitAdminFeedback = (feedbackId, response) => api.post('/feedback/admin-response', { feedbackId, response });

export default api;