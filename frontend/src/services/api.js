import axios from 'axios';

// Fallback to local server in development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getHealthStatus = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const getSamplePuzzles = async () => {
  const response = await api.get('/api/sudoku/sample');
  return response.data;
};

export const solveSudoku = async (grid, algorithm = 'dfs') => {
  const response = await api.post('/api/sudoku/solve', { grid, algorithm });
  return response.data;
};

export const compareSolvers = async (grid) => {
  const response = await api.post('/api/sudoku/compare', { grid });
  return response.data;
};

export default api;
