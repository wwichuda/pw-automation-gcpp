import { APIRequestContext, APIResponse } from "@playwright/test";
import ENV from "../../../environments/env";
import { getCurrentDateWithFormat } from "../../../utils/common";

const workflowRequest= JSON.parse(JSON.stringify(require(`../api/workflowRequest.json`)));

// Setup environment variable
const keycloakUrl = ENV.ABS_KEYCLOAK_URL;
const absCislUrl = ENV.ABS_CISL_URL;
const cookie = String(ENV.COOKIE);

const defaultHeader = {
    "Content-Type": "application/json",
};

export async function getAuthentication(request: APIRequestContext, username: String) {

    const formData = new URLSearchParams();
    formData.append("client_id", "absadapter");
    formData.append("response_type", "token");
    formData.append("username", `${username}`);
    formData.append("password", "12121212");
    formData.append("grant_type", "password");

    const response = await request.post(`${keycloakUrl}`, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Cookie: cookie,
        },
        data: formData.toString(),
    });

    return response;
}

export async function createClaimNumber(
    request: APIRequestContext,
    authentication: string,
    workflowsId: string,
    claimClassesResponse: string,
    claimClassRequest: string
) {

    let responseMessage = JSON.parse(JSON.stringify(claimClassesResponse));
    let lossTypesMessage = responseMessage;
    let lossCausesMessage = responseMessage;

    let claimClassId = '';
    let lossTypesId = '';
    let lossCausesId = '';

    const claimType = 'KK';
    const lossTypesType = 'MOD All Risk';
    const lossCausesType = 'Any peril';

    
    // const claimType = 'IU';
    // const lossTypesType = 'Bodily injury';
    // const lossCausesType = 'Collision with vehicle';

    for (let value of responseMessage) {

        if ( value.type === claimType) {
            console.log("claimClassType:", value.type);
            console.log("claimClassId:", value.self);
           
            claimClassId = value.self;
            lossTypesMessage = value.lossTypes;
            claimClassId = value.self;
            lossTypesId = value.lossTypes[0].self;
            lossCausesId =  value.lossTypes[0].lossCauses[0].self;
        }
    }

    for (let value of lossTypesMessage) {
        
        if ( value.name === lossTypesType) {        
            console.log("lossTypesName:", value.name);
            console.log("lossTypesId:", value.self);

            lossTypesId = value.self;
            lossCausesMessage = value.lossCauses;
        }
    }

    for (let value of lossCausesMessage) {
        if ( value.name === lossCausesType) {           
            console.log("lossCausesName:", value.name);
            console.log("lossCausesId:", value.self);
            lossCausesId = value.self;
        }
    }

    let requestMessage = JSON.parse(JSON.stringify(claimClassRequest));

    // claimClassRequest.request.contractNumber = contractnumber;
    requestMessage.claimClass = claimClassId;
    requestMessage.lossType = lossTypesId;
    requestMessage.lossCause = lossCausesId;

    const response = await request.post(`${absCislUrl}/claims?workflows=${workflowsId}&claimNumberGeneration=true`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `${authentication}`,
            Cookie: cookie,

        },
        data: requestMessage,
    });
    return response;
}

export async function createClaimWorkflow(
    request: APIRequestContext,
    authentication: string
) {
    const response = await request.post(`${absCislUrl}/workflows`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `${authentication}`,
            Cookie: cookie,
        },
        data: workflowRequest.request,
    });
    return response;
}

export async function publicWorkflow(
    request: APIRequestContext,
    authentication: string,
    workflowId
) {

    let requestBody = workflowRequest.request;
    requestBody.workflowType = "";

    const response = await request.post(`${absCislUrl}/workflows/${workflowId}/publication`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `${authentication}`,
            Cookie: cookie,
        },
        data: requestBody,
    });
    return response;
}

export async function deleteClaimWorkflow(
    request: APIRequestContext,
    authentication: string,
    workflowId: string
) {
    const response = await request.delete(
        `${absCislUrl}/workflows/${workflowId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `${authentication}`,
                Cookie: cookie,
            },
        }
    );
    return response;
}

export async function getclaimclasses(
    request: APIRequestContext,
    authentication: string,
    contractnumber: string
) {
    const response = await request.get(
        `${absCislUrl}/claimclasses?contractNumber=${contractnumber}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `${authentication}`,
                Cookie: cookie,
            },
        }
    );
    return response;
}

