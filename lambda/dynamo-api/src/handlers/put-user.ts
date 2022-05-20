import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import DynamoClient from "../client/DynamoClient";

const tableName = process.env.SAMPLE_TABLE;
const client = new DynamoClient(tableName as string);

export const putUserHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }

    const user = JSON.parse(event.body as string);
    console.log(user);

    // Do whatever validation we want to do on the user

    let response = {statusCode: 200, body: JSON.stringify("OK")};
    await client
        .put(user)
        .then((putItemOutput) => {
            response.statusCode = 200;
            response.body = JSON.stringify(putItemOutput)
        })
        .catch((putItemOutput) => { response.statusCode = 500; response.body = JSON.stringify(putItemOutput)});

    return response;
};