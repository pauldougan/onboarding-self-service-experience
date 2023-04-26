import {NextFunction, Request, Response} from "express";
import {Session} from "express-session";
import validateMobileNumber from "middleware/validators/mobileValidator/validator";
import {invalidNumbers, validNumbers} from "../../lib/mobileNumberUtils.test";

describe("Validating numbers works as expected", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;
    let session: Partial<Session>;

    it.each(validNumbers)("Accepts valid number %s", validNumber => {
        mockRequest = {
            body: jest.fn(),
            session: session as Session
        };

        mockResponse = {};
        nextFunction = jest.fn();

        mockRequest.body.mobileNumber = validNumber;
        validateMobileNumber("./any-template.njk")(mockRequest as Request, mockResponse as Response, nextFunction as NextFunction);

        expect(nextFunction).toBeCalledTimes(1);
    });

    it.each(invalidNumbers)("Rejects invalid number %s", invalidNumber => {
        mockRequest = {
            body: jest.fn()
        };

        mockResponse = {
            render: jest.fn()
        };

        nextFunction = jest.fn();

        mockRequest.body.mobileNumber = invalidNumber;
        validateMobileNumber("./any-template.njk")(mockRequest as Request, mockResponse as Response, nextFunction as NextFunction);

        expect(nextFunction).not.toBeCalled();
        expect(mockResponse.render).toHaveBeenCalledTimes(1);
    });
});
