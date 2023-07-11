import {static as serveStatic, urlencoded} from "express";
import {googleTagId, port, showTestBanner} from "./config/environment";
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

const app = Express();

app.use("/assets", serveStatic(distribution.assets));
app.use("/assets/images", serveStatic(distribution.images));

app.use(urlencoded({extended: true}));
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
app.locals.showTestBanner = showTestBanner;

app.listen(port, () => console.log(`Server running; listening on port ${port}`));
