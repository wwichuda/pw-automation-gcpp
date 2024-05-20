// import { extractedSubstring, getCurrentDate, getCurrentDateWithFormat, getCurrentTimeWithFormat } from "../src/index";
import { Page, TestInfo } from '@playwright/test';
import { extractedSubstring } from '../src/index';
import {Helper } from '../src/helper'
import { jiraConfig } from '../jiraSetup.config';

// export class ss {
// sendAttachedFile: any;
export async function screenshotOnResults({ page }: { page: Page }, testInfo: TestInfo) {
    // Define name and path
    let helper = new Helper(jiraConfig)
    const fileName = `${testInfo.title}.png`
    const filePath = `./screenshot/${fileName}`;
    const testKey = extractedSubstring(testInfo.title)

    // Take the screenshot on result
    await page.screenshot({ path: filePath, fullPage: true });
    if (testKey) {
        let attachedId = await helper.sendAttachedFile(filePath, fileName, testKey)
      
        // Add attachment with upload id  to the report.
        if (attachedId) testInfo.attachments.push({ name: String(attachedId), path: filePath, contentType: 'image/png' });
    }
}
// }
export default screenshotOnResults