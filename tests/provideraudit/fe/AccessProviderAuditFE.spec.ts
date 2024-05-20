// import { expect } from "@playwright/test";
// import { test } from "../../../app_commons/fixtures/page.fixture";
// import { screenshotOnResults } from "./../../../src/TCscreenshot";

// const data = JSON.parse(JSON.stringify(require(`../../../testdata/resources/projectData.json`)));

// const username = data.auditor.gcppPropertyLossAdjustorProviderAuditor.email;
// const password = data.auditor.gcppPropertyLossAdjustorProviderAuditor.password;

// test.beforeEach(async ({ page, providerPortalLoginPage, providerPortalOverviewPage }) => {
//     await test.step("1) Open the provider portal", async () => {
//         await providerPortalLoginPage.goToProviderPortalUrl()
//         await expect(page).toHaveTitle(/Provider Portal/)
//     });

//     await test.step("2) Login with a valid credential", async () => {
//         test.setTimeout(100000)
//         await providerPortalLoginPage.loginWithCredential(username,password)
//         await providerPortalOverviewPage.waitForOverviewPageLoad()
//     });
// });


// test("Login with External auditor as GCPP Property Loss Adjustor Provider Auditor", async ({
//     page, providerPortalLoginPage
// }) => {
//     const username = data.auditor.gcppPropertyLossAdjustorProviderAuditor.email;
//     const password = data.auditor.gcppPropertyLossAdjustorProviderAuditor.password;

//     await test.step("1) Access Provider Portal login page", async () => {
//         await providerPortalLoginPage.goToProviderPortalUrl();
//         await expect(page).toHaveTitle(/Provider Portal/);
//     });

//     await test.step("2) Login with valid credential", async () => {
//         await providerPortalLoginPage.clickOnLoginWithSSOButton();
//         await providerPortalLoginPage.clickOnLoginWithAzure();
//         await providerPortalLoginPage.enterUsername(username);
//         await providerPortalLoginPage.enterPassword(password);
//     });
// });

// // test("Login with External auditor as GCPP Medical Provider Auditor", async ({
// //     page, providerPortalLoginPage
// // }) => {
// //     const username = data.auditor.gcppMedicalProviderAuditor.email;
// //     const password = data.auditor.gcppMedicalProviderAuditor.password;

// //     await test.step("1) Access Provider Portal login page", async () => {
// //         await providerPortalLoginPage.goToProviderPortalUrl();
// //         await expect(page).toHaveTitle(/Provider Portal/);
// //     });

// //     await test.step("2) Login with valid credential", async () => {
// //         await providerPortalLoginPage.clickOnLoginWithSSOButton();
// //         await providerPortalLoginPage.clickOnLoginWithAzure();
// //         await providerPortalLoginPage.enterUsername(username);
// //         await providerPortalLoginPage.enterPassword(password);
// //     });
// // });

// // test("Login with External auditor as GCPP Lawyer Provider Auditor", async ({
// //     page, providerPortalLoginPage
// // }) => {
// //     const username = data.auditor.gcppLawyerProviderAuditor.email;
// //     const password = data.auditor.gcppLawyerProviderAuditor.password;

// //     await test.step("1) Access Provider Portal login page", async () => {
// //         await providerPortalLoginPage.goToProviderPortalUrl();
// //         await expect(page).toHaveTitle(/Provider Portal/);
// //     });

// //     await test.step("2) Login with valid credential", async () => {
// //         await providerPortalLoginPage.clickOnLoginWithSSOButton();
// //         await providerPortalLoginPage.clickOnLoginWithAzure();
// //         await providerPortalLoginPage.enterUsername(username);
// //         await providerPortalLoginPage.enterPassword(password);
// //     });
// // });

// // test("Login with Internal auditor as GCPP Internal User", async ({
// //     page, providerPortalLoginPage
// // }) => {
// //     const username = data.auditor.gcppInternalUser.email;
// //     const password = data.auditor.gcppInternalUser.password;

// //     await test.step("1) Access Provider Portal login page", async () => {
// //         await providerPortalLoginPage.goToProviderPortalUrl();
// //         await expect(page).toHaveTitle(/Provider Portal/);
// //     });

// //     await test.step("2) Login with valid credential", async () => {
// //         await providerPortalLoginPage.clickOnLoginWithSSOButton();
// //         await providerPortalLoginPage.clickOnLoginWithAzure();
// //         await providerPortalLoginPage.enterUsername(username);
// //         await providerPortalLoginPage.enterPassword(password);
// //     });
// // });