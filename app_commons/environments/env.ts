export default class ENV{
    public static BASE_URL = process.env.BASE_URL
    public static ENV_NAME = process.env.ENV_NAME
    public static DATAPATH = process.env.DATA_PATH
    public static COOKIE = process.env.COOKIE

    // ABS
    public static ABS_KEYCLOAK_URL = process.env.ABS_KEYCLOAK_URL
    public static ABS_CISL_URL = process.env.ABS_CISL_URL
    public static ABS_RAP_URL = process.env.ABS_RAP_URL
    public static ABS_AIRWAVE_URL = process.env.ABS_AIRWAVE_URL

    // Provider Portal
    public static PROVIDER_PORTAL_FE_URL = process.env.PROVIDER_PORTAL_FE_URL
    public static PROVIDER_PORTAL_BFF_URL = process.env.PROVIDER_PORTAL_BFF_URL

    // Provider Audit
    public static PROVIDER_AUDIT_FE_URL = process.env.PROVIDER_AUDIT_FE_URL
    public static PROVIDER_AUDIT_BFF_URL = process.env.PROVIDER_AUDIT_BFF_URL
    public static PROVIDER_AUDIT_SERVICE_URL = process.env.PROVIDER_AUDIT_SERVICE_URL
}