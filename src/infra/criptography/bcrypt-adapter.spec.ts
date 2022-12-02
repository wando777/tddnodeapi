import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const hashMocked = 'hashMocked'

jest.mock('bcrypt', () => ({
    async hash(): Promise<string> {
        return await new Promise(resolve => resolve(hashMocked))
    }
}))

describe('Bcrypt Adapter', () => {
    it('Should call bcrypt with correct values', async () => {
        const salt = 12
        const sut = new BcryptAdapter(salt)
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        const anyValue = 'any_value'
        await sut.encrypt(anyValue)
        expect(hashSpy).toHaveBeenCalledWith(anyValue, salt)
    })
    it('Should return a hash on succes', async () => {
        const salt = 12
        const sut = new BcryptAdapter(salt)
        const anyValue = 'any_value'
        const hash = await sut.encrypt(anyValue)
        expect(hash).toBe(hashMocked)
    })
})