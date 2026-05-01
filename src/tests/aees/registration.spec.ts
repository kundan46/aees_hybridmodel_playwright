import { test, expect } from '@fixtures/base.fixture';
import { AEES_TEST_DATA } from '@testData/aees.data';
import logger from '@utils/logger';

test.describe('AEES Registration @aees @registration', () => {

    test('should register a new candidate successfully', async ({ aeesRegistrationPage }) => {
        test.setTimeout(120000);
        
        // Use dynamic data generator
        const regData = AEES_TEST_DATA.generateRegistrationData();
        logger.info(`>>> Registering with Email: ${regData.email}`);
        
        await aeesRegistrationPage.open();
        await aeesRegistrationPage.clickNewRegistration();
        await aeesRegistrationPage.fillRegistrationForm(regData);
        await aeesRegistrationPage.submitRegistration();
        
        const { result, message } = await aeesRegistrationPage.handleRegistrationResult();
        expect(result, `Registration result was: ${message}`).toBe('success');
    });

});
