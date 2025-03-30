import api from './api';

export const createCase = async (caseData) => {
  const response = await api.post('/cases', caseData);
  return response.data;
};

export const getCases = async () => {
  const response = await api.get('/cases');
  return response.data;
};

export const getCaseDetails = async (id) => {
  const response = await api.get(`/cases/${id}`);
  return response.data;
};