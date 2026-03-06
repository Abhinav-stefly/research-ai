import axios from 'axios';

const API_BASE = '/api';

// Auth API calls
export const authAPI = {
  register: (name, email, password) =>
    axios.post(`${API_BASE}/auth/register`, { name, email, password }),
  login: (email, password) =>
    axios.post(`${API_BASE}/auth/login`, { email, password })
};

// Paper API calls
export const paperAPI = {
  upload: (file, token) => {
    const formData = new FormData();
    formData.append('pdf', file);
    return axios.post(`${API_BASE}/papers/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getPapers: (token) =>
    axios.get(`${API_BASE}/papers`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  reprocess: (paperId, token) =>
    axios.post(`${API_BASE}/papers/${paperId}/reprocess`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  getPaper: (paperId, token) =>
    axios.get(`${API_BASE}/papers/${paperId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  getCitations: (paperId, token) =>
    axios.get(`${API_BASE}/papers/${paperId}/citations`, {
      headers: { Authorization: `Bearer ${token}` }
    })
};

// AI API calls
export const aiAPI = {
  summarize: (paperId, mode, token) =>
    axios.get(`${API_BASE}/ai/summarize/${paperId}?mode=${mode}`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  explain: (text, level, token) =>
    axios.post(`${API_BASE}/ai/explain`, { text, level }, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  explainMath: (text, level, token) =>
    axios.post(`${API_BASE}/ai/math-explain`, { text, level }, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  getSimilar: (paperId, topN, token) =>
    axios.get(`${API_BASE}/ai/similar/${paperId}?topN=${topN}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
};

// Set auth token for all requests
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};
