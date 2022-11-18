import { MissingParamError, InvalidParamError, ServerError } from '../errors'
import { EmailValidator, SutTypes } from '../protocols'
import { SignUpController } from './signup'
import { EmailValidatorStubError } from '../mocks/EmailValidatorStubError'

const makeSut = (): SutTypes => {
    // this is a mock response for testing valid parameters
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    const emailValidatorStub = new EmailValidatorStub()
    const sut = new SignUpController(emailValidatorStub) // injecting a dependecy to our implementation where it should return whats has been mocked.
    return {
        sut,
        emailValidatorStub
    }
}

describe('SignUp Controller', () => {
    it('Should return 400 if no name is provided', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                //  name: 'foo_name',
                email: 'foo_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse?.statusCode).toBe(400)
        expect(httpResponse?.body).toEqual(new MissingParamError('name'))
    })

    it('Should return 400 if no email is provided', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'foo_name',
                // email: 'foo_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse?.statusCode).toBe(400)
        expect(httpResponse?.body).toEqual(new MissingParamError('email'))
    })

    it('Should return 400 if no password is provided', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'foo_name',
                email: 'foo_email@mail.com',
                // password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse?.statusCode).toBe(400)
        expect(httpResponse?.body).toEqual(new MissingParamError('password'))
    })

    it('Should return 400 if no password confirmation is provided', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'foo_name',
                email: 'foo_email@mail.com',
                password: 'any_password'
                // passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse?.statusCode).toBe(400)
        expect(httpResponse?.body).toEqual(new MissingParamError('passwordConfirmation'))
    })

    it('Should return 400 if an invalid email is provided', () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const httpRequest = {
            body: {
                name: 'foo_name',
                email: 'invalid_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse?.statusCode).toBe(400)
        expect(httpResponse?.body).toEqual(new InvalidParamError('email'))
    })

    it('Should call EmailValidator with a correct email', () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        const httpRequest = {
            body: {
                name: 'foo_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        sut.handle(httpRequest)
        expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
    })

    it('Should return 500 if EmailValidator throws an exception', () => {
        const emailValidatorStubError = new EmailValidatorStubError()
        const sut = new SignUpController(emailValidatorStubError)
        const httpRequest = {
            body: {
                name: 'foo_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse?.statusCode).toBe(500)
        expect(httpResponse?.body).toEqual(new ServerError())
    })
})
