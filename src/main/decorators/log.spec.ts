import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { SutTypesDecorator } from '../../data/protocols/sut-types'
import { serverError } from '../../presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

const makeController = (): Controller => {
    class ControllerStub implements Controller {
        httpResponse: HttpResponse
        async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
            this.httpResponse = {
                statusCode: 200,
                body: {
                    name: 'Wando'
                }
            }
            return await new Promise(resolve => resolve(this.httpResponse))
        }
    }
    return new ControllerStub()
}

const makeSut = (): SutTypesDecorator => {
    const logErrorRepositoryStub = makeLogErrorRepository()
    const controllerStub = makeController()
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
    return {
        sut,
        controllerStub,
        logErrorRepositoryStub
    }
}

const makeLogErrorRepository = (): LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {
        async log(stack: string): Promise<void> {
            return await new Promise(resolve => resolve())
        }
    }
    return new LogErrorRepositoryStub()
}

describe('LogControllerDecorator', () => {
    it('Should call handle method in the controller', async () => {
        const { sut, controllerStub } = makeSut()
        const handleSpy = jest.spyOn(controllerStub, 'handle')
        // const sut = new LogControllerDecorator(controllerStub)
        const httpRequest = {
            body: {
                email: 'any_mail@mail.com',
                name: 'any_name',
                password: 'anu_password',
                passwordConfirmation: 'any_password'
            }
        }
        await sut.handle(httpRequest)
        expect(handleSpy).toHaveBeenCalledWith(httpRequest)
    })

    it('Should return the same result of the controller', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: 'any_mail@mail.com',
                name: 'any_name',
                password: 'anu_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual({
            statusCode: 200,
            body: {
                name: 'Wando'
            }
        })
    })
    it('Should call LogErrorRepository with correct error when controller returns a serverError', async () => {
        const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
        const fakeError = new Error()
        fakeError.stack = 'any_error'
        const error = serverError(fakeError)
        const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)))
        const httpRequest = {
            body: {
                email: 'any_mail@mail.com',
                name: 'any_name',
                password: 'anu_password',
                passwordConfirmation: 'any_password'
            }
        }
        await sut.handle(httpRequest)
        expect(logSpy).toHaveBeenCalledWith(fakeError.stack)
    })
})