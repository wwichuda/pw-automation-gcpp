import { Page } from "@playwright/test"
import Utils from "../utils/Utils"
class WhichObjectWasAffected extends Utils {
  RNMTPHousehold: string
  nextButton: string

  constructor(page: Page) {
    super(page)
    this.RNMTPHousehold = '#nx-radio-2-label div'
    this.nextButton = '//button[@data-testid="retail-next-button"]'
  }
  async selectRNMTPHouseholdCeheckBox() {
    await this.clickOn(this.RNMTPHousehold)
  }
  async clickOnNextButton() {
    await this.clickOn(this.nextButton)
  }
};
export default WhichObjectWasAffected 