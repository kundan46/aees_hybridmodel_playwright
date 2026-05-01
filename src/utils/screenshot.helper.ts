// ─────────────────────────────────────────────────────────────
// src/utils/screenshot.helper.ts
// Manual screenshot capture with Allure attachment support
// ─────────────────────────────────────────────────────────────
import { Page, TestInfo } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import logger from './logger';

export class ScreenshotHelper {
  private static screenshotDir = path.resolve(process.cwd(), 'reports/screenshots');

  /**
   * Take a full-page screenshot and attach it to the Allure report.
   */
  static async captureFullPage(page: Page, testInfo: TestInfo, name: string): Promise<void> {
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
    const filePath = path.join(this.screenshotDir, `${name}-${Date.now()}.png`);
    const buffer = await page.screenshot({ path: filePath, fullPage: true });
    logger.info(`Screenshot saved: ${filePath}`);

    // Attach to Playwright/Allure report
    await testInfo.attach(name, { body: buffer, contentType: 'image/png' });
  }

  /**
   * Take a screenshot of a specific element.
   */
  static async captureElement(
    page: Page,
    testInfo: TestInfo,
    selector: string,
    name: string
  ): Promise<void> {
    const locator = page.locator(selector);
    const buffer = await locator.screenshot();
    await testInfo.attach(name, { body: buffer, contentType: 'image/png' });
    logger.info(`Element screenshot attached: ${name}`);
  }
}
