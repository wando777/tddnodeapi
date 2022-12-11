import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface SutTypes {
    sut: LogControllerDecorator
    controllerStub: Controller
}

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

const makeSut = (): SutTypes => {
    const controllerStub = makeController()
    const sut = new LogControllerDecorator(controllerStub)
    return {
        sut,
        controllerStub
    }
}

describe('LogControllerDecorator', () => {
    it('Should call handle method in the controller ', async () => {
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

    it('Should return the same result of the controller ', async () => {
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
})