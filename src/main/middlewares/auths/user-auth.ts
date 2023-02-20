import { adapterMiddleware } from '@/main/adapter/express/express-middleware-adapter';
import { makeAuthMiddleware } from '@/main/factories/middlewares/auth-middleware-factory';

export const userAuth = adapterMiddleware(makeAuthMiddleware())