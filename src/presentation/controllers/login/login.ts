import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper';
import { Controller, EmailValidator, HttpRequest, HttpResponse, Authentication } from './login-protocols';

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
            const accessToken = await this.authentication.auth(email, password)
            if (!accessToken) {
                return unauthorized()
            }
            return ok({ accessToken })
        } catch (error: any) {
            return serverError(error)
        }
    }
}