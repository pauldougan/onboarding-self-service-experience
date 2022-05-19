import {DynamoDBClient, PutItemCommand, PutItemCommandOutput} from "@aws-sdk/client-dynamodb";
import {marshall, unmarshall} from "@aws-sdk/util-dynamodb";
import {OnboardingTableItem} from "../@Types/OnboardingTableItem";

class DynamoClient {
    private dynamodb: DynamoDBClient;
    private readonly tableName: string;

    constructor(tableName: string) {
        this.dynamodb = new DynamoDBClient({ region: process.env.AWS_REGION });
        this.tableName = tableName;
    }

    async put(item: OnboardingTableItem): Promise<PutItemCommandOutput> {
        const params  = {
            TableName : this.tableName,
            Item: marshall(item)
        };
        const command = new PutItemCommand(params);
        return await this.dynamodb.send(command);
    }

    //async getByKey
}

export default DynamoClient;