import { Authentication, AuthenticationParams } from '../controllers/login/login/login-controller-protocols'

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
      async auth(authentication: AuthenticationParams): Promise<string> {
          // return await new Promise(resolve => resolve('any_token'))
          return 'any_token'
      }
  }
  return new AuthenticationStub()
}