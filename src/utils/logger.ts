// ─────────────────────────────────────────────────────────────
// src/utils/logger.ts
// Winston-based logger with timestamp and log-level from env
// ─────────────────────────────────────────────────────────────
import * as winston from 'winston';
import * as path from 'path';
import * as fs from 'fs';

const logDir = path.resolve(process.cwd(), 'reports/logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `[${timestamp}] ${level.toUpperCase().padEnd(7)}: ${stack || message}`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    // Console output with colour
    new winston.transports.Console({
      format: combine(colorize({ all: true }), timestamp({ format: 'HH:mm:ss' }), logFormat),
    }),
    // Persistent file log
    new winston.transports.File({
      filename: path.join(logDir, 'execution.log'),
      maxsize: 5 * 1024 * 1024, // 5 MB
      maxFiles: 5,
    }),
    // Separate error log
    new winston.transports.File({
      level: 'error',
      filename: path.join(logDir, 'errors.log'),
    }),
  ],
});

export default logger;
