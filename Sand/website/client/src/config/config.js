import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL;

export const API_CONFIG = {
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
};

export const axiosInstance = axios.create(API_CONFIG);