// ─────────────────────────────────────────────────────────────
// src/components/navbar.component.ts
// Reusable Navbar component usable across any page
// ─────────────────────────────────────────────────────────────
import { Page, Locator } from '@playwright/test';
import logger from '@utils/logger';

export class NavbarComponent {
  private readonly page: Page;

  // Locators


  constructor(page: Page) {
    this.page = page;

  }

  /** Open the burger side-menu */
  async openMenu(): Promise<void> {
    logger.debug('[Navbar] Opening menu');
    //await this.menuBtn.click();
    //await this.logoutLink.waitFor({ state: 'visible' });
  }

  /** Close the burger side-menu */
  async closeMenu(): Promise<void> {
    //await this.menuCloseBtn.click();    
  }

  /** Logout from the application */
  async logout(): Promise<void> {
    logger.info('[Navbar] Logging out');
    //await this.openMenu();
    //await this.logoutLink.click();
  }

  /** Reset the app state via menu */
  async resetApp(): Promise<void> {
    logger.info('[Navbar] Resetting app state');
    //await this.openMenu();
    //await this.resetAppLink.click();
    //await this.closeMenu();
  }

  /** Navigate to All Items */
  async goToAllItems(): Promise<void> {
    //await this.openMenu();
    //await this.allItemsLink.click();
  }

  /** Open the shopping cart */
  async openCart(): Promise<void> {
    logger.debug('[Navbar] Opening cart');
    //await this.cartIcon.click();
  }

  /** Get cart item count (returns 0 if badge is absent) */
  async getCartCount(): Promise<number> {
    //const isVisible = await this.cartBadge.isVisible();
    //if (!isVisible) return 0;
    //const text = await this.cartBadge.textContent();
    //return parseInt(text ?? '0', 10);
    return 0;
  }

  /** Get the current page title from the header */
  async getPageTitle(): Promise<string> {
    //return (await this.pageTitle.textContent()) ?? '';
    return '';
  }
}
