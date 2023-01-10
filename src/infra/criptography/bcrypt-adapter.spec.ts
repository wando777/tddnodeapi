import bcrypt from 'bcrypt'
import { serverError } from '../../presentation/helpers/http/http-helper'
import { BcryptAdapter } from './bcrypt-adapter'

const hashMocked = 'hashMocked'
const salt = 12

jest.mock('bcrypt', () => ({
    async hash(): Promise<string> {
        return await new Promise(resolve => resolve(hashMocked))
    },
    async compare(): Promise<boolean> {
        return await new Promise(resolve => resolve(true))
    }
}))

const makeSut = (): BcryptAdapter => {
    return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
    it('Should call hash from bcrypt with correct values', async () => {
        const sut = makeSut()
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        const anyValue = 'any_value'
        await sut.hash(anyValue)
        expect(hashSpy).toHaveBeenCalledWith(anyValue, salt)
    })
    it('Should return a valid hash on hash success', async () => {
        const sut = makeSut()
        const anyValue = 'any_value'
        const hash = await sut.hash(anyValue)
        expect(hash).toBe(hashMocked)
    })
    // it('Should throw an error if bcrypt has errors', async () => {
    //     const sut = makeSut()
    //     // jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    //     jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(await new Promise((resolve, reject) => reject(new Error())))
    //     const anyValue = 'any_value'
    //     const promise = sut.hash(anyValue)
    //     await expect(promise).rejects.toThrow()
    // })
    it('Should call compare with correct values', async () => {
        const sut = makeSut()
        const compareSpy = jest.spyOn(bcrypt, 'compare')
        const anyValue = 'any_value'
        await sut.compare(anyValue, 'any_hash')
        expect(compareSpy).toHaveBeenCalledWith(anyValue, 'any_hash')
    })
})