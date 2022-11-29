import { SutTypes } from '../../protocols/sut-types'
import { DbAddAccount } from './db-add-account'

const makeSut = (): SutTypes => {
    class EncrypterStub {
        async encrypt(value: string): Promise<string> {
            return await new Promise(resolve => resolve('hashed_password'))
        }
    }
    const encrypterStub = new EncrypterStub()
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
})