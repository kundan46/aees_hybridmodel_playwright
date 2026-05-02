import { Page, Locator, test } from '@playwright/test';
import { BasePage } from '../base.page';
import logger from '@utils/logger';

export class AeesInstructionsPage extends BasePage {
  readonly instructionCheckbox: Locator;
  readonly continueBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.instructionCheckbox = page.locator('input[type="checkbox"]');
    this.continueBtn = page.getByRole('button', { name: 'Continue' });
  }

  async acceptInstructions(): Promise<void> {
    await test.step('Accept Instructions', async () => {
      logger.info('[AeesInstructions] Accepting instructions if available');

      // Wait for the page to stabilize before checking for elements
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(2000);

      // Re-check after page stabilizes
      const checkboxCount = await this.instructionCheckbox.count();
      if (checkboxCount > 0) {
        await this.instructionCheckbox.last().waitFor({ state: 'visible', timeout: 10000 });
        await this.instructionCheckbox.last().check();
        await this.continueBtn.waitFor({ state: 'visible', timeout: 10000 });
        await this.continueBtn.click();

        // Wait for next step to load
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1000);
        logger.info('[AeesInstructions] Instructions accepted');
      } else {
        logger.info('[AeesInstructions] Instructions already accepted or not present');
      }
    });
  }
}
