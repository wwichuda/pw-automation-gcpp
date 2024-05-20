import { expect } from "@playwright/test";
import { test } from "../../../app_commons/fixtures/page.fixture";
import { screenshotOnResults } from "../../../src/TCscreenshot";

const data = JSON.parse(JSON.stringify(require(`../../../testdata/resources/projectData.json`)));

test("MPDI-T111749 (1.0) GCPP: [UI/BFF] Verify the reject functionality from New status assignment", async ({
    page, providerPortalLoginPage, newServiceOrdersPage
}) => {

    const username = data.provider.gcppGPPLawyerofTrust.email;
    const password = data.provider.gcppGPPLawyerofTrust.password;

    const serviceOrder = '241284401014';
    
    await test.step("1) Access Provider Portal login page", async () => {
        await providerPortalLoginPage.goToProviderPortalUrl();
    });

    await test.step("2) Login with valid credential", async () => {
        await providerPortalLoginPage.loginWithAZConnect(username, password);
    });

    await test.step("3) Find a Service Order", async () => {
        await newServiceOrdersPage.searchNewServiceOrder(serviceOrder);
    });

    await test.step("4) Choose a Service Order and open right menu with 3 dots", async () => {
        await newServiceOrdersPage.openRightMenuThreeDots();
    });

    await test.step("5) click Reject from the menu", async () => {
        await newServiceOrdersPage.clickRejectFromMenu();
    });

    await test.step("6) Choose the Rejection reason", async () => {
        await newServiceOrdersPage.selectRejectReason();
    });

    await test.step("7) Click Reject on the popup", async () => {
        await newServiceOrdersPage.clickRejectPopup();
        await newServiceOrdersPage.assertRejectSuccess();
    });

    await test.step("8) Click Close", async () => {
        await newServiceOrdersPage.clickCloseButtonSuccessPopup();
//        await newServiceOrdersPage.assertDesapearedServiceOrder(); //waiting for the locator of the text to be updated
    });
    await page.pause();
    
});