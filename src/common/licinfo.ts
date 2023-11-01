export enum LicType {
    Developer = "developer",
    Evaluation = "evaluation",
    Limited = "limited",
    Enterprise = "enterprise"
    // Developer = 'dev',
    // Evaluation = 'evl',
    // Limited = 'lim',
    // Enterprise = 'ent'
}

export interface TouchLicInfo {
    name: string;
    version: string;
    license: string;
    code: string;
}

export const prodInfo: TouchLicInfo = {
    name: 'RealChart',
    version: '$ProductVersion',
    license: '$LicenseType',
    code: ''
}