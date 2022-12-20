import { EmailValidator } from '../../protocols/email-validator'
import { InvalidParamError } from '../../errors'
import { HttpRequest, SutTypesEmailValidation } from '../../protocols'
import { EmailValidation } from './email-validation'

const makeEmailValidator = (): EmailValidator => {
    // this is a mock response for testing valid parameters
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

const makeSut = (): SutTypesEmailValidation => {
    const emailValidatorStub = makeEmailValidator()
    const sut = new EmailValidation('email', emailValidatorStub) // injecting a dependecy to our implementation where it should return whats has been mocked.
    return {
        sut,
        emailValidatorStub
    }
}

const makeFakeRequest = (): HttpRequest => ({
    body: {
        name: 'foo_name',
        email: 'foo_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
    }
})

describe('EmailValidation', () => {
    it('Should return an error if EmailValidator returns false', () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const email = makeFakeRequest().body.email
        const validation = sut.validate(email)
        expect(validation).toEqual(new InvalidParamError('email'))
    })

    it('Should call EmailValidator with a correct email', () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        const email = makeFakeRequest().body.email
        sut.validate({ email })
        expect(isValidSpy).toHaveBeenCalledWith(email)
    })

    it('Should throws an error if EmailValidator throws an exception', () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })
        expect(sut.validate).toThrow()
    })
})
