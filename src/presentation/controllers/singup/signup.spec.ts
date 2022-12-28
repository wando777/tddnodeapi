import { MissingParamError, ServerError } from '../../errors'
import { SutTypes, AddAccount, AddAccountModel, AccountModel, HttpRequest, Validation } from './signup-protocols'
import { SignUpController } from './signup'
import { badRequest, ok, serverError } from '../../helpers/http/http-helper'

const makeAddAccount = (): AddAccount => {
    // this is a mock response for testing valid parameters
    class AddAccountStub implements AddAccount {
        async add(account: AddAccountModel): Promise<AccountModel> {
            return await new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new AddAccountStub()
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

const makeSut = (): SutTypes => {
    const validationStub = makeValidation()
    const addAccountStub = makeAddAccount()
    const sut = new SignUpController(addAccountStub, validationStub) // injecting a dependecy to our implementation where it should return whats has been mocked.
    return {
        sut,
        addAccountStub,
        validationStub
    }
}

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
})

const makeFakeRequest = (): HttpRequest => ({
    body: {
        name: 'foo_name',
        email: 'foo_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
    }
})

describe('SignUp Controller', () => {
    // it('Should return 400 if no name is provided', async () => {
    //     const { sut } = makeSut()
    //     const httpRequest = {
    //         body: {
    //             //  name: 'foo_name',
    //             email: 'foo_email@mail.com',
    //             password: 'any_password',
    //             passwordConfirmation: 'any_password'
    //         }
    //     }
    //     const httpResponse = await sut.handle(httpRequest)
    //     expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
    // })

    // it('Should return 400 if no email is provided', async () => {
    //     const { sut } = makeSut()
    //     const httpRequest = {
    //         body: {
    //             name: 'foo_name',
    //             // email: 'foo_email@mail.com',
    //             password: 'any_password',
    //             passwordConfirmation: 'any_password'
    //         }
    //     }
    //     const httpResponse = await sut.handle(httpRequest)
    //     expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    // })

    // it('Should return 400 if no password is provided', async () => {
    //     const { sut } = makeSut()
    //     const httpRequest = {
    //         body: {
    //             name: 'foo_name',
    //             email: 'foo_email@mail.com',
    //             // password: 'any_password',
    //             passwordConfirmation: 'any_password'
    //         }
    //     }
    //     const httpResponse = await sut.handle(httpRequest)
    //     expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
    // })

    // it('Should return 400 if no password confirmation is provided', async () => {
    //     const { sut } = makeSut()
    //     const httpRequest = {
    //         body: {
    //             name: 'foo_name',
    //             email: 'foo_email@mail.com',
    //             password: 'any_password'
    //             // passwordConfirmation: 'any_password'
    //         }
    //     }
    //     const httpResponse = await sut.handle(httpRequest)
    //     expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
    // })

    // it('Should return 400 if no password confirmation fails', async () => {
    //     const { sut } = makeSut()
    //     const httpRequest = {
    //         body: {
    //             name: 'foo_name',
    //             email: 'foo_email@mail.com',
    //             password: 'any_password',
    //             passwordConfirmation: 'invalid_confirmation'
    //         }
    //     }
    //     const httpResponse = await sut.handle(httpRequest)
    //     expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
    // })

    it('Should call AddAccount with a correct values', async () => {
        const { sut, addAccountStub } = makeSut()
        const addSpy = jest.spyOn(addAccountStub, 'add')
        await sut.handle(makeFakeRequest())
        expect(addSpy).toHaveBeenCalledWith({
            name: makeFakeRequest().body.name,
            email: makeFakeRequest().body.email,
            password: makeFakeRequest().body.password
        })
    })

    it('Should return 500 if AddAccount throws an exception', async () => {
        const { sut, addAccountStub } = makeSut()
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
            return await new Promise((resolve, reject) => reject(new Error()))
        })
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new ServerError('')))
    })

    it('Should return 200 if a valid Account is provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok(makeFakeAccount()))
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
