import { Page, Locator, test, expect } from '@playwright/test';
import { BasePage } from '../base.page';
import envConfig from '@config/env.config';
import logger from '@utils/logger';

export class AeesRegistrationPage extends BasePage {
    register(user: any) {
        throw new Error('Method not implemented.');
    }
    readonly newRegistrationBtn: Locator;
    readonly emailInput: Locator;
    readonly confirmEmailInput: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly mobileInput: Locator;
    readonly confirmMobileInput: Locator;
    readonly registerBtn: Locator;

    readonly errorLocator: Locator;
    readonly successLocator: Locator;

    constructor(page: Page) {
        super(page);
        this.newRegistrationBtn = page.locator('button:has-text("New Candidate Registration")');
        this.emailInput = page.locator('input.form-control.ng-untouched.ng-pristine.ng-invalid').first();
        this.confirmEmailInput = page.locator('[name="confirmEmail"]');
        this.passwordInput = page.locator("//div[4]//div[1]//input[1]");
        this.confirmPasswordInput = page.locator("//div[4]//div[2]//input[1]");
        this.mobileInput = page.getByRole('textbox', { name: 'Mobile Number*' });
        this.confirmMobileInput = page.locator("//div[7]//div[2]//input[1]");
        this.registerBtn = page.locator('button:has-text("Register")');

        this.errorLocator = page.locator('.text-danger, .alert-danger, .error-message, .invalid-feedback, .toast-error, [style*="color: red"], [style*="color:red"]')
            .or(page.locator('p, span, div').filter({ hasText: /already|registered|invalid|error/i }));

        this.successLocator = page.locator('.alert-success, .text-success, .success-message, .toast-success, .alert-info, button:has-text("Start New Application")');
    }

    async open(): Promise<void> {
        await this.navigateTo(envConfig.aeesUrl);
    }

    async clickNewRegistration(): Promise<void> {
        logger.info('[AeesRegistration] Clicking New Candidate Registration');
        await this.newRegistrationBtn.click();
    }

    async fillRegistrationForm(data: { email: string; email2: string; password: string; mobile: string }): Promise<void> {
        await test.step('Fill Registration Form', async () => {
            await this.emailInput.waitFor({ state: 'visible' });
            await this.emailInput.fill(data.email);
            await this.confirmEmailInput.fill(data.email);
            await this.passwordInput.fill(data.password);
            await this.confirmPasswordInput.fill(data.password);
            await this.mobileInput.fill(data.mobile);
            await this.confirmMobileInput.fill(data.mobile);
        });
    }

    async submitRegistration(): Promise<void> {
        await this.registerBtn.click();
    }

    async handleRegistrationResult(): Promise<{ result: string; message: string }> {
        return await test.step('Handle Registration Result', async () => {
            const result = await Promise.race([
                this.errorLocator.first().waitFor({ state: 'visible', timeout: 15000 }).then(() => 'error'),
                this.successLocator.first().waitFor({ state: 'visible', timeout: 15000 }).then(() => 'success'),
                this.page.waitForURL(/.*dashboard|.*activity|.*otp|.*candidate/, { timeout: 15000 }).then(() => 'redirect')
            ]).catch(() => 'timeout');

            if (result === 'error') {
                const errorTexts = await this.errorLocator.allTextContents();
                return { result: 'error', message: errorTexts.join(" | ") };
            }

            if (result === 'success' || result === 'redirect') {
                return { result: 'success', message: 'Successful' };
            }

            return { result: 'timeout', message: 'Timed out' };
        });
    }
}
