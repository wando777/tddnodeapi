import { Controller, HttpRequest } from '../../presentation/protocols';
import { Request, Response } from 'express';

export const adapterRoute = (controller: Controller) => {
    return async (req: Request, res: Response) => {
        const httprequest: HttpRequest = {
            body: req.body
        }
        const httpResponse = await controller.handle(httprequest)
        res.status(httpResponse.statusCode).json(httpResponse.body)
    }
}