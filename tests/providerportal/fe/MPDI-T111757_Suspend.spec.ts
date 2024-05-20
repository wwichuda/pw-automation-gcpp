import { expect } from "@playwright/test"
import { test } from "../../../app_commons/fixtures/page.fixture"
import ENV from "../../../app_commons/environments/env";
import { screenshotOnResults } from "./../../../src/TCscreenshot"
import { 
    getAuthentication, 
    createAssignment,
    acceptAssignment,
    getAssignmentId
} from "../../../app_commons/utils/index"

const commonData = JSON.parse(JSON.stringify(require(`../../../testdata/resources/projectData.json`)))
const assignmentData = JSON.parse(JSON.stringify(require(`../../../testdata/${ENV.DATAPATH || 'test-DEV'}/providerportal/fe/MPDI-T111757_Suspend.data.json`)));

const username = commonData.provider.gcppGPPRepairer2.email
const password = commonData.provider.gcppGPPRepairer2.password
const providerId = commonData.provider.gcppGPPRepairer2.webuserID
let assignmentNumber = '240591610577'
  
test.beforeEach(async ({  request ,page, providerPortalLoginPage, newServiceOrdersPage }) => {
    let assignmentId;
    // await test.step("0) Create an assignment", async () => {
    //     assignmentNumber = await createAssignment(request, assignmentData)
    //     console.log("assignmentNumber:", assignmentNumber);

    //     assignmentId = await getAssignmentId(request,'KA',assignmentNumber)
    //     console.log("assignmentId:", assignmentId)
    // });

    // await test.step("1) Accept an assignment", async () => {
    //     let response = await getAuthentication(request, providerId)
    //     let responseBody= JSON.parse(await response.text());
    //     let authentication = "Bearer "+responseBody.access_token;

    //     await acceptAssignment(request, authentication, assignmentId, providerId)
    // });

    await test.step("1) Open the provider portal", async () => {
        await providerPortalLoginPage.goToProviderPortalUrl()
    });

    await test.step("2) Login with a valid credential", async () => {
        test.setTimeout(100000)
        await providerPortalLoginPage.loginWithAZConnect(username,password)
        //await providerPortalLoginPage.loginWithCredential(username,password)
        await newServiceOrdersPage.providerOverviewPageIsDisplayed()
        await newServiceOrdersPage.verifyPageTitleIsDisplayedWith('New Service Orders')
    });
});

test("[MPDI-T111757] GCPP [UI/BFF] Verify the suspend functionality", async ({
    page, newServiceOrdersPage, serviceOrderDetailsPage
}) => {
    await test.step("1) Navigate to the In progress folder, search for the assignment number and open it [assignmentNumber:"+assignmentNumber+"]", async () => {
        test.setTimeout(150000)
        await newServiceOrdersPage.navigateToCurrentServiceOrders()
        await newServiceOrdersPage.waitUntilSpinnerDiappear()
        await newServiceOrdersPage.search(assignmentNumber)
        await page.pause();
        await newServiceOrdersPage.clickAssignmentNumberToOpenAssignmentDetailsPage(assignmentNumber)
        await newServiceOrdersPage.waitUntilSpinnerDiappear()
    });

    await test.step("2) Open the options from 3 dots from the upper right corner of the page", async () => {
        test.setTimeout(150000)

        await serviceOrderDetailsPage.providerDetailsPageIsDisplayed()
        await serviceOrderDetailsPage.clickToOpenOptionsMenu()
    });

    await test.step("3) Click suspend", async () => {
        await serviceOrderDetailsPage.clickOnSuspendOption()
        await serviceOrderDetailsPage.verifyPopupIsDisplayedWithMessage('Why are you suspending the service order?')
        
    });

    await test.step("4) Choose reason", async () => {
        await serviceOrderDetailsPage.chooseReason('Other reason')
        await serviceOrderDetailsPage.enterDescription('Add description for suspend by automation')
        await serviceOrderDetailsPage.clickConfirmButton()
        await serviceOrderDetailsPage.verifyConfirmSuccessWithMessage('Successfully suspended!')
        await serviceOrderDetailsPage.closeSuccessPopup()
    });

    await test.step("5) Verify the assignment card", async () => {
        // verify suspend successfully
        const suspendedStatusIsVisible = await page.getByTestId('assignmentDetailsHeader').getByText('Suspended').isVisible()
        expect(suspendedStatusIsVisible).toBeTruthy()

        const infoMessageIsVisible = await page.getByTestId('info-message').isVisible()
        expect(infoMessageIsVisible).toBeTruthy()

        const suspendedMessageIsVisible = await page.getByText('Service order suspended').isVisible()
        expect(suspendedMessageIsVisible).toBeTruthy()
    });

    await test.step("5) Verify the assignment history", async () => {
        // navigateToHistoryTab()
        await page.getByRole('tab', {name: 'History'}).click()
        
        // verifyHeadlineIsVisible('Assignment Suspended')
        await page.waitForSelector(':text-is("Assignment Suspended")')
        const suspendedHeadlineIsVisible = await page.getByRole('cell', {name: 'Assignment Suspended'}).isVisible()
        expect(suspendedHeadlineIsVisible).toBeTruthy()
    });
});

test.afterEach(
    screenshotOnResults
)