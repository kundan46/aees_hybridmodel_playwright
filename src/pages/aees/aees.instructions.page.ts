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
      if (await this.instructionCheckbox.count() > 0) {
        await this.instructionCheckbox.last().check();
        await this.continueBtn.click();
      } else {
        logger.info('[AeesInstructions] Instructions already accepted or not present');
      }
    });
  }
}
