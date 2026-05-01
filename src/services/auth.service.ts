// ─────────────────────────────────────────────────────────────
// src/services/auth.service.ts
// Authentication-specific API service
// ─────────────────────────────────────────────────────────────
import { APIRequestContext } from '@playwright/test';
import { ApiClient } from './api.client';
import logger from '@utils/logger';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

interface UserResponse {
  data: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
  };
}

export class AuthService {
  private readonly client: ApiClient;

  constructor(request: APIRequestContext) {
    this.client = new ApiClient(request);
  }

  /**
   * Obtain a bearer token via the login endpoint.
   */
  async login(payload: LoginPayload): Promise<string> {
    logger.info(`[AuthService] Logging in as: ${payload.email}`);
    const response = await this.client.post<LoginResponse>('/login', payload);
    logger.info(`[AuthService] Token received`);
    return response.token;
  }

  /**
   * Fetch a user by ID.
   */
  async getUser(userId: number): Promise<UserResponse['data']> {
    logger.info(`[AuthService] Fetching user ID: ${userId}`);
    const response = await this.client.get<UserResponse>(`/users/${userId}`);
    return response.data;
  }

  /**
   * Create a user via API (for test setup).
   */
  async createUser(name: string, job: string): Promise<{ id: string; createdAt: string }> {
    logger.info(`[AuthService] Creating user: ${name}`);
    return this.client.post('/users', { name, job });
  }
}
