import { Page, Locator, test, expect } from '@playwright/test';
import { BasePage } from '../base.page';
import logger from '@utils/logger';

export class AeesDashboardPage extends BasePage {
  readonly dashboardLink: Locator;
  readonly startNewAppBtn: Locator;
  readonly viewAppBtn: Locator;
  readonly continueBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.dashboardLink = page.getByRole('heading', { name: 'Dashboard' });
    this.startNewAppBtn = page.locator(':text("Start New Application")');
    this.viewAppBtn = page.getByRole('button', { name: 'View Application' });
    this.continueBtn = page.getByText('Continue');
  }

  async goToDashboard(): Promise<void> {
    await test.step('Go to Dashboard', async () => {
      logger.info('[AeesDashboard] Navigating to Dashboard');
      await this.page.waitForLoadState('networkidle');
      await expect(this.dashboardLink).toBeVisible({ timeout: 15000 });
      await this.dashboardLink.click();
    });
  }

  async startOrViewApplication(): Promise<void> {
    await test.step('Start or View Application', async () => {
      logger.info('[AeesDashboard] Starting or Viewing Application');

      // Wait for the dashboard content to stabilize after click
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(2000);

      const startVisible = await this.startNewAppBtn.first().waitFor({ state: "visible", timeout: 5000 }).then(() => true).catch(() => false);
      if (startVisible) {
        await this.startNewAppBtn.first().click();
        await this.continueBtn.waitFor({ state: 'visible', timeout: 10000 });
        await this.continueBtn.click();
        logger.info('[AeesDashboard] Started new application');
      } else {
        const viewVisible = await this.viewAppBtn.first().waitFor({ state: "visible", timeout: 5000 }).then(() => true).catch(() => false);
        if (viewVisible) {
          await this.viewAppBtn.first().click();
          logger.info('[AeesDashboard] Viewing existing application');
        }
      }

      // Wait for the next step/page to load
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(1000);
    });
  }
}
