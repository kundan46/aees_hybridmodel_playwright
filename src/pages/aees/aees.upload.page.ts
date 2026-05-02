import { Page, Locator, test } from '@playwright/test';
import { BasePage } from '../base.page';
import logger from '@utils/logger';
import * as path from 'path';

interface UploadData {
  photoPath: string;
  signaturePath: string;
  casteCertificatePath?: string;
  castecertificatePath?: string;   // alternate key from test-data
  casteCertNumber?: string;
  casteIssueDate?: string;
}

export class AeesUploadPage extends BasePage {
  readonly saveAndContinueBtn: Locator;

  constructor(page: Page) {
    super(page);

    this.saveAndContinueBtn = page.getByRole('button', {
      name: /save & continue|save & next|continue/i,
    });
  }

  // ────────────────────────────────────────────────────────
  // Main entry point
  // ────────────────────────────────────────────────────────
  async uploadDocuments(data: UploadData): Promise<void> {
    await test.step('Upload documents', async () => {
      // Wait for the upload section to be ready
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(3000);

      // Resolve file paths
      const photoPath = path.resolve(data.photoPath);
      const signaturePath = path.resolve(data.signaturePath);
      const casteCertPath = data.casteCertificatePath || data.castecertificatePath;

      logger.info(`[Upload] Photo path: ${photoPath}`);
      logger.info(`[Upload] Signature path: ${signaturePath}`);
      logger.info(`[Upload] Caste cert path: ${casteCertPath || 'N/A'}`);

      // 1. Upload Photo
      await this.uploadPhoto(photoPath);

      // 2. Upload Signature
      await this.uploadSignature(signaturePath);

      // 3. Upload Caste Certificate (if applicable)
      if (casteCertPath) {
        await this.uploadCasteCert(path.resolve(casteCertPath));
      }

      // 4. Fill Caste Certificate Number
      if (data.casteCertNumber) {
        await this.fillCasteCertNumber(data.casteCertNumber);
      }

      // 5. Fill Caste Issue Date
      if (data.casteIssueDate) {
        await this.fillCasteIssueDate(data.casteIssueDate);
      }

      // Wait for all uploads to finish processing
      await this.page.waitForTimeout(2000);

      // 6. Save & Continue
      await this.clickSaveAndContinue();

      // 7. Handle validation errors (retry once if needed)
      await this.page.waitForTimeout(3000);
      if (await this.saveAndContinueBtn.isVisible().catch(() => false)) {
        const errors = await this.page
          .locator('.text-danger, .error-message, .alert-danger')
          .allInnerTexts();

        if (errors.length > 0) {
          logger.warn(`[Upload] Validation errors: ${errors.join(', ')}`);
        }

        // Retry save
        await this.saveAndContinueBtn.click().catch(() => { });
      }
    });
  }

  // ────────────────────────────────────────────────────────
  // Photo upload
  // From screenshot: "Upload Photo" dropzone button + blue "Upload" button
  // ────────────────────────────────────────────────────────
  async uploadPhoto(filePath: string): Promise<void> {
    await test.step('Upload Photo', async () => {
      logger.info(`[Upload] Uploading photo: ${filePath}`);

      // The photo dropzone has an "Upload Photo" button that triggers file chooser
      const photoTrigger = this.page.getByText('Upload Photo', { exact: false });

      if (await photoTrigger.isVisible({ timeout: 5000 }).catch(() => false)) {
        // Use FileChooser approach - click the dropzone trigger and catch the file dialog
        const [fileChooser] = await Promise.all([
          this.page.waitForEvent('filechooser', { timeout: 15000 }).catch(() => null),
          photoTrigger.click(),
        ]);

        if (fileChooser) {
          await fileChooser.setFiles(filePath);
          logger.info('[Upload] Photo selected via FileChooser');
        } else {
          // Fallback: directly set on hidden file input
          logger.warn('[Upload] FileChooser did not appear for photo. Trying direct input.');
          const fileInput = this.page.locator('input[type="file"]').first();
          await fileInput.setInputFiles(filePath);
        }

        await this.page.waitForTimeout(3000);

        // Click the blue "Upload" confirmation button next to the photo dropzone
        const uploadBtn = this.page.getByRole('button', { name: 'Upload' }).first();
        if (await uploadBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
          await uploadBtn.click();
          logger.info('[Upload] Clicked Upload button for photo');
          await this.page.waitForTimeout(3000);
        }
      } else {
        logger.info('[Upload] Photo upload trigger not visible — may already be uploaded');
      }
    });
  }

