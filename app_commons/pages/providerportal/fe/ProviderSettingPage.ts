import { Locator, Page, expect } from "@playwright/test"
import Utils from "../../../utils/Utils"
class ProviderSettingPage extends Utils {
   // Variable : Header section
   // Variable : Footer
   // Variable : General
   companyName: Locator


   constructor(page: Page) {
      super(page)
      // Constructor : Header section
      // Constructor : Footer
      // Constructor : General
      this.companyName = this.page.locator('.companyName')
   }


   // Function : Header section
   // Function : Footer
   // Function : General


   async providerSeetingPageIsDisplayed() {
      await this.waitUntilSpinnerDiappear()
      console.log("---[Provider setting page is displayed]---")
  }

  async verifyProviderNameIsDisplayedAs(expectedProviderName: string) {
      await this.page.waitForSelector(`:text-is("${expectedProviderName}")`)
      const providerName = await this.companyName.innerText()
      expect(expectedProviderName).toEqual(providerName)
}
};
export default ProviderSettingPage