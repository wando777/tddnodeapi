import { AccountModel, AddAccountModel, AddAccountRepository, Hasher, LoadAccountByEmailRepository, SutTypes } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

const makeHasher = (): Hasher => {
    class HasherStub implements Hasher {
        async hash(value: string): Promise<string> {
            return await new Promise(resolve => resolve('hashed_password'))
        }
    }
    return new HasherStub()
}
const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add(accountData: AddAccountModel): Promise<AccountModel> {
            return await new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new AddAccountRepositoryStub()
}
const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async loadByEmail(email: string): Promise<any> {
            return await new Promise(resolve => resolve(null))
        }
    }
    return new LoadAccountByEmailRepositoryStub()
}
const makeSut = (): SutTypes => {
    const hasherStub = makeHasher()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
    return {
        sut,
        hasherStub,
        addAccountRepositoryStub,
        loadAccountByEmailRepositoryStub
    }
}
const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'hashed_password'
})
const makeFakeAccountData = (): AddAccountModel => ({
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
})

describe('DbAddAccount Usecase', () => {
    it('Should call Hasher with correct password', async () => {
        const { sut, hasherStub } = makeSut();
        const encryptSpy = jest.spyOn(hasherStub, 'hash')
        await sut.add(makeFakeAccountData())
        expect(encryptSpy).toHaveBeenCalledWith(makeFakeAccountData().password)
    })
    it('Should throw and error if Hasher has errors', async () => {
        const { sut, hasherStub } = makeSut();
        // jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        jest.spyOn(hasherStub, 'hash').mockImplementationOnce(async () => {
            throw new Error()
        })
        const accountPromise = sut.add(makeFakeAccountData())
        await expect(accountPromise).rejects.toThrow()
    })
    it('Should call AddAccountRepository with correct values', async () => {
        const { sut, addAccountRepositoryStub } = makeSut();
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
        await sut.add(makeFakeAccountData())
        expect(addSpy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'hashed_password'
        })
    })
    it('Should throw and error if AddAccountRepository has errors', async () => {
        const { sut, addAccountRepositoryStub } = makeSut();
        // jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(async () => {
            throw new Error()
        })
        const accountPromise = sut.add(makeFakeAccountData())
        await expect(accountPromise).rejects.toThrow()
    })
    it('Should return an account on success', async () => {
        const { sut } = makeSut();
        const accountPromisse = await sut.add(makeFakeAccountData())
        expect(accountPromisse).toEqual(makeFakeAccount())
    })
    test('Should call LoadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
        await sut.add(makeFakeAccountData())
        expect(loadSpy).toHaveBeenCalledWith('valid_email@mail.com')
    })
    it('Should return null if LoadAccountByEmailRepository finds an user email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise(resolve => resolve(makeFakeAccount())))
        // const loadAccountByEmailRepositoryStubSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail') as unknown as jest.Mock<
        //     ReturnType<(key: null) => Promise<null>>,
        //     Parameters<(key: null) => Promise<null>>
        // >
        // loadAccountByEmailRepositoryStubSpy.mockReturnValueOnce(new Promise(_resolve => _resolve(null)))
        const accountPromisse = await sut.add(makeFakeAccountData())
        expect(accountPromisse).toBe(null)
    })
})