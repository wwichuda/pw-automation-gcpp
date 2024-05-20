import { Page, expect } from "@playwright/test"
import Utils from "../utils/Utils"
class ClaimsIncidentInformationTestPage extends Utils {
   partyId: string
   incidentd: string
   nextButton: string

   constructor(page: Page) {
      super(page)
      this.page = page
      this.partyId = '#nx-input-0'
      this.incidentd = '#nx-input-1'
      this.nextButton = '//button[@data-testid="retail-next-button"]'
   }

   async gotoIncidentInformationUrl(url: string) {
      await this.navigateTo(url)
   }

   async enterPartyId(PartyId: string) {
      await this.enterText(this.partyId, PartyId)
   }
   async enterIncidentId(IncidentId: string) {
      await this.enterText(this.incidentd, IncidentId)
   }
   async clickOnNextButton() {
      // await elementHandle.scrollIntoViewIfNeeded();
      await this.clickOn(this.nextButton)
   }
   async verifyIncidentPageTitle()
   {
      await expect(this.page).toHaveTitle('Claims Incident Information Retail - Customer details')
    
   }
   async verifyIncidentPageTitleF()
   {
      await expect(this.page).toHaveTitle('Claims Incident Information Retail -  details')
    
   }
};
export default ClaimsIncidentInformationTestPage