import axios from 'axios';
import { APIResponse } from '../types';

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: '/api', // Proxy ke ChimeraDev backend (localhost:8000)
  timeout: 120000, // 2 menit timeout untuk Ollama responses
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add timestamp untuk debugging
    console.log(`🔗 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      console.warn('🔒 Unauthorized access');
    } else if (error.response?.status === 503) {
      console.warn('🔌 Service unavailable (Ollama might be offline)');
    } else if (error.response?.status === 500) {
      console.error('💥 Server error occurred');
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
    
    // Handle ChimeraDev backend response format
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error,
        message: response.data.message
      };
    }
    
    // Fallback untuk direct data response
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.message || 
                        error.message || 
                        'Unknown error occurred';
    
    return {
      success: false,
      error: errorMessage,
      data: error.response?.data?.data
    };
  }
}

// Health check function
export async function healthCheck(): Promise<boolean> {
  try {
    const response = await apiCall<{ status: string }>('GET', '/health');
    return response.success && response.data?.status === 'OK';
  } catch {
    return false;
  }
}

// Connection test untuk Ollama
export async function testOllamaConnection(): Promise<APIResponse<any>> {
  return apiCall('POST', '/chat/test-connection');
}

export default apiClient;