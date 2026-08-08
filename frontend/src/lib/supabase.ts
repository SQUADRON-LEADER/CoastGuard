import mongoose from 'mongoose';
import axios from 'axios';

const mongoUri = import.meta.env.VITE_MONGODB_URI;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://coastguard-sgwc.onrender.com/api';

if (!mongoUri) {
  throw new Error(
    'Missing MongoDB environment variable. Please check your .env file and ensure VITE_MONGODB_URI is set.'
  )
}

// MongoDB connection (for backend use)
export const connectMongoDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// API client for frontend
export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);