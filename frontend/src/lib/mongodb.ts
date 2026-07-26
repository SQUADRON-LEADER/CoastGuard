import axios from 'axios';

// Frontend API client only (no MongoDB client-side)
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3003/api';

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});