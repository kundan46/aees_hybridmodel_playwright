// ─────────────────────────────────────────────────────────────
// src/pages/base.page.ts
// Abstract base class shared by all Page Objects
// ─────────────────────────────────────────────────────────────
import { Page, test, Locator } from '@playwright/test';
import logger from '@utils/logger';
import envConfig from '@config/env.config';
import * as path from 'path';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /**
   * Navigate to a relative or absolute URL.
   * If path is relative it is appended to BASE_URL.
   */
  async navigateTo(path: string = '/'): Promise<void> {
    const url = path.startsWith('http') ? path : `${envConfig.baseUrl}${path}`;
    logger.info(`[Navigation] → ${url}`);
    await test.step(`Navigate to ${url}`, async () => {
      await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    });
  }

  /** Current page title */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /** Current URL */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /** Reload the page */
  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: 'domcontentloaded' });
  }

  /** Wait for a specific URL pattern */
  async waitForUrl(urlOrPattern: string | RegExp, timeout = 15_000): Promise<void> {
    await this.page.waitForURL(urlOrPattern, { timeout });
  }

  /**
   * Universal helper to upload a file by clicking a trigger and handling the FileChooser.
   * @param trigger The Locator that opens the file dialog.
   * @param filePath Path to the file relative to the project root.
   */
  protected async uploadFile(trigger: Locator, filePath: string): Promise<void> {
    const fullPath = path.resolve(filePath);
    logger.info(`[Upload] Uploading file: ${fullPath}`);
    
    const [fileChooser] = await Promise.all([
      this.page.waitForEvent('filechooser', { timeout: 10000 }).catch(() => null),
      trigger.click()
    ]);

    if (fileChooser) {
      await fileChooser.setFiles(fullPath);
    } else {
      // Fallback: search for a file input in the trigger's parent or nearby
      logger.warn(`[Upload] FileChooser did not appear for trigger. Attempting direct setInputFiles.`);
      const input = this.page.locator('input[type="file"]').first();
      if (await input.isVisible()) {
        await input.setInputFiles(fullPath);
      }
    }
  }
}
