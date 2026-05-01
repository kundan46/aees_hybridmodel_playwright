// ─────────────────────────────────────────────────────────────
// src/utils/wait.helper.ts
// Explicit wait helpers wrapping Playwright auto-waiting
// ─────────────────────────────────────────────────────────────
import { Page, Locator } from '@playwright/test';
import logger from './logger';

export class WaitHelper {
  /**
   * Wait for a locator to become visible within the given timeout.
   */
  static async waitForVisible(
    locator: Locator,
    options: { timeout?: number; message?: string } = {}
  ): Promise<void> {
    const { timeout = 15_000, message = locator.toString() } = options;
    logger.debug(`Waiting for element to be visible: ${message}`);
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for a locator to be hidden / detached.
   */
  static async waitForHidden(
    locator: Locator,
    options: { timeout?: number } = {}
  ): Promise<void> {
    const { timeout = 15_000 } = options;
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Wait for network to reach 'networkidle' state.
   */
  static async waitForNetworkIdle(page: Page, timeout = 10_000): Promise<void> {
    logger.debug('Waiting for network idle…');
    await page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Poll a custom condition every interval until it returns true or times out.
   */
  static async waitUntil(
    condition: () => Promise<boolean>,
    options: { timeout?: number; interval?: number; message?: string } = {}
  ): Promise<void> {
    const { timeout = 15_000, interval = 500, message = 'condition' } = options;
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (await condition()) return;
      await new Promise((r) => setTimeout(r, interval));
    }
    throw new Error(`[WaitHelper] Timed out waiting for: ${message}`);
  }
}
