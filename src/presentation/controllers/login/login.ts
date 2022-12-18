import { Authentication } from '../../../domain/usecases/authentication';
import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, serverError } from '../../helpers/http-helper';
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../singup/signup-protocols';

export class LoginController implements Controller {
    private readonly emailValidator: EmailValidator
    private readonly authentication: Authentication;
    constructor(emailValidator: EmailValidator, authentication: Authentication) {
        this.emailValidator = emailValidator
        this.authentication = authentication
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const { email, password } = httpRequest.body
            const requiredFields = ['email', 'password']
            for (const field of requiredFields) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }
            const isEmailValid = this.emailValidator.isValid(email)
            if (!isEmailValid) {
                return badRequest(new InvalidParamError('email'))
            }
            await this.authentication.auth(email, password)
            // if (!isUserAuthenticated) {
            //     return serverError(new InvalidParamError('test'))
            // }
        } catch (error: any) {
            return serverError(error)
        }
    }
}