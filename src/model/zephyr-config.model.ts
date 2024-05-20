
export interface ZephyrConfig {
    mode: ZephyrMode,
    host: string;
    authToken: string;
    projectKey: string;
    projectName: string;
    requirementSource: string;
    productArea: string;
    component: string;
    category: string;
    affectsVersion: string;
    art: string;
    assignedTeam: string;
    sprintId: string;
}

export interface ZephyrMode {
    createCycle: string,
    updateExistingCycle: string
}
