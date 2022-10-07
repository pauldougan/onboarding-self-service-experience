import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
import DynamoClient from "../client/DynamoClient";

const client = new DynamoClient();

export const putServiceUserHandler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const payload = event?.body ? JSON.parse(event.body as string) : event;
    const record = {
        pk: payload.service.id,
        sk: `user#${payload.userDynamoId}`,
        data: payload.userEmail,
        role: "admin",
        service_name: payload.service.serviceName
    };
    let response = {statusCode: 200, body: JSON.stringify(record)};
    await client
        .put(record)
        .catch((putItemOutput) => {
            response.statusCode = 500;
            response.body = JSON.stringify(putItemOutput)
        });

    return response;
};
