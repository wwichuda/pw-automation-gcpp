// import { test, expect } from "@playwright/test";
// import ENV from "../../../app_commons/environments/env";
// import { 
//     getAuthentication, 
//     getProviderName,
//     getAssignmentListByStatus,
//     getAssignmentClaimDetails,
//     getAssignmentOverview,
//     updateAssignmentStatus,
//     createAssignment,
//     updateMultipleAssignmentsStatus
// } from "../../../app_commons/utils/index"

// // const commonData = JSON.parse(JSON.stringify(require(`../../../testdata/${ENV.DATAPATH || 'test-DEV'}/MPDI-T126434_AssignmentCreation.data.json`)));
// // const template = JSON.parse(JSON.stringify(require(`../../../testdata/${ENV.DATAPATH || 'test-DEV'}/MPDI-T124954_AcceptAssignment.json`)));


// test("[MPDI-T124954] GCPP: [API] Accept multiple assignments", async ({ request }) => {
//     let authentication;
//     let assignmentNumber = commonData.newAssignmentNumber[0];
//     let providerName = "GPP Repairer1";

//     let assignmentListResponse;
        
//     await test.step("1) Call POST /keycloack", async () => {
//         const response = await getAuthentication(request, providerName)
//         const responseBody= JSON.parse(await response.text());
//         authentication = "Bearer "+responseBody.access_token;

//         expect(response.status()).toBe(200);
//         expect(response.ok()).toBeTruthy();
//     });

            
//     await test.step("2) Call GET /provider/name", async () => {
//         const response = await getProviderName(request, authentication)
//         const responseBody= JSON.parse(await response.text());

//         expect(response.status()).toBe(200);
//         expect(response.ok()).toBeTruthy();
//         expect(responseBody.name).toEqual(providerName);
//     });

                
//     test.setTimeout(300000);
//     await test.step("3) Call GET /assignments?statuses=new", async () => {
//         const response = await getAssignmentListByStatus(request, authentication, "new")
//         assignmentListResponse= JSON.parse(await response.text());

//         expect(response.status()).toBe(200);
//         expect(response.ok()).toBeTruthy();
//     });

//     test.setTimeout(300000);
//     await test.step("6) Call POST /assignments/status", async () => {
//         const updateRequestBody = template.request;
//         const response = await updateMultipleAssignmentsStatus(request, authentication, assignmentNumber, assignmentListResponse, updateRequestBody);
//         const responseBody= JSON.parse(await response.text());


//         expect(response.status()).toBe(200);
//         expect(response.ok()).toBeTruthy();
//         expect(responseBody.lockedAssignmentsIdList).toBeNull();
//     });
    
// });

import { expect } from "@playwright/test";
import { test } from "../../../app_commons/fixtures/page.fixture";
import { screenshotOnResults } from "./../../../src/TCscreenshot";

const data = JSON.parse(JSON.stringify(require(`../../../testdata/resources/projectData.json`)));

test("FOR CHECKING ONLY", async ({
    page, providerPortalLoginPage
}) => {
    const username = data.provider.gppRepairer1.email;
    const password = data.provider.gppRepairer1.password;

    await test.step("3) Verify the provider details", async () => {
    console.log("username",username);
    console.log("password",password);
    });


});