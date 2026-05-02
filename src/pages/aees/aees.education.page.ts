import { Page, Locator, test } from '@playwright/test';
import { BasePage } from '../base.page';
import logger from '@utils/logger';
import { AeesEducationData } from '@testData/aees.data';
import * as path from 'path';


export class AeesEducationPage extends BasePage {
  readonly educationDetailsDropdown: Locator;
  readonly educationHeader: Locator;
  readonly educationSectionHeader10th: Locator;
  readonly boardInput10th: Locator;
  readonly subjectInput10th: Locator;
  readonly percentageInput10th: Locator;
  readonly passingYearInput10th: Locator;
  readonly educationSectionHeader12th: Locator;
  readonly boardInput12th: Locator;
  readonly subjectInput12th: Locator;
  readonly percentageInput12th: Locator;
  readonly passingYearInput12th: Locator;
  readonly educationSectionHeaderDegree: Locator;
  readonly boardInputDegree: Locator;
  readonly subjectInputDegree: Locator;
  readonly percentageInputDegree: Locator;
  readonly passingYearInputDegree: Locator;
  readonly saveAndContinueBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.educationDetailsDropdown = page.locator('[name="educationEligibilty"]').first();
    this.educationHeader = page.getByRole('heading', { name: 'Educational Details' });
    this.educationSectionHeader10th = page.locator("//tr[1]//td[2]//input[1]");
    this.boardInput10th = page.locator("//tr[1]//td[3]//input[1]");
    this.subjectInput10th = page.locator("//tr[1]//td[4]//input[1]");
    this.percentageInput10th = page.locator("//tr[1]//td[6]//input[1]");
    this.passingYearInput10th = page.locator("//tr[1]//td[5]//div[1]//app-date-selector[1]//div[1]//input[1]");
    this.educationSectionHeader12th = page.locator("//tr[2]//td[2]//input[1]");
    this.boardInput12th = page.locator("//tr[2]//td[3]//input[1]");
    this.subjectInput12th = page.locator("//tr[2]//td[4]//input[1]");
    this.percentageInput12th = page.locator("//tr[2]//td[6]//input[1]");
    this.passingYearInput12th = page.locator("//tr[2]//td[5]//div[1]//app-date-selector[1]//div[1]//input[1]");
    this.educationSectionHeaderDegree = page.locator("//tr[4]//td[2]//input[1]");
    this.boardInputDegree = page.locator("//tr[4]//td[3]//input[1]");
    this.subjectInputDegree = page.locator("//tr[4]//td[4]//input[1]");
    this.percentageInputDegree = page.locator("//tr[4]//td[6]//input[1]");
    this.passingYearInputDegree = page.locator("//tr[4]//td[5]//div[1]//app-date-selector[1]//div[1]//input[1]");
    this.saveAndContinueBtn = page.getByRole('button', { name: 'Save & Continue' });

