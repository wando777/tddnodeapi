import { MissingParamError, InvalidParamError } from '../errors'
import { badRequest, serverError } from '../helpers/http-helper'
import { EmailValidator, Controller, HttpResponse, HttpRequest } from '../protocols'

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator

    constructor(emailValidator: EmailValidator) {
        this.emailValidator = emailValidator
    }

    handle(httpRequest: HttpRequest): HttpResponse | undefined {
        try {
            const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
            for (const field of requiredFields) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }
            const passwordComparison = httpRequest.body.passwordConfirmation === httpRequest.body.password
            if (!passwordComparison) {
                return badRequest(new InvalidParamError('passwordConfirmation'))
            }
            const isEmailValid = this.emailValidator.isValid(httpRequest.body.email)
            if (!isEmailValid) {
                return badRequest(new InvalidParamError('email'))
            }
        } catch (error) {
            console.log(error)
            return serverError()
        }
    }
}
