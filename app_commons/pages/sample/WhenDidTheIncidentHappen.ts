import { Page } from "@playwright/test"
import Utils from "../utils/Utils"
class WhenDidTheIncidentHappen extends Utils {
  dateOfIncident: string
  time: string
  nextButton: string

  constructor(page: Page) {
    super(page)
    this.page=page
    this.dateOfIncident ='input[data-testid="dateInput"]'
    this.time =  '//input[@title="time"] | //input[@name="time"]'
    this.nextButton = 'button[data-testid="retail-next-button"]'
  }


  async enterDateOfIncident() {
    await this.wait(3000)
    const date = require('date-and-time')
    const now = new Date();
    const value = date.format(now, 'DD/MM/YYYY');
    await this.enterText(this.dateOfIncident, value)
  }
  async enterTime(Time: string) {
    await this.enterText(this.time, Time)
  }
  async clickOnNextButton() {

    await this.clickOn(this.nextButton)
  }
};
export default WhenDidTheIncidentHappen