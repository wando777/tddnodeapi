import { HttpRequest, SutTypesLogin } from './login-controller-protocols'
import { LoginController } from './login-controller'
import { ServerError, MissingParamError } from '@/presentation/errors'
import { throwError } from '@/domain/test'
import { mockAuthentication } from '@/presentation/test'
import { mockValidation } from '@/validation/test'
import { badRequest, serverError, unauthorized, ok } from '@/presentation/helpers/http/http-helper'

const mockRequest = (): HttpRequest => ({
    body: {
        email: 'foo_email@mail.com',
        password: 'any_password'
    }
})

const makeSut = (): SutTypesLogin => {
    const validationStub = mockValidation()
    const authenticationStub = mockAuthentication()
    const sut = new LoginController(authenticationStub, validationStub)
    return { sut, validationStub, authenticationStub }
}

describe('Login Controller', () => {
    it('Should call Authentication with correct values', async () => {
        const { sut, authenticationStub } = makeSut()
        const authSpy = jest.spyOn(authenticationStub, 'auth')
        await sut.handle(mockRequest())
        expect(authSpy).toHaveBeenCalledWith({ email: mockRequest().body.email, password: mockRequest().body.password })
    })
    it('Should return 401 if an invalid credentials are provided', async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(null)
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(unauthorized())
    })
    it('Should return 500 if Authentication throws an exception', async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(throwError)
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(serverError(new ServerError('')))
    })
    it('Should return 200 if an valid credentials are provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
    })
    it('Should call Validation with correct value', async () => {
        const { sut, validationStub } = makeSut()
        const addSpy = jest.spyOn(validationStub, 'validate')
        const httpRequest = mockRequest()
        await sut.handle(httpRequest)
        expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
    })
    it('Should return 400 if a validation returns an error', async () => {
        const { sut, validationStub } = makeSut()
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
    })
})