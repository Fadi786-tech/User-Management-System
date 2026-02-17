import axios, { AxiosError, AxiosInstance } from 'axios';
import {
  ApiResponse,
  LoginResponse,
  RegisterResponse,
  UsersListResponse,
  User,
} from '../types';

const API_URL =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests if available
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Handle API errors
  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResponse>;
      const message =
        axiosError.response?.data?.error ||
        axiosError.response?.data?.message ||
        axiosError.message ||
        'An unexpected error occurred';
      throw new Error(message);
    }
    throw error;
  }

  // Register user
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<RegisterResponse> {
    try {
      const response = await this.api.post<ApiResponse<RegisterResponse>>(
        '/register',
        { name, email, password }
      );
      return response.data.data!;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Login user
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await this.api.post<ApiResponse<LoginResponse>>(
        '/login',
        { email, password }
      );
      return response.data.data!;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.api.get<ApiResponse<{ user: User }>>('/me');
      return response.data.data!.user;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Get all users (SuperAdmin only)
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await this.api.get<ApiResponse<UsersListResponse>>(
        '/users'
      );
      return response.data.data!.users;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Update user
  async updateUser(
    userId: string,
    data: {
      name?: string;
      email?: string;
      password?: string;
      role?: string;
    }
  ): Promise<User> {
    try {
      const response = await this.api.put<ApiResponse<{ user: User }>>(
        `/update/${userId}`,
        data
      );
      return response.data.data!.user;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Delete user (SuperAdmin only)
  async deleteUser(userId: string): Promise<void> {
    try {
      await this.api.delete(`/delete/${userId}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Create user (Admin and SuperAdmin)
  async createUser(data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }): Promise<User> {
    try {
      const response = await this.api.post<ApiResponse<RegisterResponse>>(
        '/register',
        data
      );
      return response.data.data!.user;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * ⚠️ INSECURE ENDPOINT - DEMO ONLY
   * Get decrypted password for a user
   * NEVER use in production!
   */
  async getUserPassword(userId: string): Promise<string> {
    try {
      const response = await this.api.get<ApiResponse<{ password: string; warning: string }>>(
        `/password/${userId}`
      );
      return response.data.data!.password;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default new ApiService();

