import { expect } from "@playwright/test";
import { test } from "../../../app_commons/fixtures/page.fixture";

const data = JSON.parse(JSON.stringify(require(`../../../testdata/resources/projectData.json`)));

test.beforeEach(async ({  request ,page, providerPortalLoginPage }) => {
    await test.step("1) Open the provider portal", async () => {
        await providerPortalLoginPage.goToProviderPortalUrl()
        await expect(page).toHaveTitle(/Provider Portal/)
    });
});

test("MPDI-T117910 (1.0) GCPP: [UI/BFF] Verify the involved parties details view", async ({
    providerPortalLoginPage, newServiceOrdersPage, serviceOrderDetailsPage
}) => {

    const username = data.provider.gcppGPPAssessor1.email;
    const password = data.provider.gcppGPPAssessor1.password;
    
    await test.step("1) Select the newest service order number and open it", async () => {
        // await providerPortalLoginPage.loginWithAZConnect(username,password)
        await providerPortalLoginPage.loginWithCredential(username,password)
        await newServiceOrdersPage.providerOverviewPageIsDisplayed()
        await newServiceOrdersPage.selectNewetServiceOrderNumber()
        await serviceOrderDetailsPage.providerDetailsPageIsDisplayed()
        await serviceOrderDetailsPage.navigateToInvolvedPartiesTab()

    });

    await test.step("2) Navigate to Involved Parties tab", async () => {
        await serviceOrderDetailsPage.navigateToInvolvedPartiesTab()

    });

    await test.step("3) Verify the details section", async () => {
        await serviceOrderDetailsPage.assertSectionIsVisible('Claim Handler')
        await serviceOrderDetailsPage.assertSectionIsVisible('Policy Holder')
        await serviceOrderDetailsPage.assertSectionIsVisible('Owner')
        await serviceOrderDetailsPage.assertSectionIsVisible('Loss adjuster')
    });

    await test.step("4) Verify the Claim Handler section", async () => {
        const fields = ["Name", "Team", "Team phone", "Team email", "Team address"]
        await serviceOrderDetailsPage.assertFieldsAreVisibleForSection('Claim Handler',fields)
    });

    await test.step("5) Verify the Policy Holder section", async () => {
        const fields = ["Name", "ID Number", "Phone", "Email"]
        await serviceOrderDetailsPage.assertFieldsAreVisibleForSection('Policy Holder',fields)
    });

    await test.step("6) Verify the Owner section", async () => {
        const fields = ["Name", "ID Number", "Date of birth", "Phone", "Email", "Address"]
        await serviceOrderDetailsPage.assertFieldsAreVisibleForSection('Owner',fields)
    });
    
    await test.step("7) Verify the Loss adjuster section", async () => {
        const fields = ["Name", "Phone", "Email"]
        await serviceOrderDetailsPage.assertFieldsAreVisibleForSection('Loss adjuster',fields)
        await serviceOrderDetailsPage.assertFieldAndValueIsVisible('Name:', 'GPP Assessor1')
    });
});