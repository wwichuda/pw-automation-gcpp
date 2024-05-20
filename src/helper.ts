import { extractedSubstring, getCurrentDate, getCurrentDateWithFormat, getCurrentTimeWithFormat } from "../src/index";
import https from 'https';
import axios from "axios";
import FormData from 'form-data'
import fs from 'fs'
import globalConfig from "../playwright.config"
import { bold, green, red } from "picocolors";
import { TestResult } from "@playwright/test/reporter";
import ENV from "./env";
//Define Jira config
const host = globalConfig.host
const authToken = globalConfig.authToken
const projectKey = globalConfig.projectKey
const webhookURL = globalConfig.webHookURL


export class Helper {
    static sendAttachedFile(filePath: string, fileName: string, testKey: string) {
        throw new Error('Method not implemented.');
    }
    jmpHost: string;
    authToken: string;
    userKey:string;
    constructor(private jiraConfig) {

        this.jmpHost = this.jiraConfig.host;
        this.authToken = this.jiraConfig.authToken;
        this.userKey=this.jiraConfig.userKey;
    }
    convertStatus(status: string): string {
        if (status === 'passed') return 'Pass';
        return 'Fail'
    }
    convertANSIToHTML(text?: string) {
        if (!text) return '';
        const ansiRegex = new RegExp(
            // eslint-disable-next-line no-control-regex
            '([\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)|(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~])))',
            'g'
        );
        return text.replace(ansiRegex, '');
    }
    //new