  // ────────────────────────────────────────────────────────
  // Signature upload
  // From screenshot: "upload signature" in a dropzone (lowercase text)
  // ────────────────────────────────────────────────────────
  async uploadSignature(filePath: string): Promise<void> {
    await test.step('Upload Signature', async () => {
      logger.info(`[Upload] Uploading signature: ${filePath}`);

      // The signature dropzone has "upload signature" text (lowercase)
      const sigTrigger = this.page.getByText('upload signature', { exact: false });

      if (await sigTrigger.isVisible({ timeout: 5000 }).catch(() => false)) {
        const [fileChooser] = await Promise.all([
          this.page.waitForEvent('filechooser', { timeout: 15000 }).catch(() => null),
          sigTrigger.click(),
        ]);

        if (fileChooser) {
          await fileChooser.setFiles(filePath);
          logger.info('[Upload] Signature selected via FileChooser');
        } else {
          // Fallback: try the second file input (or remaining one)
          logger.warn('[Upload] FileChooser did not appear for signature. Trying direct input.');
          const fileInputs = this.page.locator('input[type="file"]');
          const count = await fileInputs.count();
          if (count > 0) {
            // Use the last visible file input (first may be used/hidden after photo upload)
            await fileInputs.nth(count > 1 ? 1 : 0).setInputFiles(filePath);
          }
        }

        await this.page.waitForTimeout(3000);

        // The signature section might have its own Upload confirmation button
        // Look for an Upload button that is currently visible
        const uploadBtns = this.page.getByRole('button', { name: 'Upload' });
        const btnCount = await uploadBtns.count();
        for (let i = 0; i < btnCount; i++) {
          if (await uploadBtns.nth(i).isVisible().catch(() => false)) {
            await uploadBtns.nth(i).click();
            logger.info('[Upload] Clicked Upload button for signature');
            await this.page.waitForTimeout(3000);
            break;
          }
        }
      } else {
        logger.info('[Upload] Signature upload trigger not visible — may already be uploaded');
      }
    });
  }

  // ────────────────────────────────────────────────────────
  // Caste Certificate upload
  // From screenshot: SC/ST/OBC (Non-Creamy Layer) Latest Cast certificate section
  // ────────────────────────────────────────────────────────
  async uploadCasteCert(filePath: string): Promise<void> {
    await test.step('Upload Caste Certificate', async () => {
      logger.info(`[Upload] Uploading caste certificate: ${filePath}`);

      // Look for the caste certificate upload trigger
      const casteTrigger = this.page.getByText(/upload.*caste|upload.*cast\b/i);

      if (await casteTrigger.isVisible({ timeout: 5000 }).catch(() => false)) {
        const [fileChooser] = await Promise.all([
          this.page.waitForEvent('filechooser', { timeout: 15000 }).catch(() => null),
          casteTrigger.first().click(),
        ]);

        if (fileChooser) {
          await fileChooser.setFiles(filePath);
          logger.info('[Upload] Caste certificate selected via FileChooser');
        } else {
          logger.warn('[Upload] FileChooser did not appear for caste cert. Trying direct input.');
          const fileInputs = this.page.locator('input[type="file"]');
          const count = await fileInputs.count();
          if (count > 0) {
            await fileInputs.last().setInputFiles(filePath);
          }
        }

        await this.page.waitForTimeout(3000);

        // Click Upload confirmation if visible
        const uploadBtns = this.page.getByRole('button', { name: 'Upload' });
        const btnCount = await uploadBtns.count();
        for (let i = 0; i < btnCount; i++) {
          if (await uploadBtns.nth(i).isVisible().catch(() => false)) {
            await uploadBtns.nth(i).click();
            logger.info('[Upload] Clicked Upload button for caste certificate');
            await this.page.waitForTimeout(3000);
            break;
          }
        }
      } else {
        // Try finding by the section header text
        const casteSection = this.page.locator('text=/SC.*ST.*OBC.*cast.*certificate/i');
        if (await casteSection.isVisible({ timeout: 3000 }).catch(() => false)) {
          logger.info('[Upload] Found caste section header but no upload trigger — may need scrolling');
          // Scroll down and look for file input
          await this.page.evaluate(() => window.scrollBy(0, 500));
          await this.page.waitForTimeout(1000);

          const fileInputs = this.page.locator('input[type="file"]');
          const count = await fileInputs.count();
          if (count > 0) {
            await fileInputs.last().setInputFiles(filePath);
            await this.page.waitForTimeout(3000);
          }
        } else {
          logger.warn('[Upload] Caste certificate upload section not found');
        }
      }
    });
  }

  // ────────────────────────────────────────────────────────
  // Caste Certificate Number
  // From screenshot: Placeholder is "ENTER DOCUMENT NUMBER"
  // ────────────────────────────────────────────────────────
  private async fillCasteCertNumber(certNumber: string): Promise<void> {
    await test.step('Fill Caste Certificate Number', async () => {
      logger.info(`[Upload] Filling caste certificate number: ${certNumber}`);

      // Try multiple locator strategies matching the actual DOM
      const locators = [
        this.page.getByPlaceholder(/enter document number/i),
        this.page.getByPlaceholder(/document number/i),
        this.page.locator('input[placeholder*="DOCUMENT"]'),
        this.page.locator('input[placeholder*="document"]'),
      ];

      for (const locator of locators) {
        if (await locator.isVisible({ timeout: 3000 }).catch(() => false)) {
          await locator.clear();
          await locator.fill(certNumber);
          logger.info('[Upload] Caste certificate number filled');
          return;
        }
      }

      logger.warn('[Upload] Caste certificate number field not found');
    });
  }

