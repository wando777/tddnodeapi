import { ParamInUseError } from '../../../errors'
import { badRequest, forbidden, ok, serverError } from '../../../helpers/http/http-helper'
import { Controller, HttpResponse, HttpRequest, AddAccount, Validation, Authentication } from './signup-controller-protocols'

export class SignUpController implements Controller {
    constructor(
        private readonly addAccount: AddAccount,
        private readonly validation: Validation,
        private readonly authentication: Authentication
    ) { }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(httpRequest.body)
            if (error) {
                return badRequest(error)
            }
            const { name, email, password } = httpRequest.body

            const accountCreated = await this.addAccount.add({
                name,
                email,
                password
            })
            if (!accountCreated) {
                return forbidden(new ParamInUseError('email'))
            }
            const accessToken = await this.authentication.auth({ email, password })
            return ok({ accessToken })
        } catch (error: any) {
            // console.log(error)
            return serverError(error)
        }
    }
}
