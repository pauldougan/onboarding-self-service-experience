import {AdminGetUserCommandOutput, AuthenticationResultType} from "@aws-sdk/client-cognito-identity-provider";
import bodyParser from "body-parser";
import express, {NextFunction, Request, Response} from "express";
import "express-async-errors";
import sessions from "express-session";
import path from "path";
import {User} from "../@types/User";
import configureViews from "./lib/configureViews";
import {SelfServiceError} from "./lib/SelfServiceError";
import setSignedInStatus from "./middleware/setSignedInStatus";
import createAccount from "./routes/create-account-or-sign-in";
import manageAccount from "./routes/manage-account";
import signIn from "./routes/sign-in";
import testingRoutes from "./routes/testing-routes";

const app = express();
import(`./lib/cognito/${process.env.COGNITO_CLIENT || "CognitoClient"}`).then(client => {
    app.set("cognitoClient", new client.default.CognitoClient());
});

import(`./lib/lambda-facade/${process.env.LAMBDA_FACADE || "LambdaFacade"}`).then(facade => {
    console.log(facade);
    app.set("lambdaFacade", facade.lambdaFacadeInstance);
});

app.use("/dist", express.static("./dist/assets"));
app.use(express.static("./dist"));
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(
    sessions({
        secret: "setting_this_will_never_cause_problems_in_future",
        saveUninitialized: true,
        cookie: {maxAge: 1_000 * 60 * 60 * 24},
        resave: false
    })
);

declare module "express-session" {
    interface SessionData {
        emailAddress: string;
        mobileNumber: string;
        enteredMobileNumber: string;
        session: string;
        authenticationResult: AuthenticationResultType;
        cognitoUser: AdminGetUserCommandOutput;
        selfServiceUser: User;
        updatedField: string;
        isSignedIn: boolean;
    }
}

configureViews(app, path.join(__dirname, "../src/views"));

app.use(setSignedInStatus);

app.use("/", createAccount);
app.use("/", signIn);
app.use("/", manageAccount);
app.use("/", testingRoutes);

app.get("/", function (req: Request, res: Response) {
    res.render("index.njk", {active: "get-started"});
});

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).render("404.njk");
});

app.use((err: Error | SelfServiceError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SelfServiceError && err?.options) {
        res.render(err.options.template, {values: err.options.values, errorMessages: err.options.errorMessages});
    } else {
        console.error(err);
        res.status(500).render("there-is-a-problem.njk");
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running; listening on port ${port}`));
