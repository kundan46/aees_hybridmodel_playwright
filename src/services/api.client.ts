// ─────────────────────────────────────────────────────────────
// src/services/api.client.ts
// Low-level Playwright APIRequestContext wrapper
// ─────────────────────────────────────────────────────────────
import { APIRequestContext, APIResponse } from '@playwright/test';
import logger from '@utils/logger';
import envConfig from '@config/env.config';

export class ApiClient {
  private readonly baseUrl: string;

  constructor(private readonly request: APIRequestContext) {
    this.baseUrl = envConfig.apiBaseUrl;
  }

  private async handleResponse(response: APIResponse, endpoint: string, method = 'HTTP'): Promise<unknown> {
    logger.info(`[API] ${method} ${endpoint} → ${response.status()}`);
    if (!response.ok()) {
      const body = await response.text();
      throw new Error(`[ApiClient] ${response.status()} ${response.statusText()} — ${body}`);
    }
    return response.json();
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const response = await this.request.get(`${this.baseUrl}${endpoint}`, { params });
    return (await this.handleResponse(response, endpoint, 'GET')) as T;
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await this.request.post(`${this.baseUrl}${endpoint}`, {
      data,
      headers: { 'Content-Type': 'application/json' },
    });
    return (await this.handleResponse(response, endpoint, 'POST')) as T;
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await this.request.put(`${this.baseUrl}${endpoint}`, { data });
    return (await this.handleResponse(response, endpoint, 'PUT')) as T;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.request.delete(`${this.baseUrl}${endpoint}`);
    return (await this.handleResponse(response, endpoint, 'DELETE')) as T;
  }
}
