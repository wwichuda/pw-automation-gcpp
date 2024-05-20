import { test, expect } from "@playwright/test";
import ENV from "../../../app_commons/environments/env";
import { 
    getAuthentication, 
    createAssignment,
    acceptAssignment,
    getAssignmentId
} from "../../../app_commons/utils/index"

const assignmentData = JSON.parse(JSON.stringify(require(`../../../testdata/${ENV.DATAPATH || 'test-DEV'}/providerportal/testdata/MPDI-T126434_AssignmentCreation.data.json`)));
const commonData = JSON.parse(JSON.stringify(require(`../../../testdata/resources/projectData.json`)));

test("[MPDI-T124954] GCPP: [API] Accept an assignment", async ({ request }) => {

    let assignmentNumber;
    let assignmentId;
    let providerId = commonData.provider.gcppGPPRepairer2.webuserID;
      
    await test.step("0) Create an assignment", async () => {
        assignmentNumber = await createAssignment(request, assignmentData)
        console.log("0) Create an assignment - assignmentNumber:", assignmentNumber);

        let response = await getAuthentication(request, 'TESTALL')
        let responseBody= JSON.parse(await response.text());
        let authentication = "Bearer "+responseBody.access_token
        
        response = await getAssignmentId(request,authentication,'KA',assignmentNumber)
        responseBody= JSON.parse(await response.text());

        assignmentId = responseBody[0].self
        console.log("0) Create an assignment - assignmentId:", assignmentId)

    });

    await test.step("1) Accept an assignment", async () => {
        let response = await getAuthentication(request, providerId)
        let responseBody= JSON.parse(await response.text());
        let authentication = "Bearer "+responseBody.access_token;
        const test =  await acceptAssignment(request, authentication, assignmentId, providerId)
    });
    
});