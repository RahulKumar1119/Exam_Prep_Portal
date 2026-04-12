import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { ApiResponse } from '../types/index';

// API Base URL - uses environment variable or defaults to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:5000/api';

// Log API configuration
console.log('API Configuration:', {
  baseURL: API_BASE_URL,
  environment: process.env.REACT_APP_ENVIRONMENT || 'development',
  nodeEnv: process.env.NODE_ENV,
  allEnvVars: {
    REACT_APP_API_ENDPOINT: process.env.REACT_APP_API_ENDPOINT,
    REACT_APP_ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT,
  }
});

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const response = await axios.post(
                `${API_BASE_URL}/auth/refresh-token`,
                { refresh_token: refreshToken }
              );

              const { access_token } = response.data;
              localStorage.setItem('access_token', access_token);

              originalRequest.headers.Authorization = `Bearer ${access_token}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        // Handle 403 Forbidden
        if (error.response?.status === 403) {
          console.error('Access forbidden');
        }

        // Handle 500 Server Error
        if (error.response?.status === 500) {
          console.error('Server error occurred');
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic request method
  async request<T>(
    method: string,
    url: string,
    data?: any,
    config?: any
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client({
        method,
        url,
        data,
        ...config,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || error.message,
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  }

  // GET request
  get<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, undefined, config);
  }

  // POST request
  post<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data, config);
  }

  // PUT request
  put<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data, config);
  }

  // DELETE request
  delete<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, undefined, config);
  }

  // PATCH request
  patch<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', url, data, config);
  }
}

export const apiClient = new ApiClient();
