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
    // Use a more robust locator for the checkbox
    this.declarationCheckbox = page.locator('input[type="checkbox"]').last();
    this.submitBtn = page.getByRole('button', { name: 'Submit' });
    this.confirmBtn = page.getByRole('button', { name: /Yes, I Confirm|Confirm/i });
    this.viewAppBtn = page.getByRole('button', { name: 'View Application' }).first();
    this.previewBtn = page.getByText('Preview', { exact: true });
    this.printBtn = page.getByRole('button', { name: /Download Application Form|Download|Print/i });
  }

  async confirmAndSubmit(): Promise<void> {
    await test.step('Confirm and Submit Application', async () => {
      logger.info('[AeesPreview] Confirming and submitting application');
      
      // Wait for the page to stabilize
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(2000);

      // Scroll to bottom to ensure elements are in view
      await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await this.page.waitForTimeout(1000);

      // Handle checkbox - often styled, so click the parent or use force
      if (await this.declarationCheckbox.isVisible()) {
        await this.declarationCheckbox.click({ force: true });
        logger.info('[AeesPreview] Declaration checkbox clicked');
      } else {
        // Fallback: look for any checkbox
        const anyCheckbox = this.page.locator('input[type="checkbox"]').last();
        await anyCheckbox.click({ force: true });
        logger.info('[AeesPreview] Fallback checkbox clicked');
      }

      await this.page.waitForTimeout(500);

      // Submit
      if (await this.submitBtn.isVisible()) {
        await this.submitBtn.click();
        logger.info('[AeesPreview] Submit button clicked');
        
        // Wait for confirmation modal
        await this.confirmBtn.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
            logger.warn('[AeesPreview] Confirmation button not visible after submit click');
        });

        if (await this.confirmBtn.isVisible()) {
            await this.confirmBtn.click();
            logger.info('[AeesPreview] Confirmation button clicked');
        }
      } else {
        logger.warn('[AeesPreview] Submit button not found');
      }
      
      // Wait for navigation or success message
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(2000);
    });
  }

  async downloadApplication(downloadDir: string, fileName: string): Promise<string> {
    return await test.step('Download Application', async () => {
      logger.info(`[AeesPreview] Downloading application to ${downloadDir}/${fileName}`);
      
      // Navigate to dashboard if not already there
      await this.page.waitForLoadState('networkidle');
      if (!this.page.url().includes('dashboard')) {
        await this.navigateTo('https://aees.onlineregistrationforms.com/#/dashboard');
      }

      // Sometimes need to refresh or wait for the "View Application" button to reflect state
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(3000);

      // Find the "View Application" or "Print" button
      const printBtn = this.page.getByRole('button', { name: /Print|Download/i }).first();
      
      if (await printBtn.isVisible()) {
        const downloadPromise = this.page.waitForEvent('download');
        await printBtn.click();
        const download = await downloadPromise;
        const downloadPath = path.join(downloadDir, fileName);
        await download.saveAs(downloadPath);
        logger.info(`[AeesPreview] Application downloaded to ${downloadPath}`);
        return downloadPath;
      } else {
        logger.warn('[AeesPreview] Print/Download button not visible on dashboard');
        
        // Try fallback via View Application
        if (await this.viewAppBtn.isVisible()) {
            await this.viewAppBtn.click();
            await this.page.waitForLoadState('networkidle');
            await this.page.waitForTimeout(2000);
            
            const finalPrintBtn = this.page.getByRole('button', { name: /Print|Download/i }).last();
            if (await finalPrintBtn.isVisible()) {
                const downloadPromise = this.page.waitForEvent('download');
                await finalPrintBtn.click();
                const download = await downloadPromise;
                const downloadPath = path.join(downloadDir, fileName);
                await download.saveAs(downloadPath);
                return downloadPath;
            }
        }
      }
      return '';
    });
  }
}
