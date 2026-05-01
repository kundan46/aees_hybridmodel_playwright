// ─────────────────────────────────────────────────────────────
// src/utils/date.helper.ts
// Date picker & date formatting utilities
// ─────────────────────────────────────────────────────────────
import logger from './logger';

export class DateHelper {
  /**
   * Returns a date string in YYYY-MM-DD format, offset by daysOffset from today.
   */
  static getFormattedDate(daysOffset = 0, format: 'ISO' | 'US' | 'IN' = 'ISO'): string {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);

    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = String(date.getFullYear());

    switch (format) {
      case 'US':
        return `${mm}/${dd}/${yyyy}`;
      case 'IN':
        return `${dd}/${mm}/${yyyy}`;
      default:
        return `${yyyy}-${mm}-${dd}`;
    }
  }

  /**
   * Returns an object with year, month (1-12), and day.
   */
  static getDateParts(daysOffset = 0) {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      monthName: date.toLocaleString('en-US', { month: 'long' }),
    };
  }

  /**
   * Timestamp string suitable for unique test data generation.
   */
  static getTimestamp(): string {
    return new Date().toISOString().replace(/[:.]/g, '-');
  }
}
