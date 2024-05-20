import Utils from "../../../utils/Utils";
import ENV from "../../../environments/env";
import { Locator } from "@playwright/test";
import { expect } from "@playwright/test";

class ServiceOrderDetailsPage extends Utils {
    backButton: string;
    partiallyCompleteButton: string;
    partiallyCompleteReasonDropdown: string;
    partiallyCompleteConfirmButton: string;
    partiallyCompleteSuccessModal: string;
    
    rejectButton: Locator
    acceptButton: Locator

    constructor(page: any) {
        super(page);
        this.page = page;
        this.backButton = '//button[@trackid="go-back"]';
        this.partiallyCompleteButton = '//button[@trackid="btnCompleteAssignment"]';
        this.partiallyCompleteReasonDropdown = '//nx-dropdown[@formcontrolname="partiallyCompleteReason"]';
        this.partiallyCompleteConfirmButton = '//button[@trackid="confirmPartiallyCompleteBtn"]';
        this.partiallyCompleteSuccessModal = '//h3[contains(text()," Successfully completed! ")]';
        this.rejectButton = this.page.getByTestId('sidePaneRejectButton')
        this.acceptButton = this.page.getByTestId('sidePaneAcceptButton')  
    }

    async goBackToNewServiceOrders() {
        await this.clickOn(this.backButton);
    }

    async partiallyCompleteOrder(partiallyCompletionReason: string) {
        await this.clickOn(this.partiallyCompleteButton);
        await this.clickOn(this.partiallyCompleteReasonDropdown);
        const completionReason = this.page.locator(`//div[contains(text(),'${partiallyCompletionReason}')]`);
        await this.page.waitForTimeout(2000);
        await completionReason.click();
        await this.page.waitForTimeout(2000);
        await this.clickOn(this.partiallyCompleteConfirmButton);

    }

    async assertPartiallyCompleteSuccess() {
        await expect(this.page.locator(this.partiallyCompleteSuccessModal)).toBeVisible();
    }

    async providerDetailsPageIsDisplayed() {
        await this.waitUntilSpinnerDiappear()
        console.log("---[Provider details page is displayed]---")
     }
  
     async navigateToInvolvedPartiesTab() {   
      const involvedPartiesTab = await this.page.getByText('Involved Parties') 
      involvedPartiesTab.click()  
      await this.wait(5000)
   }

     async clickToOpenOptionsMenu() {      
        await this.wait(5000)
        await this.page.getByTestId('open-menu').click()
     }
  
     async clickOnSuspendOption() {      
        await this.page.getByRole('menuitem', { name: 'Suspend'}).click()
     }
  
     async chooseReason(reason: string) {      
        await this.page.getByRole('combobox', { name: 'Choose option'}).click()
        await this.page.getByRole('option', { name: reason}).click()
     }
  
     async enterDescription(desc: string) {      
        await this.page.getByLabel('Please explain').fill(desc)
     }
  
     async clickConfirmButton() {      
        await this.page.getByRole('button', { name: 'Confirm'}).click()
     }
  
     async closeSuccessPopup() {      
        await this.page.locator('nx-modal-container').getByRole('button', { name: 'Close' , exact: true}).click()   
     }
  
     async verifyPopupIsDisplayedWithMessage(message: string){
        const popupIsVisible = await this.page.getByText(message).isVisible()
          expect(popupIsVisible).toBeTruthy()
     }
  
     async verifyConfirmSuccessWithMessage(message: string){
        await this.page.waitForSelector(':text-is("'+message+'")')
        const suspendSuccessfullyMessage = await this.page.getByRole('heading', { name: message}).isVisible()
     }
  
     async assertStatusBadgeIsVisible(status: string){
        const statusBadge = await this.page.locator('#status-badge.nx-badge--active')
        expect(statusBadge.isVisible()).toBeTruthy()
  
        const expectValue = await statusBadge.textContent()
        expect(expectValue).toEqual(status)
     }
  
     async assertDueDateBadgeIsVisible(){
        const statusBadge = await this.page.locator('#due-date-badge.nx-badge--active')
        expect(statusBadge.isVisible()).toBeTruthy()
  
        const expectValue = await statusBadge.textContent()
        expect(expectValue).toContain('Due date:')
     }
  
  
     async assertServiceOrderNumberIsVisible(serviceOrderNumber: string){
        const serviceOrderNumberHeader = await this.page.getByRole('heading', { name: serviceOrderNumber}).isVisible()
        expect(serviceOrderNumberHeader).toBeTruthy()
     }
  
     async assertRejectButtonIsVisible(){
        expect(this.rejectButton.isVisible()).toBeTruthy()
     }
  
     async assertAcceptButtonIsVisible(){
        expect(this.acceptButton.isVisible()).toBeTruthy()
     }
  
     async assertSectionIsVisible(sectionName: string){
        const section = await this.page.getByRole('heading', { name: sectionName}).isVisible()
        expect(section).toBeTruthy()
     }
  
     async assertFlatFrogContainerIsVisible(){
        const flatfrog = await this.page.getByRole('img', { name: 'flatfrog container'}).isVisible()
        expect(flatfrog).toBeTruthy()
     }
  
     async assertFieldIsVisible(fieldName: string){
        const field = await this.page.locator('p').filter({ hasText: fieldName}).isVisible()
        expect(field).toBeTruthy()
     }

     async assertFieldsAreVisibleForSection(sectionName: string, fields: string[]){
         await this.page.getByRole('heading', { name: sectionName}).isVisible()

         let locator = ''
         switch(sectionName){
            case 'Claim Handler':
               locator = '.claimHandlerTeam'
               break;
            case 'Policy Holder':
               locator = '.policyHolder'
               break;
            case 'Owner':
               locator = '.owner'
               break;
            case 'Loss adjuster':
               locator = '.lossAdjuster'
               break;                              
         }

         const section = this.page.locator(locator)

         for(const field of fields){
            const fieldLocator = await section.getByText(field+":", {exact: true}).isVisible()
            expect(fieldLocator).toBeTruthy()
        }
      }

     async assertFieldAndValueIsVisible(fieldName: string, value: string){
        const fieldValue = await this.page.getByText(fieldName+' '+value)
        expect(fieldValue.isVisible()).toBeTruthy()
     }

}
export default ServiceOrderDetailsPage;