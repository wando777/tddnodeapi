import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http-helper';
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../singup/signup-protocols';

export class LoginController implements Controller {
    private readonly emailValidator: EmailValidator
    constructor(emailValidator: EmailValidator) {
        this.emailValidator = emailValidator
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const { email, password } = httpRequest.body
        if (!email) {
            return await new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
        } if (!password) {
            return await new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
        }
        const isEmailValid = this.emailValidator.isValid(email)
        if (!isEmailValid) {
            return badRequest(new InvalidParamError('email'))
        }
    }
}