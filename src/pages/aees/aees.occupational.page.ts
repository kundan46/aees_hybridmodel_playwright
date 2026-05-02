import { Page, Locator, test } from '@playwright/test';
import { BasePage } from '../base.page';
import logger from '@utils/logger';

export class AeesOccupationalPage extends BasePage {
  readonly employmentstatusDropDown: Locator;
  readonly saveAndContinueBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.employmentstatusDropDown = page.locator('[name="empstatus"]');
    this.saveAndContinueBtn = page.getByRole('button', { name: 'Save & Continue' });
  }

  async fillOccupationalDetails(): Promise<void> {
    await test.step('Fill Occupational Details', async () => {
      logger.info('[AeesOccupational] Handling occupational details');

      // Wait for page to stabilize
      await this.page.waitForLoadState('networkidle');

      // Check if the employment status dropdown is actually present on the page
      // (not just the step label in the progress bar)
      if (await this.employmentstatusDropDown.isVisible({ timeout: 10000 }).catch(() => false)) {
        logger.info('[AeesOccupational] Employment status dropdown found, selecting NOT EMPLOYED');
        await this.employmentstatusDropDown.selectOption({ label: "NOT EMPLOYED" });
        await this.saveAndContinueBtn.click();

        // Wait for next step to load
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
        logger.info('[AeesOccupational] Occupational details saved');
      } else {
        logger.info('[AeesOccupational] Occupational form not visible — likely already filled. Skipping.');
      }
    });
  }
}
