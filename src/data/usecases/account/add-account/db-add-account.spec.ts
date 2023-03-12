import { SutTypes } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'
import { mockAccountModel, mockAddAccountParams, throwError } from '@/domain/test'
import { mockAddAccountRepository, mockHasher, mockLoadAccountByEmailRepository } from '@/data/test'

const makeSut = (): SutTypes => {
    const hasherStub = mockHasher()
    const addAccountRepositoryStub = mockAddAccountRepository()
    const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValue(new Promise(resolve => resolve(null)))
    const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
    return {
        sut,
        hasherStub,
        addAccountRepositoryStub,
        loadAccountByEmailRepositoryStub
    }
}

describe('DbAddAccount Usecase', () => {
    it('Should call Hasher with correct password', async () => {
        const { sut, hasherStub } = makeSut();
        const encryptSpy = jest.spyOn(hasherStub, 'hash')
        await sut.add(mockAddAccountParams())
        expect(encryptSpy).toHaveBeenCalledWith(mockAddAccountParams().password)
    })
    it('Should throw and error if Hasher has errors', async () => {
        const { sut, hasherStub } = makeSut();
        jest.spyOn(hasherStub, 'hash').mockImplementationOnce(throwError)
        const accountPromise = sut.add(mockAddAccountParams())
        await expect(accountPromise).rejects.toThrow()
    })
    it('Should call AddAccountRepository with correct values', async () => {
        const { sut, addAccountRepositoryStub } = makeSut();
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
        await sut.add(mockAddAccountParams())
        expect(addSpy).toHaveBeenCalledWith({
            name: mockAddAccountParams().name,
            email: mockAddAccountParams().email,
            password: 'hashed_password'
        })
    })
    it('Should throw an error if AddAccountRepository has errors', async () => {
        const { sut, addAccountRepositoryStub } = makeSut();
        jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(throwError)
        const accountPromise = sut.add(mockAddAccountParams())
        await expect(accountPromise).rejects.toThrow()
    })
    it('Should return an account on success', async () => {
        const { sut } = makeSut();
        const accountPromisse = await sut.add(mockAddAccountParams())
        expect(accountPromisse).toEqual(mockAccountModel())
    })
    test('Should call LoadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
        await sut.add(mockAddAccountParams())
        expect(loadSpy).toHaveBeenCalledWith(mockAddAccountParams().email)
    })
    it('Should return null if LoadAccountByEmailRepository finds an user email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise(resolve => resolve(mockAccountModel())))
        // const loadAccountByEmailRepositoryStubSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail') as unknown as jest.Mock<
        //     ReturnType<(key: null) => Promise<null>>,
        //     Parameters<(key: null) => Promise<null>>
        // >
        // loadAccountByEmailRepositoryStubSpy.mockReturnValueOnce(new Promise(_resolve => _resolve(null)))
        const accountPromisse = await sut.add(mockAddAccountParams())
        expect(accountPromisse).toBe(null)
    })
})