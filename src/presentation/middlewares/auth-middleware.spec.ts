import { AuthMiddleware } from './auth-middleware'
import { AccountModel, HttpRequest, LoadAccountByToken } from './auth_middleware-protocols'
import { AccessDeniedError } from '../errors'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string | undefined): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByTokenStub()
}

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeStut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)
  return {
    sut,
    loadAccountByTokenStub
  }
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

const makeFakeHttpRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  },
  body: {

  }
})

describe('Auth Middleware', () => {
  it('Should return 403 if no x-access-token exists in the headers', async () => {
    const { sut } = makeStut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  it('Should call LoadAccountByToken with correct accessToken', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeStut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(makeFakeHttpRequest())
    expect(loadSpy).toHaveBeenCalledWith(makeFakeHttpRequest().headers?.['x-access-token'], role)
  })
  it('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeStut()
    jest.spyOn(loadAccountByTokenStub, 'load')
      .mockReturnValueOnce(new Promise((resolve) => (resolve(null))))
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  it('Should return 200 if LoadAccountByToken returns an userId', async () => {
    const { sut } = makeStut()
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(ok({ userId: makeFakeAccount().id }))
  })
  it('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeStut()
    jest.spyOn(loadAccountByTokenStub, 'load')
      .mockReturnValueOnce(new Promise((resolve, reject) => (reject(new Error()))))
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})