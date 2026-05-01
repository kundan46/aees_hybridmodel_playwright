// ─────────────────────────────────────────────────────────────
// src/components/modal.component.ts
// Generic modal / dialog interaction component
// ─────────────────────────────────────────────────────────────
import { Page, Locator } from '@playwright/test';
import logger from '@utils/logger';
import { WaitHelper } from '@utils/wait.helper';

export class ModalComponent {
  private readonly page: Page;

  readonly container: Locator;
  readonly title: Locator;
  readonly body: Locator;
  readonly confirmBtn: Locator;
  readonly cancelBtn: Locator;
  readonly closeBtn: Locator;

  constructor(page: Page, containerSelector = '[role="dialog"]') {
    this.page       = page;
    this.container  = page.locator(containerSelector);
    this.title      = this.container.locator('.modal-title, [data-test="modal-title"]');
    this.body       = this.container.locator('.modal-body,  [data-test="modal-body"]');
    this.confirmBtn = this.container.locator('button.confirm, [data-test="confirm"]');
    this.cancelBtn  = this.container.locator('button.cancel,  [data-test="cancel"]');
    this.closeBtn   = this.container.locator('button.close,   [aria-label="Close"]');
  }

  async isVisible(): Promise<boolean> {
    return this.container.isVisible();
  }

  async waitForModal(): Promise<void> {
    logger.debug('[Modal] Waiting for modal to appear');
    await WaitHelper.waitForVisible(this.container, { message: 'Modal dialog' });
  }

  async getTitle(): Promise<string> {
    return (await this.title.textContent()) ?? '';
  }

  async confirm(): Promise<void> {
    logger.debug('[Modal] Clicking confirm');
    await this.confirmBtn.click();
    await WaitHelper.waitForHidden(this.container);
  }

  async cancel(): Promise<void> {
    logger.debug('[Modal] Clicking cancel');
    await this.cancelBtn.click();
    await WaitHelper.waitForHidden(this.container);
  }

  async close(): Promise<void> {
    logger.debug('[Modal] Closing modal via X button');
    await this.closeBtn.click();
    await WaitHelper.waitForHidden(this.container);
  }
}
