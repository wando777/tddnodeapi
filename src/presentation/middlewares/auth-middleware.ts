import { AccessDeniedError } from '../errors';
import { forbidden, ok, serverError } from '../helpers/http/http-helper';
import { HttpRequest, HttpResponse, LoadAccountByToken, Middleware } from './auth_middleware-protocols';

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (accessToken) {
        const account = await this.loadAccountByToken.load(httpRequest.headers?.['x-access-token'], this.role)
        if (account) {
          return ok({ userId: account.id })
        }
      }
      return await Promise.resolve(forbidden(new AccessDeniedError()))
    } catch (error: any) {
      return serverError(error)
    }
  }
}