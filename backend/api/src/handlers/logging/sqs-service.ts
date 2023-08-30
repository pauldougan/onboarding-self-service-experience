import {APIGatewayProxyEvent} from "aws-lambda";
import {SendMessageCommand, SQSClient} from "@aws-sdk/client-sqs";
import * as process from "process";

const client = new SQSClient({region: "eu-west-2"});

export const sendSQSMessageToTxMAHandler = async (event: APIGatewayProxyEvent): Promise<any> => {
    let payload: any;

    if (event.body != null) {
        payload = JSON.parse(event.body);
    }
    let response;
    const queueUrl = process.env.QUEUEURL;
    console.log(queueUrl);
    const messageParams = {
        MessageBody: JSON.stringify(payload),
        QueueUrl: queueUrl,
    };

    try {
        const data = await client.send(new SendMessageCommand(messageParams));
        if (data) {
            console.log(JSON.stringify(payload));
            const bodyMessage = 'Message Send to SQS - Here is MessageId: ' +data.MessageId;
            response = {
                statusCode: 200,
                body: JSON.stringify(bodyMessage),
            };
        }else{
            response = {
                statusCode: 500,
                body: JSON.stringify('Error')
            };
        }
        return response;
    }
    catch (err) {
        console.log("Error", err);
    }

    return response;
}