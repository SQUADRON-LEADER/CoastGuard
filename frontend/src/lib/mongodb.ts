import axios from 'axios';
import { API_BASE_URL } from '../services/api';

// Frontend API client only (no MongoDB client-side)
const apiBaseUrl = `${API_BASE_URL}/api`;

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});