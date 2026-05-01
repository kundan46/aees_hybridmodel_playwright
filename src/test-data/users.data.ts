// ─────────────────────────────────────────────────────────────
// src/test-data/users.data.ts
// Centralised, typed test data — import instead of hardcoding
// ─────────────────────────────────────────────────────────────

export interface UserCredentials {
  username: string;
  password: string;
  description?: string;
}

export const USERS: Record<string, UserCredentials> = {
  standard: {
    username:    'standard_user',
    password:    'secret_sauce',
    description: 'Standard user — full access',
  },
  locked: {
    username:    'locked_out_user',
    password:    'secret_sauce',
    description: 'Locked-out user — should see error',
  },
  problem: {
    username:    'problem_user',
    password:    'secret_sauce',
    description: 'Problem user — UI glitches expected',
  },
  performance: {
    username:    'performance_glitch_user',
    password:    'secret_sauce',
    description: 'Slow-loading user',
  },
};

export const API_USERS = {
  validLogin: {
    email:    'eve.holt@reqres.in',
    password: 'cityslicka',
  },
  invalidLogin: {
    email:    'peter@klaven.com',
    password: 'wrong_password',
  },
};
