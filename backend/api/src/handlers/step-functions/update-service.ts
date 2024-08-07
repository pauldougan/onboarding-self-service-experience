import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {stepFunctionHandler} from "./step-function-handler";

export const doUpdateServiceHandler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    return stepFunctionHandler(event, context);
};
