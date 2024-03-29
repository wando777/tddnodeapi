import { SignUpController } from './signup-controller'
import { SutTypes, HttpRequest } from './signup-controller-protocols'
import { ServerError, ParamInUseError, MissingParamError } from '@/presentation/errors'
import { serverError, forbidden, badRequest, ok } from '@/presentation/helpers/http/http-helper'
import { throwError } from '@/domain/test'
import { mockValidation } from '@/validation/test'
import { mockAddAccount, mockAuthentication } from '@/presentation/test'

const makeSut = (): SutTypes => {
    const validationStub = mockValidation()
    const addAccountStub = mockAddAccount()
    const authenticationStub = mockAuthentication()
    const sut = new SignUpController(addAccountStub, validationStub, authenticationStub) // injecting a dependecy to our implementation where it should return whats has been mocked.
    return {
        sut,
        addAccountStub,
        validationStub,
        authenticationStub
    }
}

const mockRequest = (): HttpRequest => ({
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
        await sut.handle(mockRequest())
        expect(addSpy).toHaveBeenCalledWith({
            name: mockRequest().body.name,
            email: mockRequest().body.email,
            password: mockRequest().body.password
        })
    })
    it('Should return 500 if AddAccount throws an exception', async () => {
        const { sut, addAccountStub } = makeSut()
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(throwError)
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(serverError(new ServerError('')))
    })
    it('Should return 200 if a valid Account is provided and authenticated', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
    })
    it('Should return 403 if AddAccount returns null', async () => {
        const { sut, addAccountStub } = makeSut()
        // jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.resolve(null))
        // When trying to mock a value with a new Promise, It required a type 'void | PromiseLike<null>, so in this case I need to mock the Promise type as null.
        const addAccountStubSpy = jest.spyOn(addAccountStub, 'add') as unknown as jest.Mock<
            ReturnType<(key: null) => Promise<null>>,
            Parameters<(key: null) => Promise<null>>
        >
        addAccountStubSpy.mockReturnValueOnce(Promise.resolve(null))
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(forbidden(new ParamInUseError('email')))
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
    it('Should call Authentication with correct values', async () => {
        const { sut, authenticationStub } = makeSut()
        const authSpy = jest.spyOn(authenticationStub, 'auth')
        await sut.handle(mockRequest())
        expect(authSpy).toHaveBeenCalledWith({ email: mockRequest().body.email, password: mockRequest().body.password })
    })
    it('Should return 500 if Authentication throws an exception', async () => {
        const { sut, authenticationStub } = makeSut()
        // jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(async () => {
        //     throw new Error()
        // })
        jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(throwError)
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(serverError(new ServerError('')))
    })
})
