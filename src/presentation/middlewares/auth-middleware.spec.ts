import { forbidden } from '../helpers/http/http-helper'
import { HttpRequest } from '../protocols'
import { AccessDeniedError } from '../errors/index'
import { AuthMiddleware } from './auth-middleware'

const makeFakeHttpRequest = (): HttpRequest => ({
  headers: {

  },
  body: {

  }
})

describe('Auth Middleware', () => {
  it('Should return 403 if no x-access-token exists in the headers', async () => {
    const sut = new AuthMiddleware()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})