    getAuthorizedRequestHeader() {
        return {
            Authorization: "Bearer " + this.jiraConfig.authToken,
            "Content-Type": "application/json",
            Origin: this.jiraConfig.host,
        };
    }
    async updateTestRun(itemsBody: any) {
        const testRunKey = this.jiraConfig.existingTestCycleKey
        const testCaseKeys: string[] = itemsBody.map(item => item.testCaseKey);
        const itemsWithoutTestCaseKey = itemsBody.map(({ testCaseKey, ...rest }) => rest);
        console.log(`${bold(green(`✅ Existing Test cycle ${testRunKey} has been updated`))}`);

        console.log(`${bold(green('👇List of test cases executed are :'))}\n   ${bold(green(`${testCaseKeys.join(' | ')}`))} `)
        for (let [index, item] of itemsWithoutTestCaseKey.entries()) {
            try {
                let endpoint = `${this.jiraConfig.host}/rest/atm/1.0/testrun/${testRunKey}/testcase/${testCaseKeys[index]}/testresult`
                const agent = new https.Agent({
                    rejectUnauthorized: false,
                });
                await axios.post(
                    endpoint,
                    item,
                    {
                        headers: this.getAuthorizedRequestHeader(),
                        httpsAgent: agent
                    }
                );
                console.log(`${bold(green('✅ Successfully added/updated test case result :'))} ${bold(green(`${testCaseKeys[index]}`))} `)
            } catch (error) {
                console.log(`${bold(red(' Failed to update test result for testcase :'))} ${bold(red(`${testCaseKeys[index]}`))} `)
                console.log(error)
            }
        }
        console.log(
            `${bold( green( `👇 Check out the test result:\n🔗 https://jmp.allianz.net/secure/Tests.jspa#/testPlayer/${testRunKey}` ) )}`);
    }
    //new
    async sendAttachedFile(filePath: string, fileName: string, testKey: string) {
        console.log('Starting upload attachment...')

        // Create a form data object
        const formData = new FormData();
        const fileStream = fs.createReadStream(filePath);
        formData.append('file', fileStream, { filename: fileName });
        console.log('Read file successfull...')

        const headers = {
            ...formData.getHeaders(),
            Authorization: "Bearer " + authToken,
            "Content-Type": "multipart/form-data",
        }

        const agent = new https.Agent({
            rejectUnauthorized: false
        });

        try {
            console.log('Starting call attachment api')
            // Upload the attachment to Jira test case
            const response = await axios.post(
                `${host}/rest/tests/1.0/attachment/embeddedimage`,
                formData,
                { headers, httpsAgent: agent }
            );
            console.log('finished call attachment api')
            console.log(await response.data)
            try {
                const {
                    data: { link },
                } = response;
                console.log(`Attachment uploaded successfully! and link is : ${await link}`);
                return await link

            } catch (e) {
                console.error('Failed to upload attachment:', e.response);
            }
        } catch (error) {
            console.error('Error uploading attachment:', error.response);
        }
    }



    async postZephyrReport(itemsBody: any, environment: string, duration: string, testAmount: number, testResult: string) {
        let tcLink = ''

        // Test result is exist
        if (itemsBody.length > 0) {
            const reportData = {
                projectKey: projectKey,
                name: `[VERTICAL ASSETS] Automation Test Cycle : ${getCurrentDateWithFormat("ddd, D MMM YYYY - HH:mm:ss")}`,
                status: "Done",
                folder: "/ITMP/AUTOMATION",
             //   executedBy:this.userKey,
                items: itemsBody,
            };
            const headers = {
                Authorization: "Bearer " + authToken,
                "Content-Type": "application/json",
                Origin: host,
            };

            try {
                const agent = new https.Agent({
                    rejectUnauthorized: false,
                });
                const response = await axios.post(
                    host + "/rest/atm/1.0/testrun/",
                    reportData,
                    { headers, httpsAgent: agent }
                );
                const {
                    data: { key },
                } = response;
                tcLink = `${host}/secure/Tests.jspa#/testPlayer/${key}`
                console.log(`${bold(green(`✅ Test cycle ${key} has been created`))}`);
                console.log(
                    `${bold(
                        green(
                            `👇 Check out the test result:\n🔗 ${tcLink}`
                        )
                    )}`
                );

            } catch (error) {
                console.error("Error posting to Zephyr API:", error.response);
            }
        } else {
            console.warn('There is no test result to generate the Zephyr Test Cycle report')
        }
    }

    async createReportData(testCaseKey: any, srcImage: string, steps: any, result: TestResult, testTitle: string, environment: string, ScriptResult: any, itemsBody: any) {
        let i = 0;
        // Create the ScriptResult property
        steps.forEach((step) => {
            if (step.category === "test.step") {
                if (step.error) {
                    // Create step comment section
                    console.log('Error found when executed test case : ' + testTitle)
                    let stepComment = '<h3>Message</h3>';
                    if (step.error.stack) {
                        stepComment += '<h3>Stack</h3>';
                        stepComment += `<pre>${this.convertANSIToHTML(step.error?.stack)}</pre>`;
                        console.error(`${(red(this.convertANSIToHTML(step.error?.stack)))}`)
                    }
                    if (step.error.snippet) {
                        stepComment += '<h3>Snippet</h3>';
                        stepComment += `<pre>${this.convertANSIToHTML(step.error?.snippet)}</pre>`;
                        console.error(this.convertANSIToHTML(step.error?.snippet))
                    }
                    if (step.error.location) {
                        stepComment += '<h3>Location</h3>';
                        stepComment += `<pre>${Object.values(step.error.location).join(',')}</pre>`;
                        console.error(step.error?.location)
                    }
                    stepComment += '<h3>Screenshot</h3>';
                    stepComment += `<pre><img src="${srcImage}" style="margin:10px;max-width:300px;border:1px solid grey;padding:5px;" class="fr-fic fr-fil fr-dib"></pre>`;
                    console.log('-------------------------------------------------------------------------------------------------------------------------------')
                    // List of ScriptResult
                    ScriptResult.push({
                        index: i,
                        status: "Fail",
                        comment: stepComment,
                    });

                } else {
                    // List of ScriptResult
                    ScriptResult.push({
                        index: i,
                        status: "Pass",
                        comment: `"${step.title}" is Pass`,
                    });
                }
                i += 1;
            }
        });

        // Create test comment section
        let testStatus = this.convertStatus(result.status)
        let testComment = '<h3>Test case name</h3>';
        testComment += `<pre>${testTitle}</pre>`;
        testComment += '<h3>Status</h3>';
        testComment += `<pre>${testStatus}</pre>`;
        testComment += '<h3>Screenshot</h3>';
        testComment += `<pre><img src="${srcImage}" style="margin:10px;max-width:300px;border:1px solid grey;padding:5px;" class="fr-fic fr-fil fr-dib"></pre>`;

        // Create the items property
        itemsBody.push({
            testCaseKey: testCaseKey,
            environment: environment,
            status: testStatus,
            comment: testComment,
            scriptResults: ScriptResult,
            executionTime: result.duration,
            executedBy:this.userKey
        });

    }
}
