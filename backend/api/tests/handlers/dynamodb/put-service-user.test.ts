import {putServiceUserHandler} from "../../../src/handlers/dynamodb/put-service-user";
import DynamoDbClient from "../../../src/dynamodb-client";
import ResolvedValue = jest.ResolvedValue;

const randomId = "1234Random";
jest.mock("crypto", () => ({
    randomUUID: jest.fn(() => randomId)
}));

const putServiceHandlerBody = {
    userDynamoId: "12345",
    userEmail: "test@test.gov.uk",
    service: {
        id: "service#1234Random",
        serviceName: "Test Service"
    }
};

const expectedDynamoRecord = {
    pk: putServiceHandlerBody.service.id,
    sk: `user#${putServiceHandlerBody.userDynamoId}`,
    data: putServiceHandlerBody.userEmail,
    role: "admin",
    service_name: putServiceHandlerBody.service.serviceName
};

function createResolvedValue(): ResolvedValue<string> {
    return <ResolvedValue<string>>expectedDynamoRecord;
}

describe("putServiceUserHandler tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("calls the dynamo client with a put command with the expected values and returns a 200 with the expected response body", async () => {
        const itemSpy = jest.spyOn(DynamoDbClient.prototype, "put").mockResolvedValue(createResolvedValue());

        const putServiceHandlerResponse = await putServiceUserHandler({
            statusCode: 200,
            body: JSON.stringify(putServiceHandlerBody)
        });

        expect(itemSpy).toHaveBeenCalledWith(expectedDynamoRecord);
        expect(putServiceHandlerResponse).toStrictEqual({
            statusCode: 200,
            body: JSON.stringify(expectedDynamoRecord)
        });
    });

    it("calls the dynamo client with a put command with the expected values and returns a 500 when the dynamo client throws an error", async () => {
        const error = "SomeAwsError";
        const itemSpy = jest.spyOn(DynamoDbClient.prototype, "put").mockRejectedValue(error);

        const putServiceHandlerResponse = await putServiceUserHandler({
            statusCode: 200,
            body: JSON.stringify(putServiceHandlerBody)
        });

        expect(itemSpy).toHaveBeenCalledWith(expectedDynamoRecord);
        expect(putServiceHandlerResponse).toStrictEqual({
            statusCode: 500,
            body: JSON.stringify(error)
        });
    });
});
