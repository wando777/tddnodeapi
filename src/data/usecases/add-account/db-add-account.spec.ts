import { Encrypter } from './db-add-account-protocols'
import { SutTypes } from '../../protocols/sut-types'
import { DbAddAccount } from './db-add-account'

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt(value: string): Promise<string> {
            return await new Promise(resolve => resolve('hashed_password'))
        }
    }
    return new EncrypterStub()
}

const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter()
    const sut = new DbAddAccount(encrypterStub)
    return {
        sut,
        encrypterStub
    }
}

describe('DbAddAccount Usecase', () => {
    it('Should call Encrypter with correct password', async () => {
        const { sut, encrypterStub } = makeSut();
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        }
        await sut.add(accountData)
        expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
    })
    it('Should throw and error if Encrypter has errors', async () => {
        const { sut, encrypterStub } = makeSut();
        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        }
        const accountPromise = sut.add(accountData)
        await expect(accountPromise).rejects.toThrow()
    })
})