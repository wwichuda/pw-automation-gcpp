
import { Page } from "@playwright/test"
import Utils from "../utils/Utils"
class WhereDidTheIncidentHappen extends Utils {
  nextButton: string

  constructor(page: Page) {
    super(page)
    this.nextButton = '//button[@data-testid="retail-next-button"]'
  }

  async clickOnNextButton() {
    await this.wait(3000)
    await this.clickOn(this.nextButton)
  }
};
export default WhereDidTheIncidentHappen 
