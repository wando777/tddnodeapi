import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface SutTypes {
    sut: LogControllerDecorator
    controllerStub: Controller
}

const makeController = (): Controller => {
    class ControllerStub implements Controller {
        async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
            const httpResponse: HttpResponse = {
                statusCode: 200,
                body: {
                    name: 'Wando'
                }
            }
            return await new Promise(resolve => resolve(httpResponse))
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
})