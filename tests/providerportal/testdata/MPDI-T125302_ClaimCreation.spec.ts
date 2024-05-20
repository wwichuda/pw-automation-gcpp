import { test, expect } from "@playwright/test";
import ENV from "../../../app_commons/environments/env";
import { 
    createClaimWorkflow, 
    deleteClaimWorkflow, 
    getAuthentication, 
    getclaimclassesByClaimType, 
    createClaimNumber
} from "../../../app_commons/utils/index";
// import { createClaimWorkflow, deleteClaimWorkflow, getAuthentication, getclaimclassesByClaimType, createClaimNumber } from "../../../app_commons/utils/index"

const data = JSON.parse(JSON.stringify(require(`../../../testdata/${ENV.DATAPATH || 'test-DEV'}/providerportal/testdata/MPDI-T125302_ClaimCreation.data.json`)));

test("[MPDI-T125302] GCPP: [Testdata][API] Claim creation via BE collection", async ({ request }) => {
    let authentication = "";
    let workflowsId = "";

    let claimclassesResponse = "";
    let contractnumber = "CD8000837507"
    // let contractnumber = "CD8000806514"
    
    await test.step("1) Call POST /keycloack", async () => {
        const response = await getAuthentication(request, "TESTALL")

        const responseBody= JSON.parse(await response.text());
        authentication = "Bearer "+responseBody.access_token;

        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();
        // console.log("Response status:", response.status());
        // console.log("authorization:", authentication );
    });


    await test.step("2) GET /claimclasses by contractNumber", async () => {
        const response = await getclaimclassesByClaimType(request, authentication, contractnumber)
        
        claimclassesResponse =  JSON.parse(await response.text());

        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();
    });

    
    await test.step("3) POST /workflows", async () => {
        const response = await createClaimWorkflow(request, authentication)

        const responseBody= JSON.parse(await response.text());
        workflowsId = responseBody.self;

        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();

    });

    await test.step("4) POST /claim", async () => {
        const claimClassRequest = data.requestBody;
        const response = await createClaimNumber(request, authentication, workflowsId, claimclassesResponse, claimClassRequest)
        const responseBody= JSON.parse(await response.text());

        // expect(response.status()).toBe(200);
        // expect(response.ok()).toBeTruthy();
    });

    // await test.step("5) POST /lostEventLocation", async () => {
    // });
    
    // await test.step("6) POST /processtransition to claimhandling", async () => {
    // });

    // await test.step("7) GET /claims id", async () => {
    // });

    // await test.step("8) GET /question id", async () => {
    // });

    // await test.step("9) PUT /question id", async () => {
    // });

    // await test.step("10) GET /involvedProperty", async () => {
    // });

    // await test.step("11) GET /damageTypes", async () => {
    // });
    
    // await test.step("12) GET /damageParts", async () => {
    // });

    // await test.step("13) GET /serviceProvider", async () => {
    // });

    // await test.step("14) GET /involvedProperty and damage", async () => {
    // });

    // await test.step("15) POST /damage and damage", async () => {
    // });

    // await test.step("16) POST /public", async () => {
    // });


    await test.step("17) DELETE /workflows", async () => {
        const response = await deleteClaimWorkflow(request, authentication, workflowsId)

        expect(response.status()).toBe(204);
        expect(response.ok()).toBeTruthy();
    });
});