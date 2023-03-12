import { EmailValidator } from '../protocols/email-validator'

export const mockEmailValidator = (): EmailValidator => {
  // this is a mock response for testing valid parameters
  class EmailValidatorStub implements EmailValidator {
      isValid(email: string): boolean {
          return true
      }
  }
  return new EmailValidatorStub()
}