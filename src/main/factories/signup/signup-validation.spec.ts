import { CompareFieldValidation } from '../../../presentation/helpers/validators/compare-field-validation'
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/requeired-field-validation'
import { Validation } from '../../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { makeSignUpValidation } from './signup-validation'

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