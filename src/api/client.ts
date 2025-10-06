import axios from 'axios';
import { APIResponse } from '../types';

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: '/api', // Will proxy to SillyTavern backend
  timeout: 60000, // 60 seconds for LLM responses
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add any auth tokens or additional headers here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.warn('Unauthorized access');
    } else if (error.response?.status === 500) {
      // Handle server errors
      console.error('Server error occurred');
    }
    
    return Promise.reject(error);
  }
);

// Generic API wrapper function
export async function apiCall<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: any
): Promise<APIResponse<T>> {
  try {
    const response = await apiClient.request({
      method,
      url: endpoint,
      data
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Unknown error occurred'
    };
  }
}