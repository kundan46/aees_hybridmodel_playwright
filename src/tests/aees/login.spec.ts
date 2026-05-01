import { test, expect } from '@fixtures/base.fixture';
import logger from '@utils/logger';

test.describe('AEES Login @aees @login', () => {

    test('should login successfully with valid credentials', async ({ aeesLoginPage, aeesDashboardPage }) => {
        await aeesLoginPage.open();
        await aeesLoginPage.login('bug85@gmail.com', 'Abcd@1234');
        
        // Verify dashboard is reached
        await expect(aeesDashboardPage.dashboardLink).toBeVisible();
    });

});
