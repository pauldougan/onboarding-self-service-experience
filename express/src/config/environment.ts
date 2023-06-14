export const port = process.env.PORT ?? 3000;
export const awsRegion = process.env.AWS_REGION;
export const googleTagId = process.env.GOOGLE_TAG_ID;
export const showTestBanner = process.env.SHOW_TEST_BANNER === "true";

export const cognito = {
    client: process.env.COGNITO_CLIENT ?? "CognitoClient",
    userPoolId: process.env.COGNITO_USER_POOL_ID,
    clientId: process.env.COGNITO_CLIENT_ID
};

export const api = {
    facade: process.env.LAMBDA_FACADE ?? "LambdaFacade",
    baseUrl: process.env.API_BASE_URL
};

export const sessionStorage = {
    tableName: process.env.SESSIONS_TABLE,
    dynamoDbEndpoint: process.env.DYNAMO_DB_ENDPOINT
};
