import { Page, Locator, test, expect } from '@playwright/test';
import { BasePage } from '../base.page';
import logger from '@utils/logger';

export class AeesPersonalDetailsPage extends BasePage {
  // Locators
  readonly sectionHeader: Locator;
  readonly titleSelect: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly nameChangeSelect: Locator;
  readonly dobInput: Locator;
  readonly genderSelect: Locator;
  readonly maritalStatusSelect: Locator;
  readonly categorySelect: Locator;
  readonly pwdSelect: Locator;
  readonly nationalityCheckbox: Locator;
  readonly exServicemanSelect: Locator;

  // Parents Info
  readonly fatherTitleSelect: Locator;
  readonly fatherFirstNameInput: Locator;
  readonly fatherLastNameInput: Locator;
  readonly fatherOccupationInput: Locator;
  readonly motherTitleSelect: Locator;
  readonly motherFirstNameInput: Locator;
  readonly motherLastNameInput: Locator;
  readonly motherOccupationInput: Locator;

  // Address
  readonly permanentAddressSection: Locator;
  readonly addressLine1Input: Locator;
  readonly stateSelect: Locator;
  readonly districtSelect: Locator;
  readonly cityInput: Locator;
  readonly pinCodeInput: Locator;
  readonly sameAddressCheckbox: Locator;
  readonly privacyCheckbox: Locator;

  readonly saveAndContinueBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.sectionHeader = page.getByText('Candidate Details');
    this.titleSelect = page.locator('select.custom-select').nth(0);
    this.firstNameInput = page.locator("//div[@class='row p-2 text-justify']//div[2]//input[1]");
    this.lastNameInput = page.locator("//div[@class='col-md-3']//input[@placeholder='Last Name']");
    this.nameChangeSelect = page.locator('[name="name_Change"]');
    this.dobInput = page.getByPlaceholder('date of birth');
    this.genderSelect = page.locator('select.custom-select').nth(2);
    this.maritalStatusSelect = page.locator('select.custom-select').nth(3);
    this.categorySelect = page.locator('select.custom-select').nth(4);
    this.pwdSelect = page.locator('select.custom-select').nth(5);
    this.nationalityCheckbox = page.locator('input[name="nationality_declaration"]');
    this.exServicemanSelect = page.locator('select.custom-select').nth(6);

    this.fatherTitleSelect = page.locator('select[name="title2"]');
    this.fatherFirstNameInput = page.locator("div[class='card'] div[class='card'] div[class='card-body'] input[placeholder='First Name']");
    this.fatherLastNameInput = page.locator("div[class='card-body'] div[class='col-md-2'] input[placeholder='Last Name']");
    this.fatherOccupationInput = page.locator("input[placeholder='Occupation'][name='lname']");

    this.motherTitleSelect = page.locator('[name="titleguardian2"]');
    this.motherFirstNameInput = page.locator('input[name="firstname2"]');
    this.motherLastNameInput = page.locator('input[name="lastname2"]');
    this.motherOccupationInput = page.locator('input[name="motherOccupation"]');

    this.permanentAddressSection = page.locator("app-address[header='Permanent Address']");
    this.addressLine1Input = this.permanentAddressSection.locator("input[placeholder='address line 1']");
    this.stateSelect = this.permanentAddressSection.locator('select[name="state"]');
    this.districtSelect = this.permanentAddressSection.locator('select[name="district"]');
    this.cityInput = page.locator("//app-address[@header='Permanent Address']//div[@class='col-md-6 text-justify']//input");
    this.pinCodeInput = this.permanentAddressSection.locator("input[placeholder='PIN code']");
    this.sameAddressCheckbox = page.locator('#sameaddress');
    this.privacyCheckbox = page.locator('input[name="privacy_declaration"]');

    this.saveAndContinueBtn = page.getByRole('button', { name: 'Save & Continue' });
  }

  async fillPersonalDetails(data: any): Promise<void> {
    await test.step('Fill Personal Details', async () => {
      logger.info('[AeesPersonalDetails] Filling personal details');

      // Wait for the page content to stabilize
      await this.page.waitForLoadState('networkidle');

      if (await this.sectionHeader.isVisible().catch(() => false)) {
        // Wait for form elements to be ready
        await this.titleSelect.waitFor({ state: 'visible', timeout: 10000 });

        await this.titleSelect.selectOption(data.title || 'MR');
        await this.firstNameInput.fill(data.firstName || 'Test');
        await this.lastNameInput.fill(data.lastName || 'Engineer');
        await this.nameChangeSelect.selectOption(data.nameChange || 'NO');

        // Handling Date of Birth via evaluate as in original test
        await this.dobInput.evaluate((el: HTMLInputElement, dob: string) => {
          el.removeAttribute('readonly');
          el.value = dob;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          el.dispatchEvent(new Event('blur', { bubbles: true }));
        }, data.dob || '01-01-2006');

        await this.genderSelect.selectOption(data.gender || 'MALE');
        await this.maritalStatusSelect.selectOption(data.maritalStatus || 'UNMARRIED');
        await this.categorySelect.selectOption(data.category || 'SCHEDULED CASTE (SC)');
        await this.pwdSelect.selectOption(data.pwd || 'NOT APPLICABLE');
        await this.nationalityCheckbox.click();
        await this.exServicemanSelect.selectOption(data.exServiceman || 'NO');

        // Parents info
        await this.fatherTitleSelect.selectOption(data.fatherTitle || 'MR');
        await this.fatherFirstNameInput.fill(data.fatherFirstName || 'Rudra');
        await this.fatherLastNameInput.fill(data.fatherLastName || 'Prasad');
        await this.fatherOccupationInput.fill(data.fatherOccupation || 'Engineer');

        await this.motherTitleSelect.selectOption(data.motherTitle || 'MRS');
        await this.motherFirstNameInput.fill(data.motherFirstName || 'Sita');
        await this.motherLastNameInput.fill(data.motherLastName || 'Devi');
        await this.motherOccupationInput.fill(data.motherOccupation || 'Engineer');

        // Address
        await this.addressLine1Input.fill(data.address || '123 Test Street');
        await expect(this.stateSelect).toBeEnabled({ timeout: 10000 });
        await this.stateSelect.selectOption({ label: data.state || 'BIHAR' });

        // Wait for district dropdown to populate after state selection
        await this.page.waitForTimeout(2000);
        await expect(this.districtSelect).toBeEnabled({ timeout: 10000 });
        await this.districtSelect.selectOption({ label: data.district || 'PATNA' });

        await this.cityInput.fill(data.city || 'Test City');
        await this.pinCodeInput.fill(data.pin || '800001');
        await this.sameAddressCheckbox.click();
        await this.privacyCheckbox.click();

        await this.saveAndContinueBtn.click();

        // Wait for the next step to load (replaced hardcoded 5s with proper wait)
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
        logger.info('[AeesPersonalDetails] Personal details saved');
      } else {
        logger.info('[AeesPersonalDetails] Section not visible, likely already completed');
      }
    });
  }
}
