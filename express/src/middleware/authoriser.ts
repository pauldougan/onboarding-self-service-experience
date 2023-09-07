import {NextFunction, Request, Response} from "express";
import SelfServiceServicesService from "../services/self-service-services-service";

// TODO This only checks the user is signed in but doesn't check the user's permissions to view objects or do actions
export default async function checkAuthorisation(req: Request, res: Response, next: NextFunction) {
    const s4: SelfServiceServicesService = req.app.get("backing-service");
    // For 'resume-before-password' and 'resume-after-password' Authorisation is re-instigated following re-entry of
    // required authoristation codes on Pages (i.e. EMail Code or Password) and therefore checking can be bypassed here.
    if (req.path !== "/resume-before-password" && req.path !== "/resume-after-password" && req.method === "POST") {
        // TODO only redirect to /session-timeout if the session is timed out - we need to have a way of checking this
        // TODO Otherwise, redirect to /sign-in
        if (!req.session.authenticationResult?.AccessToken) {
            s4.sendTxMALog(
                JSON.stringify({
                    userIp: req.ip,
                    event: "ERROR_TIMEOUT",
                    journeyId: req.session.id
                })
            );

            return res.redirect("/session-timeout");
        }

        if (req.session.authenticationResult?.RefreshToken) {
            const s4: SelfServiceServicesService = req.app.get("backing-service");
            req.session.authenticationResult = await s4
                .useRefreshToken(req.session.authenticationResult.RefreshToken)
                .then(result => result.AuthenticationResult);
        }
    }

    next();
}
