import {NextFunction, Request, Response} from "express";
import {Session, SessionData} from "express-session";
import emailIsPresentInSession from "../../../src/middleware/validators/emailIsPresentInSession/emailIsPresentInSession";
import "../../../src/types/session";

describe("It checks whether an email is present in the session and behaves accordingly", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;
    let mockSession: Partial<Session & Partial<SessionData>>;

    beforeEach(() => {
        mockSession = {};
        mockRequest = {
            body: jest.fn(),
            session: mockSession as Session
        };

        nextFunction = jest.fn();
    });

    it("calls the NextFunction if emailAddress is present in the session", () => {
        mockSession.emailAddress = "testing@test.gov.uk";
        emailIsPresentInSession("sign-in.njk", {})(mockRequest as Request, mockResponse as Response, nextFunction);
        expect(nextFunction).toHaveBeenCalled();
    });

    it("renders the given template if emailAddress is not present in the session", () => {
        mockSession.emailAddress = undefined;
        mockResponse = {
            render: jest.fn()
        };

        emailIsPresentInSession("sign-in.njk", {})(mockRequest as Request, mockResponse as Response, nextFunction);
        expect(mockResponse.render).toHaveBeenCalledWith("sign-in.njk", {});
    });
});
