import test, {type Page,expect, PageScreenshotOptions, Locator } from "@playwright/test"
class Utils {
	constructor(public page: Page) {
		this.page = page
	}

	async navigateTo(url: string) {
		return await this.page.goto(url)
	}

	async getTitle() {
		return await this.page.title()
	}

	async pause() {
		return await this.page.pause()
	}

	async getUrl() {
		return this.page.url()
	}

	async wait(waitInMiliseconds: number) {
		return this.page.waitForTimeout(waitInMiliseconds)
	}

	async waitForPageLoad() {
		return await this.page.waitForLoadState('domcontentloaded')
	}

	async clickOn(selector: string) {
		return await this.page.click(selector)
	}

	// async waitAndHardClick(selector: string) {
	// 	return await this.page.$eval(selector, element => element.click())
	// }

	async enterText(selector: string, text: string) {
		return await this.page.fill(selector, text)
	}

	async keyPress(selector: string, key: string) {
		return await this.page.press(selector, key)
	}

	async takeScreenShot(screenshotName: PageScreenshotOptions | undefined) {
		return await this.page.screenshot(screenshotName)
	}

	async performVisualTest(screenshotName: string | readonly string[]) {
		await expect(this.page).toHaveScreenshot(screenshotName, { fullPage: true });
	}

	// async verifyElementText(selector: string, text: String) {
	// 	const textValue = await this.page.textContent(selector)
	// 	return expect(textValue.trim()).toBe(text)
	// }

	async verifyElementContainsText(selector: string, text: string | RegExp | readonly (string | RegExp)[]) {
		const locatorText = this.page.locator(selector)
		return await expect(locatorText).toContainText(text)
	}

	async verifyJSElementValue(selector: any, text: unknown) {
		const textValue = await this.page.$eval(selector, element => element.value)
		return expect(textValue.trim()).toBe(text)
	}

	async selectValueFromDropdown(selector: string, text: any) {
		const dropdown = this.page.locator(selector)
		return await dropdown.selectOption({ value: text })
	}

	// async verifyElementAttribute(selector: string, attribute: string, value: string) {
	// 	const textValue = await this.page.getAttribute(selector, attribute)
	// 	return expect(textValue.trim()).toBe(value)
	// }

	async getFirstElementFromTheList(selector: string) {
		const rows = this.page.locator(selector)
		const count = await rows.count()
		for (let i = 0; i < count; ++i) {
			const firstItem = await rows.nth(0).textContent()
			return firstItem
		}
	}

	async isElementVisible(selector: string, errorMessage: string) {
		const element = this.page.locator(selector)
		try {
			const isVisible = await element.isVisible()
			expect(isVisible).toBeTruthy()
		} catch (error) {
			throw new Error(`${errorMessage}`)
		}
	}

	async isElementNotVisible(selector: string) {
		const element = this.page.locator(selector)
		return expect(element).toBeHidden
	}

	async isElementEnabled(selector: string, errorMessage: string) {
		const element = this.page.locator(selector)
		try {
			const isEnabled = await element.isEnabled()
			expect(isEnabled).toBeTruthy()
		} catch (error) {
			throw new Error(`${errorMessage}`)
		}
	}

	async isElementChecked(selector: string, errorMessage: string) {
		const element = this.page.locator(selector)
		try {
			const isChecked = await element.isChecked()
			expect(isChecked).toBeTruthy()
		} catch (error) {
			throw new Error(`${errorMessage}`)
		}
	}

	async waitForSelector(selector: string) {
		await this.page.waitForSelector(selector)
	}

	async waitUntilNotVisible(selector: string) {
		const element = await this.page.locator(selector)
		await expect(element).toBeHidden()
	}

	async resp(text: string){
		await this.page.waitForResponse(text)
	}
	async test(text: string){
		const element = await this.page.locator("bb-spp-page-title").getByTestId("title").textContent()
        expect(`${element}`.trim()).toEqual(text)
	}

	async clickCurrentServiceOrders(){
		await this.page.locator(':text("Current service orders")').click();
	}

	async waitUntilSpinnerDiappear() {
		try {
  		  await this.waitForPageLoad()
		  await this.wait(5000)
		  await this.page.waitForSelector('spp-spinner-overlay', { state: 'detached' })
		  let spinnerLoadingIcon = await this.page.locator('spp-spinner-overlay').isVisible()
		  //   console.log(`After: ${spinnerLoadingIcon}`)
     	  await this.wait(5000)         

		   } catch (error) {
				 console.error(error);
		}    
	 }



}
export default Utils