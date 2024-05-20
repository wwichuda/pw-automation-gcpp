import { Locator, Page, expect } from "@playwright/test";

export default class CommonPage {
    btnNext: string
    pageNameLocator: string
    constructor(public page: Page) {
        this.page = page;
        this.btnNext = '[data-testid*="next-button"]'
        this.pageNameLocator = 'h4[data-testid="title"]'
    }

    async verifyPageName(pageName: string) {
        await this.waitForElementVisible(this.pageNameLocator)
        await expect(this.page.locator(this.pageNameLocator)).toHaveText(pageName)
    }

    async verifyTitle(locator: string, title: string){
        await this.waitForElementVisible(locator)
        await expect(this.page.locator(locator)).toHaveText(title)
    }

    async waitForElementVisible(locator: string) {
        await this.page.locator(locator).waitFor({ state: "visible" });
    }

    async isElementVisible(locator: string) {
        await expect(this.page.locator(locator)).toBeVisible();
    }

    async isElementNotVisible(locator: string) {
        await expect(this.page.locator(locator)).not.toBeVisible();
    }

    async isElementLocatorVisible(locator: Locator) {
        await expect(locator).toBeVisible();
    }

    async isElementLocatorNotVisible(locator: Locator) {
        await expect(locator).not.toBeVisible();
    }

    async inputTextField(locator: string, value: string) {
        await this.waitForElementVisible(locator);
        const textField = await this.page.locator(locator)
        await textField.click();
        await textField.fill(value);
    }

    async clickButton(locator: string) {
        await this.waitForElementVisible(locator);
        const button = await this.page.locator(locator)
        await button.click();
    }

    async clickNextButton() {
        await this.waitForElementVisible(this.btnNext);
        const button = await this.page.locator(this.btnNext)
        await button.click();
    }

    async waitForNexPage(url: string){
        await this.page.waitForURL('**/'+url+'**');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async uploadFile(locator: string, filePath: string){
        const input = await this.page.locator(locator)
        await input.setInputFiles(filePath);
    }

    async verifyUploadFileSuccess(locator: string){
        await this.waitForElementVisible(locator);
    }
}