import { expect } from "@playwright/test"
import { test } from "../../../app_commons/fixtures/page.fixture"
import { screenshotOnResults } from "./../../../src/TCscreenshot"

const data = JSON.parse(JSON.stringify(require(`../../../testdata/resources/projectData.json`)))

const username = data.provider.gcppGPPRepairer1.email
const password = data.provider.gcppGPPRepairer1.password
const providerName = data.provider.gcppGPPRepairer1.name

test("[MPDI-T124501] GCPP[Basic] Access to Provider Portal FE", async ({
    page, providerPortalLoginPage, newServiceOrdersPage
}) => {
    await test.step("1) Open the provider portal", async () => {
        await providerPortalLoginPage.goToProviderPortalUrl()
        await expect(page).toHaveTitle(/Provider Portal/)
    });

    await test.step("2) Login with a valid credential", async () => {
        test.setTimeout(100000)
        await providerPortalLoginPage.loginWithAZConnect(username,password)
        //await providerPortalLoginPage.loginWithCredential(username,password)
        await newServiceOrdersPage.waitForOverviewPageLoad()

        const pageTitle = await page.locator('bb-spp-page-title').getByTestId('title').textContent()
        expect(`${pageTitle}`.trim()).toEqual('New Service Orders')   

        
        // verify the provider name
        // const providerIsVisible = await page.locator(`button[trackid="headerAvatar"][trackvalue="${providerName}"]`).isVisible()
        // expect(providerIsVisible).toBeTruthy()
    });
});

test.afterEach(screenshotOnResults);