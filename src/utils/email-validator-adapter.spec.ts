import { EmailValidatorAdapter } from './email-validator'

describe('EmailValidator Adapter', () => {
    it('Sould return false if validator returns false', () => {
        const sut = new EmailValidatorAdapter()
        const email = 'invalid_email@mail.com'
        const isValid = sut.isValid(email)
        expect(isValid).toBe(false)
    })
})