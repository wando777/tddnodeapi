import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { HttpResponse, HttpRequest } from '../protocols/http'

export class SignUpController {
    handle(httpRequest: HttpRequest): HttpResponse | undefined {
        try {
            if (httpRequest.body.name === undefined) {
                return badRequest(new MissingParamError('name'))
            }
            if (!httpRequest.body.email) {
                return badRequest(new MissingParamError('email'))
            }
        } catch (err) {
            console.log(err)
        }
    }
}
