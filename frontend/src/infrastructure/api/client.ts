// ...existing code...
import axios from 'axios';
import type {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { API_CONFIG } from '../../shared/constants';

/**
 * API Client Configuration
 */
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const method = (config.method ?? '').toString().toUpperCase();
        const url = config.url ?? '';
        console.log(`[API Request] ${method} ${url}`);
        return config;
      },
      (error: any) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        const url = response.config?.url ?? '';
        console.log(`[API Response] ${response.status} ${url}`);
        return response;
      },
      (error: AxiosError) => {
        console.error('[API Response Error]', error.response?.data ?? error.message);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): Error {
    if (error.response) {
      const message = (error.response.data as any)?.error ?? error.message;
      return new Error(message);
    } else if (error.request) {
      return new Error('No response from server. Please check your connection.');
    } else {
      return new Error(error.message);
    }
  }

  public getClient(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient().getClient();
// ...existing code...