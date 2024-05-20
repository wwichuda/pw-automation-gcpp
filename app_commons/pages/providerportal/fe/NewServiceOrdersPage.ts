import Utils from "../../../utils/Utils";
import ENV from "../../../environments/env";
import { Locator } from "@playwright/test";
import { expect } from "@playwright/test";


class NewServiceOrdersPage extends Utils {
    pageLoadingSpinner: string;
    inputSearch: string;
    acceptButton: string;
    rejectSuccessModal: string;
    textEmptyList: string;
    
   spinnerIcon: string
   spinnerIconLocator: Locator
   pageTitleLocator: Locator
   headerAvatar: string
   headerAvatarLocator: Locator
   searchInputLocator: Locator

    constructor(page: any) {
        super(page);
        this.page = page;
        this.pageLoadingSpinner = '//div[@class="nx-spinner__spin-block"]';
        this.inputSearch = '//input[@trackid="inputSearch"]';
        this.acceptButton = '//button[@trackid="btnSidePaneAccept"]';
        this.rejectSuccessModal = '//h3[contains(text()," Successfully rejected! ")]';
        this.textEmptyList = '[_ngcontent-ng-c370415914]:has-text("Nothing to display at the moment")'; //need to update locator, this one is not working
        this.spinnerIcon = 'spp-spinner-overlay'
        this.spinnerIconLocator = this.page.locator(this.spinnerIcon)
        this.pageTitleLocator = this.page.locator('bb-spp-page-title').getByTestId('title')
        this.headerAvatar =`button[trackid="headerAvatar"]`
        this.headerAvatarLocator = this.page.locator(this.headerAvatar)
        this.searchInputLocator = this.page.getByPlaceholder('Search...')
    }

    async searchNewServiceOrder(serviceOrder: string) {
        this.page.locator(this.pageLoadingSpinner).isHidden;
        await this.clickOn(this.inputSearch);
        await this.enterText(this.inputSearch, serviceOrder);
    }

    async acceptServiceOrder(serviceOrder: string) {
        const selectedServiceOrder = this.page.locator(`//*[contains(text(),'${serviceOrder}')]`);
        await selectedServiceOrder.click();
        this.page.locator(this.pageLoadingSpinner).isHidden;
        await this.clickOn(this.acceptButton);
    }

    async openRightMenuThreeDots() {
        const selectCheckbox = this.page.getByLabel('Toggle row selection');
        await selectCheckbox.locator('span').click();
        await this.page.getByTestId('open-menu').click();
    }

    async clickRejectFromMenu() {
        await this.page.getByRole('menuitem', { name: 'Reject' }).click();
    }

    async selectRejectReason() {
        const openRejectReasonDDL = this.page.getByLabel('Select reason').locator('nx-icon');
        const chooseRejectReason = this.page.locator('div.ellipsis:has-text("Missing Skills")');

        await openRejectReasonDDL.click();
        await chooseRejectReason.click();
    }

    async clickRejectPopup() {
        const rejectButtonPopup = this.page.getByRole('button', { name: 'Reject' });

        await rejectButtonPopup.click();
    }

    async clickCloseButtonSuccessPopup() {
        const closeButtonSuccessPopup = this.page.getByRole('button', { name: 'Close', exact: true });
        await closeButtonSuccessPopup.click();
    }

    async assertRejectSuccess() {
        await expect(this.page.locator(this.rejectSuccessModal)).toBeVisible();
    }

    async assertDesapearedServiceOrder() {
        await expect(this.page.locator(this.textEmptyList)).toBeVisible();    
    }

    async waitForOverviewPageLoad() {
        await this.waitUntilSpinnerDiappear()
  }

   async providerOverviewPageIsDisplayed() {
      await this.waitUntilSpinnerDiappear()
      console.log("---[Provider overview page is displayed]---")
   }

   async search(value: string) {      
      await this.searchInputLocator.click()
      await this.searchInputLocator.fill(value)
   }

   async selectNewetServiceOrderNumber() {      
        this.sortBy('Service order number')
    }

   async sortBy(filedName: string) {      
    await this.page.getByText(filedName).click()
    await this.page.getByText(filedName).click()
    await this.page.locator('tbody tr td').nth(1).click()

    }

   async clickAssignmentNumberToOpenAssignmentDetailsPage(assignmentNumber: string) {      
      await this.page.getByRole('cell', {name: assignmentNumber}).click()
   }

   async verifyPageTitleIsDisplayedWith(pageTitle: string) {
      const pageTitleValue = await this.pageTitleLocator.textContent()
      expect(`${pageTitleValue}`.trim()).toEqual('New Service Orders')     
   }


   async navigateToCurrentServiceOrders(){
      await this.page.getByTitle('Current service orders').isVisible()
      await this.page.getByTitle('Current service orders').click()
   }

   async navigateToProviderSettingPage(){
      await this.page.waitForSelector(this.headerAvatar)
      await this.headerAvatarLocator.click()
   }

}
export default NewServiceOrdersPage;