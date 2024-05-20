import { APIRequestContext, APIResponse } from "@playwright/test";
import ENV from "../../../environments/env";


// Setup environment variable
const bffUrl = ENV.PROVIDER_PORTAL_BFF_URL;
const cookie = String(ENV.COOKIE);

const defaultHeader = {
    "Content-Type": "application/json",
};

export async function getProviderName(
    request: APIRequestContext,
    authentication: string
) {
    const response = await request.get(`${bffUrl}/provider/name`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `${authentication}`,
            Cookie: cookie,
        }
    });
    return response;
}

export async function getAssignmentListByStatus(
    request: APIRequestContext,
    authentication: string,
    statuses: string
) {
    const response = await request.get(`${bffUrl}/assignments?statuses=${statuses}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `${authentication}`,
            Cookie: cookie,
        }
    });

    console.log(response)

    return response;
}

export async function getAssignmentClaimDetails(
    request: APIRequestContext,
    authentication: string,
    assignmentNumber: string,
    assignmentListResponse: string
) {
    let assignmentId;

    let responseMessage = JSON.parse(JSON.stringify(assignmentListResponse));
    for (let value of responseMessage.assignmentList) {

        if ( value.assignmentNumber === assignmentNumber) {
            assignmentId = value.assignmentId
        }
    }

    const response = await request.get(`${bffUrl}/assignments/${assignmentId}/claimDetails`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `${authentication}`,
            Cookie: cookie,
        }
    });
    return response;
}

export async function getAssignmentOverview(
    request: APIRequestContext,
    authentication: string,
    assignmentNumber: string,
    assignmentListResponse: string
) {
    let assignmentId;

    let responseMessage = JSON.parse(JSON.stringify(assignmentListResponse));
    for (let value of responseMessage.assignmentList) {

        if ( value.assignmentNumber === assignmentNumber) {
            assignmentId = value.assignmentId
        }
    }

    const response = await request.get(`${bffUrl}/assignments/${assignmentId}/overview`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `${authentication}`,
            Cookie: cookie,
        }
    });
    return response;
}

export async function updateAssignmentStatusByAssignmentId(
    request: APIRequestContext,
    authentication: string,
    assignmentId: string
) {
    const response = await request.post(`${bffUrl}/assignments/status`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `${authentication}`,
            Cookie: cookie,
        },
        data: {
            "assignmentsIdList": [
                `${assignmentId}`
            ],
            "status": "ACC",
            "reason": {
                "reason": null,
                "otherReason": null
            }
        },
    });

    console.log(response)
    return response;
}


export async function updateAssignmentStatus(
    request: APIRequestContext,
    authentication: string,
    assignmentNumber: string,
    assignmentListResponse: string,
    updateRequestBody: string
) {
    let assignmentId;

    let responseMessage = JSON.parse(JSON.stringify(assignmentListResponse));
    for (let value of responseMessage.assignmentList) {

        if ( value.assignmentNumber === assignmentNumber) {
            assignmentId = value.assignmentId
        }
    }

    let requestMessage = JSON.parse(JSON.stringify(updateRequestBody));
    requestMessage.assignmentsIdList[0] = assignmentId;

    const response = await request.post(`${bffUrl}/assignments/status`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `${authentication}`,
            Cookie: cookie,
        },
        data: requestMessage,
    });
    return response;
}

export async function updateMultipleAssignmentsStatus(
    request: APIRequestContext,
    authentication: string,
    assignmentNumber: string,
    assignmentListResponse: string,
    updateRequestBody: string
) {
    let responseMessage = JSON.parse(JSON.stringify(assignmentListResponse));
    let requestMessage = JSON.parse(JSON.stringify(updateRequestBody));
    
    requestMessage.assignmentsIdList[0] = responseMessage.assignmentList[0].assignmentId;
    requestMessage.assignmentsIdList[1] = responseMessage.assignmentList[1].assignmentId;
    requestMessage.assignmentsIdList[2] = responseMessage.assignmentList[2].assignmentId;
    requestMessage.assignmentsIdList[3] = responseMessage.assignmentList[3].assignmentId;
    requestMessage.assignmentsIdList[4] = responseMessage.assignmentList[4].assignmentId;

    console.log("requestMessage:",requestMessage);

    const response = await request.post(`${bffUrl}/assignments/status`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `${authentication}`,
            Cookie: cookie,
        },
        data: requestMessage,
    });
    return response;
}

export async function acceptAssignment(
    request: APIRequestContext,
    authentication: string,
    assignmentId:  string,
    webUserId: string
) {

    let response;
    let responseBody;
    // Step 1) POST /keycloack
    // let response = await getAuthentication(request, webUserId)
    // let responseBody= JSON.parse(await response.text())
    // let authentication = "Bearer "+responseBody.access_token
          
    // 2) Call GET /provider/name
    response = await getProviderName(request, authentication)
    responseBody= JSON.parse(await response.text())

    // 3) Call GET /coreassignments/?assignmentType={assignmentType}&assignmentNumber={assignmentNumber}&resolve=relatedClaim
    response = await updateAssignmentStatusByAssignmentId(request, authentication, assignmentId);
    responseBody= JSON.parse(await response.text());
    console.log(responseBody)

    // test.setTimeout(300000);
    // await test.step("3) Call GET /assignments?statuses=new", async () => {
    //     const response = await getAssignmentListByStatus(request, authentication, "new")
    //     assignmentListResponse= JSON.parse(await response.text());

    //     expect(response.status()).toBe(200);
    //     expect(response.ok()).toBeTruthy();
    // });

    // await test.step("4) Call GET /assignments/{assignmentId}/claimDetails", async () => {
    //     const response = await getAssignmentClaimDetails(request, authentication, assignmentNumber, assignmentListResponse);

    //     expect(response.status()).toBe(200);
    //     expect(response.ok()).toBeTruthy();
    // });

    // await test.step("5) Call GET /assignments/{assignmentId}/overview", async () => {
    //     const response = await getAssignmentOverview(request, authentication, assignmentNumber, assignmentListResponse);

    //     expect(response.status()).toBe(200);
    //     expect(response.ok()).toBeTruthy();
    // });

    // await test.step("6) Call POST /assignments/status", async () => {



    //     expect(response.status()).toBe(200);
    //     expect(response.ok()).toBeTruthy();
    //     expect(responseBody.lockedAssignmentsIdList).toBeNull();
    // });

}
