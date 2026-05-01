import { Page, Locator, test } from '@playwright/test';
import { BasePage } from '../base.page';
import logger from '@utils/logger';

export class AeesEligibilityPage extends BasePage {
  readonly radioButtons: Locator;
  readonly saveAndContinueBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.radioButtons = page.locator('input[type="radio"]');
    this.saveAndContinueBtn = page.getByRole('button', { name: 'Save & Continue' });
  }

  async fillEligibility(): Promise<void> {
    await test.step('Fill Eligibility', async () => {
      logger.info('[AeesEligibility] Filling eligibility details');
      if (await this.radioButtons.first().waitFor({ state: "visible", timeout: 2000 }).then(() => true).catch(() => false)) {
        await this.radioButtons.nth(0).check();
        await this.radioButtons.nth(2).check();
        await this.saveAndContinueBtn.click();
      }
    });
  }
}
