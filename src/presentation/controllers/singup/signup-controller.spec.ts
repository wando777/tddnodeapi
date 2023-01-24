import { MissingParamError, ParamInUseError, ServerError } from '../../errors'
import { SutTypes, AddAccount, AddAccountModel, AccountModel, HttpRequest, Validation, Authentication, AuthenticationModel } from './signup-controller-protocols'
import { SignUpController } from './signup-controller'
import { badRequest, forbidden, ok, serverError } from '../../helpers/http/http-helper'

const makeAuthentication = (): Authentication => {
    class AuthenticationStub implements Authentication {
        async auth(authentication: AuthenticationModel): Promise<string> {
            return await new Promise(resolve => resolve('any_token'))
            // return 'any_token'
        }
    }
    return new AuthenticationStub()
}

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
    const authenticationStub = makeAuthentication()
    const sut = new SignUpController(addAccountStub, validationStub, authenticationStub) // injecting a dependecy to our implementation where it should return whats has been mocked.
    return {
        sut,
        addAccountStub,
        validationStub,
        authenticationStub
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
    it('Should return 200 if a valid Account is provided and authenticated', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
    })
    it('Should return 403 if AddAccount returns null', async () => {
        const { sut, addAccountStub } = makeSut()
        // jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(new Promise(resolve => resolve(null)))
        // When trying to mock a value with a new Promise, It required a type 'void | PromiseLike<null>, so in this case I need to mock the Promise type as null.
        const addAccountStubSpy = jest.spyOn(addAccountStub, 'add') as unknown as jest.Mock<
            ReturnType<(key: null) => Promise<null>>,
            Parameters<(key: null) => Promise<null>>
        >
        addAccountStubSpy.mockReturnValueOnce(new Promise(_resolve => _resolve(null)))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(forbidden(new ParamInUseError('email')))
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
    it('Should call Authentication with correct values', async () => {
        const { sut, authenticationStub } = makeSut()
        const authSpy = jest.spyOn(authenticationStub, 'auth')
        await sut.handle(makeFakeRequest())
        expect(authSpy).toHaveBeenCalledWith({ email: makeFakeRequest().body.email, password: makeFakeRequest().body.password })
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
})
