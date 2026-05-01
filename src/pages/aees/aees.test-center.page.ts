import { Page, Locator, test } from '@playwright/test';
import { BasePage } from '../base.page';
import logger from '@utils/logger';

export class AeesTestCenterPage extends BasePage {
  readonly sectionHeader: Locator;
  readonly preference1SelectDropDown: Locator;
  readonly preference2SelectDropDown: Locator;
  readonly preference3SelectDropDown: Locator;
  readonly postingPreference1DropDown: Locator;
  readonly postingPreference2DropDown: Locator;
  readonly postingPreference3DropDown: Locator;
  readonly postingPreference4DropDown: Locator;
  readonly postingPreference5DropDown: Locator;
  readonly postingPreference6DropDown: Locator;
  readonly postingPreference7DropDown: Locator;
  readonly postingPreference8DropDown: Locator;
  readonly postingPreference9DropDown: Locator;
  readonly postingPreference10DropDown: Locator;
  readonly postingPreference11DropDown: Locator;
  readonly postingPreference12DropDown: Locator;
  readonly postingPreference13DropDown: Locator;
  readonly postingPreference14DropDown: Locator;
  readonly postingPreference15DropDown: Locator;
  readonly saveAndContinueBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.sectionHeader = page.locator('div.card-header').filter({ hasText: /Test Center City Selection|Posting Location Preference Selection/i }).first();

    const citySection = page.locator('div.card').filter({ hasText: 'Test Center City Selection' });
    this.preference1SelectDropDown = citySection.locator('select').nth(0);
    this.preference2SelectDropDown = citySection.locator('select').nth(1);
    this.preference3SelectDropDown = citySection.locator('select').nth(2);

    const postingSection = page.locator('div.card').filter({ hasText: 'Posting Location Preference Selection' });
    this.postingPreference1DropDown = postingSection.locator('select').nth(0);
    this.postingPreference2DropDown = postingSection.locator('select').nth(1);
    this.postingPreference3DropDown = postingSection.locator('select').nth(2);
    this.postingPreference4DropDown = postingSection.locator('select').nth(3);
    this.postingPreference5DropDown = postingSection.locator('select').nth(4);
    this.postingPreference6DropDown = postingSection.locator('select').nth(5);
    this.postingPreference7DropDown = postingSection.locator('select').nth(6);
    this.postingPreference8DropDown = postingSection.locator('select').nth(7);
    this.postingPreference9DropDown = postingSection.locator('select').nth(8);
    this.postingPreference10DropDown = postingSection.locator('select').nth(9);
    this.postingPreference11DropDown = postingSection.locator('select').nth(10);
    this.postingPreference12DropDown = postingSection.locator('select').nth(11);
    this.postingPreference13DropDown = postingSection.locator('select').nth(12);
    this.postingPreference14DropDown = postingSection.locator('select').nth(13);
    this.postingPreference15DropDown = postingSection.locator('select').nth(14);

    this.saveAndContinueBtn = page.getByRole('button', { name: 'Save & Continue' });
  }

  async fillTestCenterPreferences(): Promise<void> {
    await test.step('Fill Test Center Preferences', async () => {
      logger.info('[AeesTestCenter] Filling test center preferences');

      // 1. Fill Test Center Cities
      await this.preference1SelectDropDown.selectOption({ label: "AGARTALA" });
      await this.preference2SelectDropDown.selectOption({ label: "AHMEDABAD" });
      await this.preference3SelectDropDown.selectOption({ label: "BHOPAL" });

      // 2. Fill Posting Location Preferences (all 15)
      await this.postingPreference1DropDown.selectOption({ label: "ANUSHAKTINAGAR" });
      await this.postingPreference2DropDown.selectOption({ label: "HYDERABAD" });
      await this.postingPreference3DropDown.selectOption({ label: "INDORE" });
      await this.postingPreference4DropDown.selectOption({ label: "JADUGUDA/NARWAPAHAR/TURAMDIH" });
      await this.postingPreference5DropDown.selectOption({ label: "KAIGA" });
      await this.postingPreference6DropDown.selectOption({ label: "KAKRAPAR" });
      await this.postingPreference7DropDown.selectOption({ label: "KALPAKKAM/ANUPURAM" });
      await this.postingPreference8DropDown.selectOption({ label: "KUDANKULAM" });
      await this.postingPreference9DropDown.selectOption({ label: "MANUGURU" });
      await this.postingPreference10DropDown.selectOption({ label: "MYSORE" });
      await this.postingPreference11DropDown.selectOption({ label: "NARORA" });
      await this.postingPreference12DropDown.selectOption({ label: "OSCOM" });
      await this.postingPreference13DropDown.selectOption({ label: "PAZHAYAKAYAL" });
      await this.postingPreference14DropDown.selectOption({ label: "RAWATBHATA" });
      await this.postingPreference15DropDown.selectOption({ label: "TARAPUR" });

      // 3. Save and Continue
      await this.saveAndContinueBtn.click();
    });
  }
}