    // Document Upload Triggers
    this.uploadTrigger10th = page.getByText('Upload SSC/10th Doc.', { exact: true });
    this.uploadTrigger12th = page.getByText('Upload HSC/12th Doc.', { exact: true });
    this.uploadTriggerGraduation = page.getByText('Upload SEMESTER OR YEAR WISE MARK SHEET OF ALL YEARS OF GRADUATION Doc.', { exact: true });
    this.uploadTriggerDegree = page.getByText('Upload FINAL DEGREE CERTIFICATE/PROVISIONAL CERTIFICATE Doc.', { exact: false });
    this.uploadTriggerDeled = page.getByText('Upload D.El.Ed/B.El.Ed/D.E.C.Ed', { exact: false });
    this.uploadTriggerPostGraduation = page.getByText('Upload SEMESTER OR YEAR WISE MARK SHEET OF ALL YEARS OF POST-GRADUATION Doc.', { exact: true });
    this.uploadTriggerPG = page.getByText('Upload PG / MASTER DEGREE Doc.', { exact: true });
    this.uploadTriggerOther = page.getByText('Upload ALL OTHER EDUCATION Doc.', { exact: true });
  }

  readonly uploadTrigger10th: Locator;
  readonly uploadTrigger12th: Locator;
  readonly uploadTriggerGraduation: Locator;
  readonly uploadTriggerDegree: Locator;
  readonly uploadTriggerDeled: Locator;
  readonly uploadTriggerPostGraduation: Locator;
  readonly uploadTriggerPG: Locator;
  readonly uploadTriggerOther: Locator;

  /**
   * Fills the entire education details section.
   * @param data The educational data from your test-data file.
   */
  async fillEducationDetails(data: AeesEducationData): Promise<void> {
    await test.step('Fill Education Details', async () => {
      logger.info('[AeesEducation] Filling education details');

      // Wait for the page to stabilize
      await this.page.waitForLoadState('networkidle');

      const targetDegree = data.degree || 'DEGREE GRADUATION';
      logger.info(`[AeesEducation] Selecting degree: ${targetDegree}`);

      // 1. Wait for the dropdown and select the specific degree
      if (await this.educationDetailsDropdown.first().isVisible()) {
        await this.educationDetailsDropdown.first().waitFor({ state: "visible", timeout: 10000 });
        await this.educationDetailsDropdown.selectOption({ label: targetDegree });
      } else {
        logger.info('[AeesEducation] Dropdown not visible, skipping or already filled.');
        return;
      }

      // 2. Wait for the form to expand (AEEES form sometimes takes a second to load the sub-fields)
      await this.page.waitForTimeout(2000);

      // 3. Fill the sub-fields if they are visible
      if (await this.educationHeader.isVisible().catch(() => false)) {
        await this.educationSectionHeader10th.first().fill(data.educationqualification1 || "10TH STANDARD");
        await this.boardInput10th.first().fill(data.board || 'Test Board');
        await this.subjectInput10th.first().fill(data.subject || 'Test Subject');
        await this.percentageInput10th.first().fill(data.percentage || '90');
        await this.fillReadonlyDate(this.passingYearInput10th, data.year10th || '01/01/2019');

        await this.educationSectionHeader12th.first().fill(data.educationqualification2 || "12TH STANDARD");
        await this.boardInput12th.first().fill(data.board || 'Test Board');
        await this.subjectInput12th.first().fill(data.subject || 'Test Subject');
        await this.percentageInput12th.first().fill(data.percentage || '90');
        await this.fillReadonlyDate(this.passingYearInput12th, data.year12th || '01/01/2021');

        await this.educationSectionHeaderDegree.first().fill(data.educationqualification3 || "");
        await this.boardInputDegree.first().fill(data.board || 'Test Board');
        await this.subjectInputDegree.first().fill(data.subject || 'Test Subject');
        await this.percentageInputDegree.first().fill(data.percentage || '90');
        await this.fillReadonlyDate(this.passingYearInputDegree, data.yeardegree || '01/01/2023');
        // Document Uploads
        const uploadFile = 'test-file-2.pdf';
        await this.upload10thCertificate(uploadFile);
        await this.upload12thCertificate(uploadFile);
        await this.uploadGraduationMarksheets(uploadFile);
        await this.uploadDegreeCertificate(uploadFile);
        await this.uploadPostGraduationMarksheets(uploadFile);
        await this.uploadPgDegreeCertificate(uploadFile);
        await this.uploadDeledCertificate(uploadFile);
        await this.uploadOtherEducationDoc(uploadFile);

        logger.info('[AeesEducation] Submitting education details');
        await this.saveAndContinueBtn.click();

        // Wait for next step to load
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
        logger.info('[AeesEducation] Education details saved');
      } else {
        logger.error('[AeesEducation] Education details form section did not appear after selection!');
        throw new Error('Education details form not visible');
      }
    });
  }

  /**
   * Named methods for better readability in tests
   */
  async upload10thCertificate(filePath: string) {
    if (await this.uploadTrigger10th.isVisible()) {
      await this.uploadFile(this.uploadTrigger10th, filePath);
      await this.page.waitForTimeout(1000);
    }
  }

  async upload12thCertificate(filePath: string) {
    if (await this.uploadTrigger12th.isVisible()) {
      await this.uploadFile(this.uploadTrigger12th, filePath);
      await this.page.waitForTimeout(1000);
    }
  }

  async uploadGraduationMarksheets(filePath: string) {
    if (await this.uploadTriggerGraduation.isVisible()) {
      await this.uploadFile(this.uploadTriggerGraduation, filePath);
      await this.page.waitForTimeout(1000);
    }
  }

  async uploadDegreeCertificate(filePath: string) {
    if (await this.uploadTriggerDegree.isVisible()) {
      await this.uploadFile(this.uploadTriggerDegree, filePath);
      await this.page.waitForTimeout(1000);
    }
  }

  async uploadDeledCertificate(filePath: string) {
    if (await this.uploadTriggerDeled.isVisible()) {
      await this.uploadFile(this.uploadTriggerDeled, filePath);
      await this.page.waitForTimeout(1000);
    }
  }

  async uploadPostGraduationMarksheets(filePath: string) {
    if (await this.uploadTriggerPostGraduation.isVisible()) {
      await this.uploadFile(this.uploadTriggerPostGraduation, filePath);
      await this.page.waitForTimeout(1000);
    }
  }

  async uploadPgDegreeCertificate(filePath: string) {
    if (await this.uploadTriggerPG.isVisible()) {
      await this.uploadFile(this.uploadTriggerPG, filePath);
      await this.page.waitForTimeout(1000);
    }
  }

  async uploadOtherEducationDoc(filePath: string) {
    if (await this.uploadTriggerOther.isVisible()) {
      await this.uploadFile(this.uploadTriggerOther, filePath);
      await this.page.waitForTimeout(1000);
    }
  }

  /**
   * Helper method to fill date pickers that have 'readonly' attribute.
   */
  private async fillReadonlyDate(locator: Locator, date: string): Promise<void> {
    await locator.first().evaluate((el: HTMLInputElement, dateValue) => {
      el.value = dateValue;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, date);
  }
}


