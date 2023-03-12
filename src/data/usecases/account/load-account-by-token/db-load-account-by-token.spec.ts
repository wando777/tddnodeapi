import { Decrypter, LoadAccountByTokenRepository } from './db-load-account-by-token-protocols'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { mockAccountModel, throwError } from '@/domain/test'
import { mockDecrypter, mockLoadAccountByTokenRepository } from '@/data/test'

const makeFakeAuthentication = (): any => ({
  token: 'any_token',
  role: 'any_role'
})

type SutTypes = {
  sut: DbLoadAccountByToken
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
  decrypterStub: Decrypter
}

const makeSut = (): SutTypes => {
  const decrypterStub = mockDecrypter()
  const loadAccountByTokenRepositoryStub = mockLoadAccountByTokenRepository()
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
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve(null))
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
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(Promise.resolve(null))
    const promise = await sut.load(makeFakeAuthentication().token, makeFakeAuthentication().role)
    expect(promise).toBeNull()
  })
  test('Should returns an account on success', async () => {
    const { sut } = makeSut()
    const promise = await sut.load(makeFakeAuthentication().token, makeFakeAuthentication().role)
    expect(promise).toEqual(mockAccountModel())
  })
  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(throwError)
    const promise = sut.load(makeFakeAuthentication().token, makeFakeAuthentication().role)
    await expect(promise).rejects.toThrow()
  })
  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockImplementationOnce(throwError)
    const promise = sut.load(makeFakeAuthentication().token, makeFakeAuthentication().role)
    await expect(promise).rejects.toThrow()
  })
})
