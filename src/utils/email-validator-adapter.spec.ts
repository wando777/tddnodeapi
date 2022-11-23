import { EmailValidatorAdapter } from './email-validator'
import validator from 'validator'

jest.mock('validator', () => ({
    isEmail(): boolean {
        return true
    }
}))

describe('EmailValidator Adapter', () => {
    it('Sould return false if validator returns false', () => {
        const sut = new EmailValidatorAdapter()
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
        const email = 'invalid_email@mail.com'
        const isValid = sut.isValid(email)
        expect(isValid).toBe(false)
    })

    it('Sould return true if validator returns true', () => {
        const sut = new EmailValidatorAdapter()
        const email = 'valid_email@mail.com'
        const isValid = sut.isValid(email)
        expect(isValid).toBe(true)
    })
})