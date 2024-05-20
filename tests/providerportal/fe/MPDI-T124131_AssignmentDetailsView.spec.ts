import { expect } from "@playwright/test";
import { test } from "../../../app_commons/fixtures/page.fixture";
import ENV from "../../../app_commons/environments/env";
import { screenshotOnResults } from "../../../src/TCscreenshot";

const data = JSON.parse(JSON.stringify(require(`../../../testdata/resources/projectData.json`)));
const serviceOrderData = JSON.parse(JSON.stringify(require(`../../../testdata/${ENV.DATAPATH || 'test-DEV'}/providerportal/fe/MPDI-T124131_AssignmentDetailsView.data.json`)));


test.beforeEach(async ({  request ,page, providerPortalLoginPage }) => {
    await test.step("1) Open the provider portal", async () => {
        await providerPortalLoginPage.goToProviderPortalUrl()
        await expect(page).toHaveTitle(/Provider Portal/)
    });
});

test("MPDI-T124131 (1.0) GCPP: [UI/BFF] Verify the assignment details view", async ({
    providerPortalLoginPage, newServiceOrdersPage, serviceOrderDetailsPage
}) => {

    const username = data.provider.gcppGPPAssessor1.email;
    const password = data.provider.gcppGPPAssessor1.password;
    const serviceOrderNumber = '241133242494';
    
    await test.step("1) Search with service order number and open it", async () => {
        // await providerPortalLoginPage.loginWithAZConnect(username,password)
        await providerPortalLoginPage.loginWithCredential(username,password)
        await newServiceOrdersPage.providerOverviewPageIsDisplayed()
        await newServiceOrdersPage.search(serviceOrderNumber)
        await newServiceOrdersPage.clickAssignmentNumberToOpenAssignmentDetailsPage(serviceOrderNumber)
        await serviceOrderDetailsPage.providerDetailsPageIsDisplayed()

    });

    await test.step("2) Verify the header section", async () => {
        await serviceOrderDetailsPage.assertStatusBadgeIsVisible('New')
        await serviceOrderDetailsPage.assertDueDateBadgeIsVisible()
        await serviceOrderDetailsPage.assertServiceOrderNumberIsVisible(serviceOrderNumber)
        await serviceOrderDetailsPage.assertRejectButtonIsVisible()
        await serviceOrderDetailsPage.assertRejectButtonIsVisible()
    });

    await test.step("3) Verify the details section", async () => {
        await serviceOrderDetailsPage.assertSectionIsVisible('Service order details')
        await serviceOrderDetailsPage.assertSectionIsVisible('Claim details')
        await serviceOrderDetailsPage.assertSectionIsVisible('Incident details')
        await serviceOrderDetailsPage.assertSectionIsVisible('Damage details')
        await serviceOrderDetailsPage.assertSectionIsVisible('Vehicle details')
        await serviceOrderDetailsPage.assertSectionIsVisible('Repair shop details')
    });

    await test.step("4) Verify the Service order details section", async () => {
        await serviceOrderDetailsPage.assertFieldAndValueIsVisible('Service order type:', 'Expert opinion vehicle')
        await serviceOrderDetailsPage.assertFieldAndValueIsVisible('Specialization:', serviceOrderData.assignmentDetail.specialization)
        await serviceOrderDetailsPage.assertFieldAndValueIsVisible('Service:', 'Motor estimation')
        await serviceOrderDetailsPage.assertFieldIsVisible('Fault:')
        await serviceOrderDetailsPage.assertFieldIsVisible('Expertise Location:')
        await serviceOrderDetailsPage.assertFieldIsVisible('Intercompany agreement:')
    });

    await test.step("5) Verify the Claim details section", async () => {
        await serviceOrderDetailsPage.assertFieldAndValueIsVisible('Claim number:', serviceOrderData.claimDetail.claimNumber)
        await serviceOrderDetailsPage.assertFieldAndValueIsVisible('Type of coverage:', serviceOrderData.claimDetail.coverageStatus)
        await serviceOrderDetailsPage.assertFieldIsVisible('Claim class:')
        await serviceOrderDetailsPage.assertFieldIsVisible('Loss cause:')
        await serviceOrderDetailsPage.assertFieldIsVisible('Loss type:')
        await serviceOrderDetailsPage.assertFieldAndValueIsVisible('Policy number:', serviceOrderData.claimDetail.policyNumber)
        await serviceOrderDetailsPage.assertFieldIsVisible('Policy start date:')
        await serviceOrderDetailsPage.assertFieldIsVisible('Coverage status:')
    });

    await test.step("6) Verify the Incident details section", async () => {

        await serviceOrderDetailsPage.assertFieldIsVisible('Incident location:')
        await serviceOrderDetailsPage.assertFieldIsVisible('Incident date:')
        await serviceOrderDetailsPage.assertFieldIsVisible('Date received by Allianz:')
        await serviceOrderDetailsPage.assertFieldIsVisible('Accident description:')
        await serviceOrderDetailsPage.assertFieldIsVisible('Police involvement:')
    });
    
    await test.step("7) Verify the Damage details section", async () => {
        await serviceOrderDetailsPage.assertFlatFrogContainerIsVisible()
        await serviceOrderDetailsPage.assertFieldIsVisible('Flat frog:')
        await serviceOrderDetailsPage.assertFieldIsVisible('Car replacement:')
        await serviceOrderDetailsPage.assertFieldIsVisible('Preliminary repair cost:')
        await serviceOrderDetailsPage.assertFieldIsVisible('Potential total loss:')
        await serviceOrderDetailsPage.assertFieldIsVisible('Glass damage:')
        await serviceOrderDetailsPage.assertFieldIsVisible('Additional damage:')
        await serviceOrderDetailsPage.assertFieldIsVisible('Damage description:')
    });

    await test.step("8) Verify the Vehicle details section", async () => {
        await serviceOrderDetailsPage.assertFieldIsVisible('Plate:')
        await serviceOrderDetailsPage.assertFieldIsVisible('Brand/model:')
        await serviceOrderDetailsPage.assertFieldIsVisible('Mileage:')
        await serviceOrderDetailsPage.assertFieldIsVisible('VIN:')
        await serviceOrderDetailsPage.assertFieldIsVisible('Vehicle registration date:')
    });
    
    await test.step("9) Verify the Repair shop details section", async () => {
        await serviceOrderDetailsPage.assertFieldAndValueIsVisible('Repair shop name:', serviceOrderData.repairShopDetails.repairShopName )
        await serviceOrderDetailsPage.assertFieldIsVisible('Address:')
        await serviceOrderDetailsPage.assertFieldIsVisible('Phone:')
        await serviceOrderDetailsPage.assertFieldIsVisible('Email:')
    });
});