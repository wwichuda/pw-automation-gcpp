import { expect } from "@playwright/test"
import { test } from "../../../app_commons/fixtures/page.fixture"
import { screenshotOnResults } from "./../../../src/TCscreenshot"

const data = JSON.parse(JSON.stringify(require(`../../../testdata/resources/projectData.json`)))

test.beforeEach(async ({  request ,page, providerPortalLoginPage }) => {
    await test.step("1) Open the provider portal", async () => {
        await providerPortalLoginPage.goToProviderPortalUrl()
        await expect(page).toHaveTitle(/Provider Portal/)
    });
});

test("[MPDI-T124196] Login as GPP Repairer 1", async ({
    page, providerPortalLoginPage, newServiceOrdersPage, providerSettingPage
}) => {


    await test.step("1) Login to provider portal", async () => {
        const username = data.provider.gcppGPPRepairer1.email
        const password = data.provider.gcppGPPRepairer1.password
        const providerName = data.provider.gcppGPPRepairer1.name

        test.setTimeout(100000)
        // await providerPortalLoginPage.loginWithAZConnect(username,password)
        await providerPortalLoginPage.loginWithCredential(username,password)
        await newServiceOrdersPage.providerOverviewPageIsDisplayed()
        await newServiceOrdersPage.verifyPageTitleIsDisplayedWith('New Service Orders')
        await newServiceOrdersPage.navigateToProviderSettingPage()

        await providerSettingPage.providerSeetingPageIsDisplayed()
        await providerSettingPage.verifyProviderNameIsDisplayedAs(providerName)
    });
}),

test("[MPDI-T124208] Login as GPP Repairer 2", async ({
    page, providerPortalLoginPage, newServiceOrdersPage, providerSettingPage
}) => {

    const username = data.provider.gcppGPPRepairer2.email
    const password = data.provider.gcppGPPRepairer2.password
    const providerName = data.provider.gcppGPPRepairer2.name

    await test.step("1) Login to provider portal", async () => {
        const username = data.provider.gcppGPPRepairer2.email
        const password = data.provider.gcppGPPRepairer2.password
        const providerName = data.provider.gcppGPPRepairer2.name

        test.setTimeout(100000)
        await providerPortalLoginPage.loginWithAZConnect(username,password)
        //await providerPortalLoginPage.loginWithCredential(username,password)
        await newServiceOrdersPage.providerOverviewPageIsDisplayed()
        await newServiceOrdersPage.verifyPageTitleIsDisplayedWith('New Service Orders')
        await newServiceOrdersPage.navigateToProviderSettingPage()

        await providerSettingPage.providerSeetingPageIsDisplayed()
        await providerSettingPage.verifyProviderNameIsDisplayedAs(providerName)
    });
}),


test("[MPDI-TXXXXXX] Login as GPP Repairer 3", async ({
    page, providerPortalLoginPage, newServiceOrdersPage, providerSettingPage
}) => {

    const username = data.provider.gcppGPPRepairer3.email
    const password = data.provider.gcppGPPRepairer3.password
    const providerName = data.provider.gcppGPPRepairer3.name

    await test.step("1) Login to provider portal", async () => {
        const username = data.provider.gcppGPPRepairer3.email
        const password = data.provider.gcppGPPRepairer3.password
        const providerName = data.provider.gcppGPPRepairer3.name

        test.setTimeout(100000)
        await providerPortalLoginPage.loginWithAZConnect(username,password)
        //await providerPortalLoginPage.loginWithCredential(username,password)
        await newServiceOrdersPage.providerOverviewPageIsDisplayed()
        await newServiceOrdersPage.verifyPageTitleIsDisplayedWith('New Service Orders')
        await newServiceOrdersPage.navigateToProviderSettingPage()

        await providerSettingPage.providerSeetingPageIsDisplayed()
        await providerSettingPage.verifyProviderNameIsDisplayedAs(providerName)
    });
});


test.afterEach(screenshotOnResults);