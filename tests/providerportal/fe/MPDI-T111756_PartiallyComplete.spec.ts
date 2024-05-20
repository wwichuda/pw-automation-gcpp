import { expect } from "@playwright/test";
import { test } from "../../../app_commons/fixtures/page.fixture";
import { screenshotOnResults } from "../../../src/TCscreenshot";

const data = JSON.parse(JSON.stringify(require(`../../../testdata/resources/projectData.json`)));

test("MPDI-T111756 (1.0) GCPP[Basic] : Partially complete assignment", async ({
    page, providerPortalLoginPage, newServiceOrdersPage, serviceOrderDetailsPage
}) => {

    const username = data.provider.gcppGPPLawyerofTrust.email;
    const password = data.provider.gcppGPPLawyerofTrust.password;

    const serviceOrder = '241284408792';
    
    await test.step("1) Access Provider Portal login page", async () => {
        await providerPortalLoginPage.goToProviderPortalUrl();
        await expect(page).toHaveTitle(/Provider Portal/);
    });

    await test.step("2) Login with valid credential", async () => {
        await providerPortalLoginPage.loginWithAZConnect(username, password);
    });

    await test.step("3) Accept service order", async () => {
        await newServiceOrdersPage.searchNewServiceOrder(serviceOrder);
        await newServiceOrdersPage.acceptServiceOrder(serviceOrder);
    });

    await test.step("4) Partially complete assignment", async () => {
        await serviceOrderDetailsPage.partiallyCompleteOrder("Litigation interrupted");
        await serviceOrderDetailsPage.assertPartiallyCompleteSuccess();
    });
    
});