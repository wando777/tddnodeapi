import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
    async sign(): Promise<string> {
        return await new Promise(resolve => resolve('any_token'))
    }
}))

const makeSut = (): JwtAdapter => {
    return new JwtAdapter('secret')
}

describe('JWT Adapter', () => {
    test('Should Call sign with correct values', async () => {
        const sut = makeSut()
        const signSpy = jest.spyOn(jwt, 'sign')
        await sut.encrypt('any_id')
        expect(signSpy).toHaveBeenLastCalledWith({ id: 'any_id' }, 'secret')
    })
    test('Should return a token on sign success', async () => {
        const sut = makeSut()
        const accessToken = await sut.encrypt('any_id')
        expect(accessToken).toBe('any_token')
    })
    test('Should throws if sign throws', async () => {
        const sut = makeSut()
        // jest.spyOn(jwt, 'sign').mockReturnValueOnce(await new Promise((_resolve, reject) => reject(new Error())))
        jest.spyOn(jwt, 'sign').mockImplementationOnce(async () => {
            throw new Error()
        });
        const promise = sut.encrypt('any_id')
        await expect(promise).rejects.toThrow()
    })
})