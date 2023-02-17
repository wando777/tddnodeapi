import { adapterMiddleware } from '../../adapter/express/express-middleware-adapter';
import { makeAuthMiddleware } from '../../factories/middlewares/auth-middleware-factory';

export const adminAuth = adapterMiddleware(makeAuthMiddleware('admin'))