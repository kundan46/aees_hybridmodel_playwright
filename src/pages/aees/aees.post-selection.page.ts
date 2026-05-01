import { Page, Locator, test } from '@playwright/test';
import { BasePage } from '../base.page';
import logger from '@utils/logger';

export class AeesPostSelectionPage extends BasePage {
  readonly postDropdown: Locator;
  readonly checkbox: Locator;
  readonly saveAndContinueBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.postDropdown = page.locator('select[name="educont"]');
    this.checkbox = page.getByRole('checkbox');
    this.saveAndContinueBtn = page.getByRole('button', { name: 'Save & Continue' });
  }

  async selectPost(postName: string): Promise<void> {
    await test.step(`Select Post: ${postName}`, async () => {
      logger.info(`[AeesPostSelection] Selecting post: ${postName}`);
      if (await this.postDropdown.first().waitFor({ state: "visible", timeout: 2000 }).then(() => true).catch(() => false)) {
        await this.postDropdown.selectOption({ label: postName });
        await this.checkbox.check();

        await this.saveAndContinueBtn.click();
      }
    });
  }
}
