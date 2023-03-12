import { mockEncrypter, mockHashComparer, mockLoadAccountByEmailRepository, mockUpdateAccessTokenRepository } from '@/data/test'
import { mockAccountModel, mockAuthenticationParams, throwError } from '@/domain/test'
import { DbAuthentication } from './db-authentication'
import { SutTypesDbAuthentication } from './sut-types'

const makeSut = (): SutTypesDbAuthentication => {
    const encrypterStub = mockEncrypter()
    const hashComparerStub = mockHashComparer()
    const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
    const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, encrypterStub, updateAccessTokenRepositoryStub)
    return ({
        sut,
        loadAccountByEmailRepositoryStub,
        hashComparerStub,
        encrypterStub,
        updateAccessTokenRepositoryStub
    })
}

describe('DbAuthentication UseCase', () => {
    test('Should call LoadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
        await sut.auth(mockAuthenticationParams())
        expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
    })
    test('Should throws an exception if LoadAccountByEmailRepository throws', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(throwError)
        const promise = sut.auth(mockAuthenticationParams())
        await expect(promise).rejects.toThrow()
    })
    test('Should return null if LoadAccountByEmailRepository returns null', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null)
        const accessToken = await sut.auth(mockAuthenticationParams())
        expect(accessToken).toBeNull()
    })
    test('Should call HashCompare with correct values', async () => {
        const { sut, hashComparerStub } = makeSut()
        const compareSpy = jest.spyOn(hashComparerStub, 'compare')
        await sut.auth(mockAuthenticationParams())
        expect(compareSpy).toHaveBeenCalledWith(mockAuthenticationParams().password, mockAccountModel().password) // It compares the password sent by the user on the UI (mockAuthenticationParams) with what is recorded in the database (mockAccountModel)
    })
    test('Should throw if HashComparer throws', async () => {
        const { sut, hashComparerStub } = makeSut()
        jest.spyOn(hashComparerStub, 'compare').mockImplementationOnce(throwError)
        const promise = sut.auth(mockAuthenticationParams())
        await expect(promise).rejects.toThrow()
    })
    test('Should return null if HashComparer returns false', async () => {
        const { sut, hashComparerStub } = makeSut()
        jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
        const accessToken = await sut.auth(mockAuthenticationParams())
        expect(accessToken).toBeNull()
    })
    test('Should call Encrypter with correct id', async () => {
        const { sut, encrypterStub } = makeSut()
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
        await sut.auth(mockAuthenticationParams())
        expect(encryptSpy).toHaveBeenCalledWith(mockAccountModel().id) // It ensures that token generator should be called with the expected ID.
    })
    test('Should throw if Encrypter throws', async () => {
        const { sut, encrypterStub } = makeSut()
        jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(throwError)
        const promise = sut.auth(mockAuthenticationParams())
        await expect(promise).rejects.toThrow()
    })
    test('Should return a token on success', async () => {
        const { sut } = makeSut()
        const accessToken = await sut.auth(mockAuthenticationParams())
        expect(accessToken).toBe('any_token')
    })
    test('Should call UpdateAccessTokenRepository with correct values', async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut()
        const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
        await sut.auth(mockAuthenticationParams())
        expect(updateSpy).toHaveBeenLastCalledWith('any_id', 'any_token')
    })
    test('Should throw if UpdateAccessTokenRepository throws', async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut()
        jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockImplementationOnce(throwError)
        const promise = sut.auth(mockAuthenticationParams())
        await expect(promise).rejects.toThrow()
    })
})
