import { MissingParamError, InvalidParamError, ServerError } from '../errors'
import { EmailValidator, SutTypes } from '../protocols'
import { SignUpController } from './signup'
// import { EmailValidatorStubError } from '../mocks/EmailValidatorStubError'
import { AccountModel } from '../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../domain/usecases/add-account'

const makeEmailValidator = (): EmailValidator => {
    // this is a mock response for testing valid parameters
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
    // this is a mock response for testing valid parameters
    class AddAccountStub implements AddAccount {
        add(account: AddAccountModel): AccountModel {
            const fakeAccount = {
                id: 'valid_id',
                name: 'valid_name',
                email: 'valid_email@mail.com',
                password: 'valid_password'
            }
            return fakeAccount
        }
    }
    return new AddAccountStub()
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const addAccountStub = makeAddAccount()
    const sut = new SignUpController(emailValidatorStub, addAccountStub) // injecting a dependecy to our implementation where it should return whats has been mocked.
    return {
        sut,
        emailValidatorStub,
        addAccountStub
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

    it('Should return 400 if no password confirmation fails', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'foo_name',
                email: 'foo_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'invalid_confirmation'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse?.statusCode).toBe(400)
        expect(httpResponse?.body).toEqual(new InvalidParamError('passwordConfirmation'))
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
        // const emailValidatorStubError = new EmailValidatorStubError()
        const { sut, emailValidatorStub } = makeSut()
        // const sut = new SignUpController(emailValidatorStubError)
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })
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

    it('Should call AddAccount with a correct values', () => {
        const { sut, addAccountStub } = makeSut()
        const addSpy = jest.spyOn(addAccountStub, 'add')
        const httpRequest = {
            body: {
                name: 'foo_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        sut.handle(httpRequest)
        expect(addSpy).toHaveBeenCalledWith({
            name: httpRequest.body.name,
            email: httpRequest.body.email,
            password: httpRequest.body.password
        })
    })
})
