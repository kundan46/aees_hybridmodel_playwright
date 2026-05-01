// ─────────────────────────────────────────────────────────────
// src/fixtures/base.fixture.ts
// Custom fixtures extending Playwright's base `test`
// ─────────────────────────────────────────────────────────────
import { test as base, expect } from '@playwright/test';
import { AuthService } from '@services/auth.service';
import logger from '@utils/logger';
import envConfig from '@config/env.config';
// AEES Pages
import { AeesLoginPage } from '@pages/aees/aees.login.page';
import { AeesDashboardPage } from '@pages/aees/aees.dashboard.page';
import { AeesInstructionsPage } from '@pages/aees/aees.instructions.page';
import { AeesPostSelectionPage } from '@pages/aees/aees.post-selection.page';
import { AeesEligibilityPage } from '@pages/aees/aees.eligibility.page';
import { AeesPersonalDetailsPage } from '@pages/aees/aees.personal-details.page';
import { AeesEducationPage } from '@pages/aees/aees.education.page';
import { AeesOccupationalPage } from '@pages/aees/aees.occupational.page';
import { AeesUploadPage } from '@pages/aees/aees.upload.page';
import { AeesTestCenterPage } from '@pages/aees/aees.test-center.page';
import { AeesPreviewPage } from '@pages/aees/aees.preview.page';
import { AeesRegistrationPage } from '@pages/aees/aees.registration.page';

// ── Type declaration for custom fixtures ─────────────────────
type AppFixtures =
  {
    // AEES Fixtures
    aeesLoginPage: AeesLoginPage;
    aeesDashboardPage: AeesDashboardPage;
    aeesInstructionsPage: AeesInstructionsPage;
    aeesPostSelectionPage: AeesPostSelectionPage;
    aeesEligibilityPage: AeesEligibilityPage;
    aeesPersonalDetailsPage: AeesPersonalDetailsPage;
    aeesEducationPage: AeesEducationPage;
    aeesOccupationalPage: AeesOccupationalPage;
    aeesUploadPage: AeesUploadPage;
    aeesTestCenterPage: AeesTestCenterPage;
    aeesPreviewPage: AeesPreviewPage;
    aeesRegistrationPage: AeesRegistrationPage;
  };

// ── Extended test object ──────────────────────────────────────
export const test = base.extend<AppFixtures>({

  aeesLoginPage: async ({ page }, use) => {
    await use(new AeesLoginPage(page));
  },

  aeesDashboardPage: async ({ page }, use) => {
    await use(new AeesDashboardPage(page));
  },

  aeesInstructionsPage: async ({ page }, use) => {
    await use(new AeesInstructionsPage(page));
  },

  aeesPostSelectionPage: async ({ page }, use) => {
    await use(new AeesPostSelectionPage(page));
  },

  aeesEligibilityPage: async ({ page }, use) => {
    await use(new AeesEligibilityPage(page));
  },

  aeesPersonalDetailsPage: async ({ page }, use) => {
    await use(new AeesPersonalDetailsPage(page));
  },

  aeesEducationPage: async ({ page }, use) => {
    await use(new AeesEducationPage(page));
  },

  aeesOccupationalPage: async ({ page }, use) => {
    await use(new AeesOccupationalPage(page));
  },

  aeesUploadPage: async ({ page }, use) => {
    await use(new AeesUploadPage(page));
  },

  aeesTestCenterPage: async ({ page }, use) => {
    await use(new AeesTestCenterPage(page));
  },

  aeesPreviewPage: async ({ page }, use) => {
    await use(new AeesPreviewPage(page));
  },

  aeesRegistrationPage: async ({ page }, use) => {
    await use(new AeesRegistrationPage(page));
  },
});

export { expect };
