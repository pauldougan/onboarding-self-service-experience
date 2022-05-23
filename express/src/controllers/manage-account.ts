import express, {Request, Response} from "express";
import router from "../routes/testing-routes";
import lambdaFacadeInstance from "../lib/lambda-facade";
import {randomUUID} from "crypto";
import {User} from "../../@types/User";

export const listServices = async function(req: Request, res: Response) {
    res.render('manage-account/list-services.njk');
}

export const showAddServiceForm = async function (req: Request, res: Response) {
    res.render("add-service-name.njk");
}
export const processAddServiceForm = async function (req: Request, res: Response) {
    console.log(req.body)
    const uuid = randomUUID();
    const service = {
        "pk": `service#${uuid}`,
        "sk": `service#${uuid}`,
        "data": req.body.serviceName,
        "service_name": req.body.serviceName
    }
    let user = req.session.selfServiceUser as User;
    console.log(service);
    await lambdaFacadeInstance.newService(service, req.session.authenticationResult?.AccessToken as string, user);
    res.redirect("/create-service");
}

