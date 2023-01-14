import { Controller, HttpRequest } from '../../../presentation/protocols';
import { Request, Response } from 'express';

export const adapterRoute = (controller: Controller) => {
    return async (req: Request, res: Response) => {
        const httprequest: HttpRequest = {
            body: req.body
        }
        const httpResponse = await controller.handle(httprequest)
        // if (httpResponse.statusCode === 200) {
        //     res.status(httpResponse.statusCode).json(httpResponse.body)
        // }
        res.status(httpResponse.statusCode).json({ error: httpResponse.body })
    }
}