import { LogControllerDecorator } from './log-controller-decorator'
import { SutTypesDecorator } from './sut-types-decorator'
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { ok, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { mockAccountModel } from '@/domain/test'

const makeController = (): Controller => {
    class ControllerStub implements Controller {
        async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
            return await new Promise(resolve => resolve(ok(mockAccountModel())))
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
        async logError(stack: string): Promise<void> {
            return await new Promise(resolve => resolve())
        }
    }
    return new LogErrorRepositoryStub()
}

const makeFakeRequest = (): HttpRequest => ({
    body: {
        name: 'foo_name',
        email: 'foo_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
    }
})

describe('LogControllerDecorator', () => {
    it('Should call handle method in the controller', async () => {
        const { sut, controllerStub } = makeSut()
        const handleSpy = jest.spyOn(controllerStub, 'handle')
        // const sut = new LogControllerDecorator(controllerStub)
        await sut.handle(makeFakeRequest())
        expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
    })

    it('Should return the same result of the controller', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok(mockAccountModel()))
    })

    it('Should call LogErrorRepository with correct error when controller returns a serverError', async () => {
        const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
        const fakeError = new Error()
        fakeError.stack = 'any_error'
        const error = serverError(fakeError)
        const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)))
        await sut.handle(makeFakeRequest())
        expect(logSpy).toHaveBeenCalledWith(fakeError.stack)
    })
})