import type {
    FullConfig,
    FullResult,
    Reporter,
    Suite,
    TestCase,
    TestResult,
    TestStep
} from "@playwright/test/reporter";
import {
    extractedSubstring,
    // convertStatus,
    Helper
    // convertANSIToHTML,
    // postZephyrReport,
    // createReportData,
} from "../src/index";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { bold, green, red } from "picocolors";
import test from "node:test";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Kolkata");
const format = "ddd, MMM D YYYY HH:mm:ss Z";

import { ZephyrConfig } from "../src/model/zephyr-config.model";


class zephyrReporter implements Reporter {
    private helper: Helper;
    constructor(private zephyrConfig: ZephyrConfig) {
        this.helper = new Helper(zephyrConfig);
    }

    itemsBody: any[] = [];
    stepResult: any[] = [];
    ScriptResult: any[] = [];
    testTotal: any

    async onBegin(config: FullConfig, suite: Suite) {
        console.log(`Starting the run with ${suite.allTests().length} tests`);
        this.testTotal = suite.allTests().length
        if (this.zephyrConfig.mode.updateExistingCycle === 'off' && this.zephyrConfig.mode.createCycle == 'off') {
            console.log(
                `\n-------------------------------------------------------------------------------------------------------------------------------\n`,
                "Running test cases... Zephyr reporting is disabled.",
                `\n-------------------------------------------------------------------------------------------------------------------------------\n`
            )
        }else if(this.zephyrConfig.mode.updateExistingCycle === 'on'&& this.zephyrConfig.mode.createCycle == 'off'){
            console.log(
                `\n-------------------------------------------------------------------------------------------------------------------------------\n`,
                "Zephyr execution started in existing test cycle...",
                `\n-------------------------------------------------------------------------------------------------------------------------------\n`
            )
        }else if(this.zephyrConfig.mode.updateExistingCycle === 'off'&& this.zephyrConfig.mode.createCycle == 'on'){
            console.log(
                `\n-------------------------------------------------------------------------------------------------------------------------------\n`,
                "Zephyr execution started with creating new test cycle...",
                `\n-------------------------------------------------------------------------------------------------------------------------------\n`
            )
        }
    }

    async onTestBegin(test: TestCase, result: TestResult) {
        console.log(`Starting test case ${test.title}`);
    }

    // async onStepBegin(test: TestCase, result: TestResult, step: TestStep) {
    //     if (step.category === "test.step")
    //         console.log(
    //             `Starting test step "${step.title}" at ${dayjs().tz().format(format)}`
    //         );
    // }

    // async onStepEnd(test: TestCase, result: TestResult, step: TestStep) {
    //     if (step.category === "test.step")
    //         console.log(
    //             `Finished test step "${step.title}" at ${dayjs().tz().format(format)}`
    //         );
    // }
    async onTestEnd(test: TestCase, result: TestResult) {
        let testTitle = test.title;
        if (result.status.toUpperCase() === 'PASSED') {
            console.log(

                `Test case "${testTitle}" has been "${bold(green(`${result.status.toUpperCase()}`))}" at ${dayjs()
                    .tz()
                    .format(format)}`
            );
        } else {
            console.log(

                `Test case "${testTitle}" has been "${bold(red(`${result.status.toUpperCase()}`))}" at ${dayjs()
                    .tz()
                    .format(format)}`
            );
        }
        const environment = process.env.env_name ? process.env.env_name:'Undefined';
        const steps = result.steps;
        const testCaseKey = extractedSubstring(testTitle);

        if (testCaseKey) {
            // Get src img id from attachement list
            let srcImage =
                result.attachments.length > 0
                    ? result.attachments[0].name
                    : "No image attached";
            // console.log(`Attached src image link : ${srcImage}`);
            // Create the ScriptResult property for current test case
            this.helper.createReportData(
                testCaseKey,
                srcImage,
                steps,
                result,
                testTitle,
                environment,
                this.ScriptResult,
                this.itemsBody
            );
        } else {
            // Log error when test failed
            steps.forEach((step) => {
                if (step.error) {
                    console.log("Error found when executed test case : " + testTitle);
                    // Create step comment section
                    if (step.error.stack) {
                        console.error(`${red(this.helper.convertANSIToHTML(step.error?.stack))}`);
                    }
                    if (step.error.snippet) {
                        console.error(this.helper.convertANSIToHTML(step.error?.snippet));
                    }
                    if (step.error.location) {
                        console.error(step.error?.location);
                    }
                }
            });
        }
        console.log(
            "-------------------------------------------------------------------------------------------------------------------------------"
        );

        // Clear the ScriptResult to be empty for next test case
        this.ScriptResult = [];
    }

    async onEnd(result: FullResult) { //my file method

        if (this.zephyrConfig.mode.createCycle == 'on') {
            // let testTitle = test.title;
            // console.log(
            //     `Test case "${testTitle}" has been "${result.status.toUpperCase()}"`
            // );

            const environment = process.env.dev_name ? process.env.dev_name:'Undefined';
            const duration = (result.duration / 1000).toFixed(2)
            // const testAmount = this.itemsBody.length
            const testAmount = this.testTotal
            const testResult = result.status.toUpperCase()
            console.log(
                `\n----------------------------------------------- ${bold(
                    "Test execution has been finished"
                )} -----------------------------------------------\n`
            );
            console.log(`Test environment : ${bold(environment)}`);
            console.log(
                `Test duration : ${bold(duration)} S`
            );
            if (result.status === "passed")
                console.log(
                    `Test result : "${bold(green(result.status.toUpperCase()))}"`
                );
            else {
                console.log(`Test result : "${bold(red(testResult))}"`);
            }
            console.log("Total test number : ", this.testTotal);
            console.log(
                `\n-------------------------------------------------------------------------------------------------------------------------------\n`
            );


            // Post result to Zephyr
            await this.helper.postZephyrReport(this.itemsBody, environment, duration, testAmount, testResult);
            // Update the existing test cycle
            console.log(
                `\n------------------------------------------------ ${bold(
                    "Updating the existing test cycle"
                )} ------------------------------------------------\n`
            );


        } //if

        if (this.zephyrConfig.mode.updateExistingCycle === 'on') {
            await this.helper.updateTestRun(this.itemsBody)
        }
        
    }

}

export default zephyrReporter;
