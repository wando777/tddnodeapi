import { HttpResponse, HttpRequest } from '../protocols/http'

export class SignUpController {
    handle(httpRequest: HttpRequest): HttpResponse | undefined {
        try {
            if (httpRequest.body.name === undefined) {
                return {
                    statusCode: 400,
                    body: new Error('Missing param: name')
                }
            }
            if (!httpRequest.body.email) {
                return {
                    statusCode: 400,
                    body: new Error('Missing param: email')
                }
            }
        } catch (err) {
            console.log(err)
        }
    }
}
