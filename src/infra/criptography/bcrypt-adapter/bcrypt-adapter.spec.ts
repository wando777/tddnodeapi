import bcrypt from 'bcrypt'
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
    it('Should throw an error if bcrypt has errors', async () => {
        const sut = makeSut()
        jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => {
            return await new Promise((_resolve, reject) => reject(new Error()));
        });
        const anyValue = 'any_value'
        const promise = sut.hash(anyValue)
        await expect(promise).rejects.toThrow()
    })
    it('Should call compare with correct values', async () => {
        const sut = makeSut()
        const compareSpy = jest.spyOn(bcrypt, 'compare')
        const anyValue = 'any_value'
        await sut.compare(anyValue, 'any_hash')
        expect(compareSpy).toHaveBeenCalledWith(anyValue, 'any_hash')
    })
    it('Should return true when compare succeeds', async () => {
        const sut = makeSut()
        const anyValue = 'any_value'
        const compare = await sut.compare(anyValue, 'any_hash')
        expect(compare).toBe(true)
    })
    it('Should return false when compare fails', async () => {
        const sut = makeSut()
        // When trying to mock a value with a new Promise, It required a type 'void | PromiseLike<void>, so in this case I need to mock the Promise type as boolean.
        const hashSpy = jest.spyOn(bcrypt, 'compare') as unknown as jest.Mock<
            ReturnType<(key: boolean) => Promise<boolean>>,
            Parameters<(key: boolean) => Promise<boolean>>
        >
        hashSpy.mockReturnValueOnce(new Promise(_resolve => _resolve(false)))
        const anyValue = 'any_value'
        const compare = await sut.compare(anyValue, 'any_hash')
        expect(compare).toBe(false)
    })
    it('Should throw an error if compare throws', async () => {
        const sut = makeSut()
        const anyValue = 'any_value'
        // const hashSpy = jest.spyOn(bcrypt, 'compare') as unknown as jest.Mock<
        //     ReturnType<(key: Error) => Promise<Error>>,
        //     Parameters<(key: Error) => Promise<Error>>
        // >
        // hashSpy.mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
            throw new Error()
        })
        const promise = sut.compare(anyValue, 'any_hash')
        await expect(promise).rejects.toThrow()
    })
})