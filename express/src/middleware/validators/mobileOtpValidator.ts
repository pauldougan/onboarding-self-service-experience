import {Request, RequestHandler} from "express";
import {obscureNumber} from "../../lib/mobileNumberUtils";
import validate from "../../lib/validators/checkOtp";

export default function validateMobileSecurityCode(textMessageNotReceivedUrl: string, hideNumber = true): RequestHandler {
    return (req, res, next) => {
        const securityCode: string = req.body.securityCode.trim();
        const result = validate(securityCode);

        if (result.isValid) {
            return next();
        }

        res.render("common/enter-text-code.njk", {
            values: {
                securityCode: securityCode,
                mobileNumber: hideNumber ? obscureNumber(getMobileNumber(req)) : req.session.enteredMobileNumber,
                textMessageNotReceivedUrl: textMessageNotReceivedUrl
            },
            errorMessages: {
                securityCode: result.errorMessage
            }
        });
    };
}

function getMobileNumber(req: Request): string {
    return nonNull(req.session.mfaResponse?.codeSentTo ?? req.session.enteredMobileNumber ?? req.session.mobileNumber);
}
