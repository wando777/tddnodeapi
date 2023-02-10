import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
    async sign(): Promise<string> {
        return await new Promise(resolve => resolve('any_token'))
    },
    async verify(): Promise<string> {
        return await new Promise(resolve => resolve('any_decrypted_token'))
    }
}))

const makeSut = (): JwtAdapter => {
    return new JwtAdapter('secret')
}

describe('JWT Adapter', () => {
    describe('sign()', () => {
        test('Should call sign() with correct values', async () => {
            const sut = makeSut()
            const signSpy = jest.spyOn(jwt, 'sign')
            await sut.encrypt('any_id')
            expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
        })
        test('Should return a token on sign() success', async () => {
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
    describe('verify()', () => {
        test('Should call verify() with correct values', async () => {
            const sut = makeSut()
            const verifySpy = jest.spyOn(jwt, 'verify')
            await sut.decrypt('any_token')
            expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret')
        })
        test('Should return a decrypted token on verify() success', async () => {
            const sut = makeSut()
            const decryptedToken = await sut.decrypt('any_token')
            expect(decryptedToken).toBe('any_decrypted_token')
        })
        test('Should throws if verify() throws', async () => {
            const sut = makeSut()
            // jest.spyOn(jwt, 'verify').mockReturnValueOnce(await new Promise((_resolve, reject) => reject(new Error())))
            jest.spyOn(jwt, 'verify').mockImplementationOnce(async () => {
                throw new Error()
            });
            const promise = sut.decrypt('any_token')
            await expect(promise).rejects.toThrow()
        })
    })
})
