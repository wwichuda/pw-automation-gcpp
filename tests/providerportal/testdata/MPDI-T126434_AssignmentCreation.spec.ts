// import { test, expect } from "@playwright/test";
import { test } from "../../../app_commons/fixtures/page.fixture";
import { expect } from "@playwright/test";

import ENV from "../../../app_commons/environments/env";
import { 
        createClaimWorkflow, 
    deleteClaimWorkflow, 
    getAuthentication, 
    getclaimByWorkflowId, 
    getclaimsAssignableobjects, 
    getPartiesAddresses, 
    getPropertyDamage,
    getDatalistsByAssignmentType,
    getServiceproviders,
    createCoreassignments,
    publicWorkflow
} from "../../../app_commons/utils/index";

const data = JSON.parse(JSON.stringify(require(`../../../testdata/${ENV.DATAPATH || 'test-DEV'}/providerportal/testdata/MPDI-T126434_AssignmentCreation.data.json`)));
const commonData = JSON.parse(JSON.stringify(require(`../../../testdata/resources/projectData.json`)));

test("[MPDI-T126434] GCPP: [Testdata][API] Assignment creation via BE collection", async ({ request }) => {

    let authentication = "";
    let workflowsId = "";

    let contractNumber = data.common.contractNumber;
    let claimNumber = data.common.claimNumber;
    let assignmentNumber = "";
    let assignmentType = data.common.assignmentType;;
    // let providerName = data.common.providerName;
    let providerName = commonData.provider.gcppGPPRepairer1.providerName;

    let countryCode = data.common.countryCode;
    let claimResponse = "";
    let claimAssignableobjectsResponse = "";
    let propertyDamageResponse = "";
    let providerDatalistResponse = "";
    let serviceProvidersResponse = "";

    await test.step("1) POST /keycloack", async () => {
        const response = await getAuthentication(request, "")

        const responseBody= JSON.parse(await response.text());
        authentication = "Bearer "+responseBody.access_token;

        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();
    });
    
    await test.step("2) POST /workflows", async () => {
        const response = await createClaimWorkflow(request, authentication)

        const responseBody= JSON.parse(await response.text());
        workflowsId = responseBody.self;

        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();

    });

    await test.step("3) GET /claims?claimNumber by workflowId", async () => {
        const response = await getclaimByWorkflowId(request, authentication, workflowsId, claimNumber)
        claimResponse= JSON.parse(await response.text());

        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();
    });

    
    await test.step("4) GET /claims/{claimId}/assignableobjects", async () => {
        const response = await getclaimsAssignableobjects(request, authentication, claimResponse)
        claimAssignableobjectsResponse= JSON.parse(await response.text());

        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();
    });

    await test.step("5) GET /parties/{owner}/addresses", async () => {
        const response = await getPartiesAddresses(request, authentication, workflowsId, claimAssignableobjectsResponse)
        const responseBody= JSON.parse(await response.text());

        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();
    });

    await test.step("6) GET /properties/{property}/damages", async () => {
        const response = await getPropertyDamage(request, authentication, workflowsId, claimAssignableobjectsResponse)
        propertyDamageResponse= JSON.parse(await response.text());

        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();
    });


    await test.step("7) GET /datalists/views/AUFTRAGSART_ZU_GBP_ART/AUFTRAGSART/{assignmentType}", async () => {
        const response = await getDatalistsByAssignmentType(request, authentication, assignmentType)
        providerDatalistResponse= JSON.parse(await response.text());

        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();
    });

    await test.step("8) GET /serviceproviders", async () => {
        const response = await getServiceproviders(request, authentication, providerName, countryCode, providerDatalistResponse)
        serviceProvidersResponse= JSON.parse(await response.text());

        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();
    });

    await test.step("9) POST /coreassignments", async () => {
        const response = await createCoreassignments(request, authentication, workflowsId, providerName, claimAssignableobjectsResponse, propertyDamageResponse, serviceProvidersResponse, data.requestBody)
        const responseBody= JSON.parse(await response.text());

        assignmentNumber = responseBody.assignmentNumber
        console.log("assignmentNumber:", assignmentNumber);

        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();
    });


    await test.step("10) POST /workflows/${workflowId}/publication", async () => {
        const response = await publicWorkflow(request, authentication, workflowsId)
        const responseBody= JSON.parse(await response.text());

        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();
    });

    await test.step("11) DELETE /workflows", async () => {
        const response = await deleteClaimWorkflow(request, authentication, workflowsId)

        expect(response.status()).toBe(204);
        expect(response.ok()).toBeTruthy();
    });
});

