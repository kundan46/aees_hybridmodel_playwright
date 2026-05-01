// ─────────────────────────────────────────────────────────────
// src/utils/dropdown.helper.ts
// Generic dropdown / select helpers
// ─────────────────────────────────────────────────────────────
import { Page, Locator } from '@playwright/test';
import logger from './logger';

export class DropdownHelper {
  /**
   * Select an option from a native <select> by visible label.
   */
  static async selectByLabel(locator: Locator, label: string): Promise<void> {
    logger.debug(`Selecting dropdown option by label: "${label}"`);
    await locator.selectOption({ label });
  }

  /**
   * Select an option from a native <select> by value attribute.
   */
  static async selectByValue(locator: Locator, value: string): Promise<void> {
    logger.debug(`Selecting dropdown option by value: "${value}"`);
    await locator.selectOption({ value });
  }

  /**
   * Handle custom (non-native) dropdowns: click trigger, then click option.
   */
  static async selectCustomOption(
    page: Page,
    triggerLocator: Locator,
    optionText: string
  ): Promise<void> {
    logger.debug(`Opening custom dropdown and selecting: "${optionText}"`);
    await triggerLocator.click();
    await page.getByRole('option', { name: optionText }).click();
  }

  /**
   * Return the currently selected text from a native <select>.
   */
  static async getSelectedText(locator: Locator): Promise<string> {
    return locator.evaluate((el: HTMLSelectElement) => el.options[el.selectedIndex].text);
  }
}
