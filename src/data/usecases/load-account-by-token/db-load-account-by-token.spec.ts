import { Decrypter, LoadAccountByTokenRepository } from './db-load-account-by-token-protocols'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { AccountModel } from '../add-account/db-add-account-protocols'

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
    async loadByToken(token: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

interface SutTypes {
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
    await expect(promise).toBeNull()
  })
  // test('Should return null if LoadAccountByEmailRepository returns null', async () => {
  //     const { sut, loadAccountByEmailRepositoryStub } = makeSut()
  //     jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null)
  //     const accessToken = await sut.auth(makeFakeAuthentication())
  //     expect(accessToken).toBeNull()
  // })
  // test('Should call HashCompare with correct values', async () => {
  //     const { sut, hashComparerStub } = makeSut()
  //     const compareSpy = jest.spyOn(hashComparerStub, 'compare')
  //     await sut.auth(makeFakeAuthentication())
  //     expect(compareSpy).toHaveBeenCalledWith(makeFakeAuthentication().password, makeFakeAccount().password) // It compares the password sent by the user on the UI (makeFakeAuthentication) with what is recorded in the database (makeFakeAccount)
  // })
  // test('Should throw if HashComparer throws', async () => {
  //     const { sut, hashComparerStub } = makeSut()
  //     jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
  //     const promise = sut.auth(makeFakeAuthentication())
  //     await expect(promise).rejects.toThrow()
  // })
  // test('Should return null if HashComparer returns false', async () => {
  //     const { sut, hashComparerStub } = makeSut()
  //     jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
  //     const accessToken = await sut.auth(makeFakeAuthentication())
  //     expect(accessToken).toBeNull()
  // })
  // test('Should call Encrypter with correct id', async () => {
  //     const { sut, encrypterStub } = makeSut()
  //     const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
  //     await sut.auth(makeFakeAuthentication())
  //     expect(encryptSpy).toHaveBeenCalledWith(makeFakeAccount().id) // It ensures that token generator should be called with the expected ID.
  // })
  // test('Should throw if Encrypter throws', async () => {
  //     const { sut, encrypterStub } = makeSut()
  //     jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
  //     const promise = sut.auth(makeFakeAuthentication())
  //     await expect(promise).rejects.toThrow()
  // })
  // test('Should return a token on success', async () => {
  //     const { sut } = makeSut()
  //     const accessToken = await sut.auth(makeFakeAuthentication())
  //     expect(accessToken).toBe('any_token')
  // })
  // test('Should call UpdateAccessTokenRepository with correct values', async () => {
  //     const { sut, updateAccessTokenRepositoryStub } = makeSut()
  //     const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
  //     await sut.auth(makeFakeAuthentication())
  //     expect(updateSpy).toHaveBeenLastCalledWith('any_id', 'any_token')
  // })
  // test('Should throw if UpdateAccessTokenRepository throws', async () => {
  //     const { sut, updateAccessTokenRepositoryStub } = makeSut()
  //     jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
  //     const promise = sut.auth(makeFakeAuthentication())
  //     await expect(promise).rejects.toThrow()
  // })
})
