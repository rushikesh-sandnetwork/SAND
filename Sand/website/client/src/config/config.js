import axios from 'axios';

export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
};

export const axiosInstance = axios.create(API_CONFIG);