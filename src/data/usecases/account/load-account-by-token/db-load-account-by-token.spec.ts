import { Decrypter, LoadAccountByTokenRepository } from './db-load-account-by-token-protocols'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { AccountModel } from '@/domain/models/account'

const makeFakeAuthentication = (): any => ({
  token: 'any_token',
  role: 'any_role'
})

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  email: 'any_email',
  name: 'any_name',
  password: 'any_password'
})

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(id: string): Promise<string> {
      return await new Promise(resolve => resolve('any_value'))
    }
  }
  return new DecrypterStub()
}

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken(token: string, role?: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

type SutTypes = {
  sut: DbLoadAccountByToken
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
  decrypterStub: Decrypter
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository()
  const sut = new DbLoadAccountByToken(loadAccountByTokenRepositoryStub, decrypterStub)
  return ({
    sut,
    loadAccountByTokenRepositoryStub,
    decrypterStub
  })
}

describe('DbLoadAccountByToken UseCase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load(makeFakeAuthentication().token, makeFakeAuthentication().role)
    expect(decryptSpy).toHaveBeenCalledWith(makeFakeAuthentication().token)
  })
  test('Should returns null if Decrypter also returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const promise = await sut.load(makeFakeAuthentication().token, makeFakeAuthentication().role)
    expect(promise).toBeNull()
  })
  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.load(makeFakeAuthentication().token, makeFakeAuthentication().role)
    expect(loadByTokenSpy).toHaveBeenCalledWith(makeFakeAuthentication().token, makeFakeAuthentication().role)
  })
  test('Should returns null if LoadAccountByTokenRepository also returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const promise = await sut.load(makeFakeAuthentication().token, makeFakeAuthentication().role)
    expect(promise).toBeNull()
  })
  test('Should returns an account on success', async () => {
    const { sut } = makeSut()
    const promise = await sut.load(makeFakeAuthentication().token, makeFakeAuthentication().role)
    expect(promise).toEqual(makeFakeAccount())
  })
  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.load(makeFakeAuthentication().token, makeFakeAuthentication().role)
    await expect(promise).rejects.toThrow()
  })
  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.load(makeFakeAuthentication().token, makeFakeAuthentication().role)
    await expect(promise).rejects.toThrow()
  })
})
