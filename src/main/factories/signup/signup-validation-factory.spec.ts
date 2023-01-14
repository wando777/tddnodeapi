import { Validation } from '../../../presentation/protocols/validation'
import { CompareFieldValidation, EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../presentation/helpers/validators'
import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { makeSignUpValidation } from './signup-validation-factory'

jest.mock('../../../presentation/helpers/validators/validation-composite')
const makeEmailValidator = (): EmailValidator => {
    // this is a mock response for testing valid parameters
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

describe('SignUPValidation Factory', () => {
    it('Should ValidationComposite with all validations', () => {
        makeSignUpValidation()
        const validations: Validation[] = []
        const fields = ['name', 'email', 'password', 'passwordConfirmation']
        for (const field of fields) {
            validations.push(new RequiredFieldValidation(field))
        }
        validations.push(new CompareFieldValidation(fields[2], fields[3]))
        validations.push(new EmailValidation('email', makeEmailValidator()))
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})