  // ────────────────────────────────────────────────────────
  // Caste Issue Date
  // From screenshot: format is mm/dd/yyyy, datepicker input
  // Test data format: dd-mm-yyyy (01-01-2025)
  // ────────────────────────────────────────────────────────
  private async fillCasteIssueDate(date: string): Promise<void> {
    await test.step('Fill Caste Issue Date', async () => {
      logger.info(`[Upload] Filling caste issue date: ${date}`);

      // Convert dd-mm-yyyy to mm/dd/yyyy for the datepicker
      const convertedDate = this.convertDateFormat(date);
      logger.info(`[Upload] Converted date format: ${date} → ${convertedDate}`);

      // Find the date input
      const locators = [
        this.page.getByPlaceholder(/mm\/dd\/yyyy/i),
        this.page.getByPlaceholder(/date of issue/i),
        this.page.locator('input[placeholder*="mm/dd"]'),
        this.page.locator('input[placeholder*="Date of Issue"]'),
        this.page.locator('app-date-selector input').last(),
      ];

      let dateField: Locator | null = null;
      for (const locator of locators) {
        if (await locator.isVisible({ timeout: 3000 }).catch(() => false)) {
          dateField = locator;
          logger.info('[Upload] Found date field');
          break;
        }
      }

      if (!dateField) {
        logger.warn('[Upload] Caste issue date field not found');
        return;
      }

      // Strategy 1: Use evaluate to set the value directly
      await dateField.evaluate((el: HTMLInputElement, dateValue) => {
        // Remove readonly/disabled
        el.removeAttribute('readonly');
        el.removeAttribute('disabled');

        // Clear and set
        el.value = '';
        el.value = dateValue;

        // Dispatch full event chain for Angular
        el.dispatchEvent(new Event('focus', { bubbles: true }));
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.dispatchEvent(new Event('blur', { bubbles: true }));

        // Angular-specific InputEvent
        const inputEvent = new InputEvent('input', {
          bubbles: true,
          cancelable: true,
          data: dateValue,
          inputType: 'insertText',
        });
        el.dispatchEvent(inputEvent);
      }, convertedDate);

      await this.page.waitForTimeout(500);

      // Verify the value was set
      const setValue = await dateField.inputValue().catch(() => '');
      logger.info(`[Upload] Date field value after evaluate: "${setValue}"`);

      if (!setValue || setValue !== convertedDate) {
        logger.warn('[Upload] Date not set via evaluate. Trying keyboard approach.');

        // Strategy 2: Click and type
        await dateField.click();
        await this.page.waitForTimeout(500);

        // Clear existing content
        await dateField.press('Control+a');
        await dateField.press('Backspace');
        await this.page.waitForTimeout(300);

        // Type the date character by character
        await dateField.pressSequentially(convertedDate, { delay: 100 });
        await this.page.waitForTimeout(300);
        await dateField.press('Tab'); // Trigger blur/validation

        logger.info('[Upload] Caste issue date filled via keyboard');
      } else {
        logger.info(`[Upload] Caste issue date set successfully: ${setValue}`);
      }
    });
  }

  /**
   * Convert date from dd-mm-yyyy to mm/dd/yyyy format
   */
  private convertDateFormat(date: string): string {
    // Handle dd-mm-yyyy format
    const dashParts = date.split('-');
    if (dashParts.length === 3) {
      const [dd, mm, yyyy] = dashParts;
      return `${mm}/${dd}/${yyyy}`;
    }

    // Handle dd/mm/yyyy format
    const slashParts = date.split('/');
    if (slashParts.length === 3) {
      const [dd, mm, yyyy] = slashParts;
      return `${mm}/${dd}/${yyyy}`;
    }

    // If already in correct format or unknown, return as-is
    return date;
  }

  // ────────────────────────────────────────────────────────
  // Save & Continue
  // ────────────────────────────────────────────────────────
  async clickSaveAndContinue(): Promise<void> {
    await test.step('Click Save & Continue', async () => {
      logger.info('[Upload] Clicking Save & Continue');

      // Scroll to the button first
      await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await this.page.waitForTimeout(1000);

      if (await this.saveAndContinueBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await this.saveAndContinueBtn.waitFor({ state: 'visible', timeout: 10000 });

        await Promise.all([
          this.page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => { }),
          this.saveAndContinueBtn.click(),
        ]);
      } else {
        logger.info('[Upload] Save & Continue button not visible, possibly already moved to next step');
      }
    });
  }

  // ────────────────────────────────────────────────────────
  // Legacy public method for caste certificate
  // ────────────────────────────────────────────────────────
  async uploadCasteCertificate(filePath: string) {
    await this.uploadCasteCert(path.resolve(filePath));
  }
}