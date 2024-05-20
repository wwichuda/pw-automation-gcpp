import { Page } from "@playwright/test"
import Utils from "../utils/Utils"
class IncidentInformationHasBeenSavedSuccessfully extends Utils {
  incidentInformationId: string

  constructor(page: Page) {
    super(page)
    this.page = page
    this.incidentInformationId = "//div[@class='nx-message__content']/span[contains(text(),'Incident information Id')]/following-sibling::span"

  }

  async getIncidentInformationIdText() {
    await this.wait(2000)
   // await this.verifyElementText(this.incidentInformationId)
    //  await this.page.locator(this.incidentInformationId).getText()
  }
};
export default IncidentInformationHasBeenSavedSuccessfully