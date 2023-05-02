import bodyParser from "body-parser";
import express from "express";
import {cognito, googleTagId, lambda, port} from "./config/environment";
import Express from "./config/express";
import {distribution} from "./config/resources";
import sessionStorage from "./config/session-storage";
import {errorHandler, notFoundHandler} from "./middleware/errors";
import signInStatus from "./middleware/sign-in-status";
import account from "./routes/account";
import baseRoutes from "./routes/base";
import register from "./routes/register";
import services from "./routes/services";
import signIn from "./routes/sign-in";
import testingRoutes from "./routes/testing";
import SelfServiceServicesService from "./services/self-service-services-service";

const app = Express();

const cognitoPromise = import(`./services/cognito/${cognito.client}`).then(client => client.default);
const lambdaPromise = import(`./services/lambda-facade/${lambda.facade}`).then(facade => facade.default);

Promise.all([cognitoPromise, lambdaPromise]).then(deps => {
    app.set("backing-service", new SelfServiceServicesService(deps[0], deps[1]));
    console.log("Backing service created");
});

app.use("/assets", express.static(distribution.assets));
app.use("/assets/images", express.static(distribution.images));

app.use(bodyParser.urlencoded({extended: true}));

app.use(sessionStorage);
app.use(signInStatus);

app.use(baseRoutes);
app.use("/register", register);
app.use("/sign-in", signIn);
app.use("/account", account);
app.use("/services", services);
app.use("/test", testingRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.locals.googleTagId = googleTagId;

app.listen(port, () => console.log(`Server running; listening on port ${port}`));