export async function getclaimclassesByClaimType(
    request: APIRequestContext,
    authentication: string,
    contractnumber: string
) {
    const response = await request.get(
        `${absCislUrl}/claimclasses?contractNumber=${contractnumber}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `${authentication}`,
                Cookie: cookie,
            },
        }
    );
    return response;
}

export async function getclaimByWorkflowId(
    request: APIRequestContext,
    authentication: string,
    workflowId: string,
    claimNumber: string,
) {
    const response = await request.get(
        `${absCislUrl}/claims?claimNumber=${claimNumber}&workflowId=${workflowId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `${authentication}`,
                Cookie: cookie,
            },
        }
    );
    return response;
}

export async function getclaimsAssignableobjects(
    request: APIRequestContext,
    authentication: string,
    claimResponse: string
) {
    let responseMessage = JSON.parse(JSON.stringify(claimResponse));
    let claimId = responseMessage[0].self;

    const response = await request.get(
        `${absCislUrl}/claims/${claimId}/assignableobjects`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `${authentication}`,
                Cookie: cookie,
            },
        }
    );
    return response;
}

export async function getPartiesAddresses(
    request: APIRequestContext,
    authentication: string,
    workflowId: string,
    claimAssignableobjectsResponse: string
) {

    let responseMessage = JSON.parse(JSON.stringify(claimAssignableobjectsResponse));
    let ownerId = responseMessage[0].assignableObject[0].owners[0];
    let vehicle ="com.cislapi.coreinsurance.core.property.Vehicle";
    let person ="com.cislapi.coreinsurance.core.person.Person";

    const response = await request.get(
        `${absCislUrl}/parties/${ownerId}/addresses?&workflowId=${workflowId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `${authentication}`,
                Cookie: cookie,
            },
        }
    );
    return response;
}

export async function getPropertyDamage(
    request: APIRequestContext,
    authentication: string,
    workflowId: string,
    claimAssignableobjectsResponse: string
) {

    let responseMessage = JSON.parse(JSON.stringify(claimAssignableobjectsResponse));
    let propertyId = responseMessage[0].assignableObject[0].self;

    const response = await request.get(
        `${absCislUrl}/properties/${propertyId}/damages?&workflowId=${workflowId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `${authentication}`,
                Cookie: cookie,
            },
        }
    );
    return response;
}

export async function getDatalistsByAssignmentType(
    request: APIRequestContext,
    authentication: string,
    assignmentType: string
) {
    const response = await request.get(
        `${absCislUrl}/datalists/views/AUFTRAGSART_ZU_GBP_ART/AUFTRAGSART/${assignmentType}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `${authentication}`,
                Cookie: cookie,
            },
        }
    );
    return response;
}

export async function getServiceproviders(
    request: APIRequestContext,
    authentication: string,
    providerName: string,
    countryCode: string,
    providerDatalistResponse: string
) {

    let responseMessage = JSON.parse(JSON.stringify(providerDatalistResponse));
    let providerType = responseMessage.options[0].value;
    
    const response = await request.get(
        `${absCislUrl}/serviceproviders?providerType=${providerType}&countryCode=${countryCode}&name=${providerName}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `${authentication}`,
                Cookie: cookie,
            },
        }
    );
    return response;
}

