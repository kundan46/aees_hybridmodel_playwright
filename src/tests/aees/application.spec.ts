import { test, expect } from '@fixtures/base.fixture';
import { AEES_TEST_DATA } from '@testData/aees.data';
import logger from '@utils/logger';

test.describe('AEES Application Process @aees @application', () => {

    test.beforeEach(async ({ aeesLoginPage }) => {
        // Use credentials from test-data
        const { email, password } = AEES_TEST_DATA.validUser;
        await aeesLoginPage.open();
        await aeesLoginPage.login(email, password);
    });

    test('should complete the full application journey', async ({
        aeesDashboardPage,
        aeesInstructionsPage,
        aeesPostSelectionPage,
        aeesEligibilityPage,
        aeesPersonalDetailsPage,
        aeesEducationPage,
        aeesOccupationalPage,
        aeesUploadPage,
        aeesTestCenterPage,
        aeesPreviewPage
    }) => {
        test.setTimeout(180000);

        // Step 1: Dashboard & Start
        await aeesDashboardPage.goToDashboard();
        await aeesDashboardPage.startOrViewApplication();

        // Step 2: Instructions
        await aeesInstructionsPage.acceptInstructions();

        // Step 3: Post Selection
        await aeesPostSelectionPage.selectPost('LIBRARIAN');

        // Step 4: Eligibility
        await aeesEligibilityPage.fillEligibility();

        // Step 5: Personal Details (Using centralized data)
        await aeesPersonalDetailsPage.fillPersonalDetails(AEES_TEST_DATA.defaultPersonalDetails);

        // Step 6: Education (Using centralized data)
        await aeesEducationPage.fillEducationDetails(AEES_TEST_DATA.defaultEducationDetails);

        // Step 7: Occupationa
        await aeesOccupationalPage.fillOccupationalDetails();

        // Step 8: Upload
        await aeesUploadPage.uploadDocuments(AEES_TEST_DATA.defaultUploads);

        // Step 9: Test Center
        await aeesTestCenterPage.fillTestCenterPreferences();

        // Step 10: Final Preview & Download
        await aeesPreviewPage.confirmAndSubmit();
        const download = await aeesPreviewPage.downloadApplication(__dirname, 'final_application.pdf');
        expect(download).toBeTruthy();
    });

});
