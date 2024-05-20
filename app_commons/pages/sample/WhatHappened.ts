import Utils from "../utils/Utils"
class WhatHappened extends Utils {
    whatHappened: string
    howDidItHappen: string
    nextButton: string

    constructor(page) {
        super(page)
        this.whatHappened = '#nx-radio-group-3 nx-radio label'
        this.howDidItHappen = '#nx-radio-group-13 nx-radio label'
        this.nextButton = '//button[@data-testid="retail-next-button"]'
    }
    async selectWhatHappenedRadioButton(provideWhatHappenedOption: string) {
        await this.page.locator(this.whatHappened)
            .locator("span", {
                hasText: provideWhatHappenedOption
            }).click()
    }

    async selectHowDitItHappenRadioButton(provideHowDidItHappenOtion: string) {
        await this.page.locator(this.howDidItHappen)
            .locator("span", {
                hasText: provideHowDidItHappenOtion
            }).click()
    }
    async clickOnNextButton() {
        await this.clickOn(this.nextButton)
    }
};
export default WhatHappened