export async function createCoreassignments(
    request: APIRequestContext,
    authentication: string,
    workflowId: string,
    providerName: string,
    claimAssignableobjectsResponse, 
    propertyDamageResponse,
    serviceProvidersResponse: string,
    coreassignmentsRequestBody: string
) {
    
    const currentDate = getCurrentDateWithFormat('YYYY-MM-DDTHH:mm:ss.000');

    let providerDatalistResponseMessage = JSON.parse(JSON.stringify(serviceProvidersResponse));
    let providerId = "";

    for (let value of providerDatalistResponseMessage) {
        if ( value.providerName === providerName) {           
            providerId = value.self;
        }
    }

    let responseMessage = JSON.parse(JSON.stringify(claimAssignableobjectsResponse));
    let ownerId = responseMessage[0].assignableObject[0].owners[0];

    let damageResponseMessage = JSON.parse(JSON.stringify(propertyDamageResponse));
    let damagesId = damageResponseMessage[0].self;

    let requestBody = JSON.parse(JSON.stringify(coreassignmentsRequestBody));
    requestBody.creationDateTime = currentDate;
    requestBody.desiredReinstateDateTime = currentDate;
    requestBody.serviceProvider = providerId;
    requestBody.customers[0] = ownerId;
    requestBody.damages[0] = damagesId;
    requestBody.assignmentLocation.self = ownerId;

    const response = await request.post(`${absCislUrl}/coreassignments?workflowId=${workflowId}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `${authentication}`,
            Cookie: cookie,
        },
        data: requestBody,
    });
    return response;
}

export async function createAssignment(
    request: APIRequestContext,
    commonData: String
) {
    let assignmentNumber;

    let data = JSON.parse(JSON.stringify(commonData));
    let contractNumber = data.common.contractNumber;
    let claimNumber = data.common.claimNumber;
    let assignmentType = data.common.assignmentType;;
    let providerName = data.common.providerName;
    let countryCode = data.common.countryCode;

    // Step 1) POST /keycloack
    let response = await getAuthentication(request, "TESTALL")
    let responseBody= JSON.parse(await response.text());
    let authentication = "Bearer "+responseBody.access_token;

    // Step 2) POST /workflows
    response = await createClaimWorkflow(request, authentication)
    responseBody= JSON.parse(await response.text());
    let workflowsId = responseBody.self;

    // Step 3) GET /claims?claimNumber by workflowId
    response = await getclaimByWorkflowId(request, authentication, workflowsId, claimNumber)
    let claimResponse= JSON.parse(await response.text());
    
    // Step 4) GET /claims/{claimId}/assignableobjects
    response = await getclaimsAssignableobjects(request, authentication, claimResponse)
    let claimAssignableobjectsResponse= JSON.parse(await response.text());

    // Step 5) GET /parties/{owner}/addresses
    response = await getPartiesAddresses(request, authentication, workflowsId, claimAssignableobjectsResponse)

    // Step 6) GET /properties/{property}/damages
    response = await getPropertyDamage(request, authentication, workflowsId, claimAssignableobjectsResponse)
    let propertyDamageResponse= JSON.parse(await response.text());

    // Step 7) GET /datalists/views/AUFTRAGSART_ZU_GBP_ART/AUFTRAGSART/{assignmentType}
    response = await getDatalistsByAssignmentType(request, authentication, assignmentType)
    let providerDatalistResponse= JSON.parse(await response.text());

    // Step 8) GET /serviceproviders
    response = await getServiceproviders(request, authentication, providerName, countryCode, providerDatalistResponse)
    let serviceProvidersResponse= JSON.parse(await response.text());

    // Step 9) POST /coreassignments
    response = await createCoreassignments(request, authentication, workflowsId, providerName, claimAssignableobjectsResponse, propertyDamageResponse, serviceProvidersResponse, data.requestBody)
    let assignmentsResponseBody= JSON.parse(await response.text());
    assignmentNumber = assignmentsResponseBody.assignmentNumber

    // Step 10) POST /workflows/${workflowId}/publication
    response = await publicWorkflow(request, authentication, workflowsId)

    // Step 11) DELETE /workflows
    response = await deleteClaimWorkflow(request, authentication, workflowsId)

    return assignmentNumber;
}


export async function sampleCall(
    request: APIRequestContext
) {
    let assignmentNumber;
    return assignmentNumber;
}

export async function getAssignmentId(
    request: APIRequestContext,
    assignmentType: string,
    assignmentNumber: string
) {

    // Step 1) POST /keycloack
    let response = await getAuthentication(request, "TESTALL")
    let responseBody= JSON.parse(await response.text());
    let authentication = "Bearer "+responseBody.access_token;

    // Step 1) POST /keycloack
    response = await getCoreassignmentsDetails(request, authentication, assignmentType, assignmentNumber);
    responseBody= JSON.parse(await response.text());
    let assignmentId = responseBody[0].self;
    
    return assignmentId;
}

export async function getCoreassignmentsDetails(
    request: APIRequestContext,
    authentication: string,
    assignmentType: string,
    assignmentNumber: string
) {
    // Step 1) POST /keycloack
    const response = await request.get(
        `${absCislUrl}/coreassignments/?assignmentType=${assignmentType}&assignmentNumber=${assignmentNumber}&resolve=relatedClaim`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `${authentication}`,
                Cookie: cookie,
            },
        }
    );
    return response;
}