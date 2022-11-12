/* eslint-disable @typescript-eslint/indent */
import { SignUpController } from './signup'
describe('SignUp Controller', () => {
    it('Should return 400 if no name is provided', () => {
        const sut = new SignUpController()
        const httpRequest = {
            //  name: 'foo_name',
            email: 'foo_email@mail.com',
            password: 'any_password',
            passwordConfirmation: 'any_password'
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new Error('Missing param: name'))
    })
})
