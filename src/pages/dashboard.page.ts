// ─────────────────────────────────────────────────────────────
// src/pages/dashboard.page.ts
// Page Object for the Dashboard / Inventory page
// ─────────────────────────────────────────────────────────────
import { Page, Locator, test } from '@playwright/test';
import { BasePage } from './base.page';
import { NavbarComponent } from '@components/navbar.component';
import logger from '@utils/logger';

export class DashboardPage extends BasePage {
  readonly navbar: NavbarComponent;
  readonly productList: Locator;
  readonly inventoryItems: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.navbar = new NavbarComponent(page);
    this.productList = page.locator('.inventory_list');
    this.inventoryItems = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product_sort_container"]');
  }

  async waitForLoad(): Promise<void> {
    await this.productList.waitFor({ state: 'visible' });
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    logger.info(`[Dashboard] Sorting products by: ${option}`);
    await this.sortDropdown.selectOption(option);
  }

  async addToCart(index: number): Promise<void> {
    const item = this.inventoryItems.nth(index);
    const button = item.locator('button');
    logger.info(`[Dashboard] Adding product at index ${index} to cart`);
    await button.click();
  }

  async getProductCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  async getPageTitle(): Promise<string> {
    return this.navbar.getPageTitle();
  }

  async getPricesAsNumbers(): Promise<number[]> {
    const priceLocators = this.page.locator('.inventory_item_price');
    const texts = await priceLocators.allTextContents();
    return texts.map(t => parseFloat(t.replace('$', '')));
  }

  async getAllProducts(): Promise<{ name: string; price: string }[]> {
    const items = await this.inventoryItems.all();
    const results = [];
    for (const item of items) {
      const name = await item.locator('.inventory_item_name').textContent();
      const price = await item.locator('.inventory_item_price').textContent();
      results.push({ name: name ?? '', price: price ?? '' });
    }
    return results;
  }
}
