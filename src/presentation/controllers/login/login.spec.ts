import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { LoginController } from './login'

interface SutTypes {
    sut: LoginController
}

const makeSut = (): SutTypes => {
    const sut = new LoginController()
    return { sut }
}

describe('Login Controller', () => {
    it('Should return 400 if no email is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                password: 'any_password'
            }
        }
        const HttpResponse = await sut.handle(httpRequest)
        expect(HttpResponse).toEqual(badRequest(new MissingParamError('email')))
    })
})