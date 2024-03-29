import { HttpRequest, Middleware } from '@/presentation/protocols';
import { NextFunction, Request, Response } from 'express';

export const adapterMiddleware = (middleware: Middleware) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const httprequest: HttpRequest = {
            headers: req.headers
        }
        const httpResponse = await middleware.handle(httprequest)
        if (httpResponse.statusCode === 200) {
            Object.assign(req, httpResponse.body)
            next()
        } else {
            res.status(httpResponse.statusCode).json({ error: httpResponse.body })
        }
    }
}