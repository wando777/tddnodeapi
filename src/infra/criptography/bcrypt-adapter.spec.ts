import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

describe('Bcrypt Adapter', () => {
    it('Should call bcrypt with correct values', async () => {
        const salt = 12
        const sut = new BcryptAdapter(salt)
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        const anyValue = 'any_value'
        await sut.encrypt(anyValue)
        expect(hashSpy).toHaveBeenCalledWith(anyValue, salt)
    })
})