import { Page } from "@playwright/test"
import Utils from "../utils/Utils"
class LetsReviewYourIncidentAndStartYourClaim extends Utils {
  first: string
  second: string
  third: string
  fourth: string
  nextButton: string

  constructor(page: Page) {
    super(page)
    this.first = '#nx-checkbox-1-label span'
    this.second = '#nx-checkbox-2-label span'
    this.third = '#nx-checkbox-3-label span'
    this.fourth = '#nx-checkbox-4-label span'
    this.nextButton = '//button[@data-testid="retail-next-button"]'
  }
  async selectFirstTermsAndConditionCheckBox() {
    await this.wait(1000)
    await this.clickOn(this.first)
  }

  async selectSecondTermsAndConditionCheckBox() {
    await this.wait(1000)
    await this.clickOn(this.second)
  }
  async selectFirstCommunicationCheckBox() {
    await this.wait(1000)
    await this.clickOn(this.third)
  }

  async selectSecondCommunicationCheckBox() {
    await this.wait(1000)
    await this.clickOn(this.fourth)
  }


  async clickOnNextButton() {
    await this.wait(1000)
    await this.clickOn(this.nextButton)
  }
};
export default LetsReviewYourIncidentAndStartYourClaim