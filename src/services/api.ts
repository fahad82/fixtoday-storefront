// src/services/api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse } from '../types';

class ApiService {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000,
      withCredentials: true,
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('authToken');
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        // Log requests in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.params || {});
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor with better error handling
    this.client.interceptors.response.use(
      (response) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ API Response: ${response.config.url}`, response.status);
        }
        return response;
      },
      (error: AxiosError) => {
        // Log full error details
        console.error('❌ API Error Details:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          code: error.code,
        });
        
        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
          console.error('Request timeout - server may be slow or unreachable');
        }
        
        if (error.response?.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.get(endpoint, { 
        params,
        timeout: 30000,
      });
      return response.data as T;
    } catch (error) {
      // Return empty data structure on error to prevent UI crashes
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
          console.warn(`⏰ Timeout fetching ${endpoint}, returning empty data`);
        }
        // Re-throw with more context
        throw new Error(`API Error: ${error.response?.status || 'Network Error'} - ${error.message}`);
      }
      throw error;
    }
  }

  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.post(endpoint, data);
    return response.data as T;
  }

  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.put(endpoint, data);
    return response.data as T;
  }

  async patch<T = any>(endpoint: string, data?: any): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.patch(endpoint, data);
    return response.data as T;
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.delete(endpoint);
    return response.data as T;
  }

  async postForm<T = any>(endpoint: string, formData: FormData): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data as T;
  }
}

export const api = new ApiService();
export default api;