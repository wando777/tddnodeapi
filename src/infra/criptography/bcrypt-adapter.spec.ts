import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const hashMocked = 'hashMocked'
const salt = 12

jest.mock('bcrypt', () => ({
    async hash(): Promise<string> {
        return await new Promise(resolve => resolve(hashMocked))
    }
}))

const makeSut = (): BcryptAdapter => {
    return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
    it('Should call bcrypt with correct values', async () => {
        const sut = makeSut()
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        const anyValue = 'any_value'
        await sut.encrypt(anyValue)
        expect(hashSpy).toHaveBeenCalledWith(anyValue, salt)
    })
    it('Should return a hash on succes', async () => {
        const sut = makeSut()
        const anyValue = 'any_value'
        const hash = await sut.encrypt(anyValue)
        expect(hash).toBe(hashMocked)
    })
    // it('Should throw an error if bcrypt has errors', async () => {
    //     const sut = makeSut()
    //     // jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    //     jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    //     const anyValue = 'any_value'
    //     const promise = sut.encrypt(anyValue)
    //     await expect(promise).rejects.toThrow()
    // })
})