import { Page, Locator, test, expect } from '@playwright/test';
import { BasePage } from '../base.page';
import logger from '@utils/logger';
import * as path from 'path';

export class AeesPreviewPage extends BasePage {
  readonly declarationCheckbox: Locator;
  readonly submitBtn: Locator;
  readonly confirmBtn: Locator;
  readonly viewAppBtn: Locator;
  readonly previewBtn: Locator;
  readonly printBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.declarationCheckbox = page.locator('input[type="checkbox"]').last();
    this.submitBtn = page.getByRole('button', { name: 'Submit' });
    this.confirmBtn = page.getByRole('button', { name: 'Yes, I Confirm' });
    this.viewAppBtn = page.locator('a').filter({ hasText: 'Dashboard' }).first();
    this.previewBtn = page.getByText('Preview');
    this.printBtn = page.getByRole('button', { name: 'Download Application Form' });
  }

  async confirmAndSubmit(): Promise<void> {
    await test.step('Confirm and Submit Application', async () => {
      logger.info('[AeesPreview] Confirming and submitting application');
      await expect(this.declarationCheckbox).toBeVisible();
      await this.declarationCheckbox.check();

      if (await this.submitBtn.isVisible()) {
        await this.submitBtn.click();
        await this.confirmBtn.click();
      }
    });
  }

  async downloadApplication(downloadDir: string, fileName: string): Promise<string> {
    return await test.step('Download Application', async () => {
      logger.info(`[AeesPreview] Downloading application to ${downloadDir}/${fileName}`);
      await this.page.waitForURL(/.*dashboard|.*activity/);

      if (!this.page.url().includes('dashboard')) {
        await this.navigateTo('https://aees.onlineregistrationforms.com/#/dashboard');
      }

      await this.viewAppBtn.click();

      const downloadPromise = this.page.waitForEvent('download');

      if (await this.previewBtn.isVisible().catch(() => false)) {
        await this.previewBtn.click();
      }

      if (await this.printBtn.isVisible()) {
        await this.printBtn.click();
        const download = await downloadPromise;
        const downloadPath = path.join(downloadDir, fileName);
        await download.saveAs(downloadPath);
        return downloadPath;
      }
      return '';
    });
  }
}
