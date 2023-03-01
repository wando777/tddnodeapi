import { badRequest, serverError, unauthorized, ok } from '@/presentation/helpers/http/http-helper'
import { Authentication, AuthenticationParams, HttpRequest, SutTypesLogin, Validation } from './login-controller-protocols'
import { LoginController } from './login-controller'
import { ServerError, MissingParamError } from '@/presentation/errors'

const makeAuthentication = (): Authentication => {
    class AuthenticationStub implements Authentication {
        async auth(authentication: AuthenticationParams): Promise<string> {
            // return await new Promise(resolve => resolve('any_token'))
            return 'any_token'
        }
    }
    return new AuthenticationStub()
}

const makeValidation = (): Validation => {
    // this is a mock response for testing valid parameters
    class ValidationStub implements Validation {
        validate(input: any): Error {
            return null
        }
    }
    return new ValidationStub()
}

const makeFakeRequest = (): HttpRequest => ({
    body: {
        email: 'foo_email@mail.com',
        password: 'any_password'
    }
})

const makeSut = (): SutTypesLogin => {
    const validationStub = makeValidation()
    const authenticationStub = makeAuthentication()
    const sut = new LoginController(authenticationStub, validationStub)
    return { sut, validationStub, authenticationStub }
}

describe('Login Controller', () => {
    it('Should call Authentication with correct values', async () => {
        const { sut, authenticationStub } = makeSut()
        const authSpy = jest.spyOn(authenticationStub, 'auth')
        await sut.handle(makeFakeRequest())
        expect(authSpy).toHaveBeenCalledWith({ email: makeFakeRequest().body.email, password: makeFakeRequest().body.password })
    })
    it('Should return 401 if an invalid credentials are provided', async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(null)
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(unauthorized())
    })
    it('Should return 500 if Authentication throws an exception', async () => {
        const { sut, authenticationStub } = makeSut()
        // jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(async () => {
        //     throw new Error()
        // })
        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new ServerError('')))
    })
    it('Should return 200 if an valid credentials are provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
    })
    it('Should call Validation with correct value', async () => {
        const { sut, validationStub } = makeSut()
        const addSpy = jest.spyOn(validationStub, 'validate')
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
    })
    it('Should return 400 if a validation returns an error', async () => {
        const { sut, validationStub } = makeSut()
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
    })
})