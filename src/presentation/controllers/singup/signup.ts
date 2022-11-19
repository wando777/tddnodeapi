import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { EmailValidator, Controller, HttpResponse, HttpRequest, AddAccount } from './signup-protocols'

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator
    private readonly addAccount: AddAccount

    constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
        this.emailValidator = emailValidator
        this.addAccount = addAccount
    }

    handle(httpRequest: HttpRequest): HttpResponse | undefined {
        try {
            const { name, email, password, passwordConfirmation } = httpRequest.body
            const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
            for (const field of requiredFields) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }
            if (passwordConfirmation !== password) {
                return badRequest(new InvalidParamError('passwordConfirmation'))
            }
            const isEmailValid = this.emailValidator.isValid(httpRequest.body.email)
            if (!isEmailValid) {
                return badRequest(new InvalidParamError('email'))
            }

            const accountCreated = this.addAccount.add({
                name,
                email,
                password
            })
            return {
                statusCode: 200,
                body: accountCreated
            }
        } catch (error) {
            console.log(error)
            return serverError()
        }
    }
}
