// ─────────────────────────────────────────────────────────────
// src/config/env.config.ts
// Centralised environment configuration with type-safety
// ─────────────────────────────────────────────────────────────
import * as dotenv from 'dotenv';
import * as path from 'path';

const ENV = process.env.ENV || 'qa';

// Load environment-specific .env first, then fall back to .env
dotenv.config({ path: path.resolve(process.cwd(), `.env.${ENV}`) });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

interface EnvConfig {
  env: string;
  baseUrl: string;
  apiBaseUrl: string;
  adminUser: string;
  adminPassword: string;
  logLevel: string;
  aeesUrl: string;
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`[ENV] Missing required environment variable: ${key}`);
  }
  return value;
}

export const envConfig: EnvConfig = {
  env: ENV,
  baseUrl: process.env.BASE_URL || 'https://aees.onlineregistrationforms.com',
  apiBaseUrl: process.env.API_BASE_URL || 'https://aees.onlineregistrationforms.com',
  adminUser: process.env.ADMIN_USER || 'standard_user',
  adminPassword: process.env.ADMIN_PASSWORD || 'secret_sauce',
  logLevel: process.env.LOG_LEVEL || 'info',
  aeesUrl: process.env.AEES_URL || 'https://aees.onlineregistrationforms.com',
};

export default envConfig;
