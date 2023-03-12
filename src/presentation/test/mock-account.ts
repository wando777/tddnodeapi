import { mockAccountModel } from '@/domain/test'
import { AddAccount, AddAccountParams } from '../controllers/login/singup/signup-controller-protocols'
import { AccountModel, LoadAccountByToken } from '../middlewares/auth_middleware-protocols'

export const mockAddAccount = (): AddAccount => {
  // this is a mock response for testing valid parameters
  class AddAccountStub implements AddAccount {
      async add(account: AddAccountParams): Promise<AccountModel> {
          return await new Promise(resolve => resolve(mockAccountModel()))
      }
  }
  return new AddAccountStub()
}

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string | undefined): Promise<AccountModel> {
      return await new Promise(resolve => resolve(mockAccountModel()))
    }
  }
  return new LoadAccountByTokenStub()
}