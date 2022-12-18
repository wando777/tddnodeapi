import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { badRequest, serverError, unauthorized } from '../../helpers/http-helper'
import { EmailValidator, HttpRequest } from '../singup/signup-protocols'
import { SutTypesLogin } from '../../protocols'
import { LoginController } from './login'
import { Authentication } from '../../../domain/usecases/authentication'

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

const makeAuthentication = (): Authentication => {
    class AuthenticationStub implements Authentication {
        async auth(email: string, password: string): Promise<string> {
            // return await new Promise(resolve => resolve('any_token'))
            return 'any token'
        }
    }
    return new AuthenticationStub()
}

const makeFakeRequest = (): HttpRequest => ({
    body: {
        email: 'foo_email@mail.com',
        password: 'any_password'
    }
})

const makeSut = (): SutTypesLogin => {
    const emailValidatorStub = makeEmailValidator()
    const authenticationStub = makeAuthentication()
    const sut = new LoginController(emailValidatorStub, authenticationStub)
    return { sut, emailValidatorStub, authenticationStub }
}

describe('Login Controller', () => {
    it('Should return 400 if no email is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                password: 'any_password'
            }
        }
        const HttpResponse = await sut.handle(httpRequest)
        expect(HttpResponse).toEqual(badRequest(new MissingParamError('email')))
    })
    it('Should return 400 if no password is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: 'any_email@mail.com'
            }
        }
        const HttpResponse = await sut.handle(httpRequest)
        expect(HttpResponse).toEqual(badRequest(new MissingParamError('password')))
    })
    it('Should call EmailValidator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        await sut.handle(makeFakeRequest())
        expect(isValidSpy).toHaveBeenCalledWith(makeFakeRequest().body.email)
    })
    it('Should return 400 if an invalid email is provided', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
    })
    it('Should return 500 if EmailValidator throws an exception', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new ServerError('')))
    })
    it('Should call Authentication with correct values', async () => {
        const { sut, authenticationStub } = makeSut()
        const authSpy = jest.spyOn(authenticationStub, 'auth')
        await sut.handle(makeFakeRequest())
        expect(authSpy).toHaveBeenCalledWith(makeFakeRequest().body.email, makeFakeRequest().body.password)
    })
    it('Should return 401 if an invalid credentials are provided', async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(null)
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(unauthorized())
    })
})